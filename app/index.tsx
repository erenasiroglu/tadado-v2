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
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsScrollContainer}
          style={styles.cardsScrollView}
        >
          <TouchableOpacity style={styles.card} onPress={handleSeriesCardPress} activeOpacity={0.8}>
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

              <Text style={styles.cardTitle}>SERIES</Text>

              <Text style={styles.cardSubtitle}>Popular series and movies!</Text>

              <View style={styles.buyButton}>
                <Text style={styles.buyButtonText}>FREE</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingBottom: 0,
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
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  cardsScrollContainer: {
    paddingRight: 20,
  },
  card: {
    width: 155,
    height: 223,
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
    color: "#FBAA12A6",
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
});
