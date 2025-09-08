import CheftoryTextInput from "@/src/modules/user/presentation/components/CheftoryTextInput";
import { useCallback, useState } from "react";
import { Gender } from "@/src/modules/user/enums/Gender";
import { DateOnly } from "@/src/modules/shared/utils/dateOnly";
import { View } from "react-native";
import { DateOfBirthSelectInput } from "@/src/modules/user/presentation/components/DateOfBirthSelectInput";
import { Text, useTheme } from "react-native-paper";
import { GenderOptionsSelectInput } from "@/src/modules/user/presentation/components/GenderOptionsSelectInput";
import SignupButton, { AgreeValue } from "@/src/modules/user/presentation/components/SignupButton";
import { useSignupViewModel } from "@/src/modules/user/business/service/useAuthService";
import { userSchema } from "@/src/modules/user/business/validation/userSchema";

enum ButtonState {
  NICKNAME,
  BIRTH_OF_DATE,
  GENDER,
  TERMS_AND_CONDITIONS,
}

function SignupPage({
    token,
    provider,
  }: {
    token: string;
    provider: string;
  }) {
  const [nickname, setNickname] = useState<string>("");
  const [isNicknameValid, setIsNicknameValid] = useState<boolean|null>(null);

  const [dateOfBirth, setDateOfBirth] = useState<DateOnly | null>(null);
  const [isDateOfBirthValid, setIsDateOfBirthValid] = useState<boolean|null>(null);
  
  const [gender, setGender] = useState<Gender | null>(null);
  const [isGenderValid, setIsGenderValid] = useState<boolean|null>(null);

  const [inputNames, setInputNames] = useState(
    new Set<ButtonState>([ButtonState.NICKNAME])
  );

  const { signup, isLoading } = useSignupViewModel();

  const [focusedInput, setFocusedInput] = useState<ButtonState | null>(null);

  const handlePressNickNameButton = () => {
    const result = userSchema.pick({ nickname: true }).safeParse({ nickname });
    if (!result.success) {
      setIsNicknameValid(false);
      return;
    }
    else {
      setIsNicknameValid(true);
    }

    if (!inputNames.has(ButtonState.BIRTH_OF_DATE)) {
      setInputNames(new Set([...inputNames, ButtonState.BIRTH_OF_DATE]));
      setFocusedInput(ButtonState.BIRTH_OF_DATE);
      return;
    }
    setFocusedInput(null);
  };

  const handlePressDateOfBirthButton = (dateOfBirth: DateOnly|null) => {
    const result = userSchema.pick({ dateOfBirth: true }).safeParse({ dateOfBirth });
    if (!result.success) {
        setIsDateOfBirthValid(false);
        return;
      }
    else {
      setIsDateOfBirthValid(true);
    }
    setDateOfBirth(dateOfBirth);
    if (!inputNames.has(ButtonState.GENDER)) {
      setInputNames(new Set([...inputNames, ButtonState.GENDER]));
      setFocusedInput(ButtonState.GENDER);
      return;
    }
    setFocusedInput(null);
  };

  const handlePressGenderButton = (gender: Gender|null) => {
    setGender(gender);
    const result = userSchema.pick({ gender: true }).safeParse({ gender });
    if (!result.success) {
      setIsGenderValid(false);
      return;
    }
    else {
      setIsGenderValid(true);
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
      gender: gender,
      date_of_birth: dateOfBirth,
      is_marketing_agreed: agreeValue.isMarketingAgree,
      is_privacy_agreed: agreeValue.isPrivacyAgree,
      is_terms_of_use_agreed: agreeValue.isServiceAgree,
    });
    setFocusedInput(null);
  };

  let label;
  if (inputNames.has(ButtonState.NICKNAME)) {
    label = "닉네임을 입력해주세요.";
  }
  if (inputNames.has(ButtonState.BIRTH_OF_DATE)) {
    label = "생년월일을 선택해주세요.";
  }
  if (inputNames.has(ButtonState.GENDER)) {
    label = "성별을 선택해주세요.";
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
        <CheftoryTextInput
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
        ></CheftoryTextInput>
      )}
      <View style={{ height: 16 }} />
      {inputNames.has(ButtonState.BIRTH_OF_DATE) && (
        <DateOfBirthSelectInput
          dateOfBirth={dateOfBirth}
          handlePress={handlePressDateOfBirthButton}
          isFocused={focusedInput === ButtonState.BIRTH_OF_DATE}
          toFocus={() => {
            setFocusedInput(ButtonState.BIRTH_OF_DATE);
          }}
          toBlur={() => {
            setFocusedInput(null);
          }}
          isValid={isDateOfBirthValid}
        />
      )}
      <View style={{ height: 16 }} />
      {inputNames.has(ButtonState.GENDER) && (
        <GenderOptionsSelectInput
          gender={gender}
          handlePress={handlePressGenderButton}
          isFocused={focusedInput === ButtonState.GENDER}
          toFocus={() => {
            setFocusedInput(ButtonState.GENDER);
          }}
          toBlur={() => {
            setFocusedInput(null);
          }}
          isValid={isGenderValid}
        />
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
            isFocused={focusedInput === ButtonState.TERMS_AND_CONDITIONS}
            isValid={isNicknameValid && isDateOfBirthValid && isGenderValid ? true:false}
          />
        )
      }
    </View>
  );
}

export default SignupPage;
