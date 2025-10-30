import { View } from "react-native";

enum SpacingType {
  small = 16,
  medium = 24,
  large = 32,
}
//TODO : 이 요소가 왜 존재하는지 알려주기
//TODO : 삭제
export default function SectionSpacing({ type }: { type: SpacingType }) {
  return <View style={{ height: type }} />;
}