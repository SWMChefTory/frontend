import { BottomSheetView } from "@gorhom/bottom-sheet";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import SquareButton from "../../SquareButton";

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
}: {
  handleSignupPress: (agreeValue: AgreeValue) => void;
  toBlur: () => void;
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
      <View style ={{ height:16 }}/>
      {/* <View style = {{backgroundColor: "grey", height: 1, width: "88%"}}></View> */}
      {/* <View style ={{ height:15 }}/> */}
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
      <View style ={{ height:8 }}/>

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

      <View style ={{ height:8 }}/>

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
      <View style ={{ height:32 }}/>

      <View style={styles.buttonSection}>
        <View style={styles.buttonContainer}>
          <SquareButton
            onPress={() => handleSignupPress(agreeValue)}
            label="회원가입"
          />
        </View>
      </View>
    </BottomSheetView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: "column",
    alignItems: "center",
    marginTop: 16,
    // justifyContent: "center",
    // alignSelf: "stretch",
  },
  AllAgreeBottonContainer: {
    // marginVertical: 12,
    // alignItems: "center",
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
    // paddingRight: 4,
    height: 48,
    // width: 48,
  },
  detailText: {
    color: localColor.text.gray,
    fontSize: 16,
  },
  buttonSection: {
    // marginTop: 16,
    // marginHorizontal: 20,
    // height: 48,
    // alignSelf: "stretch",
    alignItems: "center",
    width: "90%",
    flexDirection: "row",
    // justifyContent: "center",
  },

  buttonContainer: {
    flex: 1,

    // width: "80%",
    alignSelf: "stretch",
    // paddingHorizontal: 10,
  },

  button: {
    // width: 120,
    // height: 40,
    alignSelf: "stretch",
  },
});
