import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { RecentSummaryRecipe } from "../types/Recipe";
import { SHADOW } from "@/src/modules/shared/constants/shadow";
import { CARD_STYLES } from "@/src/modules/shared/constants/card";
import { responsiveWidth } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveHeight } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveFontSize } from "@/src/modules/shared/utils/responsiveUI";
type Props = {
  recipe: RecentSummaryRecipe;
  onPress: (recipe: RecentSummaryRecipe) => void;
};

export function RecentRecipeSummaryCard({ recipe, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={() => onPress(recipe)}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: recipe.thumbnailUrl }} style={styles.image} />
      </View>
      <View style={styles.body}>
        <Text numberOfLines={1} style={styles.title}>
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
        <Text style={styles.progressText}>{recipe.getTimeAgo()} 시청됨</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    ...CARD_STYLES.medium_horizontal,
  },
  imageWrapper: {
    width: "100%",
    height: "60%",
    overflow: "hidden",
    borderRadius: CARD_STYLES.medium_horizontal.borderRadius,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
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
    borderRadius: responsiveWidth(2),
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
