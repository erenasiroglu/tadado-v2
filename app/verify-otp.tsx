import { FONT_FAMILY } from "@/constants/fonts";
import { supabase } from "@/utils/supabase";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function VerifyOTPScreen() {
  const params = useLocalSearchParams();
  const email = (params.email as string) || "";
  const password = (params.password as string) || "";
  const isSignUp = params.isSignUp === "false";
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      const pastedOtp = value.slice(0, 6).split("");
      const newOtp = [...otp];
      pastedOtp.forEach((char, i) => {
        if (index + i < 6) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + pastedOtp.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (value && index === 5) {
      const fullOtp = newOtp.join("");
      if (fullOtp.length === 6) {
        handleVerify(fullOtp);
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpCode?: string) => {
    const otpCodeToVerify = otpCode || otp.join("");
    
    if (otpCodeToVerify.length !== 6) {
      Alert.alert("Hata", "Lütfen 6 haneli kodu giriniz.");
      return;
    }

    if (!email) {
      Alert.alert("Hata", "E-posta adresi bulunamadı.");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: otpCodeToVerify,
        type: "email",
      });

      if (error) {
        Alert.alert("Doğrulama Hatası", error.message);
        return;
      }

      if (data?.session) {
        if (isSignUp && password) {
          const { error: updateError } = await supabase.auth.updateUser({
            password: password,
          });

          if (updateError) {
            console.error("Password update error:", updateError);
          }
        }

        Alert.alert(
          "Başarılı",
          isSignUp 
            ? "Hesabınız oluşturuldu ve e-posta adresiniz doğrulandı!" 
            : "E-posta adresiniz doğrulandı! Giriş yapabilirsiniz.",
          [
            {
              text: "Tamam",
              onPress: () => router.replace("/"),
            },
          ]
        );
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      Alert.alert("Hata", "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      Alert.alert("Hata", "E-posta adresi bulunamadı.");
      return;
    }

    setIsResending(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: isSignUp,
        },
      });

      if (error) {
        Alert.alert("Hata", error.message);
        return;
      }

      Alert.alert("Başarılı", "Yeni doğrulama kodu e-posta adresinize gönderildi.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error("Resend OTP error:", error);
      Alert.alert("Hata", "Kod gönderilirken bir hata oluştu.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <LinearGradient colors={["#441063", "#2A0A3B"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← Geri</Text>
          </TouchableOpacity>

          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Doğrulama Kodu</Text>
              <Text style={styles.subtitle}>
                {email ? (
                  <>
                    <Text style={styles.emailText}>{email}</Text>
                    {"\n"}adresine gönderilen 6 haneli kodu giriniz.
                  </>
                ) : (
                  "E-posta adresinize gönderilen 6 haneli kodu giriniz."
                )}
              </Text>
            </View>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  style={[
                    styles.otpInput,
                    digit ? styles.otpInputFilled : null,
                  ]}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={({ nativeEvent }) =>
                    handleKeyPress(nativeEvent.key, index)
                  }
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  editable={!isLoading}
                />
              ))}
            </View>

            <TouchableOpacity
              style={[styles.verifyButton, isLoading && styles.verifyButtonDisabled]}
              onPress={() => handleVerify()}
              activeOpacity={0.8}
              disabled={isLoading || otp.join("").length !== 6}
            >
              <LinearGradient
                colors={["#B47FE9", "#FFD17A"]}
                style={styles.verifyButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.verifyButtonText}>Doğrula</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResendOTP}
              activeOpacity={0.7}
              disabled={isResending}
            >
              {isResending ? (
                <ActivityIndicator size="small" color="#8D64AB" />
              ) : (
                <Text style={styles.resendButtonText}>Kodu Tekrar Gönder</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 30,
    alignSelf: "flex-start",
  },
  backButtonText: {
    fontSize: 18,
    color: "#8D64AB",
    fontFamily: FONT_FAMILY,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 40,
    color: "#8D64AB",
    fontFamily: FONT_FAMILY,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: FONT_FAMILY,
    lineHeight: 22,
  },
  emailText: {
    fontWeight: "600",
    color: "#8D64AB",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
    gap: 12,
  },
  otpInput: {
    flex: 1,
    height: 60,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(141, 100, 171, 0.3)",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: FONT_FAMILY,
  },
  otpInputFilled: {
    borderColor: "#8D64AB",
    backgroundColor: "rgba(141, 100, 171, 0.2)",
  },
  verifyButton: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
  },
  verifyButtonDisabled: {
    opacity: 0.7,
  },
  verifyButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  verifyButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: FONT_FAMILY,
  },
  resendButton: {
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  resendButtonText: {
    fontSize: 16,
    color: "#8D64AB",
    fontFamily: FONT_FAMILY,
  },
});

