import { View, TextInput, StyleSheet } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
    
export const InputTemplate = ({
  text,
  setText,
  inputAccessoryViewID = "",
}: {
  text: string;
  setText: (text: string) => void;
  inputAccessoryViewID?: string;
}) => {
  return (
    <View style={styles.nicknameContainer}>
      <TextInput
        style={styles.textInput}
        placeholder=""
        value={text}
        onChangeText={setText}
        placeholderTextColor={COLORS.text.gray}
        inputAccessoryViewID={inputAccessoryViewID}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  nicknameContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.border.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: 280,
    fontSize: 14,
    height: 50,
    backgroundColor: COLORS.background.white,
    color: COLORS.text.black,
    shadowColor: COLORS.shadow.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});
