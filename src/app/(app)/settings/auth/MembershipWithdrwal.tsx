import { View, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import OnlyBackTemplate from "@/src/header/template/OnlyBackTemplate";
import { COLORS } from "@/src/modules/shared/constants/colors";
import MemberShipWithdrawalPage from "@/src/pages/membership-withdrawal/MemberShipWithdrawalPage";

export default function MembershipWithdrwal() {
    const { userNickname } = useLocalSearchParams();
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header : () => <OnlyBackTemplate  title="" />,  
        }}
      />
      <MemberShipWithdrawalPage userNickname={userNickname as string} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background.white,
  },
});