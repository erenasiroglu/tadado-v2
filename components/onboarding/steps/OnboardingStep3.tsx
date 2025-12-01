import { FONT_FAMILY } from "@/constants/fonts";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const OnboardingStep3: React.FC = () => {
  const categories = ["Classic Fun", "Dirty Minds", "Your Own Style", "Create your Own Deck"];

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("@/assets/images/onboarding_second.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.content}>
        <View style={styles.topSection}>
          <Text style={styles.title}>Explore TaDaDo!</Text>
          <Text style={styles.subtitle}>pick your card category to play</Text>
        </View>
        <View style={styles.buttonsContainer}>
          {categories.map((category, index) => (
            <TouchableOpacity key={index} style={styles.button} activeOpacity={0.8}>
              <View style={styles.buttonLeft}>
                <Text style={styles.buttonText}>{category}</Text>
              </View>
              <View style={styles.buttonRight} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  imageContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    paddingTop: 120,
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  topSection: {
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "700",
    color: "#38145D",
    textAlign: "center",
    marginBottom: 4,
    fontFamily: FONT_FAMILY,
  },
  subtitle: {
    fontSize: 25,
    color: "#38145D",
    textAlign: "center",
    fontFamily: FONT_FAMILY,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
    gap: 16,
    marginBottom: 40,
  },
  button: {
    width: 354,
    height: 36,
    borderRadius: 30,
    flexDirection: "row",
    overflow: "hidden",
  },
  buttonLeft: {
    width: "90%",
    backgroundColor: "#EFDCFE",
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 16,
  },
  buttonRight: {
    width: "10%",
    backgroundColor: "#683f5e",
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
  },
  buttonText: {
    fontSize: 25,
    fontWeight: "400",
    color: "#38145D",
    fontFamily: FONT_FAMILY,
  },
});
