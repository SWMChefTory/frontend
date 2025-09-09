import { View } from "react-native";

enum SpacingType {
  small = 8,
  medium = 16,
  large = 24,
}

function InputSpacing({ type }: { type: SpacingType }) {
  return <View style={{ height: type }} />;
}

export { InputSpacing };