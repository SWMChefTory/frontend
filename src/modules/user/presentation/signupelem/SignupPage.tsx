import TextInputTemplate from "@/src/shared/components/textInputs/TextInputTemplate";
import { useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import SignupButton, { AgreeValue } from "@/src/pages/signup/submit/SignupButton";
import { useSignupViewModel } from "@/src/modules/user/business/service/useAuthService";
import { userSchema } from "@/src/modules/user/business/validation/userSchema";
import { track } from "@/src/modules/shared/utils/analytics";
import useNickname from "@/src/pages/signup/hooks/useRandomName";
import { useIsFocused } from '@react-navigation/native';

enum ButtonState {
  NICKNAME,
  // BIRTH_OF_DATE,
  // GENDER,
  TERMS_AND_CONDITIONS,
}

function SignupPage({
    token,
    provider,
  }: {
    token: string;
    provider: string;
  }) {
  const { nickname, setNickname } = useNickname();
  const [isNicknameValid, setIsNicknameValid] = useState<boolean>(true);
  const isScreenFocused = useIsFocused();

  const [inputNames, setInputNames] = useState(
    new Set<ButtonState>([ButtonState.NICKNAME])
  );

  const { signup, isLoading } = useSignupViewModel();

  const [focusedInput, setFocusedInput] = useState<ButtonState | null>(ButtonState.NICKNAME);

  console.log("isScreenFocused", isScreenFocused);

  const handlePressNickNameButton = () => {
    const result = userSchema.pick({ nickname: true }).safeParse({ nickname });
    if (!result.success) {
      setIsNicknameValid(false);
      return;
    }
    else {
      setIsNicknameValid(true);
    }

    if (!inputNames.has(ButtonState.TERMS_AND_CONDITIONS)) {
      setInputNames(new Set([...inputNames, ButtonState.TERMS_AND_CONDITIONS]));
      setFocusedInput(ButtonState.TERMS_AND_CONDITIONS);
      return;
    }
    setFocusedInput(null);
  };

  const handlePressSignUpButton = (agreeValue: AgreeValue) => {
    signup({
      provider: provider as string,
      id_token: token as string,
      nickname: nickname,
      gender: null,
      date_of_birth: null,
      is_marketing_agreed: agreeValue.isMarketingAgree,
      is_privacy_agreed: agreeValue.isPrivacyAgree,
      is_terms_of_use_agreed: agreeValue.isServiceAgree,
    });
    track.event("signup");
    setFocusedInput(null);
  };

  let label;
  if (inputNames.has(ButtonState.NICKNAME)) {
    label = "닉네임을 입력해주세요.";
  }
  if (inputNames.has(ButtonState.TERMS_AND_CONDITIONS)) {
    label = "약관 동의";
  }

  return (
    <View
      style={{ width: "80%", height: "100%", alignSelf: "center" }}
    >
      <Text variant="titleLarge">{label}</Text>
      <View style={{ height: 32 }} />
      {inputNames.has(ButtonState.NICKNAME) && (
        <TextInputTemplate
          label="닉네임"
          value={nickname}
          onChangeValue={(text) => {
            setNickname(text);
            if(userSchema.pick({ nickname: true }).safeParse({ nickname: text }).success) {
              setIsNicknameValid(true);
            }
            else {
              setIsNicknameValid(false);
            }
          }}
          onPressButton={handlePressNickNameButton}
          onFocus={() => {
            setFocusedInput(ButtonState.NICKNAME);
          }}
          isValid={isNicknameValid}
          isFocused={focusedInput === ButtonState.NICKNAME}
        ></TextInputTemplate>
      )}
      
      <View style={{ height: 32 }} />
      {
        inputNames.has(ButtonState.TERMS_AND_CONDITIONS) && (
          <SignupButton
            onPress={() => {setFocusedInput(ButtonState.TERMS_AND_CONDITIONS)}}
            onPressConfirm={handlePressSignUpButton}
            onPressCancel={() => {
              setFocusedInput(null);
            }}
            toBlur={() => {
              setFocusedInput(null);
            }}
            toFocus={() => {
              setFocusedInput(ButtonState.TERMS_AND_CONDITIONS);
            }}
            isFocused={focusedInput === ButtonState.TERMS_AND_CONDITIONS && isScreenFocused}
            isValid={isNicknameValid ? true:false}
          />
        )
      }
    </View>
  );
}

export default SignupPage;
