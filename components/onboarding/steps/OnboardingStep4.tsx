import { FONT_FAMILY } from "@/constants/fonts";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export const OnboardingStep4: React.FC = () => {
  const steps = [
    {
      number: 1,
      text: "Split into teams",
    },
    {
      number: 2,
      text: "Pick A Topic To Play",
    },
    {
      number: 3,
      text: "Describe The Word Without Using The Forbidden Ones!",
    },
    {
      number: 4,
      text: "Guess As Many As You Can Before Time Runs Out",
    },
    {
      number: 5,
      text: "The Team With The Most Points Wins!",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("@/assets/images/onboarding_third.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>
          HOW TO PLAY{"\n"}TaDaDo?
        </Text>
        <View style={styles.buttonsContainer}>
          {steps.map((step, index) => (
            <View key={index} style={styles.button}>
              <View style={styles.circle}>
                <Text style={styles.circleText}>{step.number}</Text>
              </View>
              <Text style={styles.buttonText}>{step.text}</Text>
            </View>
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
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "120%",
    height: "120%",
    maxWidth: 600,
    maxHeight: 800,
  },
  content: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 49,
    fontWeight: "700",
    color: "#38145D",
    textAlign: "center",
    marginBottom: 16,
    fontFamily: FONT_FAMILY,
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  button: {
    width: 362,
    minHeight: 50,
    borderRadius: 35,
    backgroundColor: "#fbead2",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 12,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#D57CD3CC",
    justifyContent: "center",
    alignItems: "center",
  },
  circleText: {
    fontSize: 20,
    fontWeight: "400",
    color: "#FFFFFF",
    fontFamily: FONT_FAMILY,
    lineHeight: 24,
  },
  buttonText: {
    flex: 1,
    fontSize: 25,
    color: "#38145D",
    fontFamily: FONT_FAMILY,
  },
});

