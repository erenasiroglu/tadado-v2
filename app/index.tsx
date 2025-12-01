import { LoginScreen } from "@/components/LoginScreen";
import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";
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
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

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

  if (showHome) {
    return (
      <View style={styles.homeContainer}>
        <Text style={styles.homeText}>{t("home_title")}</Text>
        <Text style={styles.homeSubtext}>{t("home_welcome")}</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsScrollContainer}
          style={styles.cardsScrollView}
        >
          <View style={styles.card}>
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
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut} activeOpacity={0.8}>
          <LinearGradient
            colors={["#B47FE9", "#FFD17A"]}
            style={styles.signOutButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.signOutButtonText}>{t("sign_out_button")}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
    backgroundColor: "#2A0A3B",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  homeText: {
    fontSize: 32,
    color: "#8D64AB",
    fontFamily: FONT_FAMILY,
    marginBottom: 8,
  },
  homeSubtext: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: FONT_FAMILY,
    marginBottom: 24,
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
  signOutButton: {
    width: 80,
    height: 24,
    borderRadius: 12,
    overflow: "hidden",
    bottom: 20,
    marginTop: 0,
    alignSelf: "center",
  },
  signOutButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  signOutButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: FONT_FAMILY,
  },
});
