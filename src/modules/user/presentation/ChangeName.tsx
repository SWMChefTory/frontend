import { View, Text, StyleSheet, InputAccessoryView, TouchableOpacity } from "react-native";
import { NicknameInput } from "./components/NicknameInput";
import { useState } from "react";
import { useUserViewModel, useChangeNameViewModel } from "../business/service/useUserSerivce";
import { COLORS } from "@/src/modules/shared/constants/colors"; 
import { validateNickname } from "../business/validation/userInputValidation";

export default function ChangeName() {
  const user = useUserViewModel();
  const {changeNickname, isLoading} = useChangeNameViewModel();
  const [nickname, setNickname] = useState(user?.nickname||"");
  const inputAccessoryViewID = "uniqueNameID"; // 더 고유한 ID
  const [isNameChanged, setIsNameChanged] = useState(false);


  function handleChangedNameSubit(nickname:string) {
    if(validateNickname(nickname).isValid) {
      setIsNameChanged(true);
    } else {
      setIsNameChanged(false);
    }
    setNickname(nickname);
  }

  return (  
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>이름</Text>       
        <NicknameInput         
          nickname={nickname}         
          setNickname={handleChangedNameSubit}          
          inputAccessoryViewID={inputAccessoryViewID}       
        />     
      </View>
      
      <InputAccessoryView nativeID={inputAccessoryViewID}>
        <View style={styles.accessoryContainer}>
          <TouchableOpacity 
            style={[styles.button, (!isNameChanged || isLoading) && styles.buttonDisabled]}
            onPress={() => changeNickname(nickname)} 
            disabled={isLoading||!isNameChanged}
          >
            <Text style={styles.buttonText}>변경</Text>
          </TouchableOpacity>
        </View>
      </InputAccessoryView>
    </View>
  ); 
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 75,
    paddingTop: 16,
  },
  title: {
    fontSize: 12,
    color: "gray",
  },
  accessoryContainer: {
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  button: {
    backgroundColor: COLORS.orange.main, // 주황색
    paddingVertical: 16,
    paddingHorizontal: 24,
    // borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: COLORS.orange.inactive, // 비활성화 시 연한 주황색
  },
  buttonText: {
    color: 'white', // 하얀색 텍스트
    fontSize: 16,
    fontWeight: '600',
  },
});