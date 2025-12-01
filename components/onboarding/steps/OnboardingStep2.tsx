import { FONT_FAMILY } from "@/constants/fonts";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const OnboardingStep2: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          FAST{"\n"}WORDS,{"\n"}FUNNY{"\n"}MOMENTS,{"\n"}ENDLESS{"\n"}FUN!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 60,
  },
  title: {
    fontSize: 55,
    fontWeight: "400",
    color: "#38145D",
    textAlign: "left",
    lineHeight: 70,
    fontFamily: FONT_FAMILY,
  },
});
