import { FONT_FAMILY } from "@/constants/fonts";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export const OnboardingStep5: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.categoryBar}>
          <View style={styles.barFilled}>
            <Text style={styles.barText}>Classic Fun!</Text>
          </View>
          <View style={styles.barEmpty} />
        </View>
        <View>
          <Image
            source={require("@/assets/images/component_7.png")}
            style={styles.cardsImage}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 2,
  },
  content: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 80,
  },
  categoryBar: {
    width: 354,
    height: 36,
    borderRadius: 30,
    flexDirection: "row",
    overflow: "hidden",
  },
  barFilled: {
    width: "90%",
    backgroundColor: "#F9B73B",
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  barEmpty: {
    width: "10%",
    backgroundColor: "#684164",
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
  },
  barText: {
    fontSize: 25,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: FONT_FAMILY,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  cardsImage: {
    width: 320,
    height: 200,
  },
});
