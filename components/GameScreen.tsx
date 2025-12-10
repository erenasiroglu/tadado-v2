import { FONT_FAMILY } from "@/constants/fonts";
import { gameService } from "@/utils/gameService";
import type { Card } from "@/types/game";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface GameScreenProps {
  cardTypeId: string;
  team1: string;
  team2: string;
  gameTime: number;
  rounds: number;
  passLimit: number;
  onBack: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  cardTypeId,
  team1,
  team2,
  gameTime,
  rounds,
  passLimit,
  onBack,
}) => {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [currentTeam, setCurrentTeam] = useState(0); // 0: team1, 1: team2
  const [currentRound, setCurrentRound] = useState(1); // 1'den başlar
  const [timeLeft, setTimeLeft] = useState(gameTime);
  const [score, setScore] = useState({ team1: 0, team2: 0 });
  const [passCount, setPassCount] = useState(0);
  const [usedCardIds, setUsedCardIds] = useState<string[]>([]);

  // Oyunu başlat ve kartları yükle
  useEffect(() => {
    const initializeGame = async () => {
      try {
        // Kartları yükle
        const loadedCards = await gameService.getCardsByType(cardTypeId);
        setCards(loadedCards);

        // Oyun oluştur
        const { game, session } = await gameService.createGame({
          cardTypeId,
          team1,
          team2,
          gameTime,
          rounds,
          passLimit,
        });

        setGameId(game.id);
        setCurrentTeam(0); // Her zaman team1 ile başla
        setCurrentRound(1); // İlk round
        setTimeLeft(gameTime);
        setScore({ team1: 0, team2: 0 });
        setPassCount(0);
        setUsedCardIds([]);

        // İlk kartı seç
        if (loadedCards.length > 0) {
          const randomCard = getRandomCard(loadedCards, []);
          setCurrentCard(randomCard);
        }
      } catch (error) {
        console.error("Error initializing game:", error);
        Alert.alert("Error", "Failed to start game. Please try again.");
        onBack();
      } finally {
        setLoading(false);
      }
    };

    initializeGame();
  }, []);

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !loading) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        updateTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !loading) {
      // Timer bitti, takım değiş
      switchTeam();
    }
  }, [timeLeft, loading]);

  // Rastgele kart seç (kullanılmayanlar arasından)
  const getRandomCard = (available: Card[], usedIds: string[]): Card => {
    const unusedCards = available.filter((card) => !usedIds.includes(card.id));
    if (unusedCards.length === 0) {
      // Tüm kartlar kullanıldı, yeniden başlat
      return available[Math.floor(Math.random() * available.length)];
    }
    return unusedCards[Math.floor(Math.random() * unusedCards.length)];
  };

  // Oyun durumunu güncelle
  const updateGameSession = async (updates: {
    current_team?: number;
    current_round?: number;
    current_card_index?: number;
    team1_score?: number;
    team2_score?: number;
    pass_count?: number;
    time_left?: number;
    used_card_ids?: string[];
  }) => {
    if (!gameId) return;

    try {
      await gameService.updateGameSession(gameId, updates);
    } catch (error) {
      console.error("Error updating game session:", error);
    }
  };

  // Timer'ı güncelle
  const updateTimeLeft = async (newTime: number) => {
    if (!gameId) return;
    await updateGameSession({ time_left: newTime });
  };

  // Takım değiştir veya yeni round başlat
  const switchTeam = async () => {
    if (!gameId) return;

    const newUsedCardIds = [...usedCardIds];

    // Mevcut kartı kullanılanlara ekle
    if (currentCard && !newUsedCardIds.includes(currentCard.id)) {
      newUsedCardIds.push(currentCard.id);
    }
    setUsedCardIds(newUsedCardIds);

    // Eğer team1 bitirdiyse -> team2'ye geç
    if (currentTeam === 0) {
      const newTeam = 1;
      setCurrentTeam(newTeam);
      setTimeLeft(gameTime);
      setPassCount(0);

      // Yeni kart seç
      const nextCard = getRandomCard(cards, newUsedCardIds);
      setCurrentCard(nextCard);

      // DB'yi güncelle
      await updateGameSession({
        current_team: newTeam,
        current_round: currentRound,
        time_left: gameTime,
        pass_count: 0,
        used_card_ids: newUsedCardIds,
      });
    } else {
      // Team2 bitirdi, round tamamlandı
      const nextRound = currentRound + 1;

      // Tüm roundlar tamamlandı mı?
      if (nextRound > rounds) {
        // Oyun bitti - final skorları al
        const finalScore = { ...score };
        await gameService.completeGame(gameId);
        Alert.alert(
          "Game Over!",
          `Final Scores:\n${team1}: ${finalScore.team1}\n${team2}: ${finalScore.team2}\n\n${
            finalScore.team1 > finalScore.team2
              ? team1
              : finalScore.team2 > finalScore.team1
                ? team2
                : "Tie"
          } Wins!`,
          [{ text: "OK", onPress: onBack }]
        );
        return;
      }

      // Yeni round başla (team1'e dön)
      setCurrentRound(nextRound);
      setCurrentTeam(0);
      setTimeLeft(gameTime);
      setPassCount(0);

      // Yeni kart seç
      const nextCard = getRandomCard(cards, newUsedCardIds);
      setCurrentCard(nextCard);

      // DB'yi güncelle
      await updateGameSession({
        current_team: 0,
        current_round: nextRound,
        time_left: gameTime,
        pass_count: 0,
        used_card_ids: newUsedCardIds,
      });
    }
  };

  // Sonraki kartı seç
  const selectNextCard = () => {
    const nextCard = getRandomCard(cards, usedCardIds);
    setCurrentCard(nextCard);
  };

  const handleCorrect = async () => {
    if (!gameId || !currentCard) return;

    const scoreBefore = currentTeam === 0 ? score.team1 : score.team2;
    const newScore = { ...score };
    if (currentTeam === 0) {
      newScore.team1 += 1;
    } else {
      newScore.team2 += 1;
    }
    const scoreAfter = currentTeam === 0 ? newScore.team1 : newScore.team2;

    setScore(newScore);
    setPassCount(0);

    // Kartı kullanılanlara ekle
    const newUsedCardIds = [...usedCardIds];
    if (!newUsedCardIds.includes(currentCard.id)) {
      newUsedCardIds.push(currentCard.id);
    }
    setUsedCardIds(newUsedCardIds);

    // DB'yi güncelle
    await updateGameSession({
      team1_score: newScore.team1,
      team2_score: newScore.team2,
      pass_count: 0,
      used_card_ids: newUsedCardIds,
    });

    // Aksiyonu kaydet
    await gameService.logGameAction(gameId, {
      roundNumber: currentRound,
      teamNumber: currentTeam,
      actionType: "correct",
      cardId: currentCard.id,
      cardWord: currentCard.word,
      scoreBefore,
      scoreAfter,
    });

    selectNextCard();
  };

  const handlePass = async () => {
    if (!gameId || !currentCard || passCount >= passLimit) return;

    const scoreBefore = currentTeam === 0 ? score.team1 : score.team2;
    const newPassCount = passCount + 1;
    setPassCount(newPassCount);

    // Kartı kullanılanlara ekle
    const newUsedCardIds = [...usedCardIds];
    if (!newUsedCardIds.includes(currentCard.id)) {
      newUsedCardIds.push(currentCard.id);
    }
    setUsedCardIds(newUsedCardIds);

    // DB'yi güncelle
    await updateGameSession({
      pass_count: newPassCount,
      used_card_ids: newUsedCardIds,
    });

    // Aksiyonu kaydet (Pass - puan değişmez)
    await gameService.logGameAction(gameId, {
      roundNumber: currentRound,
      teamNumber: currentTeam,
      actionType: "pass",
      cardId: currentCard.id,
      cardWord: currentCard.word,
      scoreBefore,
      scoreAfter: scoreBefore, // Pass'te puan değişmez
    });

    selectNextCard();
  };

  const handleTado = async () => {
    if (!gameId || !currentCard) return;

    const scoreBefore = currentTeam === 0 ? score.team1 : score.team2;
    // Yasaklı kelime kullanıldı, -1 puan
    const newScore = { ...score };
    if (currentTeam === 0) {
      newScore.team1 = Math.max(0, newScore.team1 - 1); // Negatif olmasın
    } else {
      newScore.team2 = Math.max(0, newScore.team2 - 1); // Negatif olmasın
    }
    const scoreAfter = currentTeam === 0 ? newScore.team1 : newScore.team2;

    setScore(newScore);

    // Kartı kullanılanlara ekle
    const newUsedCardIds = [...usedCardIds];
    if (!newUsedCardIds.includes(currentCard.id)) {
      newUsedCardIds.push(currentCard.id);
    }
    setUsedCardIds(newUsedCardIds);

    // DB'yi güncelle
    await updateGameSession({
      team1_score: newScore.team1,
      team2_score: newScore.team2,
      used_card_ids: newUsedCardIds,
    });

    // Aksiyonu kaydet
    await gameService.logGameAction(gameId, {
      roundNumber: currentRound,
      teamNumber: currentTeam,
      actionType: "tado",
      cardId: currentCard.id,
      cardWord: currentCard.word,
      scoreBefore,
      scoreAfter,
    });

    selectNextCard();
  };

  if (loading) {
    return (
      <LinearGradient
        colors={["#2A0A3A", "#441063"]}
        locations={[0, 0.79]}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff0cf" />
          <Text style={styles.loadingText}>Loading game...</Text>
        </View>
      </LinearGradient>
    );
  }

  const progress = ((gameTime - timeLeft) / gameTime) * 100;
  const currentTeamName = currentTeam === 0 ? team1 : team2;
  const currentTeamScore = currentTeam === 0 ? score.team1 : score.team2;

  return (
    <LinearGradient colors={["#2A0A3A", "#441063"]} locations={[0, 0.79]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.teamNameContainer}>
          <Text style={styles.teamName}>{currentTeamName}</Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{currentTeamScore}</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBarTrack}>
          <LinearGradient
            colors={["#d41f50", "#66052f"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressBarFill, { width: `${progress}%` }]}
          />
        </View>
        <Text style={styles.timeLeft}>{timeLeft} second Left</Text>
      </View>

      <View style={styles.cardsContainer}>
        {currentCard && (
          <View style={styles.card}>
            <View style={styles.cardProgressIndicator}>
              <Text style={styles.cardProgressText}>
                Round {currentRound}/{rounds}
              </Text>
            </View>

            <View style={styles.wordContainer}>
              <Text style={styles.wordText}>{currentCard.word}</Text>
            </View>

            <View style={styles.forbiddenWordsContainer}>
              {currentCard.forbidden_words.map((forbiddenWord, wordIndex) => (
                <View key={wordIndex} style={styles.forbiddenWordContainer}>
                  <Text style={styles.forbiddenWordText}>{forbiddenWord}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonPass]}
          onPress={handlePass}
          activeOpacity={0.8}
          disabled={passCount >= passLimit}
        >
          <Text
            style={[
              styles.actionButtonText,
              passCount >= passLimit && styles.actionButtonTextDisabled,
            ]}
          >
            Pass
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonTado]}
          onPress={handleTado}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>TaDo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonCorrect]}
          onPress={handleCorrect}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>Correct</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#fff0cf",
    fontFamily: FONT_FAMILY,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    position: "relative",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
    zIndex: 1,
  },
  teamNameContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 0,
  },
  teamName: {
    fontSize: 32,
    color: "#fff0cf",
    fontFamily: FONT_FAMILY,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  scoreContainer: {
    backgroundColor: "#d92151",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 50,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  scoreText: {
    fontSize: 24,
    color: "#fff0cf",
    fontFamily: FONT_FAMILY,
    fontWeight: "900",
  },
  progressContainer: {
    marginBottom: 24,
    alignItems: "center",
  },
  progressBarTrack: {
    width: "85%",
    height: 20,
    backgroundColor: "rgba(255, 240, 207, 0.2)",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff0cf",
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 8,
  },
  timeLeft: {
    fontSize: 14,
    color: "#957d84",
    fontFamily: FONT_FAMILY,
    textAlign: "center",
  },
  cardsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    position: "relative",
  },
  card: {
    width: "90%",
    height: 400,
    backgroundColor: "#5d022c",
    borderRadius: 24,
    padding: 20,
    paddingTop: 40,
    overflow: "visible",
  },
  cardProgressIndicator: {
    position: "absolute",
    top: -28,
    alignSelf: "center",
    backgroundColor: "#5d022c",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: 24,
    paddingVertical: 12,
    zIndex: 10,
  },
  cardProgressText: {
    fontSize: 16,
    color: "#fff0cf",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
  },
  wordContainer: {
    backgroundColor: "#d92151",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  wordText: {
    fontSize: 28,
    color: "#fff0cf",
    fontFamily: FONT_FAMILY,
    fontWeight: "900",
    textTransform: "uppercase",
    textAlign: "center",
  },
  forbiddenWordsContainer: {
    flex: 1,
    justifyContent: "space-between",
    gap: 12,
  },
  forbiddenWordContainer: {
    backgroundColor: "#d92151",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  forbiddenWordText: {
    fontSize: 18,
    color: "#fff0cf",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
    textTransform: "capitalize",
    textAlign: "center",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 20,
    paddingBottom: 10,
  },
  actionButton: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 60,
  },
  actionButtonPass: {
    backgroundColor: "#290939",
  },
  actionButtonTado: {
    backgroundColor: "#5d022c",
  },
  actionButtonCorrect: {
    backgroundColor: "#d92151",
  },
  actionButtonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  actionButtonTextDisabled: {
    opacity: 0.5,
  },
});
