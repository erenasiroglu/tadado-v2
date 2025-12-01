import { FONT_FAMILY } from "@/constants/fonts";
import LottieView from "lottie-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const OnboardingStep1: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <LottieView
          source={{
            uri: "https://lottie.host/3d43da9b-3018-454f-a40f-a9df23c99869/GkEzcjiGpy.lottie",
          }}
          autoPlay
          loop
          style={styles.image}
        />
      </View>
      <View style={styles.card}>
        <Text style={styles.welcomeTitle}>
          WELCOME{"\n"}TO{"\n"}TADADO!
        </Text>
        <Text style={styles.subtitle}>Choose which game{"\n"}you want to play!</Text>
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
