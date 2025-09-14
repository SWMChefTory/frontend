import { TextInput, Button } from "react-native-paper";
import { useEffect, useId, useRef } from "react";
import {
  InputAccessoryView,
  StyleSheet,
  Platform,
} from "react-native";
import { fa } from "zod/v4/locales";


//chefory의 키보드 악세사리가 존재하는 텍스트 인풋
//material design 3의 조건에 따르고 있음.
// onFoucs는 textInput이 클릭되었을 때
// onSubmitEditing은 키보드의 확인 버튼이 눌렸을 때
// onChangeValue는 텍스트가 변경될 때
// onPressButton은 키보드의 확인 버튼이 눌렸을 때
// isValid는 텍스트가 유효한지 여부
// buttonText는 키보드의 확인 버튼의 텍스트
// isFocused는 텍스트 인풋이 포커스되었는지 여부
// isSubmittable은 키보드의 버튼이 눌러질 수 있는지 여부
export default function TextInputTemplate({
  label,
  value,
  onChangeValue,
  onPressButton,
  isValid=true,
  buttonText="확인",
  isFocused = false,
  onFocus = () => {},
  isSubmittable = true,
}: {
  label: string;
  value: string;
  onChangeValue: (text: string) => void;
  onPressButton: () => void;
  isValid?: boolean|null;
  buttonText?: string;
  isFocused?: boolean;
  onFocus?: () => void;
  isSubmittable?: boolean;
}) {
  const inputAccessoryViewID = useId();

  const textInputRef = useRef<any>(null);

  useEffect(()=>{
    if(!isFocused){
      textInputRef.current?.blur();
    }
    else {
      textInputRef.current?.focus();
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
        right={<TextInput.Icon 
          icon="close-circle" 
          onPress={() => onChangeValue('')} 
        />}
        ref={textInputRef}
        error={isValid !== null && !isValid}
      />
      {Platform.OS === 'ios' && (
        <InputAccessoryView nativeID={inputAccessoryViewID}>
          <Button 
            mode="contained"
            disabled={!isValid || !isSubmittable}
            style={{ borderRadius: 0}}
            contentStyle={{height: 48}}
            onPress={onPressButton}
            labelStyle={{
                lineHeight: undefined, // 기본 lineHeight 제거
              }}
          >
            {buttonText}
          </Button>
        </InputAccessoryView>
      )}
    </>
  );
}

