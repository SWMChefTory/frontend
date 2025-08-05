import React, { useState, useEffect } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { GenderOptions } from "@/src/modules/user/presentation/components/GenderOption";
import { Gender } from "@/src/modules/user/enums/Gender";
import { useSignupViewModel } from "@/src/modules/user/business/service/useAuthService";
import {
  makeUTCDateAtMidnight,
  UTCDateAtMidnight,
} from "@/src/modules/shared/utils/UTCDateAtMidnight";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { DateOfBirthPick } from "@/src/modules/user/presentation/components/DateOfBirthPick";
import { NicknameInput } from "@/src/modules/user/presentation/components/NicknameInput";
import { NextButton } from "@/src/modules/user/presentation/components/NextButton";
import { FullScreenLoader } from "@/src/modules/shared/splash/loading/lottieview/FullScreenLoader";
import { DateOnly } from "@/src/modules/shared/utils/DateOnly";

export default function SignupScreen() {
  const [nickname, setNickname] = useState<string>("");
  const [gender, setGender] = useState<Gender>(Gender.FEMALE);
  const [dateOfBirth, setDateOfBirth] = useState<DateOnly>(
    DateOnly.create("1995-01-01"),
  );

  const { token, provider } = useLocalSearchParams();
  const { signup, isLoading, error } = useSignupViewModel();

  useEffect(() => {
    if (error) {
      Alert.alert("회원 가입 중 오류가 발생했습니다.");
      console.error(error);
    }
  }, [error]);

  console.log({
    id_token: token as string,
    provider: provider as string,
    nickname: nickname,
    gender: gender,
    date_of_birth: dateOfBirth,
  });

  return (
    <>
      {isLoading && <FullScreenLoader />}
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
          <DateOfBirthPick
            dateOfBirth={dateOfBirth}
            setDateOfBirth={setDateOfBirth}
          />
        </View>
        <NextButton
          handleSignupPress={() =>
            signup({
              id_token: token as string,
              provider: provider as string,
              nickname: nickname,
              gender: gender,
              date_of_birth: dateOfBirth,
            })
          }
          isLoading={isLoading}
        />
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
    fontWeight: "bold",
    color: COLORS.text.black,
    textAlign: "center",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.gray,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },

  inputSection: {
    marginBottom: 40,
    width: "100%",
  },

  birthInputSection: {
    marginTop: 10,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text.black,
    marginBottom: 12,
  },
});
