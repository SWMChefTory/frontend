import { DateOnly } from "@/src/modules/shared/utils/DateOnly";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { InputTemplate } from "../components/InputTemplate";

function BirthOfDateResult({
  dateOfBirth,
}: {
  dateOfBirth: DateOnly | undefined;
}) {
  if (!dateOfBirth) {
    return (
      <InputTemplate
        text="선택없음"
        setText={() => {}}
        inputAccessoryViewID={""}
      />
    );
  }

  return (
    <InputTemplate
      text={dateOfBirth.toString()}
      setText={() => {}}
      inputAccessoryViewID={""}
    />
  );
}

export default BirthOfDateResult;

const styles = StyleSheet.create({
  container: {
    height: 50,
    justifyContent: "center",
  },
});
