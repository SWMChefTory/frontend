import { View, StyleSheet, Alert } from "react-native";
import {
  useUserViewModel,
  useChangeGenderViewModel,
} from "@/src/modules/user/business/service/useUserSerivce";
import { Text } from "react-native-paper";
import { useState } from "react";
import { Gender } from "@/src/modules/user/enums/Gender";
import { GenderOptionsSelectInput } from "@/src/widgets/user/GenderOptionsSelectInput";
import SquareButton from "@/src/shared/components/textInputs/SquareButtonTemplate";
import { router } from "expo-router";

export default function ChangeGenderPage() {
  const user = useUserViewModel();
  const { changeGender, isLoading } = useChangeGenderViewModel();
  const [gender, setGender] = useState<Gender | null>(user?.gender || null);
  const [isFocused, setIsFocused] = useState(false);
  const [isGenderChanged, setIsGenderChanged] = useState(false);

  const handleChangedGenderSubmit = (gender: Gender | null) => {
    console.log("gender", gender);
    console.log(user?.gender);
    if (gender === user?.gender) {
      setIsGenderChanged(false);
    } else {
      setIsGenderChanged(true);
      setGender(gender);
    }
    setIsFocused(false);
  };

  const handlePressButton = async () => {
    if (isGenderChanged) {
      try {
        await changeGender(gender);
        router.back();
      } catch (e) {
        console.error(e);
        Alert.alert("에러", "성별 변경에 실패했습니다.");
      }
      
    }
  }

    return (
      <View style={styles.container}>
        <View style={{ height: 16 }} />
        <View style={{ width: "80%", alignSelf: "center" }}>
          <Text variant="titleLarge">성별을 선택해주세요.</Text>
        </View>
        <View style={{ height: 32 }} />
        <View style={{ width: "80%" }}>
          <GenderOptionsSelectInput
            gender={gender}
            handlePress={handleChangedGenderSubmit}
            isFocused={isFocused}
            toFocus={() => {
              setIsFocused(true);
            }}
            toBlur={() => {
              setIsFocused(false);
            }}
            isValid={isGenderChanged}
          />
          <View style={{ height: 32 }} />
          <SquareButton
            label="확인"
            onPress={handlePressButton}
            disabled={!isGenderChanged}
          />
        </View>
        <View style={{ height: 32 }} />
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      width: "100%",
    },
  });
