import { GameScreen } from "@/components/GameScreen";
import { GameSettingsScreen } from "@/components/GameSettingsScreen";
import { LoginScreen } from "@/components/LoginScreen";
import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";
import { SettingsScreen } from "@/components/SettingsScreen";
import { gameService } from "@/utils/gameService";
import { FONT_FAMILY } from "@/constants/fonts";
import { supabase } from "@/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const { t } = useTranslation();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const [showGameSettings, setShowGameSettings] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCardTypeId, setSelectedCardTypeId] = useState<string | null>(null);
  const [gameSettings, setGameSettings] = useState<{
    cardTypeId: string;
    team1: string;
    team2: string;
    gameTime: number;
    rounds: number;
    passLimit: number;
  } | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Session check error:", error);
        }

        if (session) {
          // Get user name from session
          const name =
            session.user.user_metadata?.name ||
            session.user.user_metadata?.full_name ||
            session.user.email?.split("@")[0] ||
            "GU";
          setUserName(name);
          setShowOnboarding(false);
          setShowLogin(false);
          setShowHome(true);
        } else {
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error("Unexpected error checking session:", error);
        setShowOnboarding(true);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const name =
          session.user.user_metadata?.name ||
          session.user.user_metadata?.full_name ||
          session.user.email?.split("@")[0] ||
          "GU";
        setUserName(name);
        setShowOnboarding(false);
        setShowLogin(false);
        setShowHome(true);
      } else {
        setShowOnboarding(true);
        setShowLogin(false);
        setShowHome(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setShowLogin(true);
  };

  const handleCreateAccount = () => {
    router.push("/signup");
  };

  const handleAlreadyHaveAccount = () => {
    router.push("/login");
  };

  const handleContinueAsGuest = async () => {
    setIsSigningIn(true);
    try {
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) {
        console.error("Anonymous sign-in error:", error);
        Alert.alert(t("guest_error"), error.message || t("guest_error_message"), [
          { text: t("ok") },
        ]);
        return;
      }

      if (data?.user) {
        setShowLogin(false);
        setShowHome(true);
      }
    } catch (error) {
      console.error("Unexpected error during anonymous sign-in:", error);
      Alert.alert(t("error"), t("guest_unexpected_error"), [{ text: t("ok") }]);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(t("sign_out_title"), t("sign_out_message"), [
      {
        text: t("cancel"),
        style: "cancel",
      },
      {
        text: t("sign_out_confirm"),
        style: "destructive",
        onPress: async () => {
          try {
            const { error } = await supabase.auth.signOut();
            if (error) {
              Alert.alert(t("error"), error.message);
              return;
            }
          } catch (error) {
            console.error("Sign out error:", error);
            Alert.alert(t("error"), t("sign_out_error"));
          }
        },
      },
    ]);
  };

  const handleSeriesCardPress = async () => {
    try {
      // SERIES kart tipinin ID'sini bul
      const cardTypes = await gameService.getCardTypes();
      const seriesCardType = cardTypes.find((ct) => ct.name === "SERIES");
      if (seriesCardType) {
        setSelectedCardTypeId(seriesCardType.id);
        setShowGameSettings(true);
      } else {
        Alert.alert("Error", "SERIES card type not found");
      }
    } catch (error) {
      console.error("Error loading card types:", error);
      Alert.alert("Error", "Failed to load card types");
    }
  };

  const handleCitiesCountriesCardPress = async () => {
    try {
      // CITIES_COUNTRIES kart tipinin ID'sini bul
      const cardTypes = await gameService.getCardTypes();
      const citiesCountriesCardType = cardTypes.find((ct) => ct.name === "CITIES_COUNTRIES");
      if (citiesCountriesCardType) {
        setSelectedCardTypeId(citiesCountriesCardType.id);
        setShowGameSettings(true);
      } else {
        Alert.alert("Error", "CITIES_COUNTRIES card type not found");
      }
    } catch (error) {
      console.error("Error loading card types:", error);
      Alert.alert("Error", "Failed to load card types");
    }
  };

  const handleSportCardPress = async () => {
    try {
      // SPORT kart tipinin ID'sini bul
      const cardTypes = await gameService.getCardTypes();
      const sportCardType = cardTypes.find((ct) => ct.name === "SPORT");
      if (sportCardType) {
        setSelectedCardTypeId(sportCardType.id);
        setShowGameSettings(true);
      } else {
        Alert.alert("Error", "SPORT card type not found");
      }
    } catch (error) {
      console.error("Error loading card types:", error);
      Alert.alert("Error", "Failed to load card types");
    }
  };

  const handleMidnightFunCardPress = async () => {
    try {
      // MIDNIGHT_FUN kart tipinin ID'sini bul
      const cardTypes = await gameService.getCardTypes();
      const midnightFunCardType = cardTypes.find((ct) => ct.name === "MIDNIGHT_FUN");
      if (midnightFunCardType) {
        setSelectedCardTypeId(midnightFunCardType.id);
        setShowGameSettings(true);
      } else {
        Alert.alert("Error", "MIDNIGHT_FUN card type not found");
      }
    } catch (error) {
      console.error("Error loading card types:", error);
      Alert.alert("Error", "Failed to load card types");
    }
  };

  const handleRomanceCardPress = async () => {
    try {
      // ROMANCE kart tipinin ID'sini bul
      const cardTypes = await gameService.getCardTypes();
      const romanceCardType = cardTypes.find((ct) => ct.name === "ROMANCE");
      if (romanceCardType) {
        setSelectedCardTypeId(romanceCardType.id);
        setShowGameSettings(true);
      } else {
        Alert.alert("Error", "ROMANCE card type not found");
      }
    } catch (error) {
      console.error("Error loading card types:", error);
      Alert.alert("Error", "Failed to load card types");
    }
  };

  const handleMarvelCardPress = async () => {
    try {
      // MARVEL kart tipinin ID'sini bul
      const cardTypes = await gameService.getCardTypes();
      const marvelCardType = cardTypes.find((ct) => ct.name === "MARVEL");
      if (marvelCardType) {
        setSelectedCardTypeId(marvelCardType.id);
        setShowGameSettings(true);
      } else {
        Alert.alert("Error", "MARVEL card type not found");
      }
    } catch (error) {
      console.error("Error loading card types:", error);
      Alert.alert("Error", "Failed to load card types");
    }
  };

  const handleGameSettingsBack = () => {
    setShowGameSettings(false);
    setSelectedCardTypeId(null);
  };

  const handleStartGame = (settings: {
    cardTypeId: string;
    team1: string;
    team2: string;
    gameTime: number;
    rounds: number;
    passLimit: number;
  }) => {
    setGameSettings(settings);
    setShowGameSettings(false);
    setShowGame(true);
  };

  const handleGameBack = () => {
    setShowGame(false);
    setGameSettings(null);
  };

  const handleSettingsBack = () => {
    setShowSettings(false);
  };

  if (isCheckingSession) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8D64AB" />
      </View>
    );
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  if (showLogin) {
    return (
      <LoginScreen
        onCreateAccount={handleCreateAccount}
        onAlreadyHaveAccount={handleAlreadyHaveAccount}
        onContinueAsGuest={handleContinueAsGuest}
        isSigningIn={isSigningIn}
      />
    );
  }

  if (showGame && gameSettings) {
    return (
      <GameScreen
        cardTypeId={gameSettings.cardTypeId}
        team1={gameSettings.team1}
        team2={gameSettings.team2}
        gameTime={gameSettings.gameTime}
        rounds={gameSettings.rounds}
        passLimit={gameSettings.passLimit}
        onBack={handleGameBack}
      />
    );
  }

  if (showSettings) {
    return <SettingsScreen onBack={handleSettingsBack} />;
  }

  if (showGameSettings && selectedCardTypeId) {
    return (
      <GameSettingsScreen
        cardTypeId={selectedCardTypeId}
        onBack={handleGameSettingsBack}
        onStartGame={handleStartGame}
      />
    );
  }

  if (showHome) {
    // Get initials from user name
    const getInitials = (name: string) => {
      if (!name) return "GU";
      const parts = name.trim().split(" ");
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    };

    const initials = getInitials(userName);

    return (
      <LinearGradient
        colors={["#2A0A3A", "#441063"]}
        locations={[0, 0.79]}
        style={styles.homeContainer}
      >
        <View style={styles.headerRow}>
          <View style={styles.avatarSpacer} />
          <Text style={styles.newCardsText}>NEW CARDS!</Text>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => setShowSettings(true)}
            activeOpacity={0.8}
          >
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.mainScrollView}
          contentContainerStyle={styles.mainScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsScrollContainer}
            style={styles.cardsScrollView}
          >
            <TouchableOpacity
              style={styles.card}
              onPress={handleSeriesCardPress}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#752AC3CC", "#38145DCC"]}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>NEW</Text>
                </View>

                <View style={styles.playIconContainer}>
                  <View style={styles.playIconCircle}>
                    <Ionicons name="play" size={24} color="#FFFFFF" style={styles.playIcon} />
                  </View>
                </View>

                <Text style={styles.cardTitle}>CINEMA</Text>

                <Text style={styles.cardSubtitle}>Movies, series and actors!</Text>

                <View style={styles.buyButton}>
                  <Text style={styles.buyButtonText}>FREE</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card, styles.cardMargin]}
              onPress={handleCitiesCountriesCardPress}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#1B5E20CC", "#2E7D32CC"]}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.newBadgeGreen}>
                  <Text style={styles.newBadgeTextGreen}>NEW</Text>
                </View>

                <View style={styles.playIconContainer}>
                  <View style={styles.playIconCircleGreen}>
                    <Ionicons name="play" size={24} color="#FFFFFF" style={styles.playIcon} />
                  </View>
                </View>

                <Text style={styles.cardTitleGreen}>TRAVEL</Text>

                <Text style={styles.cardSubtitleGreen}>All cities and countries!</Text>

                <View style={styles.buyButtonGreen}>
                  <Text style={styles.buyButtonTextGreen}>FREE</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card, styles.cardMargin]}
              onPress={handleSportCardPress}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#FBC02DCC", "#FFD54FCC"]}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.newBadgeSport}>
                  <Text style={styles.newBadgeTextSport}>NEW</Text>
                </View>

                <View style={styles.playIconContainer}>
                  <View style={styles.playIconCircleSport}>
                    <Ionicons name="play" size={24} color="#FFFFFF" style={styles.playIcon} />
                  </View>
                </View>

                <Text style={styles.cardTitleSport}>SPORT</Text>

                <Text style={styles.cardSubtitleSport}>Football basketball and more!</Text>

                <View style={styles.buyButtonSport}>
                  <Text style={styles.buyButtonTextSport}>FREE</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card, styles.cardMargin]}
              onPress={handleMidnightFunCardPress}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#C3045DCC", "#5D022CCC"]}
                locations={[0, 0.8]}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                <View style={styles.newBadgeMidnightFun}>
                  <Text style={styles.newBadgeTextMidnightFun}>NEW</Text>
                </View>

                <View style={styles.playIconContainer}>
                  <View style={styles.playIconCircleMidnightFun}>
                    <Ionicons name="play" size={24} color="#FFFFFF" style={styles.playIcon} />
                  </View>
                </View>

                <Text style={styles.cardTitleMidnightFun}>MIDNIGHT FUN</Text>

                <Text style={styles.cardSubtitleMidnightFun}>Spicy Challenges for Couples!</Text>

                <View style={styles.buyButtonMidnightFun}>
                  <Text style={styles.buyButtonTextMidnightFun}>BUY 2.99$</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card, styles.cardMargin]}
              onPress={handleRomanceCardPress}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#D57C9DCC", "#FF2C7ACC"]}
                locations={[0, 0.8]}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                <View style={styles.newBadgeRomance}>
                  <Text style={styles.newBadgeTextRomance}>NEW</Text>
                </View>

                <View style={styles.playIconContainer}>
                  <View style={styles.playIconCircleRomance}>
                    <Ionicons name="play" size={24} color="#FFFFFF" style={styles.playIcon} />
                  </View>
                </View>

                <Text style={styles.cardTitleRomance}>ROMANCE</Text>

                <Text style={styles.cardSubtitleRomance}>Fun Game About Relationships!</Text>

                <View style={styles.buyButtonRomance}>
                  <Text style={styles.buyButtonTextRomance}>BUY 2.99$</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card, styles.cardMargin]}
              onPress={handleMarvelCardPress}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#C41E3ACC", "#ED1C24CC"]}
                locations={[0, 0.8]}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                <View style={styles.newBadgeMarvel}>
                  <Text style={styles.newBadgeTextMarvel}>NEW</Text>
                </View>

                <View style={styles.playIconContainer}>
                  <View style={styles.playIconCircleMarvel}>
                    <Ionicons name="play" size={24} color="#FFFFFF" style={styles.playIcon} />
                  </View>
                </View>

                <Text style={styles.cardTitleMarvel}>MARVEL</Text>

                <Text style={styles.cardSubtitleMarvel}>Superheroes stories!</Text>

                <View style={styles.buyButtonMarvel}>
                  <Text style={styles.buyButtonTextMarvel}>BUY 4.99$</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>

          <Text style={styles.createYourOwnCardText}>CREATE YOUR OWN CARD!</Text>

          <TouchableOpacity
            style={styles.aiCreateCard}
            onPress={() => router.push("/ai-create")}
            activeOpacity={0.8}
          >
            <View style={styles.aiCreateContent}>
              <View style={styles.aiCreateLeft}>
                <Text style={styles.magicWithTadoText}>Magic With TADO!</Text>
                <View style={styles.createButton}>
                  <Text style={styles.createButtonText}>CREATE</Text>
                </View>
              </View>
              <Image
                source={require("@/assets/images/tado_ai.png")}
                style={styles.tadoAiImage}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.smallCardsScrollContainer}
            style={styles.smallCardsScrollView}
          >
            <View style={styles.smallCard}>
              <View style={styles.classicTitleContainer}>
                <Text style={styles.smallCardTitleClassic}>CLASSIC</Text>
                <Text style={styles.smallCardTitleClassic}>FUN!</Text>
              </View>
              <View style={styles.previewButton}>
                <Text style={styles.previewButtonText}>PREVIEW</Text>
              </View>
            </View>

            <View style={[styles.smallCard, styles.smallCardMargin, styles.smallCardDirty]}>
              <Text style={styles.smallCardTitleDirty}>DIRTY MINDS</Text>
              <View style={styles.ageBadge}>
                <Text style={styles.ageBadgeText}>+18</Text>
              </View>
              <View style={styles.previewButtonDirty}>
                <Text style={styles.previewButtonTextDirty}>PREVIEW</Text>
              </View>
            </View>

            <View style={[styles.smallCard, styles.smallCardMargin, styles.smallCardOwn]}>
              <Text style={styles.smallCardTitleOwn}>YOUR OWN STYLE!</Text>
              <View style={styles.previewButtonOwn}>
                <Text style={styles.previewButtonTextOwn}>PREVIEW</Text>
              </View>
            </View>
          </ScrollView>
        </ScrollView>

        <View style={styles.bottomTab}>
          <TouchableOpacity style={styles.tabButton} activeOpacity={0.8}>
            <View style={styles.iconCircle}>
              <Ionicons name="home" size={24} color="#FBAA12" />
            </View>
            <Text style={styles.tabLabel}>HOME</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabButton} activeOpacity={0.8}>
            <View style={styles.iconCircle}>
              <Ionicons name="play" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.tabLabel}>PLAY NOW</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabButton} activeOpacity={0.8}>
            <View style={styles.iconCircle}>
              <Ionicons name="time-outline" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.tabLabel}>RECENT</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2A0A3B",
  },
  homeContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 12,
    paddingBottom: 0,
  },
  mainScrollView: {
    flex: 1,
  },
  mainScrollContent: {
    paddingBottom: 100,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 0,
    marginTop: 8,
    position: "relative",
  },
  avatarContainer: {
    alignItems: "flex-end",
    width: 36,
    justifyContent: "center",
    alignSelf: "flex-start",
    marginTop: 2,
  },
  avatarSpacer: {
    width: 36,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FBAA12",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FBAA12",
    fontFamily: FONT_FAMILY,
  },
  newCardsText: {
    fontSize: 32,
    color: "#997EAF",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
    flex: 1,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  cardsScrollView: {
    marginHorizontal: -12,
    paddingHorizontal: 12,
    marginBottom: 0,
    marginTop: 0,
  },
  cardsScrollContainer: {
    paddingRight: 12,
  },
  card: {
    width: 155,
    height: 223,
    borderRadius: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardInner: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
    overflow: "hidden",
  },
  cardMargin: {
    marginLeft: 16,
  },
  cardGradient: {
    width: "100%",
    height: "100%",
    padding: 12,
    position: "relative",
    borderRadius: 24,
    overflow: "hidden",
  },
  newBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 54,
    height: 23,
    backgroundColor: "#FBAA12",
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  newBadgeText: {
    fontSize: 12,
    color: "#38145D",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
  },
  playIconContainer: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 5,
  },
  playIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#8057a7",
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: {
    opacity: 0.4,
    marginLeft: 2,
  },
  cardTitle: {
    position: "absolute",
    top: 130,
    left: 12,
    right: 12,
    fontSize: 18,
    color: "#FBAA12",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
    textAlign: "center",
  },
  cardSubtitle: {
    position: "absolute",
    top: 155,
    left: 12,
    right: 12,
    fontSize: 11,
    color: "#BC7734",
    fontFamily: FONT_FAMILY,
    textAlign: "center",
    opacity: 0.65,
    lineHeight: 14,
  },
  buyButton: {
    position: "absolute",
    bottom: 12,
    left: 42.5,
    width: 70,
    height: 23,
    backgroundColor: "#FBAA12",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  buyButtonText: {
    fontSize: 11,
    color: "#38145D",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
  },
  // Green card specific styles
  newBadgeGreen: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 54,
    height: 23,
    backgroundColor: "#4CAF50",
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  newBadgeTextGreen: {
    fontSize: 12,
    color: "#FFFF",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
  },
  playIconCircleGreen: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitleGreen: {
    position: "absolute",
    top: 130,
    left: 12,
    right: 12,
    fontSize: 18,
    color: "#A5D6A7",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
    textAlign: "center",
  },
  cardSubtitleGreen: {
    position: "absolute",
    top: 155,
    left: 12,
    right: 12,
    fontSize: 11,
    color: "#81C784",
    fontFamily: FONT_FAMILY,
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 14,
  },
  buyButtonGreen: {
    position: "absolute",
    bottom: 12,
    left: 42.5,
    width: 70,
    height: 23,
    backgroundColor: "#4CAF50",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  buyButtonTextGreen: {
    fontSize: 11,
    color: "#FFFFFF",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
  },
  // Sport card specific styles
  newBadgeSport: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 54,
    height: 23,
    backgroundColor: "#FFC107",
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  newBadgeTextSport: {
    fontSize: 12,
    color: "#38145D",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
  },
  playIconCircleSport: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFC107",
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitleSport: {
    position: "absolute",
    top: 130,
    left: 12,
    right: 12,
    fontSize: 18,
    color: "#38145D",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
    textAlign: "center",
  },
  cardSubtitleSport: {
    position: "absolute",
    top: 155,
    left: 12,
    right: 12,
    fontSize: 11,
    color: "#5C3145",
    fontFamily: FONT_FAMILY,
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 14,
  },
  buyButtonSport: {
    position: "absolute",
    bottom: 12,
    left: 42.5,
    width: 70,
    height: 23,
    backgroundColor: "#FFC107",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  buyButtonTextSport: {
    fontSize: 11,
    color: "#38145D",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
  },
  // Midnight Fun card specific styles
  newBadgeMidnightFun: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 54,
    height: 23,
    backgroundColor: "#C3045D",
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  newBadgeTextMidnightFun: {
    fontSize: 12,
    color: "#FFFFFF",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
  },
  playIconCircleMidnightFun: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#C3045D",
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitleMidnightFun: {
    position: "absolute",
    top: 130,
    left: 12,
    right: 12,
    fontSize: 18,
    color: "#D92151",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
    textAlign: "center",
  },
  cardSubtitleMidnightFun: {
    position: "absolute",
    top: 155,
    left: 12,
    right: 12,
    fontSize: 11,
    color: "#D92151",
    fontFamily: FONT_FAMILY,
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 14,
  },
  buyButtonMidnightFun: {
    position: "absolute",
    bottom: 12,
    left: 42.5,
    width: 70,
    height: 23,
    backgroundColor: "#C3045D",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  buyButtonTextMidnightFun: {
    fontSize: 11,
    color: "#FFFFFF",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
  },
  // Romance card specific styles
  newBadgeRomance: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 54,
    height: 23,
    backgroundColor: "#FF2C7A",
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  newBadgeTextRomance: {
    fontSize: 12,
    color: "#FFFFFF",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
  },
  playIconCircleRomance: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FF2C7A",
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitleRomance: {
    position: "absolute",
    top: 130,
    left: 12,
    right: 12,
    fontSize: 18,
    color: "#5D022C",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
    textAlign: "center",
  },
  cardSubtitleRomance: {
    position: "absolute",
    top: 155,
    left: 12,
    right: 12,
    fontSize: 11,
    color: "#831747",
    fontFamily: FONT_FAMILY,
    textAlign: "center",
    opacity: 0.9,
    lineHeight: 14,
  },
  buyButtonRomance: {
    position: "absolute",
    bottom: 12,
    left: 42.5,
    width: 70,
    height: 23,
    backgroundColor: "#5D022C",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  buyButtonTextRomance: {
    fontSize: 11,
    color: "#FFFFFF",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
  },
  // Marvel card specific styles
  newBadgeMarvel: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 54,
    height: 23,
    backgroundColor: "#ED1C24",
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  newBadgeTextMarvel: {
    fontSize: 12,
    color: "#FFFFFF",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
  },
  playIconCircleMarvel: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ED1C24",
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitleMarvel: {
    position: "absolute",
    top: 130,
    left: 12,
    right: 12,
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
    textAlign: "center",
  },
  cardSubtitleMarvel: {
    position: "absolute",
    top: 155,
    left: 12,
    right: 12,
    fontSize: 11,
    color: "#FFFFFF",
    fontFamily: FONT_FAMILY,
    textAlign: "center",
    opacity: 0.9,
    lineHeight: 14,
  },
  buyButtonMarvel: {
    position: "absolute",
    bottom: 12,
    left: 42.5,
    width: 70,
    height: 23,
    backgroundColor: "#ED1C24",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  buyButtonTextMarvel: {
    fontSize: 11,
    color: "#FFFFFF",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
  },
  bottomTab: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 86,
    backgroundColor: "#2C093E",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 0,
    borderTopWidth: 0,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    paddingVertical: 0,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#60476d",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 10,
    color: "#B2AEBB",
    fontFamily: FONT_FAMILY,
  },
  createYourOwnCardText: {
    fontSize: 24,
    color: "#997EAF",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
    marginTop: 16,
    marginLeft: 0,
    marginBottom: 12,
  },
  aiCreateCard: {
    width: 370,
    maxWidth: "100%",
    height: 151,
    backgroundColor: "#150527",
    borderRadius: 24,
    marginBottom: 8,
    alignSelf: "flex-start",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  aiCreateContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 24,
    overflow: "hidden",
  },
  aiCreateLeft: {
    flex: 1,
    justifyContent: "space-between",
    height: "100%",
    paddingVertical: 8,
  },
  magicWithTadoText: {
    fontSize: 24,
    color: "#FFFFFF",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  createButton: {
    width: 125,
    height: 32,
    backgroundColor: "#38145D",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  createButtonText: {
    fontSize: 14,
    color: "#FBAA12",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
  },
  tadoAiImage: {
    width: 120,
    height: 120,
  },
  smallCardsScrollView: {
    marginHorizontal: -12,
    paddingHorizontal: 12,
    marginTop: 8,
    marginBottom: 0,
    height: 184,
  },
  smallCardsScrollContainer: {
    paddingRight: 12,
  },
  smallCard: {
    width: 112,
    height: 184,
    borderRadius: 25,
    backgroundColor: "#38145D",
    padding: 12,
    justifyContent: "space-between",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  smallCardMargin: {
    marginLeft: 16,
  },
  smallCardDirty: {
    backgroundColor: "#5D022C",
  },
  smallCardOwn: {
    backgroundColor: "#FBAA12",
  },
  classicTitleContainer: {
    alignItems: "center",
  },
  smallCardTitleClassic: {
    marginTop: 12,
    fontSize: 26,
    color: "#FBAA12",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 40,
  },
  smallCardTitleDirty: {
    marginTop: 12,
    fontSize: 26,
    color: "#D92151",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 40,
  },
  smallCardTitleOwn: {
    fontSize: 26,
    lineHeight: 40,
    color: "#38145D",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
    textAlign: "center",
  },
  previewButton: {
    width: 75,
    height: 23,
    backgroundColor: "#FBAA12",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  previewButtonText: {
    fontSize: 12,
    color: "#38145D",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
  },
  previewButtonDirty: {
    width: 75,
    height: 23,
    backgroundColor: "#D92151",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  previewButtonTextDirty: {
    fontSize: 12,
    color: "#5D022C",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
  },
  previewButtonOwn: {
    width: 75,
    height: 23,
    backgroundColor: "#38145D",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  previewButtonTextOwn: {
    fontSize: 12,
    color: "#FBAA12",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
  },
  ageBadge: {
    width: 30,
    height: 30,
    backgroundColor: "#D92151",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 8,
  },
  ageBadgeText: {
    fontSize: 12,
    color: "#5D022C",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
  },
});
