import { BottomSheetView } from "@gorhom/bottom-sheet";
import { Text, View, StyleSheet } from "react-native";
import { DatePicker } from "@/src/widgets/DatePicker";
import { useState } from "react";
import { DateOnly } from "@/src/modules/shared/utils/dateOnly";
import { Button, useTheme } from "react-native-paper";


function BirthOfDateModalContent({
  onClickNextButton,
  dateOfBirth,
}: {
  onClickNextButton: (dateOfBirth: DateOnly|null) => void;
  dateOfBirth: DateOnly|null;
}) {
  const theme = useTheme() as any; 
  const [dateOfBirthInput, setDateOfBirthInput] = useState<DateOnly|null>(
    dateOfBirth
  );

  console.log(dateOfBirthInput,"dateOfBirthInput");
  dateOfBirthInput === dateOfBirth

  return (
    <BottomSheetView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>생년월일을 변경해주세요</Text>
      </View>
      <View style={{height: 32}}></View>
      <DatePicker
        dateOfBirth={dateOfBirthInput ?? DateOnly.create(new Date().toISOString())}
        setDateOfBirth={setDateOfBirthInput}
      />
      <View style={{height: 32}}></View>
      <View style={styles.buttonSection}>
        <Button
        disabled={dateOfBirthInput==null}
        mode="contained" 
        style={[
            theme.sizes.button.medium,
            {backgroundColor: dateOfBirthInput==null ? theme.colors.onPrimaryContainerDisabled : theme.colors.primary},
        ]}
        onPress={()=>{
            onClickNextButton(null);
        }}>
            <Text>선택 안함</Text>
        </Button>
        <Button 
        disabled={dateOfBirthInput === dateOfBirth}
        mode="contained" 
        style={[
            theme.sizes.button.medium,
            {backgroundColor: dateOfBirthInput === dateOfBirth ? theme.colors.onPrimaryContainerDisabled : theme.colors.primary},
        ]}
        onPress={()=>{
            onClickNextButton(dateOfBirthInput);
        }}>
            <Text>변경하기</Text>
        </Button >
      </View>
    </BottomSheetView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    // gap: 16,
  },
  titleContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },

  buttonSection: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  }
});

export default BirthOfDateModalContent;
