import { BottomSheetView } from "@gorhom/bottom-sheet";
import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DateOfBirthPick } from "../components/DateOfBirthPick";
import { useState } from "react";
import { DateOnly } from "@/src/modules/shared/utils/dateOnly";
import { NextButton } from "../components/NextButton";

function BirthOfDateModalContent({
  onClickNextButton,
  setSelectedDateOfBirth,
}: {
  onClickNextButton: () => void;
  setSelectedDateOfBirth: (dateOfBirth: DateOnly|null) => void;
}) {
  const [dateOfBirthInput, setDateOfBirthInput] = useState<DateOnly>(
    DateOnly.create(new Date().toISOString())
  );

  return (
    <BottomSheetView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>생년월일을 알려주세요</Text>
      </View>
      <DateOfBirthPick
        dateOfBirth={dateOfBirthInput}
        setDateOfBirth={setDateOfBirthInput}
      />
      <View style={styles.buttonSection}>
        <View style={styles.buttonContainer}>
          <NextButton
            handleSignupPress={()=>{
                onClickNextButton();
                setSelectedDateOfBirth(null);
            }}
            buttonText="건너뛰기"
            isLoading={false}
            isEnabled={true}
          />
        </View>
        <View style={styles.buttonContainer}>
          <NextButton
            handleSignupPress={()=>{
                onClickNextButton();
                setSelectedDateOfBirth(dateOfBirthInput);
            }}
            buttonText="다음"
            isLoading={false}
            isEnabled={true}
          />
        </View>
      </View>
    </BottomSheetView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // padding: 40,
    // paddingBottom: 80,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    // padding: 40,
    // paddingBottom: 100,
  },
  titleContainer: {
    alignItems: "center",
    marginTop:48,
    marginBottom: 24,
    // paddingVertical:10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },

  buttonSection: {
    // flex: 1,
    marginTop: 36,
    marginHorizontal: 20,
    height: 48,
    alignSelf: "stretch",
    alignItems: "center",
    // width: "100%",
    flexDirection: "row",
    // justifyContent: "center",
  },

  buttonContainer: {
    flex: 1,

    // width: "100%",
    alignSelf: "stretch",
    paddingHorizontal: 10,
  },

  button: {
    // width: 120,
    // height: 40,
    alignSelf: "stretch",
  },
});

export default BirthOfDateModalContent;
