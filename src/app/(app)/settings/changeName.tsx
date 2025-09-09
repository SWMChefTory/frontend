import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
import ChangeNamePage from "@/src/modules/user/presentation/settings/user/items/ChangeNamePage";
import OnlyBackTemplate from "@/src/header/template/OnlyBackTemplate";

export default function ChangeNameScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header : () => <OnlyBackTemplate title="" />,  
        }}
      />
      <ChangeNamePage />
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.white,
  },
});
