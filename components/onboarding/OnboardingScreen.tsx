import { FONT_FAMILY } from "@/constants/fonts";
import { ONBOARDING_GRADIENT_COLORS, ONBOARDING_STEPS } from "@/constants/onboarding";
import { OnboardingProps } from "@/types/onboarding";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { OnboardingButton } from "./OnboardingButton";
import { OnboardingPagination } from "./OnboardingPagination";
import { OnboardingStep1, OnboardingStep3, OnboardingStep5 } from "./steps";

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
  const isSecondStep = currentStep === 1;
  const isFirstStep = currentStep === 0;

  const getGradientColors = () => {
    return ONBOARDING_GRADIENT_COLORS as [string, string];
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <View style={styles.container}>
      {isLastStep ? (
        <>
          <LinearGradient
            colors={["#FFD17B", "#38145D"]}
            locations={[0.47, 1]}
            style={styles.step5Background}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          <Image
            source={require("@/assets/images/group_49.png")}
            style={styles.step5TopImage}
            resizeMode="cover"
          />
        </>
      ) : !isSecondStep ? (
        <LinearGradient
          colors={getGradientColors()}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      ) : null}
      {currentStep === 1 && (
        <>
          <LinearGradient
            colors={["#FFD17B", "#5D022C"]}
            locations={[0.47, 1]}
            style={styles.step3Background}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          <Image
            source={require("@/assets/images/group_26.png")}
            style={styles.step3TopImage}
            resizeMode="cover"
          />
        </>
      )}
      <SafeAreaView style={styles.safeArea}>
        {!isFirstStep && (
          <TouchableOpacity style={styles.backButton} onPress={handlePrevious} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={30} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.skipButton,
            isSecondStep && styles.skipButtonSecondStep,
            isLastStep && styles.doneButton,
          ]}
          onPress={handleSkip}
          activeOpacity={0.8}
        >
          <Text style={styles.skipButtonText}>{isLastStep ? "DONE!" : "SKIP"}</Text>
        </TouchableOpacity>

        {currentStep === 0 && <OnboardingStep1 />}
        {currentStep === 1 && <OnboardingStep3 />}
        {currentStep === 2 && <OnboardingStep5 />}

        {!isLastStep && (
          <View style={styles.footer}>
            <OnboardingPagination totalSteps={ONBOARDING_STEPS.length} currentStep={currentStep} />
            <View style={styles.buttonContainer}>
              <OnboardingButton
                title="İleri"
                onPress={handleNext}
                variant={isSecondStep ? "secondary" : "primary"}
              />
            </View>
          </View>
        )}
        {isLastStep && (
          <View style={styles.footer}>
            <OnboardingPagination totalSteps={ONBOARDING_STEPS.length} currentStep={currentStep} />
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
    zIndex: 10,
  },
  step3Background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 0,
  },
  step3TopImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 1,
  },
  step5Background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 0,
  },
  step5TopImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 1,
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
  skipButtonSecondStep: {
    backgroundColor: "#D39079",
  },
  doneButton: {
    backgroundColor: "#D39079",
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
