import { View, TouchableOpacity, StyleSheet } from "react-native";
import {
  useUserViewModel,
  useChangeGenderViewModel,
} from "@/src/modules/user/business/service/useUserSerivce";
// import { GenderOptions } from "@/src/modules/user/presentation/settings/user/components/GenderOptions";
import { Text } from "react-native-paper";
import { useState } from "react";
import { Gender } from "@/src/modules/user/enums/Gender";
import { COLORS } from "@/src/modules/shared/constants/colors";
import TextInputTemplate from "@/src/shared/components/textInputs/TextInputTemplate";

export default function ChangeGenderPage() {
  const user = useUserViewModel();
  const { changeGender, isLoading } = useChangeGenderViewModel();
  const [gender, setGender] = useState<Gender | null>(user?.gender || null);
  const [isGenderChanged, setIsGenderChanged] = useState(false);

  const handleChangedGenderSubmit = (gender: Gender) => {
    console.log("gender", gender);
    console.log(user?.gender);
    if (gender === user?.gender) {
      setIsGenderChanged(false);
    } else {
      setIsGenderChanged(true);
    }
    setGender(gender);
  };

  return (
    <View style={styles.container}>
      <View style={{ width: "80%", height: "100%", alignSelf: "center" }}>
        <View style={{ height: 16 }} />
        <Text variant="titleLarge">성별을 선택해주세요.</Text>
        <View style={{ height: 32 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 400,
    // paddingHorizontal: 75,
    paddingTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: COLORS.orange.main,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 32,
  },
  buttonText: {
    color: COLORS.text.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: COLORS.orange.inactive,
  },
});
