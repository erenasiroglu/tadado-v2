import { FONT_FAMILY } from "@/constants/fonts";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

interface LoginScreenProps {
  onCreateAccount?: () => void;
  onAlreadyHaveAccount?: () => void;
  onContinueAsGuest?: () => void;
  onSignInWithGoogle?: () => void;
  onSignInWithApple?: () => void;
  isSigningIn?: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onCreateAccount,
  onAlreadyHaveAccount,
  onContinueAsGuest,
  onSignInWithGoogle,
  onSignInWithApple,
  isSigningIn = false,
}) => {
  const { t } = useTranslation();

  return (
    <LinearGradient colors={["#441063", "#2A0A3B"]} style={styles.container}>
      <View style={styles.content}>
        {/* New Welcome Screen Design */}
        <View style={styles.newHeader}>
          <Text style={styles.tadadoText}>TADADO!</Text>
          <Image source={require("@/assets/images/tado_login.png")} style={styles.loginImage} />
          <Text style={styles.readyToPartyText}>{t("ready_to_party")}</Text>
        </View>

        <View style={styles.newBottomSection}>
          <View style={styles.newButtonsContainer}>
            <TouchableOpacity
              style={styles.newButton}
              onPress={onSignInWithGoogle}
              activeOpacity={0.8}
              disabled={isSigningIn}
            >
              <LinearGradient
                colors={["#B47FE9", "#FFD17A"]}
                style={styles.newButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.newButtonText}>{t("sign_in_with_google")}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.newButton}
              onPress={onSignInWithApple}
              activeOpacity={0.8}
              disabled={isSigningIn}
            >
              <LinearGradient
                colors={["#B47FE9", "#FFD17A"]}
                style={styles.newButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.newButtonText}>{t("sign_in_with_apple")}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.guestButton, isSigningIn && styles.guestButtonDisabled]}
            onPress={onContinueAsGuest}
            activeOpacity={0.8}
            disabled={isSigningIn}
          >
            {isSigningIn ? (
              <ActivityIndicator size="small" color="#ADADAD" />
            ) : (
              <Text style={styles.guestText}>{t("continue_as_guest")}</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Old code kept for future reference */}
        {/* 
        <View style={styles.header}>
          <Text style={styles.welcomeText}>{t("welcome")}</Text>
          <Text style={styles.subtitleText}>{t("login_screen_subtitle")}</Text>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={onCreateAccount} activeOpacity={0.8}>
              <LinearGradient
                colors={["#B47FE9", "#FFD17A"]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>{t("create_account")}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={onAlreadyHaveAccount}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#B47FE9", "#FFD17A"]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>{t("already_have_account")}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        */}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: "center",
  },
  newHeader: {
    alignItems: "center",
    width: "100%",
    marginTop: 48,
  },
  tadadoText: {
    fontSize: 48,
    color: "#8D64AB",
    fontFamily: FONT_FAMILY,
    marginBottom: 20,
  },
  loginImage: {
    width: 240,
    height: 181,
    resizeMode: "contain",
    marginBottom: 20,
  },
  readyToPartyText: {
    fontSize: 32,
    color: "#E6E6E6",
    fontFamily: FONT_FAMILY,
    marginBottom: 40,
  },
  newBottomSection: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
  },
  newButtonsContainer: {
    alignItems: "center",
    gap: 20,
    marginBottom: 40,
    width: "100%",
  },
  newButton: {
    width: 332,
    height: 55,
    borderRadius: 12,
    overflow: "hidden",
  },
  newButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  newButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: FONT_FAMILY,
  },
  guestButton: {
    marginTop: 20,
    minHeight: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  guestButtonDisabled: {
    opacity: 0.6,
  },
  guestText: {
    fontSize: 20,
    color: "#ADADAD",
    fontFamily: FONT_FAMILY,
  },
  header: {
    alignItems: "flex-start",
  },
  welcomeText: {
    fontSize: 40,
    color: "#8D64AB",
    fontFamily: FONT_FAMILY,
    marginBottom: 16,
  },
  subtitleText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: FONT_FAMILY,
    textAlign: "left",
  },
  bottomSection: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  buttonsContainer: {
    alignItems: "center",
    gap: 20,
    marginBottom: 40,
    width: "100%",
  },
  button: {
    width: 332,
    height: 76,
    borderRadius: 12,
    overflow: "hidden",
  },
  buttonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: FONT_FAMILY,
  },
});
