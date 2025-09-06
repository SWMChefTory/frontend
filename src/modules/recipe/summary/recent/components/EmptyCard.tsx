import React, { useCallback, useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { RecipeBottomSheet } from "@/src/modules/recipe/create/form/components/BottomSheet";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { CARD_STYLES } from "@/src/modules/shared/constants/card";
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from "@/src/modules/shared/utils/responsiveUI";

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
      {isFirst && <RecipeBottomSheet modalRef={modalRef} youtubeUrl={""} />}

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
    ...CARD_STYLES.medium_horizontal,
    borderWidth: 1,
    borderColor: COLORS.background.orange,
    borderStyle: "dashed",
    backgroundColor: COLORS.background.white,
  },
  emptyCardInactive: { opacity: 0.3 },
  cardPressed: { transform: [{ scale: 0.98 }] },

  emptyImageWrapper: {
    width: "100%",
    height: "60%",
    overflow: "hidden",
    borderRadius: CARD_STYLES.medium_horizontal.borderRadius,
  },
  plusIcon: {
    fontSize: responsiveWidth(24),
    color: COLORS.text.gray,
    fontWeight: "300",
  },

  emptyImagePlaceholder: {
    flex: 1,
    backgroundColor: COLORS.background.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyBody: {
    paddingHorizontal: responsiveWidth(12),
    paddingTop: responsiveHeight(12),
  },
  emptyTitle: {
    fontSize: responsiveFontSize(13),
    fontWeight: "600",
    color: COLORS.text.gray,
    lineHeight: responsiveHeight(18),
  },
  emptyProgressBg: {
    width: "100%",
    height: responsiveHeight(3),
    backgroundColor: COLORS.background.lightGray,
    borderRadius: responsiveWidth(2),
    marginTop: responsiveHeight(6),
  },
  emptyProgressText: {
    fontSize: responsiveFontSize(11),
    color: COLORS.text.gray,
    marginTop: responsiveHeight(4),
    fontWeight: "500",
  },
});
