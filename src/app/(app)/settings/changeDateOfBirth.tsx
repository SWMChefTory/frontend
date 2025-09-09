import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
import ChangeDateOfBirth from "@/src/modules/user/presentation/settings/user/items/ChangeDateOfBirthPage";
import OnlyBackTemplate from "@/src/header/template/OnlyBackTemplate";

export default function ChangeDateOfBirthPage() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header : () => <OnlyBackTemplate  title="" />,  
        }}
      />
      <ChangeDateOfBirth />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.white,
  },
});
