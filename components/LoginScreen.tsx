import { FONT_FAMILY } from "@/constants/fonts";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

interface LoginScreenProps {
  onCreateAccount?: () => void;
  onAlreadyHaveAccount?: () => void;
  onContinueAsGuest?: () => void;
  isSigningIn?: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onCreateAccount,
  onAlreadyHaveAccount,
  onContinueAsGuest,
  isSigningIn = false,
}) => {
  const { t } = useTranslation();

  return (
    <LinearGradient colors={["#441063", "#2A0A3B"]} style={styles.container}>
      <View style={styles.content}>
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
});
