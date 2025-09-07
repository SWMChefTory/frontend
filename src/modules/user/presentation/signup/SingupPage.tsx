import { useState, useEffect, useCallback, useRef } from "react";
import { View, Alert, StyleSheet, Text } from "react-native";
import { Gender } from "@/src/modules/user/enums/Gender";
import { useSignupViewModel } from "@/src/modules/user/business/service/useAuthService";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { FullScreenLoader } from "@/src/modules/shared/splash/loading/lottieview/FullScreenLoader";
import { DateOnly } from "@/src/modules/shared/utils/dateOnly";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import TermsAndConditions from "@/src/modules/user/presentation/signup/TermsAndCondition";
import { Button, makeStyles } from '@rneui/themed';

import InputName from "@/src/modules/user/presentation/signup/InputName";
import DateModal from "../components/modal/DateModal";
import BirthOfDateResult from "./BirthOfDateResult";
import GenderResult from "./GenderResult";
import GenderModal from "../components/modal/GenderModal";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import TermsAndConditionsModal from "../components/modal/TermsAndConditionsModal";

import {TextInput} from 'react-native-paper'
  

enum ButtonState {
  NICKNAME,
  BIRTH_OF_DATE,
  GENDER,
  TERMS_AND_CONDITIONS,
}

export default function SignupPage({
  token,
  provider,
}: {
  token: string;
  provider: string;
}) {
  const [nickname, setNickname] = useState<string>("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<DateOnly | null>(
    null
  );
  const [buttonState, setButtonState] = useState(ButtonState.NICKNAME);

//   const styles = useStyles(props);

  const [isPrivacyPolicyAgreed, setIsPrivacyPolicyAgreed] = useState(false);
  const [isTermsOfUseAgreed, setIsTermsOfUseAgreed] = useState(false);
  const [isMarketingAgreed, setIsMarketingAgreed] = useState(false);    

  const isFocused = useIsFocused();

  const { signup, isLoading, error } = useSignupViewModel();

  useEffect(() => {
    if (error) {
      Alert.alert("회원 가입 중 오류가 발생했습니다.");
      console.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (buttonState === ButtonState.TERMS_AND_CONDITIONS && isFocused) {
      console.log("present");
      TermsAndConditionModalRef.current?.present();
    }
    else{
        console.log("dismiss");
        TermsAndConditionModalRef.current?.dismiss();
    }
  }, [buttonState, isFocused]);


  const BirthOfDateModalRef = useRef<BottomSheetModal>(null);
  const GenderModalRef = useRef<BottomSheetModal>(null);
  const TermsAndConditionModalRef = useRef<BottomSheetModal>(null);


  function handleSignupPress() {
    signup({
      id_token: token as string,
      provider: provider as string,
      nickname: nickname,
      gender: gender,
      date_of_birth: dateOfBirth,
      is_marketing_agreed: isMarketingAgreed,
      is_privacy_agreed: isPrivacyPolicyAgreed,
      is_terms_of_use_agreed: isTermsOfUseAgreed,
    });
  }

  let guideText = "";
  if (buttonState === ButtonState.NICKNAME) {
    guideText = "닉네임을 입력해주세요";
  } else if (buttonState === ButtonState.BIRTH_OF_DATE) {
    guideText = "생년월일을 선택해주세요";
  } else if (buttonState === ButtonState.GENDER) {
    guideText = "성별을 선택해주세요";
  } else if (buttonState === ButtonState.TERMS_AND_CONDITIONS) {
    guideText = "약관에 동의해주세요";
  }

  return (
    // <BottomSheetModalProvider>
    <View style={styles.container}>
      {isLoading && <FullScreenLoader />}
      {/* <TextInput
          label="닉네임"
          value={nickname}
          onChangeText={setNickname}
          mode="outlined"
        /> */}
        

      <View style={styles.titleContainer}>
        <Text style={styles.title}>{guideText}</Text>
      </View>
      <View style={styles.formArea}>
        <View style={styles.inputSection}>
          <Text style={styles.label}>닉네임</Text>
          <InputName
            nickname={nickname}
            setNickname={setNickname}
            onNextPress={() => {
              setButtonState(ButtonState.BIRTH_OF_DATE);
              BirthOfDateModalRef.current?.present();
            }}
          />
        </View>



        {buttonState !== ButtonState.NICKNAME && (
          <View style={styles.inputSection}>
            <Text style={styles.label}>생년월일</Text>
            <BirthOfDateResult dateOfBirth={dateOfBirth} />
          </View>
        )}

        {buttonState !== ButtonState.NICKNAME &&
          buttonState !== ButtonState.BIRTH_OF_DATE && (
            <View style={styles.inputSection}>
              <Text style={styles.label}>성별</Text>
              <GenderResult gender={gender} />
            </View>
          )}
      </View>

      <DateModal
        bottomSheetModalRef={BirthOfDateModalRef}
        setSelectedDateOfBirth={setDateOfBirth}
        onClickNextButton={() => {
          setButtonState(ButtonState.GENDER);
          GenderModalRef.current?.present();
          BirthOfDateModalRef.current?.dismiss();
        }}
      />

      <GenderModal
        bottomSheetModalRef={GenderModalRef}
        setSelectedGender={setGender}
        onClickNextButton={() => {
          setButtonState(ButtonState.TERMS_AND_CONDITIONS);
          GenderModalRef.current?.dismiss();
          TermsAndConditionModalRef.current?.present();
        }}
      />

      <TermsAndConditionsModal
        bottomSheetModalRef={TermsAndConditionModalRef}
        handleAgreementPage={() => {
          TermsAndConditionModalRef.current?.dismiss();
        }}
        handleSignupPress={handleSignupPress}
        isServiceAgree={isTermsOfUseAgreed}
        setIsServiceAgree={setIsTermsOfUseAgreed}
        isPrivacyAgree={isPrivacyPolicyAgreed}
        setIsPrivacyAgree={setIsPrivacyPolicyAgreed}
        isMarketingAgree={isMarketingAgreed}
        setIsMarketingAgree={setIsMarketingAgreed}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 40,
    paddingHorizontal: 24,
    // paddingBottom: 200,
    backgroundColor: COLORS.background.white,
  },
  titleContainer: {
    flex: 0.3,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text.black,
    textAlign: "center",
    // marginBottom: 40,
    backgroundColor: "white",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.gray,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },

  inputSection: {
    marginBottom: 30,
    width: "100%",
  },

  birthInputSection: {
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text.black,
    marginBottom: 12,
  },
  formArea: {
    flex: 4,
    // flex: 10,
    paddingHorizontal: 50,
    overflow: "hidden",
    // paddingBottom: 30,
  },
  buttonArea: {
    flex: 1.5,
    // padding: 60,
    // borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
});
