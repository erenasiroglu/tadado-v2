import { FONT_FAMILY } from "@/constants/fonts";
import { ONBOARDING_GRADIENT_COLORS, ONBOARDING_STEPS } from "@/constants/onboarding";
import { OnboardingProps } from "@/types/onboarding";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { OnboardingButton } from "./OnboardingButton";
import { OnboardingPagination } from "./OnboardingPagination";
import {
    OnboardingStep1,
    OnboardingStep2,
    OnboardingStep3,
    OnboardingStep4,
    OnboardingStep5,
} from "./steps";

export const OnboardingScreen: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;
  const isThirdStep = currentStep === 2;
  const isFourthStep = currentStep === 3;
  const isFifthStep = currentStep === 4;
  const isFirstStep = currentStep === 0;

  const getGradientColors = () => {
    if (isFourthStep) {
      return ["#FFD17BDE", "#D5B1F2"] as [string, string];
    }
    return ONBOARDING_GRADIENT_COLORS as [string, string];
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <View style={styles.container}>
      {isFifthStep ? (
        <Image
          source={require("@/assets/images/onboarding_fourth.png")}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      ) : (
        <LinearGradient
          colors={getGradientColors()}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      )}
      <SafeAreaView style={styles.safeArea}>
        {!isFirstStep && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handlePrevious}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={30} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        {!isLastStep && (
          <TouchableOpacity
            style={[
              styles.skipButton,
              isThirdStep && styles.skipButtonThirdStep,
            ]}
            onPress={handleSkip}
            activeOpacity={0.8}
          >
            <Text style={styles.skipButtonText}>SKIP</Text>
          </TouchableOpacity>
        )}

        {currentStep === 0 && <OnboardingStep1 />}
        {currentStep === 1 && <OnboardingStep2 />}
        {currentStep === 2 && <OnboardingStep3 />}
        {currentStep === 3 && <OnboardingStep4 />}
        {currentStep === 4 && <OnboardingStep5 />}

        {!isLastStep && (
          <View style={styles.footer}>
            {currentStep === 1 && (
              <Text style={styles.playInYourStyle}>Play in your style!</Text>
            )}
            <OnboardingPagination
              totalSteps={ONBOARDING_STEPS.length}
              currentStep={currentStep}
            />
            <View style={styles.buttonContainer}>
              <OnboardingButton
                title="İleri"
                onPress={handleNext}
                variant="primary"
              />
            </View>
          </View>
        )}
        {isLastStep && (
          <View style={styles.footer}>
            <OnboardingPagination
              totalSteps={ONBOARDING_STEPS.length}
              currentStep={currentStep}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.getStartedButton}
                onPress={onComplete}
                activeOpacity={0.8}
              >
                <Text style={styles.getStartedText}>Get Started!</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  gradientBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  backgroundImage: {
    position: "absolute",
    width: "150%",
    height: "150%",
    top: "-25%",
    left: "-25%",
  },
  safeArea: {
    flex: 1,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    width: 30,
    height: 30,
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  skipButton: {
    position: "absolute",
    top: 60,
    right: 20,
    width: 59,
    height: 29,
    backgroundColor: "#eed7fb",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  skipButtonThirdStep: {
    backgroundColor: "#fedb59",
  },
  skipButtonText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: FONT_FAMILY,
  },
  footer: {
    paddingBottom: 40,
    paddingHorizontal: 20,
    gap: 32,
  },
  playInYourStyle: {
    fontSize: 25,
    color: "#38145D",
    fontFamily: FONT_FAMILY,
    textAlign: "center",
  },
  buttonContainer: {
    alignItems: "center",
  },
  getStartedButton: {
    width: 318,
    height: 50,
    borderRadius: 35,
    display: "flex",
    backgroundColor: "rgba(217, 217, 217, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  getStartedText: {
    justifyContent: "center",
    alignItems: "center",
    fontSize: 35,
    fontWeight: "700",
    color: "#38145D",
    fontFamily: FONT_FAMILY,
    textAlign: "center",
  },
});

