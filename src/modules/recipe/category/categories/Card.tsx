import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DraxView } from "react-native-drax";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { Category } from "../Category";

interface Props {
  category: Category;
  onDrop: (
    recipeId: string,
    recipeCategoryId: string | null,
    categoryId: string,
  ) => void;
  onDelete: (categoryId: string) => void;
  onPress: (category: Category) => void;
  isSelected: boolean;
  isDeleting: boolean;
  isUpdating: boolean;
}

export function CategoryCard({
  category,
  onDrop,
  onDelete,
  onPress,
  isSelected,
  isDeleting,
  isUpdating,
}: Props) {
  const [isReceiving, setIsReceiving] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const countPreviewAnim = useRef(new Animated.Value(0)).current;
  const successAnim = useRef(new Animated.Value(0)).current;
  const deleteAnim = useRef(new Animated.Value(1)).current;
  const updateAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const pulseLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const updateLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (isUpdating) {
      Animated.parallel([
        Animated.timing(updateAnim, {
          toValue: 0.95,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.98,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const rotateLoop = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      );
      rotateLoop.start();
      updateLoopRef.current = rotateLoop;

      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(updateAnim, {
            toValue: 0.92,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(updateAnim, {
            toValue: 0.95,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      );
      pulseLoop.start();
      pulseLoopRef.current = pulseLoop;
    } else {
      if (updateLoopRef.current) {
        updateLoopRef.current.stop();
        updateLoopRef.current = null;
      }
      if (pulseLoopRef.current) {
        pulseLoopRef.current.stop();
        pulseLoopRef.current = null;
      }

      rotateAnim.setValue(0);

      Animated.parallel([
        Animated.spring(updateAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 150,
          friction: 8,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 150,
          friction: 8,
        }),
      ]).start();
    }
  }, [isUpdating]);

  useEffect(() => {
    if (isDeleting) {
      const shakeAnimation = () => {
        return Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.02,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.98,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.01,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 200,
            useNativeDriver: true,
          }),
        ]);
      };

      Animated.parallel([
        Animated.timing(deleteAnim, {
          toValue: 0.6,
          duration: 300,
          useNativeDriver: true,
        }),
        shakeAnimation(),
      ]).start();

      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(deleteAnim, {
            toValue: 0.4,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(deleteAnim, {
            toValue: 0.6,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      );
      pulseLoop.start();
      pulseLoopRef.current = pulseLoop;
    } else if (!isUpdating) {
      if (pulseLoopRef.current) {
        pulseLoopRef.current.stop();
        pulseLoopRef.current = null;
      }

      Animated.parallel([
        Animated.spring(deleteAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 150,
          friction: 8,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 150,
          friction: 8,
        }),
      ]).start();
    }
  }, [isDeleting, isUpdating]);

  const startHoverAnimation = () => {
    if (isDeleting || isUpdating) return;

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.005,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    );

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1.005,
        useNativeDriver: true,
        tension: 150,
        friction: 8,
      }),
      Animated.timing(countPreviewAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    pulse.start();
  };

  const endHoverAnimation = () => {
    pulseAnim.stopAnimation();

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isDeleting ? 0.95 : isUpdating ? 0.98 : 1,
        useNativeDriver: true,
        tension: 150,
        friction: 8,
      }),
      Animated.spring(pulseAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 150,
        friction: 8,
      }),
      Animated.timing(countPreviewAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const successAnimation = () => {
    setShowSuccessAnimation(true);

    Animated.sequence([
      Animated.timing(successAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(successAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowSuccessAnimation(false);
    });
  };

  const handlePress = () => {
    if (isDeleting || isUpdating) return;
    onPress(category);
  };

  const handleDrop = (event: any) => {
    if (isDeleting || isUpdating) return;

    const payload = event.dragged.payload;
    console.log("payload", payload);

    let recipeId: string;
    if (typeof payload === "string") {
      recipeId = payload;
    } else if (payload && typeof payload === "object" && payload[0]) {
      recipeId = payload[0];
    } else {
      console.warn("Invalid drag payload:", payload);
      return;
    }

    let recipeCategoryId: string | null = null;
    if (payload && typeof payload === "object" && payload[1]) {
      recipeCategoryId = payload[1];
    }

    if (recipeCategoryId === category.id) {
      setIsReceiving(false);
      endHoverAnimation();
      return;
    }

    setIsReceiving(false);
    endHoverAnimation();

    onDrop(recipeId, recipeCategoryId, category.id);
    successAnimation();
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const animatedStyle = {
    transform: [
      {
        scale: Animated.multiply(
          Animated.multiply(scaleAnim, pulseAnim),
          updateAnim,
        ),
      },
      ...(isUpdating ? [{ rotate: rotateInterpolate }] : []),
    ],
    opacity: isDeleting ? deleteAnim : 1,
  };

  const gradientReceivingStyle = isReceiving
    ? {
        backgroundColor: "rgba(255, 165, 0, 0.15)",
        borderColor: COLORS.orange.main,
        borderWidth: 2,
        shadowColor: COLORS.orange.main,
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 10,
      }
    : {};

  const deletingStyle = isDeleting
    ? {
        backgroundColor: "rgba(255, 99, 99, 0.1)",
        borderColor: "#FF6B6B",
        borderWidth: 2,
        shadowColor: "#FF6B6B",
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }
    : {};

  const updatingStyle = isUpdating
    ? {
        backgroundColor: "rgba(52, 152, 219, 0.1)",
        borderColor: "#3498DB",
        borderWidth: 2,
        shadowColor: "#3498DB",
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }
    : {};

  return (
    <Animated.View style={[animatedStyle]}>
      <DraxView
        style={[
          styles.categoryGridItem,
          gradientReceivingStyle,
          deletingStyle,
          updatingStyle,
        ]}
        onReceiveDragEnter={
          isDeleting || isUpdating
            ? undefined
            : () => {
                setIsReceiving(true);
                startHoverAnimation();
              }
        }
        onReceiveDragExit={
          isDeleting || isUpdating
            ? undefined
            : () => {
                setIsReceiving(false);
                endHoverAnimation();
              }
        }
        onReceiveDragDrop={isDeleting || isUpdating ? undefined : handleDrop}
      >
        <TouchableOpacity
          style={styles.categoryContent}
          onPress={handlePress}
          disabled={isDeleting || isUpdating}
        >
          <View
            style={[
              styles.categoryIconContainer,
              isReceiving && styles.receivingIconContainer,
              isDeleting && styles.deletingIconContainer,
              isUpdating && styles.updatingIconContainer,
            ]}
          >
            <Ionicons
              name="folder"
              size={24}
              color={
                isDeleting
                  ? COLORS.text.gray
                  : isUpdating
                    ? "#3498DB"
                    : isReceiving
                      ? COLORS.text.white
                      : isSelected
                        ? COLORS.priamry.cook
                        : COLORS.orange.main
              }
            />
          </View>

          <Text
            style={[
              styles.categoryName,
              isReceiving && styles.receivingText,
              isDeleting && styles.deletingText,
              isUpdating && styles.updatingText,
            ]}
            numberOfLines={1}
          >
            {category.name}
          </Text>

          <View style={styles.countContainer}>
            <Text
              style={[
                styles.categoryCount,
                isReceiving && styles.receivingText,
                isDeleting && styles.deletingText,
                isUpdating && styles.updatingText,
              ]}
            >
              {category.count}개
            </Text>

            {!isDeleting && !isUpdating && (
              <Animated.View
                style={[
                  styles.previewCount,
                  {
                    opacity: countPreviewAnim,
                    transform: [
                      {
                        scale: countPreviewAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.5, 1],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Text style={styles.previewCountText}>+1</Text>
              </Animated.View>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.categoryDeleteButton,
            isDeleting && styles.deletingButton,
            isUpdating && styles.hiddenButton,
          ]}
          onPress={() => onDelete(category.id)}
          disabled={isDeleting || isUpdating}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color={COLORS.text.gray} />
          ) : (
            <Ionicons name="close" size={14} color={COLORS.text.gray} />
          )}
        </TouchableOpacity>

        {isDeleting && (
          <Animated.View
            style={[
              styles.deletingOverlay,
              {
                opacity: deleteAnim.interpolate({
                  inputRange: [0.4, 0.6],
                  outputRange: [0.9, 0.7],
                }),
              },
            ]}
          >
            <ActivityIndicator
              size="small"
              color="#FF6B6B"
              style={{ marginBottom: 4 }}
            />
            <Text style={styles.deletingOverlayText}>삭제 중...</Text>
          </Animated.View>
        )}

        {isUpdating && (
          <Animated.View
            style={[
              styles.updatingOverlay,
              {
                opacity: updateAnim.interpolate({
                  inputRange: [0.92, 0.95],
                  outputRange: [0.9, 0.7],
                }),
              },
            ]}
          >
            <ActivityIndicator
              size="small"
              color="#3498DB"
              style={{ marginBottom: 4 }}
            />
            <Text style={styles.updatingOverlayText}>업데이트 중...</Text>
          </Animated.View>
        )}

        {showSuccessAnimation && !isDeleting && !isUpdating && (
          <Animated.View
            style={[
              styles.successOverlay,
              {
                opacity: successAnim,
                transform: [
                  {
                    scale: successAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.5, 1.2, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Ionicons
              name="checkmark-circle"
              size={32}
              color={COLORS.orange.main}
            />
          </Animated.View>
        )}
      </DraxView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  categoryGridItem: {
    width: 120,
    height: 120,
    backgroundColor: COLORS.background.white,
    borderRadius: 12,
    shadowColor: COLORS.shadow.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    position: "relative",
  },
  categoryContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF3F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  receivingIconContainer: {
    backgroundColor: COLORS.orange.main,
  },
  deletingIconContainer: {
    backgroundColor: "#F5F5F5",
  },
  updatingIconContainer: {
    backgroundColor: "#E3F2FD",
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text.black,
    marginBottom: 4,
    textAlign: "center",
  },
  receivingText: {
    color: COLORS.orange.main,
    fontWeight: "700",
  },
  deletingText: {
    color: COLORS.text.gray,
    opacity: 0.6,
  },
  updatingText: {
    color: "#3498DB",
    fontWeight: "600",
  },
  countContainer: {
    position: "relative",
    alignItems: "center",
  },
  categoryCount: {
    fontSize: 11,
    color: COLORS.text.gray,
  },
  previewCount: {
    position: "absolute",
    top: -15,
    right: -10,
    backgroundColor: COLORS.orange.main,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  previewCountText: {
    color: COLORS.text.white,
    fontSize: 10,
    fontWeight: "bold",
  },
  categoryDeleteButton: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  deletingButton: {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
  },
  hiddenButton: {
    opacity: 0,
  },
  deletingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
  },
  deletingOverlayText: {
    fontSize: 11,
    color: "#FF6B6B",
    fontWeight: "700",
  },
  updatingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
  },
  updatingOverlayText: {
    fontSize: 11,
    color: "#3498DB",
    fontWeight: "700",
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
  },
});
