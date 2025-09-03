import { View, TextInput, StyleSheet } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { InputTemplate } from "./InputTemplate";

export const NicknameInput = ({
  nickname,
  setNickname,
  inputAccessoryViewID = "",
}: {
  nickname: string;
  setNickname: (nickname: string) => void;
  inputAccessoryViewID?: string;
}) => {
  return (
    <InputTemplate
      text={nickname}
      setText={setNickname}
      inputAccessoryViewID={inputAccessoryViewID}
    />
  );
};

