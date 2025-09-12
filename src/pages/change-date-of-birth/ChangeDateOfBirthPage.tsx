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

export default function ChangeDateOfBirth() {
  const user = useUserViewModel();
  const [dateOfBirthInput, setDateOfBirthInput] = useState<DateOnly>(
    user?.dateOfBirth || DateOnly.create(new Date().toISOString())
  );
  const { changeDateOfBirth, isLoading } = useChangeDateOfBirthViewModel();
  const [isDateOfBirthChanged, setIsDateOfBirthChanged] = useState(true);
  const router = useRouter();

  const handleChangeDateOfBirth = () => {
    changeDateOfBirth(dateOfBirthInput);
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={{ height: 16 }} />
      
      <View style={{ width: "80%" }}>
        <Text variant="titleLarge">생년월일을 입력해주세요.</Text>
      </View>
      
      <View style={{ height: 32 }} />
      
      <View style={{ width: "90%" }}>
        <DatePicker
          dateOfBirth={dateOfBirthInput}
          setDateOfBirth={setDateOfBirthInput}
        />
      </View>

      <View style={{ height: 32 }} />
      <View style={{width: "80%" }} >
      <SquareButton
        label="변경"
        onPress={handleChangeDateOfBirth}
        disabled={isLoading || !isDateOfBirthChanged}
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
