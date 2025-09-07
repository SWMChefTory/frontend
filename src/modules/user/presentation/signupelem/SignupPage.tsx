import CheftoryTextInput from "@/src/modules/user/presentation/componetelem/CheftoryTextInput";
import { useState } from "react";
import { Gender } from "@/src/modules/user/enums/Gender";
import { DateOnly } from "@/src/modules/shared/utils/dateOnly";
import { View } from "react-native";
import { DateOfBirthSelectInput } from "@/src/modules/user/presentation/componetelem/DateOfBirthSelectInput";
import { Text, useTheme } from "react-native-paper";
import { GenderOptionsSelectInput } from "../componetelem/GenderOptionsSelectInput";

enum ButtonState {
  NICKNAME,
  BIRTH_OF_DATE,
  GENDER,
  TERMS_AND_CONDITIONS,
}

function SignupPage() {
  const [nickname, setNickname] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<DateOnly | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);
  const [inputNames, setInputNames] = useState(
    new Set<ButtonState>([ButtonState.NICKNAME])
  );

  const [isPrivacyPolicyAgreed, setIsPrivacyPolicyAgreed] = useState(false);
  const [isTermsOfUseAgreed, setIsTermsOfUseAgreed] = useState(false);
  const [isMarketingAgreed, setIsMarketingAgreed] = useState(false);

  const [focusedInput, setFocusedInput] = useState<ButtonState | null>(null);

  const handlePressNickNameButton = () => {
    if (!inputNames.has(ButtonState.BIRTH_OF_DATE)) {
      setInputNames(new Set([...inputNames, ButtonState.BIRTH_OF_DATE]));
      setFocusedInput(ButtonState.BIRTH_OF_DATE);
      return;
    }
    setFocusedInput(null);
  };

  const handlePressDateOfBirthButton = (dateOfBirth: DateOnly|null) => {
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
    if (!inputNames.has(ButtonState.TERMS_AND_CONDITIONS)) {
      setInputNames(new Set([...inputNames, ButtonState.TERMS_AND_CONDITIONS]));
      setFocusedInput(ButtonState.TERMS_AND_CONDITIONS);
      return;
    }
    setFocusedInput(null);
  };

  const handlePressTermsOfUseButton = () => {
    if (!inputNames.has(ButtonState.TERMS_AND_CONDITIONS)) {
      setInputNames(new Set([...inputNames, ButtonState.TERMS_AND_CONDITIONS]));
      setFocusedInput(ButtonState.TERMS_AND_CONDITIONS);
      return;
    }
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
    label = "약관 동의를 해주세요.";
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
          onChangeValue={setNickname}
          onPressButton={handlePressNickNameButton}
          onFocus={() => {
            setFocusedInput(ButtonState.NICKNAME);
          }}
          isValid={true}
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
        />
      )}
    </View>
  );
}

export default SignupPage;
