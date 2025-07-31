import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { GenderOptions } from "@/src/modules/login/components/GenderOption";
import { Gender, getGenderLabel } from "@/src/modules/login/enums/Gender";
import { useSignupViewModel } from "@/src/modules/login/form/viewmodel/authViewModel";
import { makeUTCDateAtMidnight, UTCDateAtMidnight } from "@/src/modules/shared/utils/UTCDateAtMidnight";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { DateOfBirthPick } from "@/src/modules/login/components/DateOfBirthPick";
import { NicknameInput } from "@/src/modules/login/components/NicknameInput";
import { NextButton } from "@/src/modules/login/components/NextButton";
import { FullScreenLoader } from "@/src/modules/shared/splash/loading/lottieview/FullScreenLoader";

export default function SignupPage() {
  const [nickname, setNickname] = useState<string>("");
  const [gender, setGender] = useState<Gender>(Gender.FEMALE);
  const [dateOfBirth, setDateOfBirth] = useState<UTCDateAtMidnight>(makeUTCDateAtMidnight(1995, 1, 1));
  
  const { token, provider } = useLocalSearchParams();
  const { signup, isLoading, error } = useSignupViewModel();

  useEffect(() => {
    if (error) {
      Alert.alert("회원 가입 중 오류가 발생했습니다.");
      console.error(error);
    }
  }, [error]);

  const handleSignupPress = () => {
    console.log("handleSignupPress");
    console.log("nickname", !nickname.trim());
    if (!nickname.trim()) {
      Alert.alert("오류", "닉네임을 입력해주세요.");
      return;
    }
    else {
      signup({
        id_token: token as string,
        provider: provider as string,
        nickname: nickname,
        gender: gender,
        date_of_birth: dateOfBirth,
      });
    }
  };

    return (
      <>
        {isLoading&&<FullScreenLoader/>}
        <View style={styles.container}>
          <Text style={styles.title}>회원 정보를 입력해주세요</Text>

          <View style={styles.inputSection}>
          <Text style={styles.label}>닉네임</Text>
            <NicknameInput nickname={nickname} setNickname={setNickname} />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>성별</Text>
            <GenderOptions selectedGender={gender} setGender={setGender} />
          </View>

          <View style={[styles.inputSection, styles.birthInputSection]}>
            <Text style={styles.label}>생년월일</Text>
            <DateOfBirthPick dateOfBirth={dateOfBirth} setDateOfBirth={setDateOfBirth} />
          </View>

          <NextButton handleSignupPress={handleSignupPress} isLoading={isLoading} />
        </View>
      </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 24,
    backgroundColor: COLORS.background.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.black,
    textAlign: 'center',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.gray,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },

  inputSection: {
    marginBottom: 40,
    width: '100%',
  },

  birthInputSection: {
    marginTop: 10,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.black,
    marginBottom: 12,
  }
});