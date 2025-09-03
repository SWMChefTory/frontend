import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  useUserViewModel,
  useChangeGenderViewModel,
  } from "@/src/modules/user/business/service/useUserSerivce";
import { GenderOptions } from "@/src/modules/user/presentation/components/GenderOption";
import { useState } from "react";
import { Gender } from "@/src/modules/user/enums/Gender";
import { COLORS } from "@/src/modules/shared/constants/colors";

export default function ChangeGenderPage() {
  const user = useUserViewModel();
  const { changeGender, isLoading } = useChangeGenderViewModel();
  const [gender, setGender] = useState<Gender|null>(user?.gender || null);
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
      <GenderOptions
        selectedGender={gender}
        setGender={handleChangedGenderSubmit}
      />
      <TouchableOpacity
        style={[styles.button, !isGenderChanged && styles.buttonDisabled]}
        onPress={() => changeGender(gender ?? Gender.MALE)}
        disabled={isLoading || !isGenderChanged}
      >
        <Text style={styles.buttonText}>변경</Text>
      </TouchableOpacity>
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
