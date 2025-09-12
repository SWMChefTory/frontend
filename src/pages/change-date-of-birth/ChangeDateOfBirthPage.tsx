import { View, StyleSheet} from "react-native";
import { Text } from "react-native-paper";
import {
  useChangeDateOfBirthViewModel,
  useUserViewModel,
} from "@/src/modules/user/business/service/useUserSerivce";
import { useState } from "react";
import { DatePicker } from "@/src/widgets/DatePicker";
import { DateOnly } from "@/src/modules/shared/utils/dateOnly";
import SquareButton from "@/src/shared/components/textInputs/SquareButtonTemplate";
import { useRouter } from "expo-router";
import { DateOfBirthSelectInput } from "@/src/pages/change-date-of-birth/buttons/DateOfBirthSelectInput";

export default function ChangeDateOfBirth() {
  const user = useUserViewModel();
  const [dateOfBirthInput, setDateOfBirthInput] = useState<DateOnly>(
    user?.dateOfBirth || DateOnly.create(new Date().toISOString())
  );
  const { changeDateOfBirth, isLoading } = useChangeDateOfBirthViewModel();
  const [isDateOfBirthChanged, setIsDateOfBirthChanged] = useState(true);
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);

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
          changeDateOfBirth(date);
          setIsFocused(false);  
          router.back();
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
