import {
    View,
    Text,
    StyleSheet,
    InputAccessoryView,
    TouchableOpacity,
    Keyboard
  } from "react-native";
  import { NicknameInput } from "@/src/modules/user/presentation/components/NicknameInput";
  import { COLORS } from "@/src/modules/shared/constants/colors";
  import { validateNickname } from "@/src/modules/user/business/validation/userInputValidation";
  
  
  const ACCESSORY_ID = "INPUT_NAME_INPUT";
  export default function InputName({
    nickname,
    setNickname,
    onNextPress,
  }: {
    nickname: string;
    setNickname: (nickname: string) => void;
    onNextPress: () => void;
  }) {    
    const inputAccessoryViewID = ACCESSORY_ID; // 더 고유한 ID
  
    return (
      <View style={styles.outerContainer}>
        <View style={styles.container}>
          <NicknameInput
            nickname={nickname}
            setNickname={setNickname}
            inputAccessoryViewID={inputAccessoryViewID}
          />
        </View>
  
        <InputAccessoryView nativeID={inputAccessoryViewID}>
          <View style={styles.accessoryContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                (!validateNickname(nickname).isValid) && styles.buttonDisabled,
              ]}
              onPress={()=>{
                onNextPress();
                Keyboard.dismiss();
              }}
              disabled={!validateNickname(nickname).isValid}
            >
              <Text style={styles.buttonText}>다음</Text>
            </TouchableOpacity>
          </View>
        </InputAccessoryView>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    outerContainer: {
    //   flex: 1,
    },
    container: {
    //   flex: 1,
      paddingHorizontal: 50,
    //   paddingTop: 30,
    },
    title: {
      fontSize: 12,
      color: "gray",
    },
    accessoryContainer: {
      backgroundColor: "#f0f0f0",
      borderTopWidth: 1,
      borderTopColor: "#ccc",
    },
    button: {
      backgroundColor: COLORS.orange.main, // 주황색
      paddingVertical: 16,
      paddingHorizontal: 24,
      // borderRadius: 8,
      alignItems: "center",
    },
    buttonDisabled: {
      backgroundColor: COLORS.orange.inactive, // 비활성화 시 연한 주황색
    },
    buttonText: {
      color: "white", // 하얀색 텍스트
      fontSize: 16,
      fontWeight: "600",
    },
  });
  