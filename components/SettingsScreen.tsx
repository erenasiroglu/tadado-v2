import { FONT_FAMILY } from "@/constants/fonts";
import i18n from "@/utils/i18n";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const { t, i18n: i18nInstance } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18nInstance.language || "en");

  const changeLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
  };

  return (
    <LinearGradient colors={["#2A0A3A", "#441063"]} locations={[0, 0.79]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language</Text>
          <View style={styles.languageOptions}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                currentLanguage === "en" && styles.languageButtonActive,
              ]}
              onPress={() => changeLanguage("en")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  currentLanguage === "en" && styles.languageButtonTextActive,
                ]}
              >
                English
              </Text>
              {currentLanguage === "en" && (
                <Ionicons name="checkmark-circle" size={24} color="#FBAA12" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageButton,
                currentLanguage === "tr" && styles.languageButtonActive,
              ]}
              onPress={() => changeLanguage("tr")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  currentLanguage === "tr" && styles.languageButtonTextActive,
                ]}
              >
                Türkçe
              </Text>
              {currentLanguage === "tr" && (
                <Ionicons name="checkmark-circle" size={24} color="#FBAA12" />
              )}
            </TouchableOpacity>
          </View>
        </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 28,
    color: "#fff0cf",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    color: "#997EAF",
    fontFamily: FONT_FAMILY,
    fontWeight: "700",
    marginBottom: 16,
  },
  languageOptions: {
    gap: 12,
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#321441",
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "transparent",
  },
  languageButtonActive: {
    backgroundColor: "#4b3158",
    borderColor: "#FBAA12",
  },
  languageButtonText: {
    fontSize: 18,
    color: "#997EAF",
    fontFamily: FONT_FAMILY,
    fontWeight: "600",
  },
  languageButtonTextActive: {
    color: "#fff0cf",
    fontWeight: "700",
  },
});
