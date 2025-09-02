import { View, StyleSheet } from "react-native";
import { RecipeCategorySection } from "@/src/modules/recipe/category/Section";
import { responsiveWidth } from "@/src/modules/shared/utils/responsiveUI";

export default function Collection() {
  return (
    <View style={styles.container}>
      <RecipeCategorySection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: responsiveWidth(10),
    backgroundColor: "rgba(252, 148, 83, 0.1)",
  },
});
