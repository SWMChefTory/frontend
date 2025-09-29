import { COLORS } from "@/src/modules/shared/constants/colors";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { memo } from "react";
import { responsiveFontSize } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveWidth } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveHeight } from "@/src/modules/shared/utils/responsiveUI";
import { Icon, IconButton, Text } from "react-native-paper";
import { Button } from "react-native-paper";

type TimerHeaderProps = {
  recipeTitle: string;
  onClose: () => void;
  onPress?: () => void;
};

export const TimerHeader = memo(({ recipeTitle, onPress, onClose }: TimerHeaderProps) => {
  const isDisabled = !onPress;
  return (
    <View style={styles.headerRow}>
      <IconButton icon="close" size={responsiveWidth(20)} onPress={onClose} />

      <View style={[styles.titleContainer, { opacity: isDisabled ? 0.5 : 1 }]}>
        <Button
          icon={({ color }) => (
              <Icon
                source="chevron-right"
                size={responsiveWidth(24)}
                color={color}
              />
          )}
          disabled={isDisabled}
          mode="text"
          textColor={COLORS.text.gray}
          maxFontSizeMultiplier={2}
          contentStyle={{ flexDirection: "row-reverse" }}
          onPress={onPress}
          labelStyle={{
            fontSize: responsiveFontSize(16),
            fontWeight: "600",
            lineHeight: responsiveHeight(20),
          }}
        >
          <Text
            style={styles.activityTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {recipeTitle || ""}
          </Text>
        </Button>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  headerRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContainer: {
    alignItems: "flex-end",
    flex: 1,
  },
  activityTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityTitle: {
    color: COLORS.text.gray,
    fontSize: responsiveFontSize(16),
    fontWeight: "600",
    lineHeight: responsiveHeight(20),
  },
});
