import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  useChangeDateOfBirthViewModel,
  useUserViewModel,
} from "@/src/modules/user/business/service/useUserSerivce";
import { useState } from "react";
import { DateOfBirthPick } from "@/src/modules/user/presentation/components/DateOfBirthPick";
import { COLORS } from "../../shared/constants/colors";
import { DateOnly } from "@/src/modules/shared/utils/DateOnly";

export default function ChangeDateOfBirth() {
  const user = useUserViewModel();
  const [dateOfBirthInput, setDateOfBirthInput] = useState<DateOnly>(
    user?.dateOfBirth || DateOnly.create(new Date().toISOString()),
  );
  const { changeDateOfBirth, isLoading } = useChangeDateOfBirthViewModel();
  const [isDateOfBirthChanged, setIsDateOfBirthChanged] = useState(false);

  const handleChangeDateOfBirth = () => {
    if (dateOfBirthInput.toJSON() === user?.dateOfBirth?.toJSON()) {
      setIsDateOfBirthChanged(false);
    } else {
      setIsDateOfBirthChanged(true);
    }
    changeDateOfBirth(dateOfBirthInput);
  };

  return (
    <View style={styles.container}>
      <DateOfBirthPick
        dateOfBirth={dateOfBirthInput}
        setDateOfBirth={setDateOfBirthInput}
      />
      <TouchableOpacity
        style={[styles.button, !isDateOfBirthChanged && styles.buttonDisabled]}
        onPress={handleChangeDateOfBirth}
        disabled={isLoading || !isDateOfBirthChanged}
      >
        <Text style={styles.buttonText}>변경</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 400,
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
  buttonDisabled: {
    backgroundColor: COLORS.orange.inactive,
  },
  buttonText: {
    color: COLORS.text.white,
    fontSize: 12,
    fontWeight: "bold",
  },
});
