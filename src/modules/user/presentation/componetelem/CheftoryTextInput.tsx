import { TextInput, Button } from "react-native-paper";
import { useEffect, useId, useRef } from "react";
import {
  InputAccessoryView,
  StyleSheet,
  Platform,
} from "react-native";


//chefory의 키보드 악세사리가 존재하는 텍스트 인풋
//material design 3의 조건에 따르고 있음.
//validateValue가 실패하면 텍스트 인풋에 
export default function CheftoryTextInput({
  label,
  value,
  onChangeValue,
  onPressButton,
  isValid=true,
  buttonText="확인",
  isFocused = false,
  onFocus = () => {},
}: {
  label: string;
  value: string;
  onChangeValue: (text: string) => void;
  onPressButton: () => void;
  isValid?: boolean|null;
  buttonText?: string;
  isFocused?: boolean;
  onFocus?: () => void;
}) {
  const inputAccessoryViewID = useId();

  const textInputRef = useRef<any>(null);

  useEffect(()=>{
    if(!isFocused){
      textInputRef.current?.blur();
    }
  },[isFocused])

  return (
    <>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeValue}
        mode="outlined"
        inputAccessoryViewID={inputAccessoryViewID}

  
        returnKeyType="done" // 또는 "next", "send", "search"
        onSubmitEditing={() => {
            console.log("onSubmitEditing");
            if (isValid) {
            onPressButton();
          }
        }}
        onFocus={onFocus}
        ref={textInputRef}
        error={isValid !== null && !isValid}
      />
      {Platform.OS === 'ios' && (
        <InputAccessoryView nativeID={inputAccessoryViewID}>
          <Button 
            mode="contained"
            style={{borderRadius: 0}}
            onPress={onPressButton}
          >
            {buttonText}
          </Button>
        </InputAccessoryView>
      )}
    </>
  );
}

