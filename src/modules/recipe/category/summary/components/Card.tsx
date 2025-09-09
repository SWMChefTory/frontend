import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { DraxView } from "react-native-drax";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { CategorySummaryRecipe } from "../types/Recipe";
import { SHADOW } from "@/src/modules/shared/constants/shadow";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "@/src/modules/shared/utils/responsiveUI";

interface Props {
  recipe: CategorySummaryRecipe;
  index: number;
  onPress: (recipe: CategorySummaryRecipe) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  isDragging?: boolean;
}

export const RecipeCard = React.memo(function RecipeCard({
  recipe,
  index,
  onPress,
  onDragStart,
  onDragEnd,
  isDragging,
}: Props) {
  const handlePress = () => {
    if (onPress && !isDragging) {
      onPress(recipe);
    }
  };

  return (
    <DraxView
      key={`recipe-${recipe.recipeId}-${index}`}
      style={[styles.card, isDragging && styles.draggingCard]}
      draggable={true}
      dragPayload={[recipe.recipeId, recipe.categoryId]}
      longPressDelay={300}
      onDragStart={() => {
        onDragStart();
      }}
      onDragEnd={() => {
        onDragEnd();
      }}
    >
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        style={styles.touchableContent}
        disabled={isDragging}
      >
        <View style={styles.imageWrapper}>
          <Image source={{ uri: recipe.thumbnailUrl }} style={styles.image} />
          <View
            style={[styles.overlay, isDragging && styles.draggingOverlay]}
          />
        </View>
        <View style={styles.body}>
          <Text numberOfLines={1} style={[styles.title]}>
            {recipe.title}
          </Text>
          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFg,
                {
                  width: `${Math.min(
                    (recipe.lastPlaySeconds / recipe.videoDuration) * 100,
                    100,
                  )}%`,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText]}>
            {recipe.getTimeAgo()} 시청됨
          </Text>
        </View>
      </TouchableOpacity>
    </DraxView>
  );
});

const styles = StyleSheet.create({
  card: {
    width: "32%",
    backgroundColor: COLORS.background.white,
    borderRadius: 12,
    paddingBottom: responsiveHeight(12),
    ...SHADOW,
  },
  draggingCard: {
    opacity: 0.5,
  },
  touchableContent: {
    flex: 1,
  },
  imageWrapper: {
    width: "100%",
    height: responsiveHeight(80),
    overflow: "hidden",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  draggingOverlay: {
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  body: {
    paddingHorizontal: responsiveWidth(12),
    paddingTop: responsiveHeight(12),
  },
  title: {
    fontSize: responsiveFontSize(13),
    fontWeight: "600",
    color: COLORS.text.black,
    lineHeight: responsiveHeight(18),
  },
  progressBg: {
    width: "100%",
    height: responsiveHeight(3),
    backgroundColor: COLORS.background.lightGray,
    borderRadius: 2,
    marginTop: responsiveHeight(6),
  },
  progressFg: {
    height: "100%",
    backgroundColor: COLORS.background.orange,
    borderRadius: 2,
  },
  progressText: {
    fontSize: responsiveFontSize(11),
    color: COLORS.text.gray,
    marginTop: responsiveHeight(4),
    fontWeight: "500",
  },
});
