import { FONT_FAMILY } from "@/constants/fonts";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const OnboardingStep5: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardText}>
          Let&apos;s{"\n"}Get{"\n"}Started!
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
  },
  card: {
    width: 318,
    height: 253,
    borderRadius: 35,
    backgroundColor: "rgba(217, 217, 217, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    fontSize: 45,
    fontWeight: "700",
    color: "#4B1A7A",
    textAlign: "center",
    fontFamily: FONT_FAMILY,
  },
});
