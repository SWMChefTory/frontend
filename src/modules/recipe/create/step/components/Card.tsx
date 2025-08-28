import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { RecipeCreateStatus } from "@/src/modules/recipe/create/step/types/Status";
import { COLORS } from "@/src/modules/shared/constants/colors";

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
    padding: 32,
    shadowColor: COLORS.shadow.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.border.lightGray,
  },
  innerContainer: {
    alignItems: "center",
    paddingBottom: 8,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text.black,
    paddingBottom: 12,
    textAlign: "center",
  },
  stepDescription: {
    fontSize: 16,
    color: COLORS.text.gray,
    lineHeight: 24,
    textAlign: "center",
    paddingBottom: 24,
  },
  stepIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    paddingBottom: 8,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.background.lightGray,
  },
  stepDotActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.background.gray,
  },
});
