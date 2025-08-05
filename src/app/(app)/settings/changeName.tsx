import { Stack } from "expo-router";
import { View,StyleSheet } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
import ChangeName from "@/src/modules/user/presentation/ChangeName";
import OnlyBackTemplate from "@/src/header/template/OnlyBackTemplate";

export default function ChangeNamePage() {
  return (
    <View style={styles.container}> 
      <Stack.Screen
        options={{
          header: () => <OnlyBackTemplate content="이름 변경" />,
        }}
      />
      <ChangeName />
    </View>
  );
} 


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.white,
  }
});