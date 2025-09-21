import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { RecipeProgressDetail, RecipeProgress } from "../types/Status";
import { DETAIL_STEPS_INFO } from "../constants/Steps";
import {
  responsiveWidth,
  responsiveFontSize,
  responsiveHeight,
} from "@/src/modules/shared/utils/responsiveUI";
import { SHADOW } from "@/src/modules/shared/constants/shadow";

interface Props {
  progresses: RecipeProgress[];
  scaleValue: any;
}

interface Step {
  step: string;
  status: "completed";
  orderIndex: number;
}

export function DetailSteps({ progresses }: Props) {
  const scrollViewRef = useRef<ScrollView>(null);

  const STEP_ORDER_MAP: { [key: string]: number } = {
    READY: 0,
    CAPTION: 1,
    INGREDIENT: 2,
    TAG: 3,
    DETAIL_META: 4,
    BRIEFING: 5,
    STEP: 6,
    FINISHED: 7,
  };

  const getStepsFromProgresses = (): Step[] => {
    const completedStepDetails = progresses
      .map((progress) => progress.progress_detail)
      .filter((detail) => detail in STEP_ORDER_MAP)
      .sort((a, b) => STEP_ORDER_MAP[a] - STEP_ORDER_MAP[b]);

    return completedStepDetails.map((stepDetail) => ({
      step: stepDetail,
      status: "completed" as const,
      orderIndex: STEP_ORDER_MAP[stepDetail],
    }));
  };

  const steps = getStepsFromProgresses();

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [progresses.length]);

  const getStepInfo = (stepKey: string) => {
    return (
      DETAIL_STEPS_INFO[stepKey as RecipeProgressDetail] || {
        label: stepKey,
        description: `${stepKey} 진행 중`,
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>진행 상황</Text>
          <Text style={styles.subtitle}>레시피 생성 과정</Text>
        </View>
        <View style={styles.progressBadge}>
          <Text style={styles.progressBadgeText}>
            {progresses.length}/{Object.keys(STEP_ORDER_MAP).length}
          </Text>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {steps.map((stepData, index) => {
          const stepInfo = getStepInfo(stepData.step);

          return (
            <View
              key={`${stepData.step}-${stepData.orderIndex}`}
              style={styles.stepItemWrapper}
            >
              <View style={styles.stepItem}>
                <View style={styles.stepContent}>
                  <View style={styles.stepIcon}>
                    <Text style={styles.checkMark}>✓</Text>
                  </View>

                  <View style={styles.stepTextContainer}>
                    <Text style={styles.stepLabel}>{stepInfo.label}</Text>
                    <Text style={styles.stepDescription}>
                      {stepInfo.description}
                    </Text>
                  </View>

                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>
                      {stepData.orderIndex + 1}
                    </Text>
                  </View>
                </View>
              </View>

              {index < steps.length - 1 && (
                <View style={styles.connectorContainer}>
                  <View style={styles.connector} />
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: responsiveWidth(16),
    padding: responsiveWidth(16),
    marginTop: responsiveHeight(6),
    marginBottom: responsiveHeight(6),
    width: responsiveWidth(272),
    height: responsiveHeight(256),
    ...SHADOW,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.08)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: responsiveHeight(16),
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: responsiveFontSize(15),
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: responsiveHeight(2),
  },
  subtitle: {
    fontSize: responsiveFontSize(10),
    fontWeight: "500",
    color: "#6B7280",
  },
  progressBadge: {
    paddingHorizontal: responsiveWidth(10),
    paddingVertical: responsiveHeight(5),
    borderRadius: 12,
    backgroundColor: "rgba(255, 69, 0, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.1)",
  },
  progressBadgeText: {
    fontSize: responsiveFontSize(11),
    fontWeight: "700",
    color: "#FF4500",
  },
  scrollView: {
    flex: 1,
    marginBottom: responsiveHeight(12),
  },
  scrollContent: {
    paddingBottom: responsiveHeight(16),
  },
  stepItemWrapper: {
    position: "relative",
    marginBottom: responsiveHeight(10),
  },
  stepItem: {
    minHeight: responsiveHeight(60),
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: responsiveHeight(10),
    paddingHorizontal: responsiveWidth(12),
    backgroundColor: "#FEFEFE",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.1)",
  },
  stepContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepIcon: {
    width: responsiveWidth(34),
    height: responsiveWidth(34),
    borderRadius: responsiveWidth(17),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF4500",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    marginRight: responsiveWidth(12),
  },
  checkMark: {
    color: "#FFFFFF",
    fontSize: responsiveFontSize(16),
    fontWeight: "900",
  },
  stepTextContainer: {
    flex: 1,
  },
  stepLabel: {
    fontSize: responsiveFontSize(13),
    fontWeight: "700",
    color: "#FF4500",
    marginBottom: responsiveHeight(3),
  },
  stepDescription: {
    fontSize: responsiveFontSize(11),
    lineHeight: responsiveHeight(14),
    color: "#6B7280",
  },
  stepNumber: {
    width: responsiveWidth(22),
    height: responsiveWidth(22),
    borderRadius: responsiveWidth(11),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 69, 0, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.1)",
  },
  stepNumberText: {
    fontSize: responsiveFontSize(10),
    fontWeight: "800",
    color: "#FF4500",
  },
  connectorContainer: {
    position: "absolute",
    left: responsiveWidth(20),
    top: responsiveHeight(52),
    width: 2,
    height: responsiveHeight(16),
    zIndex: -1,
  },
  connector: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FF4500",
    borderRadius: 1,
  },
});
