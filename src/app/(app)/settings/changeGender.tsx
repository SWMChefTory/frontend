import { Stack } from "expo-router";
import { View,StyleSheet } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
import ChangeGender from "@/src/modules/user/presentation/ChangeGender";
import OnlyBackTemplate from "@/src/header/template/OnlyBackTemplate";

export default function ChangeGenderPage() {
  return (
    <View style={styles.container}> 
      <Stack.Screen
        options={{
          header: () => <OnlyBackTemplate content="성별 변경" />,
        }}
      />
      <ChangeGender />
    </View>
  );
} 


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.white,
  }
});