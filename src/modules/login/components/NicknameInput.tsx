import { View, TextInput, StyleSheet } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";

export const NicknameInput = ({nickname, setNickname}: {nickname: string, setNickname: (nickname: string) => void}) => {
  return (
  <View style={styles.nicknameContainer}>
    <TextInput 
      style={styles.textInput} 
      placeholder="닉네임을 입력해주세요" 
      value={nickname} 
      onChangeText={setNickname}
      placeholderTextColor={COLORS.text.gray}
    />
  </View>
  );
};

const styles = StyleSheet.create({
  nicknameContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 12,
      paddingHorizontal: 20,
      padding: 10,
    },
    textInput: {
      borderWidth: 1,
      borderColor: COLORS.border.lightGray,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      width: 280,
      fontSize: 14,
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
})