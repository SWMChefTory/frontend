import { BottomSheetView } from "@gorhom/bottom-sheet";
import { Text, View, StyleSheet } from "react-native";
import { DateOfBirthPick } from "../../DateOfBirthPick";
import { useState } from "react";
import { DateOnly } from "@/src/modules/shared/utils/dateOnly";
import { Button, useTheme } from "react-native-paper";


function BirthOfDateModalContent({
  onClickNextButton,
}: {
  onClickNextButton: (dateOfBirth: DateOnly|null) => void;
}) {
  const theme = useTheme() as any; 
  const [dateOfBirthInput, setDateOfBirthInput] = useState<DateOnly|null>(
    DateOnly.create(new Date().toISOString())
  );

  return (
    <BottomSheetView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>생년월일을 알려주세요</Text>
      </View>
      <View style={{height: 32}}></View>
      <DateOfBirthPick
        dateOfBirth={dateOfBirthInput ?? DateOnly.create(new Date().toISOString())}
        setDateOfBirth={setDateOfBirthInput}
      />
      <View style={{height: 32}}></View>
      <View style={styles.buttonSection}>
        <Button
        mode="contained" 
        style={[
            theme.sizes.button.medium,
        ]}
        onPress={()=>{
            onClickNextButton(null);
        }}>
            <Text>선택 없음</Text>
        </Button>
        <Button 
        mode="contained" 
        style={[
            theme.sizes.button.medium,
        ]}
        onPress={()=>{
            onClickNextButton(dateOfBirthInput);
        }}>
            <Text>다음</Text>
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
