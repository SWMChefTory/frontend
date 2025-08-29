import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { DraxView } from "react-native-drax";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { useDeleteViewModel } from "./useDeleteViewModel";
import { SHADOW } from "@/src/modules/shared/constants/shadow";

interface TrashCanProps {
  isDragging: boolean;
  onDragEnd: () => void;
}

export const TrashCan = React.memo(function TrashCan({ 
  isDragging, 
  onDragEnd,
}: TrashCanProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { deleteCategoryRecipe } = useDeleteViewModel();
  
  const successScaleAnim = useRef(new Animated.Value(0)).current;
  const successOpacityAnim = useRef(new Animated.Value(0)).current;
  const iconScaleAnim = useRef(new Animated.Value(1)).current;

  const showSuccessAnimation = () => {
    setShowSuccess(true);
    
    // 아이콘 스케일 애니메이션 (빨아들이는 효과)
    Animated.timing(iconScaleAnim, {
      toValue: 0.8,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(iconScaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });

    // 성공 체크마크 애니메이션
    Animated.parallel([
      Animated.spring(successScaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(successOpacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // 1.2초 후 애니메이션 리셋 및 드래그 종료
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(successScaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(successOpacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowSuccess(false);
        successScaleAnim.setValue(0);
        successOpacityAnim.setValue(0);
        onDragEnd();
      });
    }, 1200);
  };

  return (
    <Animated.View 
      style={[
        styles.trashContainer, 
        isDragging ? styles.trashVisible : styles.trashHidden
      ]}
      pointerEvents={isDragging ? 'auto' : 'none'}
    >
      <DraxView
        style={[
          styles.trashCan,
          isHovered && styles.trashCanHovered
        ]}
        receivingStyle={styles.trashCanReceiving}
        onReceiveDragEnter={() => {
          setIsHovered(true);
        }}
        onReceiveDragExit={() => {
          setIsHovered(false);
        }}
        onReceiveDragDrop={({ dragged: { payload } }) => {
          setIsHovered(false);
          
          if (payload) {
            const [recipeId, categoryId] = payload;
            deleteCategoryRecipe({ recipeId, categoryId });
            showSuccessAnimation();
          } else {
            onDragEnd();
          }
        }}
      >
        <Animated.View style={{ transform: [{ scale: iconScaleAnim }] }}>
          <Ionicons 
            name={isHovered ? "trash" : "trash-outline"} 
            size={32} 
            color={isHovered ? COLORS.background.white : COLORS.orange.main} 
          />
        </Animated.View>
        
        <Text style={[styles.trashText, isHovered && styles.trashTextHovered]}>
          삭제하려면 여기에 놓으세요
        </Text>

        {/* 성공 애니메이션 오버레이 */}
        {showSuccess && (
          <Animated.View 
            style={[
              styles.successOverlay,
              {
                opacity: successOpacityAnim,
                transform: [{ scale: successScaleAnim }],
              }
            ]}
          >
            <View style={styles.successCheckContainer}>
              <Ionicons 
                name="checkmark-circle" 
                size={40} 
                color={COLORS.orange.main} 
              />
            </View>
            <Text style={styles.successText}>삭제 완료!</Text>
          </Animated.View>
        )}
      </DraxView>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  trashContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 0,
    elevation: 0,
    pointerEvents: 'box-none',
  },
  trashVisible: {
    opacity: 1,
    transform: [{ translateY: 0 }],
  },
  trashHidden: {
    opacity: 0,
    transform: [{ translateY: 120 }],
  },
  trashCan: {
    backgroundColor: COLORS.background.white,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "dashed",
    ...SHADOW,
    pointerEvents: 'auto',
    position: 'relative',
  },
  trashCanHovered: {
    borderColor: COLORS.orange.main,
    backgroundColor: COLORS.orange.main,
    transform: [{ scale: 1.05 }],
    shadowColor: COLORS.orange.main,
    shadowOpacity: 0.3,
  },
  trashCanReceiving: {
    borderColor: COLORS.orange.main,
    backgroundColor: COLORS.orange.main,
    transform: [{ scale: 1.05 }],
    shadowColor: COLORS.orange.main,
    shadowOpacity: 0.3,
  },
  trashText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.orange.main,
    textAlign: 'center',
  },
  trashTextHovered: {
    color: COLORS.background.white,
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCheckContainer: {
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.orange.main,
  },
});