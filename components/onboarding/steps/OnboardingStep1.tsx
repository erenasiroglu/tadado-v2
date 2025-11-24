import { FONT_FAMILY } from "@/constants/fonts";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export const OnboardingStep1: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("@/assets/images/onboarding_first.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.card}>
        <Text style={styles.welcomeTitle}>
          WELCOME{"\n"}TO{"\n"}TaDaDo!
        </Text>
        <Text style={styles.subtitle}>
          Choose which game{"\n"}you want to play!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    position: "relative",
  },
  imageContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 0,
  },
  image: {
    width: "120%",
    height: "120%",
    maxWidth: 650,
    maxHeight: 750,
  },
  card: {
    backgroundColor: "#F9B536E5",
    borderRadius: 45,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
    width: "100%",
    zIndex: 1,
    position: "relative",
  },
  welcomeTitle: {
    fontSize: 60,
    fontWeight: "700",
    color: "#38145D",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 72,
    fontFamily: FONT_FAMILY,
  },
  subtitle: {
    fontSize: 32,
    color: "#38145D",
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 40,
    fontFamily: FONT_FAMILY,
  },
});

