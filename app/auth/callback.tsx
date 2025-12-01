import { supabase } from "@/utils/supabase";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";

export default function AuthCallback() {
  const params = useLocalSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        if (params.access_token && params.refresh_token) {
          await processTokens({
            access_token: params.access_token as string,
            refresh_token: params.refresh_token as string,
          });
          return;
        }

        const url = await Linking.getInitialURL();
        if (url) {
          const parsed = Linking.parse(url);
    
          const hash = url.split("#")[1];
          if (hash) {
            const hashParams: Record<string, string> = {};
            hash.split("&").forEach((param) => {
              const [key, value] = param.split("=");
              if (key && value) {
                hashParams[key] = decodeURIComponent(value);
              }
            });
            
            if (hashParams.access_token && hashParams.refresh_token) {
              await processTokens(hashParams);
              return;
            }
          }
          
    
          if (parsed.queryParams) {
            const accessToken = parsed.queryParams.access_token as string;
            const refreshToken = parsed.queryParams.refresh_token as string;
            if (accessToken && refreshToken) {
              await processTokens({ access_token: accessToken, refresh_token: refreshToken });
              return;
            }
          }
        }

        throw new Error("No authentication tokens found");
      } catch (error: any) {
        console.error("Auth callback error:", error);
        Alert.alert(
          "Doğrulama Hatası",
          error.message || "E-posta doğrulaması sırasında bir hata oluştu. Lütfen tekrar deneyin.",
          [
            {
              text: "Tamam",
              onPress: () => router.replace("/"),
            },
          ]
        );
      }
    };

    handleAuthCallback();
  }, [params]);

  const processTokens = async (tokenParams: any) => {
    const accessToken = tokenParams.access_token || tokenParams.accessToken;
    const refreshToken = tokenParams.refresh_token || tokenParams.refreshToken;

    if (!accessToken || !refreshToken) {
      throw new Error("Missing tokens");
    }

    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) {
      throw error;
    }

    if (data?.session) {

      Alert.alert(
        "Başarılı",
        "E-posta adresiniz doğrulandı! Giriş yapabilirsiniz.",
        [
          {
            text: "Tamam",
            onPress: () => router.replace("/"),
          },
        ]
      );
    }
  };

  return (
    <LinearGradient colors={["#441063", "#2A0A3B"]} style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#8D64AB" />
        <Text style={styles.text}>Doğrulama yapılıyor...</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: "#FFFFFF",
  },
});

