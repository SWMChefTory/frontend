import { HeaderTemplate } from "./HeaderTemplate";
import { router } from "expo-router";
import { Text,StyleSheet } from "react-native";
export default function OnlyBackTemplate({content}: {content:string}) {
  return(
    <HeaderTemplate 
      title={""}
      leftComponent={<Text style={styles.text}>{content}</Text>}
      showBackButton={true} 
      onBackPress={() => router.back()}
    />
  )
}

const styles = StyleSheet.create({
  text: {
    paddingLeft: 8,
    fontSize: 20,
    fontWeight: "bold",
  },
});