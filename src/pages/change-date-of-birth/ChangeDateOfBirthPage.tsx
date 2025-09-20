import { View, StyleSheet, Alert} from "react-native";
import { Text } from "react-native-paper";
import {
  useChangeUserViewModel,
  useUserViewModel,
} from "@/src/modules/user/business/service/useUserSerivce";
import { useState } from "react";
import { DateOnly } from "@/src/modules/shared/utils/dateOnly";
import { useRouter } from "expo-router";
import { DateOfBirthSelectInput } from "@/src/pages/change-date-of-birth/buttons/DateOfBirthSelectInput";

export default function ChangeDateOfBirth() {
  const user = useUserViewModel();
  const [dateOfBirthInput, setDateOfBirthInput] = useState<DateOnly | null>(
    user?.dateOfBirth || null
  );
  const { changeUser, isLoading } = useChangeUserViewModel();
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);
  
  if (!user) {
    throw new Error("protected page에서 user가 없습니다.");
  }

  const handlePressDateOfBirthButton = async (dateOfBirthInput: DateOnly | null) => {
    try {
      await changeUser(
        user.withDateOfBirth(dateOfBirthInput),
      );
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert("에러", "생년월일 변경에 실패했습니다.");
    }
  }

  return (
    <View style={styles.container}>
      <View style={{ height: 16 }} /> 
      <View style={{ width: "80%", alignSelf: "center" }}>
        <Text variant="titleLarge">생년월일을 변경해주세요.</Text>
      </View>

      <View style={{ height: 32 }} />
      <View style={{width: "80%" }} >
      <DateOfBirthSelectInput
        dateOfBirth={dateOfBirthInput}
        handlePress={(date) => {
          handlePressDateOfBirthButton(date);
        }}
        isFocused={isFocused}
        toFocus={() => {setIsFocused(true);}}
        toBlur={() => {setIsFocused(false);}}
        isValid={true}
      />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
});
