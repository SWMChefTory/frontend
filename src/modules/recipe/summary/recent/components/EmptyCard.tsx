import React, { useCallback, useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { RecipeBottomSheet } from "@/src/modules/recipe/create/form/components/BottomSheet";
import { COLORS } from "@/src/modules/shared/constants/colors";

type Props = {
  isFirst?: boolean;
};

export function EmptyStateCard({ isFirst }: Props) {
  const modalRef = useRef<BottomSheetModal>(null);

  const openBottomSheet = useCallback(() => {
    if (isFirst) {
      modalRef.current?.present();
    }
  }, [isFirst]);

  return (
    <>
      {isFirst && <RecipeBottomSheet modalRef={modalRef} />}
      
      <Pressable 
        onPress={openBottomSheet} 
        style={[styles.emptyCard, !isFirst && styles.emptyCardInactive]}
      >
        <View style={styles.emptyImageWrapper}>
          <View style={styles.emptyImagePlaceholder}>
            {isFirst && <Text style={styles.plusIcon}>+</Text>}
          </View>
        </View>
        <View style={styles.emptyBody}>
          <Text numberOfLines={1} style={styles.emptyTitle}>
            {isFirst ? "레시피 만들기" : ""}
          </Text>
          <View style={styles.emptyProgressBg} />
          <Text style={styles.emptyProgressText}>
            {isFirst ? "새로운 레시피 추가" : ""}
          </Text>
        </View>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  emptyCard: {
    width: 140,
    marginVertical: 8,
    backgroundColor: COLORS.background.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.font.dark,
    // borderStyle: 'dashed',
  },
  emptyCardInactive: {
    opacity: 0.3,
  },
  emptyImageWrapper: {
    width: "100%",
    height: 80,
    overflow: "hidden",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  emptyImagePlaceholder: { 
    width: "100%", 
    height: "100%", 
    backgroundColor: COLORS.background.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  plusIcon: {
    fontSize: 24,
    color: COLORS.text.gray,
    fontWeight: "300",
  },
  emptyBody: { 
    padding: 12 
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text.gray,
    lineHeight: 18,
  },
  emptyProgressBg: {
    width: "100%",
    height: 3,
    backgroundColor: COLORS.background.lightGray,
    borderRadius: 2,
    marginTop: 6,
  },
  emptyProgressText: {
    fontSize: 11,
    color: COLORS.text.gray,
    marginTop: 4,
    fontWeight: "500",
  },
});