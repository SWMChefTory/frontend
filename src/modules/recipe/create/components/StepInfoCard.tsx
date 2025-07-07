import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { RecipeCreateStatus } from "@/src/modules/recipe/create/types/Status";

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
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 24,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    marginBottom: 32,
    alignItems: "center",
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 12,
    textAlign: "center",
  },
  stepDescription: {
    fontSize: 16,
    color: "#64748B",
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
    backgroundColor: "#CBD5E1",
  },
  stepDotActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#475569",
  },
});
