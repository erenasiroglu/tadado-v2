import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";
import { FONT_FAMILY } from "@/constants/fonts";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  const [showOnboarding, setShowOnboarding] = useState(true);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ana Ekran</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "600",
    fontFamily: FONT_FAMILY,
  },
});
