import { BottomSheetView } from "@gorhom/bottom-sheet";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import SquareButton from "@/src/shared/components/textInputs/SquareButtonTemplate";
import { useSignupModalStore } from "@/src/pages/login/ui/button";
import { useSignupViewModel } from "@/src/modules/user/business/service/useAuthService";
import useRandomName from "@/src/pages/login/model/useRandomName";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface AgreeValue {
  isServiceAgree: boolean;
  isPrivacyAgree: boolean;
  isMarketingAgree: boolean;
}

const localColor = {
  text: {
    black: "#3B3B3B",
    gray: "#ADADAD",
    white: "#E6E6E6",
  },
};

export default function TermsAndConditionsModalContent() {
  const { idToken, provider, closeModal } = useSignupModalStore();
  const { signup } = useSignupViewModel();
  const { nickname } = useRandomName();
  const insets = useSafeAreaInsets();

  const router = useRouter();
  const [agreeValue, setAgreeValue] = useState<AgreeValue>({
    isServiceAgree: false,
    isPrivacyAgree: false,
    isMarketingAgree: false,
  });

  const isServiceAgree = agreeValue.isServiceAgree;
  const isPrivacyAgree = agreeValue.isPrivacyAgree;
  const isMarketingAgree = agreeValue.isMarketingAgree;

  const handleSignupPress = () => {
    if (
      !idToken ||
      !provider ||
      !nickname ||
      !isPrivacyAgree ||
      !isServiceAgree
    ) {
      return;
    }
    signup({
      id_token: idToken,
      provider: provider,
      nickname: nickname,
      gender: null,
      date_of_birth: null,
      is_marketing_agreed: isMarketingAgree,
      is_privacy_agreed: isPrivacyAgree,
      is_terms_of_use_agreed: isServiceAgree,
    });
    closeModal();
  };

  return (
    <BottomSheetView
      style={[styles.container, { paddingBottom: insets.bottom }]}
    >
      <View style={styles.AllAgreeBottonContainer}>
        <TouchableOpacity
          style={styles.allAgreeBotton}
          onPress={() => {
            setAgreeValue({
              ...agreeValue,
              isServiceAgree: true,
              isPrivacyAgree: true,
              isMarketingAgree: true,
            });
          }}
        >
          <Ionicons
            name="checkmark"
            size={20}
            color={
              isServiceAgree && isPrivacyAgree && isMarketingAgree
                ? "#3B3B3B"
                : "#ADADAD"
            }
          />
          <Text
            style={[
              styles.allAgreeText,
              {
                color:
                  isServiceAgree && isPrivacyAgree && isMarketingAgree
                    ? localColor.text.black
                    : localColor.text.gray,
              },
            ]}
          >
            {" "}
            전체 동의하기
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 16 }} />
      <View style={styles.detailContainer}>
        <TouchableOpacity
          style={styles.detailLeftContainer}
          onPress={() => {
            setAgreeValue({
              ...agreeValue,
              isServiceAgree: !isServiceAgree,
            });
          }}
        >
          <Ionicons
            name="checkmark"
            size={20}
            color={
              isServiceAgree ? localColor.text.black : localColor.text.gray
            }
          />
          <Text
            style={[
              styles.detailText,
              {
                color: isServiceAgree
                  ? localColor.text.black
                  : localColor.text.gray,
              },
            ]}
          >
            {" "}
            [필수] 서비스 이용약관 동의
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.detailRightContainer}
          onPress={() => {
            closeModal();
            router.push({
              pathname: "/agreement/ServiceTermsAndConditions",
            });
          }}
        >
          <Ionicons
            name="chevron-forward"
            size={20}
            color={localColor.text.gray}
          />
        </TouchableOpacity>
      </View>
      <View style={{ height: 8 }} />

      <View style={styles.detailContainer}>
        <TouchableOpacity
          style={styles.detailLeftContainer}
          onPress={() => {
            setAgreeValue({
              ...agreeValue,
              isPrivacyAgree: !isPrivacyAgree,
            });
          }}
        >
          <Ionicons
            name="checkmark"
            size={20}
            color={
              isPrivacyAgree ? localColor.text.black : localColor.text.gray
            }
          />
          <Text
            style={[
              styles.detailText,
              {
                color: isPrivacyAgree
                  ? localColor.text.black
                  : localColor.text.gray,
              },
            ]}
          >
            {" "}
            [필수] 개인정보 처리방침 동의
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.detailRightContainer}
          onPress={() => {
            closeModal();
            router.push({
              pathname: "/agreement/PrivacyTermsAndConditions",
            });
          }}
        >
          <Ionicons
            name="chevron-forward"
            size={20}
            color={localColor.text.gray}
          />
        </TouchableOpacity>
      </View>

      <View style={{ height: 8 }} />

      <View style={styles.detailContainer}>
        <TouchableOpacity
          style={styles.detailLeftContainer}
          onPress={() => {
            setAgreeValue({
              ...agreeValue,
              isMarketingAgree: !isMarketingAgree,
            });
          }}
        >
          <Ionicons
            name="checkmark"
            size={20}
            color={
              isMarketingAgree ? localColor.text.black : localColor.text.gray
            }
          />
          <Text
            style={[
              styles.detailText,
              {
                color: isMarketingAgree
                  ? localColor.text.black
                  : localColor.text.gray,
              },
            ]}
          >
            {" "}
            [선택] 마케팅 수신 동의
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 32 }} />

      <View style={styles.buttonSection}>
        <View style={styles.buttonContainer}>
          <SquareButton
            disabled={!isServiceAgree || !isPrivacyAgree}
            onPress={() => handleSignupPress()}
            label="회원가입"
          />
        </View>
      </View>
    </BottomSheetView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 16,
  },
  AllAgreeBottonContainer: {
    width: "90%",
  },
  allAgreeBotton: {
    backgroundColor: "#E6E6E6",
    padding: 16,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  allAgreeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: localColor.text.gray,
  },
  detailContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
  },
  detailRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
  },
  detailText: {
    color: localColor.text.gray,
    fontSize: 16,
  },
  buttonSection: {
    alignItems: "center",
    width: "90%",
    flexDirection: "row",
    paddingBottom: 32,
  },
  buttonContainer: {
    flex: 1,
    alignSelf: "stretch",
  },

  button: {
    alignSelf: "stretch",
  },
});
