import { LoginScreen } from "@/components/LoginScreen";
import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";
import { FONT_FAMILY } from "@/constants/fonts";
import { supabase } from "@/utils/supabase";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
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
        Alert.alert(
          "Giriş Hatası",
          error.message || "Misafir olarak giriş yapılamadı. Lütfen tekrar deneyin.",
          [{ text: "Tamam" }]
        );
        return;
      }

      if (data?.user) {
        setShowLogin(false);
        setShowHome(true);
      }
    } catch (error) {
      console.error("Unexpected error during anonymous sign-in:", error);
      Alert.alert(
        "Hata",
        "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.",
        [{ text: "Tamam" }]
      );
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      "Çıkış Yap",
      "Hesabınızdan çıkmak istediğinize emin misiniz?",
      [
        {
          text: "İptal",
          style: "cancel",
        },
        {
          text: "Çıkış Yap",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase.auth.signOut();
              if (error) {
                Alert.alert("Hata", error.message);
                return;
              }
      
            } catch (error) {
              console.error("Sign out error:", error);
              Alert.alert("Hata", "Çıkış yapılırken bir hata oluştu.");
            }
          },
        },
      ]
    );
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
        <Text style={styles.homeText}>Ana Sayfa</Text>
        <Text style={styles.homeSubtext}>Hoş geldiniz!</Text>
        
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#B47FE9", "#FFD17A"]}
            style={styles.signOutButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.signOutButtonText}>Çıkış Yap</Text>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2A0A3B",
    paddingHorizontal: 20,
  },
  homeText: {
    fontSize: 32,
    color: "#8D64AB",
    fontFamily: FONT_FAMILY,
    marginBottom: 16,
  },
  homeSubtext: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: FONT_FAMILY,
    marginBottom: 40,
  },
  signOutButton: {
    width: 200,
    height: 56,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 20,
  },
  signOutButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  signOutButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: FONT_FAMILY,
  },
});
