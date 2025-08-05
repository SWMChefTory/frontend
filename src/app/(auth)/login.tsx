import { View, Text, StyleSheet } from "react-native";
import GoogleLoginButton from "@/src/modules/user/presentation/google/components/GoogleLoginButton";
import { AppleLoginButton } from "@/src/modules/user/presentation/apple/components/AppleLoginButton";
import { Image } from "expo-image";
import LoginPage from "@/src/modules/user/presentation/LoginPage";

export default function LoginScreen() {
  return (
    <LoginPage isReal={true} />
  );
}