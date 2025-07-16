import { View, StyleSheet } from "react-native";
import Skeleton from "react-native-reanimated-skeleton";
import { COLORS } from "@/src/modules/shared/constants/colors";

export function RecentRecipesSkeleton() {
  return (
    <View style={styles.container}>
      {[...Array(2)].map((_, index) => (
        <View key={index} style={styles.skeletonCard}>
          <Skeleton
            isLoading={true}
            layout={[
              {
                key: `img${index}`,
                width: "100%",
                height: 80,
                borderRadius: 16,
              },
              {
                key: `title${index}`,
                width: "90%",
                height: 13,
                borderRadius: 4,
                marginTop: 12,
              },
              {
                key: `progress${index}`,
                width: "100%",
                height: 3,
                borderRadius: 2,
                marginTop: 6,
              },
              {
                key: `progressText${index}`,
                width: "60%",
                height: 11,
                borderRadius: 4,
                marginTop: 4,
              },
            ]}
            boneColor={COLORS.skeleton.bone}
            highlightColor={COLORS.skeleton.highlight}
            animationType="pulse"
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  skeletonCard: {
    width: 140,
    marginRight: 12,
    backgroundColor: COLORS.background.white,
    borderRadius: 16,
    padding: 12,
    shadowColor: COLORS.orange.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
});
