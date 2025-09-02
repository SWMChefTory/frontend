import { useState, useEffect, useCallback, useRef } from "react";
import { View, Alert, StyleSheet, Text } from "react-native";
import { Gender } from "@/src/modules/user/enums/Gender";
import { useSignupViewModel } from "@/src/modules/user/business/service/useAuthService";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { FullScreenLoader } from "@/src/modules/shared/splash/loading/lottieview/FullScreenLoader";
import { DateOnly } from "@/src/modules/shared/utils/DateOnly";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import TermsAndConditions from "@/src/modules/user/presentation/signup/TermsAndCondition";

import InputName from "@/src/modules/user/presentation/signup/InputName";
import BirthOfDateModal from "./BirthOfDateModal";
import BirthOfDateResult from "./BirthOfDateResult";
import GenderResult from "./GenderResult";
import GenderModal from "./GenderModal";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

import { useInteractionBlocker } from "@/src/modules/shared/blocker/store/interactionBlocker";

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
  const [dateOfBirth, setDateOfBirth] = useState<DateOnly | undefined>(
    undefined
  );
  const [buttonState, setButtonState] = useState(ButtonState.NICKNAME);

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

  const openTermsAndConditionsModal = useCallback(() => {
    TermsAndConditionModalRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="none"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
          />    
    ),
    []
  );

  function handleSignupPress() {
    signup({
      id_token: token as string,
      provider: provider as string,
      nickname: nickname,
      gender: gender as Gender,
      date_of_birth: dateOfBirth,
      is_marketing_agreed: isMarketingAgreed,
      is_privacy_agreed: isPrivacyPolicyAgreed,
      is_terms_of_use_agreed: isTermsOfUseAgreed,
    });
  }

  let guideText = "";
  if (buttonState === ButtonState.NICKNAME) {
    guideText = "이름을 입력해주세요";
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
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{guideText}</Text>
      </View>
      <View style={styles.formArea}>
        <View style={styles.inputSection}>
          <Text style={styles.label}>이름</Text>
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

      <BirthOfDateModal
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

      <BottomSheetModal
        ref={TermsAndConditionModalRef}
        backdropComponent={renderBackdrop}
        snapPoints={["45%"]}
        enableHandlePanningGesture={false}
        enableContentPanningGesture={false}
        enableDynamicSizing={false}
      >
        <TermsAndConditions
          handleAgreementPage={() => {
            TermsAndConditionModalRef.current?.dismiss();
          }}
          isServiceAgree={isTermsOfUseAgreed}
          setIsServiceAgree={setIsTermsOfUseAgreed}
          isPrivacyAgree={isPrivacyPolicyAgreed}
          setIsPrivacyAgree={setIsPrivacyPolicyAgreed}
          isMarketingAgree={isMarketingAgreed}
          setIsMarketingAgree={setIsMarketingAgreed}
        />
      </BottomSheetModal>
    </View>
    // </BottomSheetModalProvider>
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
