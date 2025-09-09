import { View } from "react-native";

enum SpacingType {
  small = 8,
  medium = 16,
  large = 24,
}

export default function SectionSpacing({ type }: { type: SpacingType }) {
  return <View style={{ height: type }} />;
}