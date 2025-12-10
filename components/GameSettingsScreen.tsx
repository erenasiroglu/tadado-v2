import { FONT_FAMILY } from "@/constants/fonts";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface GameSettingsScreenProps {
  cardTypeId: string;
  onBack: () => void;
  onStartGame: (settings: {
    cardTypeId: string;
    team1: string;
    team2: string;
    gameTime: number;
    rounds: number;
    passLimit: number;
  }) => void;
}

export const GameSettingsScreen: React.FC<GameSettingsScreenProps> = ({
  cardTypeId,
  onBack,
  onStartGame,
}) => {
  const [team1, setTeam1] = useState("TEAM NUR");
  const [team2, setTeam2] = useState("TEAM EREN");
  const [gameTime, setGameTime] = useState(150);
  const [rounds, setRounds] = useState(10);
  const [passLimit, setPassLimit] = useState(3);

  const gameTimeOptions = [90, 120, 150, 180, 200];
  const roundOptions = [2, 5, 8, 10, 12];
  const passLimitOptions = [1, 2, 3, 4, 5];

  const handleStartGame = () => {
    onStartGame({
      cardTypeId,
      team1,
      team2,
      gameTime,
      rounds,
      passLimit,
    });
  };

  return (
    <LinearGradient colors={["#2A0A3A", "#441063"]} locations={[0, 0.79]} style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Team Selection Section */}
      <View style={styles.teamSection}>
        <View style={styles.teamInputContainer}>
          <TextInput
            style={styles.teamInput}
            value={team1}
            onChangeText={setTeam1}
            placeholder="TEAM NUR"
            placeholderTextColor="#FFFFFF"
            autoCapitalize="characters"
          />
        </View>
        <Text style={styles.vsText}>VS</Text>
        <View style={styles.teamInputContainer}>
          <TextInput
            style={styles.teamInput}
            value={team2}
            onChangeText={setTeam2}
            placeholder="TEAM EREN"
            placeholderTextColor="#FFFFFF"
            autoCapitalize="characters"
          />
        </View>
      </View>

      {/* Game Settings Section */}
      <View style={styles.settingsSection}>
        {/* Game Time */}
        <View style={styles.settingGroup}>
          <View style={styles.labelContainer}>
            <Text style={styles.settingLabel}>GAME TIME(SECOND)</Text>
          </View>
          <View style={styles.optionsRow}>
            {gameTimeOptions.map((time) => (
              <TouchableOpacity
                key={time}
                style={[styles.optionButton, gameTime === time && styles.optionButtonSelected]}
                onPress={() => setGameTime(time)}
              >
                <Text style={[styles.optionText, gameTime === time && styles.optionTextSelected]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Rounds */}
        <View style={styles.settingGroup}>
          <View style={styles.labelContainer}>
            <Text style={styles.settingLabel}>ROUND</Text>
          </View>
          <View style={styles.optionsRow}>
            {roundOptions.map((round) => (
              <TouchableOpacity
                key={round}
                style={[styles.optionButton, rounds === round && styles.optionButtonSelected]}
                onPress={() => setRounds(round)}
              >
                <Text style={[styles.optionText, rounds === round && styles.optionTextSelected]}>
                  {round}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pass Limit */}
        <View style={styles.settingGroup}>
          <View style={styles.labelContainer}>
            <Text style={styles.settingLabel}>PASS LIMIT</Text>
          </View>
          <View style={styles.optionsRow}>
            {passLimitOptions.map((limit) => (
              <TouchableOpacity
                key={limit}
                style={[styles.optionButton, passLimit === limit && styles.optionButtonSelected]}
                onPress={() => setPassLimit(limit)}
              >
                <Text style={[styles.optionText, passLimit === limit && styles.optionTextSelected]}>
                  {limit}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Let's Play Button */}
        <TouchableOpacity style={styles.playButton} onPress={handleStartGame} activeOpacity={0.8}>
          <Text style={styles.playButtonText}>LET&apos;S PLAY!</Text>
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  teamSection: {
    backgroundColor: "#321441",
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.3)",
    padding: 20,
    marginBottom: 20,
  },
  teamInputContainer: {
    marginVertical: 6,
  },
  teamInput: {
    backgroundColor: "#4b3158",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
    textAlign: "center",
    minHeight: 48,
  },
  vsText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 10,
  },
  settingsSection: {
    backgroundColor: "#5d022c",
    borderRadius: 24,
    padding: 20,
    flex: 1,
  },
  settingGroup: {
    marginBottom: 28,
  },
  labelContainer: {
    backgroundColor: "#7d324d",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: "flex-start",
    marginBottom: 14,
  },
  settingLabel: {
    fontSize: 16,
    color: "#fff0cf",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  optionButton: {
    flex: 1,
    backgroundColor: "#7d324d",
    borderRadius: 10,
    borderWidth: 0,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  optionButtonSelected: {
    backgroundColor: "#fff0cf",
    borderWidth: 0,
  },
  optionText: {
    fontSize: 15,
    color: "#fff0cf",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
  },
  optionTextSelected: {
    color: "#5d022c",
  },
  playButton: {
    backgroundColor: "#9e616e",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    alignSelf: "center",
    width: "85%",
  },
  playButtonText: {
    fontSize: 30,
    color: "#5d022c",
    fontFamily: FONT_FAMILY,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
