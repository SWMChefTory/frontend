import { View, Text, StyleSheet, Animated } from "react-native";
import { RecipeCreateStatus } from "@/src/modules/recipe/create/step/types/Status";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { responsiveWidth } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveFontSize } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveHeight } from "@/src/modules/shared/utils/responsiveUI";
import { SHADOW } from "@/src/modules/shared/constants/shadow";

interface Props {
  title: string;
  description: string;
  stepOrder: RecipeCreateStatus[];
  currentStepIndex: number;
  scaleValue: Animated.Value;
}

export function StepInfoCard({
  title,
  description,
  stepOrder,
  currentStepIndex,
  scaleValue,
}: Props) {
  return (
    <View style={styles.stepInfoCard}>
      <View style={styles.innerContainer}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text
          style={styles.stepDescription}
          lineBreakStrategyIOS="hangul-word"
          textBreakStrategy="simple"
          numberOfLines={2}
        >
          {description}
        </Text>

        <View style={styles.stepIndicators}>
          {stepOrder.map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.stepDot,
                index <= currentStepIndex && styles.stepDotActive,
                {
                  transform: [
                    {
                      scale: index <= currentStepIndex ? scaleValue : 1,
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepInfoCard: {
    backgroundColor: COLORS.background.white,
    borderRadius: 24,
    padding: responsiveWidth(24),
    width: responsiveWidth(250),
    height: responsiveHeight(180),
    ...SHADOW,
    borderWidth: 1,
    borderColor: COLORS.border.lightGray,
  },
  innerContainer: {
    alignItems: "center",
    paddingBottom: responsiveHeight(8),
  },
  stepTitle: {
    fontSize: responsiveFontSize(24),
    fontWeight: "bold",
    color: COLORS.text.black,
    paddingBottom: responsiveHeight(12),
    textAlign: "center",
    height: responsiveHeight(35),
  },
  stepDescription: {
    fontSize: responsiveFontSize(16),
    color: COLORS.text.gray,
    lineHeight: responsiveHeight(20),
    textAlign: "center",
    paddingBottom: 24,
    minHeight: responsiveHeight(40),
  },
  stepIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    gap: responsiveWidth(12),
    paddingBottom: responsiveHeight(8),
  },
  stepDot: {
    width: responsiveWidth(8),
    height: responsiveHeight(8),
    borderRadius: responsiveWidth(4),
    backgroundColor: COLORS.background.lightGray,
  },
  stepDotActive: {
    width: responsiveWidth(12),
    height: responsiveHeight(12),
    borderRadius: responsiveWidth(6),
    backgroundColor: COLORS.background.gray,
  },
});
