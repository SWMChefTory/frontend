import { Text, View } from "react-native";
import { NicknameInput } from "@/src/modules/user/presentation/components/NicknameInput";
import { GenderOptions } from "@/src/modules/user/presentation/components/GenderOption";
import { DateOfBirthPick } from "@/src/modules/user/presentation/components/DateOfBirthPick";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { StyleSheet } from "react-native";
import { DateOnly } from "@/src/modules/shared/utils/DateOnly";
import { Gender } from "../../enums/Gender";
import { NextButton } from "../components/NextButton";

function UserInfoInputs({
    nickname,
    setNickname,
    gender,
    setGender,
    dateOfBirth,
    setDateOfBirth,
}: {
    nickname: string;
    setNickname: (nickname: string) => void;
    gender: Gender;
    setGender: (gender: Gender) => void;
    dateOfBirth: DateOnly;
    setDateOfBirth: (dateOfBirth: DateOnly) => void;
}) {
  return (
    <>
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
  

export default UserInfoInputs;