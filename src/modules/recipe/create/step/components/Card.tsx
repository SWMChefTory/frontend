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
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepDescription}>{description}</Text>

      {/* 단계 인디케이터 */}
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
    marginBottom: 32,
    alignItems: "center",
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text.black,
    marginBottom: 12,
    textAlign: "center",
  },
  stepDescription: {
    fontSize: 16,
    color: COLORS.text.gray,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 24,
  },
  stepIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
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
