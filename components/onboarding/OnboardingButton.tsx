import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { FONT_FAMILY } from "@/constants/fonts";

interface OnboardingButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
}

export const OnboardingButton: React.FC<OnboardingButtonProps> = ({
  title,
  onPress,
  variant = "primary",
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, variant === "primary" ? styles.primaryButton : styles.secondaryButton]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.buttonText,
          variant === "primary" ? styles.primaryText : styles.secondaryText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: "#FFFFFF",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: FONT_FAMILY,
  },
  primaryText: {
    color: "#F8B22F",
  },
  secondaryText: {
    color: "#FFFFFF",
  },
});
