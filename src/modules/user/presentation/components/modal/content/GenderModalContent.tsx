import { BottomSheetView } from "@gorhom/bottom-sheet";
import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DateOfBirthPick } from "../../DateOfBirthPick";
import { useState } from "react";
import { DateOnly } from "@/src/modules/shared/utils/dateOnly";
import { NextButton } from "../../NextButton";
import { GenderOptions } from "@/src/modules/user/presentation/components/GenderOption";
import { Gender } from "../../../../enums/Gender";

export default function GenderModalContent({
  gender,
  onClickNextButton,
}: {
  gender: Gender|null;
  onClickNextButton: (gender: Gender|null) => void;
}) {
  const [gender, setGender] = useState<Gender>(Gender.FEMALE);
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
                onClickNextButton(null);
            }}
            buttonText="건너뛰기"
            isLoading={false}
            isEnabled={true}
          />
        </View>
        <View style={styles.buttonContainer}>
          <NextButton
            handleSignupPress={()=>{
                onClickNextButton(gender);
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
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  titleContainer: {
    alignItems: "center",
    marginTop:48,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },

  buttonSection: {
    marginTop: 36,
    marginHorizontal: 20,
    height: 48,
    alignSelf: "stretch",
    alignItems: "center",
    flexDirection: "row",
  },

  buttonContainer: {
    flex: 1,
    alignSelf: "stretch",
    paddingHorizontal: 10,
  },

  button: {
    alignSelf: "stretch",
  },
});

