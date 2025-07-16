import { View, StyleSheet } from "react-native";
import Skeleton from "react-native-reanimated-skeleton";
import { COLORS } from "@/src/modules/shared/constants/colors";

export function PopularRecipesSkeleton() {
  return (
    <View style={styles.skeletonGrid}>
      <View style={styles.skeletonRow}>
        <View style={styles.skeletonCard}>
          <Skeleton
            isLoading={true}
            layout={[
              { key: "img1", width: "100%", height: 100, borderRadius: 12 },
              {
                key: "text1",
                width: "80%",
                height: 14,
                borderRadius: 4,
                marginTop: 6,
              },
            ]}
            boneColor={COLORS.skeleton.bone}
            highlightColor={COLORS.skeleton.highlight}
            animationType="pulse"
          />
        </View>
        <View style={styles.skeletonCard}>
          <Skeleton
            isLoading={true}
            layout={[
              { key: "img2", width: "100%", height: 100, borderRadius: 12 },
              {
                key: "text2",
                width: "70%",
                height: 14,
                borderRadius: 4,
                marginTop: 6,
              },
            ]}
            boneColor={COLORS.skeleton.bone}
            highlightColor={COLORS.skeleton.highlight}
            animationType="pulse"
          />
        </View>
      </View>

      <View style={[styles.skeletonRow, { marginTop: 12 }]}>
        <View style={styles.skeletonCard}>
          <Skeleton
            isLoading={true}
            layout={[
              { key: "img3", width: "100%", height: 100, borderRadius: 12 },
              {
                key: "text3",
                width: "85%",
                height: 14,
                borderRadius: 4,
                marginTop: 6,
              },
            ]}
            boneColor={COLORS.skeleton.bone}
            highlightColor={COLORS.skeleton.highlight}
            animationType="pulse"
          />
        </View>
        <View style={styles.skeletonCard}>
          <Skeleton
            isLoading={true}
            layout={[
              { key: "img4", width: "100%", height: 100, borderRadius: 12 },
              {
                key: "text4",
                width: "75%",
                height: 14,
                borderRadius: 4,
                marginTop: 6,
              },
            ]}
            boneColor={COLORS.skeleton.bone}
            highlightColor={COLORS.skeleton.highlight}
            animationType="pulse"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeletonGrid: {
    flex: 1,
  },
  skeletonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  skeletonCard: {
    width: "48%",
  },
});
