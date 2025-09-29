import { DimensionValue, View } from "react-native";

import { Button, useTheme } from "react-native-paper";
import {
  responsiveHeight,
  responsiveWidth,
} from "@/src/modules/shared/utils/responsiveUI";

export type TimerControlButtonProps = {
  label: string;
  icon: string;
  isEmphasis?: boolean;
  onPress: () => void;
  disabled: boolean;
};

export default function TimerControlSection({
  buttonsProps,
  width,
}: {
  buttonsProps: TimerControlButtonProps[];
  width: DimensionValue; //%값만 넣을 수 있음
}) {
  return (
    <View
      style={[
        {
          position: "absolute",
          bottom: 24,
          zIndex: 1,
          width: "92%",
          alignItems: "center",
        },
      ]}
    >
      <View
        style={[
          {
            height: responsiveHeight(1),
            backgroundColor: "black",
            width: "100%",
            opacity: 0.5,
          },
        ]}
      />

      <View
        style={[
          {
            height: responsiveHeight(16),
            width: width,
          },
        ]}
      />
      <View style={[{ flexDirection: "row", width: width }]}>
        {buttonsProps.map((button) => (
          <TimerControlButton
            key={button.label}
            label={button.label}
            icon={button.icon}
            onPress={button.onPress}
            disabled={button.disabled}
            isEmphasis={button.isEmphasis}
          />
        ))}
      </View>
    </View>
  );
}

function TimerControlButton({
  label,
  icon,
  onPress,
  disabled,
  isEmphasis,
}: TimerControlButtonProps) {
  const theme = useTheme();
  return (
    <View
      style={{
        paddingHorizontal: responsiveWidth(4),
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <Button
        mode={isEmphasis ? "contained" : "outlined"}
        icon={icon}
        style={{
          justifyContent: "center",
          flexDirection: "row-reverse",
          borderRadius: 8,
          flex: 1,
          width: "100%",
        }}
        contentStyle={{
           width: "100%",
          }}  
        onPress={() => onPress()}
        disabled={disabled}
        textColor={isEmphasis ? theme.colors.onPrimary : "black"}
      >
        {label}
      </Button>
    </View>
  );
}
