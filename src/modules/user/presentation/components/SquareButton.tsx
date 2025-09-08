import { Button, useTheme } from "react-native-paper";

export default function SquareButton({
  label,
  onPress,
  disabled=false,
}: {
  label: string;
  onPress: () => void; //버튼을 눌렀을 때
  disabled?: boolean;
}) {
  const theme = useTheme();
  return (
    <Button
      onPress={onPress}
      style={{
        height: 48,
        borderRadius: 4,
        backgroundColor: disabled 
      ? theme.colors.surfaceDisabled 
      : theme.colors.primary,
      }}
      contentStyle={{
        height: 48,
        justifyContent: "center",
        alignItems: "center", // 가로 중앙 정렬 추가
      }}
      labelStyle={{
        color: theme.colors.onPrimary,
      }}
      disabled={disabled}
    >
      {label}
    </Button>
  );
}
