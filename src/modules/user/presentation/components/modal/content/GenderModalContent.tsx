import { BottomSheetView } from "@gorhom/bottom-sheet";
import { Text, View, StyleSheet } from "react-native";
import { Gender } from "../../../../enums/Gender";
import { RadioButton } from 'react-native-paper';

export default function GenderModalContent({
  gender: currentGender,
  onClickNextButton,
}: {
  gender: Gender|null;
  onClickNextButton: (gender: Gender|null) => void;
}) {
  return (
    <BottomSheetView style={styles.container}>
      <View style={styles.innerContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>성별을 선택해주세요</Text>
      </View>
      <RadioButton.Group onValueChange={value => onClickNextButton(value === '' ? null : (value as Gender))} value={currentGender as string}>
      <RadioButton.Item label="여성" value={Gender.FEMALE} />
      <RadioButton.Item label="남성" value={Gender.MALE} />
      <RadioButton.Item label="선택 없음" value={""} />
    </RadioButton.Group>
      </View>
    </BottomSheetView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: "100%",
    alignSelf: "center",
    marginTop: 16,
    // justifyContent: "center",
    // alignItems: "center",
    // alignSelf: "center",
  },
  innerContainer: {
    width: "90%",
    alignSelf: "center",
  },
  titleContainer: {
    marginLeft: 16,
    marginBottom: 32,
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

