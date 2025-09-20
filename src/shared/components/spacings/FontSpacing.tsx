import { View } from "react-native";

enum FontSpacingType {
  small = 8,
  medium = 16, //subtitle과 subtitle 여백
  large = 24, //title과 subtile 여백
}

function FontSpacing({ type }: { type: FontSpacingType }) {
  return <View style={{ height: type }} />;
}

export { FontSpacing, FontSpacingType };