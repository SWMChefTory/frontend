import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { NextButton } from "../../NextButton";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";

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

export default function TermsAndConditionsModalContent({
  handleSignupPress,
  toBlur,
  toFocus,
}: {
  handleSignupPress: (agreeValue: AgreeValue) => void;
  toBlur: () => void;
  toFocus: () => void;
}) {
  const router = useRouter();  
  const [agreeValue, setAgreeValue] = useState<AgreeValue>({
    isServiceAgree: false,
    isPrivacyAgree: false,
    isMarketingAgree: false,
  });

  const isServiceAgree = agreeValue.isServiceAgree;
  const isPrivacyAgree = agreeValue.isPrivacyAgree;
  const isMarketingAgree = agreeValue.isMarketingAgree;

  return (
    <BottomSheetView style={styles.container}>
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
      <View style={styles.lineContainer}>
        <View
          style={{ height: 1, backgroundColor: "#E0E0E0", width: "100%" }}
        />
      </View>
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
            toBlur();
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
            toBlur();
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

      <View style={styles.buttonSection}>
        <View style={styles.buttonContainer}>
          <NextButton
            handleSignupPress={()=>handleSignupPress(agreeValue)}
            buttonText="다음"
            isLoading={false}
            isEnabled={isServiceAgree && isPrivacyAgree}
          />
        </View>
      </View>
    </BottomSheetView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // padding: 40,
    // paddingBottom: 80,
    flexDirection: "column",
    // justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    // padding: 40,
    // paddingBottom: 100,
  },
  AllAgreeBottonContainer: {
    // alignItems: "center",
    marginVertical: 12,
    width: "88%",

    // paddingVertical:10,
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
  lineContainer: {
    width: "88%",
    marginTop: 12,
    marginBottom: 16,
    // paddingHorizontal: 24,
  },
  detailContainer: {
    width: "88%",
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 4,
  },
  detailText: {
    color: localColor.text.gray,
    fontSize: 16,
  },
  buttonSection: {
    // flex: 1,
    marginTop: 36,
    marginHorizontal: 20,
    height: 48,
    alignSelf: "stretch",
    alignItems: "center",
    // width: "100%",
    flexDirection: "row",
    // justifyContent: "center",
  },

  buttonContainer: {
    flex: 1,

    // width: "100%",
    alignSelf: "stretch",
    paddingHorizontal: 10,
  },

  button: {
    // width: 120,
    // height: 40,
    alignSelf: "stretch",
  },
});
