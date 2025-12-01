import React from "react";
import { View, StyleSheet } from "react-native";

interface OnboardingPaginationProps {
  totalSteps: number;
  currentStep: number;
}

export const OnboardingPagination: React.FC<OnboardingPaginationProps> = ({
  totalSteps,
  currentStep,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[styles.dot, index === currentStep ? styles.activeDot : styles.inactiveDot]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 56,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: "#3d3346",
  },
  inactiveDot: {
    backgroundColor: "#D9D9D9",
  },
});
