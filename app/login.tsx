import { FONT_FAMILY } from "@/constants/fonts";
import { supabase } from "@/utils/supabase";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert(t("error"), t("email_required"));
      return false;
    }
    if (!email.includes("@")) {
      Alert.alert(t("error"), t("email_invalid"));
      return false;
    }
    if (!password) {
      Alert.alert(t("error"), t("password_required"));
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        Alert.alert(t("login_error"), error.message);
        return;
      }

      if (data?.user) {
        router.replace("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(t("error"), t("login_unexpected_error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#441063", "#2A0A3B"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>{t("login_title")}</Text>
              <Text style={styles.subtitle}>{t("login_subtitle")}</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t("email_label")}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t("email_placeholder")}
                  placeholderTextColor="#ADADAD"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t("password_label")}</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder={t("password_placeholder")}
                    placeholderTextColor="#ADADAD"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.eyeButtonText}>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => {
                  Alert.alert(t("forgot_password_title"), t("forgot_password_message"));
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotPasswordText}>{t("forgot_password_link")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                onPress={handleLogin}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={["#B47FE9", "#FFD17A"]}
                  style={styles.submitButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.submitButtonText}>{t("login_submit")}</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>{t("no_account")}</Text>
                <TouchableOpacity onPress={() => router.push("/signup")} activeOpacity={0.7}>
                  <Text style={styles.footerLink}>{t("create_account")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 30,
    alignSelf: "flex-start",
  },
  backButtonText: {
    fontSize: 18,
    color: "#8D64AB",
    fontFamily: FONT_FAMILY,
  },
  content: {
    flex: 1,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 40,
    color: "#8D64AB",
    fontFamily: FONT_FAMILY,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: FONT_FAMILY,
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: "#8D64AB",
    fontFamily: FONT_FAMILY,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: FONT_FAMILY,
    borderWidth: 1,
    borderColor: "rgba(141, 100, 171, 0.3)",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(141, 100, 171, 0.3)",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: FONT_FAMILY,
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  eyeButtonText: {
    fontSize: 20,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#8D64AB",
    fontFamily: FONT_FAMILY,
  },
  submitButton: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: FONT_FAMILY,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: "#ADADAD",
    fontFamily: FONT_FAMILY,
  },
  footerLink: {
    fontSize: 16,
    color: "#8D64AB",
    fontFamily: FONT_FAMILY,
    fontWeight: "600",
  },
});
