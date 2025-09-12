import { View } from "react-native";

enum SpacingType {
  small = 16,
  medium = 24,
  large = 32,
}

export default function SectionSpacing({ type }: { type: SpacingType }) {
  return <View style={{ height: type }} />;
}