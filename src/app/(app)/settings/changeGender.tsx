import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
import ChangeGenderPage from "@/src/modules/user/presentation/settings/user/items/ChangeGenderPage";
import OnlyBackTemplate from "@/src/header/template/OnlyBackTemplate";

export default function ChangeGender() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header : () => <OnlyBackTemplate  title="" />,  
        }}
      />
      <ChangeGenderPage />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.white,
  },
});
