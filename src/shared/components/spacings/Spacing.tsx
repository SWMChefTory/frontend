import { View } from "react-native";

enum InputSpacingType {
  small = 8,
  medium = 16,
  large = 24,
}

function InputSpacing({ type }: { type: InputSpacingType }) {
  return <View style={{ height: type }} />;
}

enum BlockSpacingType {
  small = 16,
  medium = 24,
  large = 32,
  xlarge = 40,
}

function BlockSpacing({ type }: { type: BlockSpacingType }) {
  return <View style={{ height: type }} />;
}

export { InputSpacing,InputSpacingType, BlockSpacing, BlockSpacingType };