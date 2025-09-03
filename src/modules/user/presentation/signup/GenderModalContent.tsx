import { BottomSheetView } from "@gorhom/bottom-sheet";
import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DateOfBirthPick } from "../components/DateOfBirthPick";
import { useState } from "react";
import { DateOnly } from "@/src/modules/shared/utils/DateOnly";
import { NextButton } from "../components/NextButton";
import { GenderOptions } from "@/src/modules/user/presentation/components/GenderOption";
import { Gender } from "../../enums/Gender";

function BirthOfDateModalContent({
  onClickNextButton,
  setSelectedGender,
}: {
  onClickNextButton: () => void;
  setSelectedGender: (gender: Gender|null) => void;
}) {
  const [gender, setGender] = useState<Gender>(Gender.FEMALE);
//   console.log("gender", gender);
  return (
    <BottomSheetView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>성별을 선택해주세요</Text>
      </View>
      <GenderOptions
        selectedGender={gender}
        setGender={setGender}
      />
      <View style={styles.buttonSection}>
        <View style={styles.buttonContainer}>
          <NextButton
            handleSignupPress={()=>{
                onClickNextButton();
                setSelectedGender(null);
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
                setSelectedGender(gender);
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
