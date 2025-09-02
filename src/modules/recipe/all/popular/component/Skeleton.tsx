import { View, StyleSheet, FlatList } from "react-native";
import Skeleton from "react-native-reanimated-skeleton";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { responsiveHeight } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveWidth } from "@/src/modules/shared/utils/responsiveUI";

type Props = { itemCount?: number };

export function AllPopularRecipesSkeleton({ itemCount = 4 }: Props) {
  const data = Array.from({ length: itemCount }, (_, i) => i);

  const renderItem = () => (
    <View style={styles.card}>
      <Skeleton
        isLoading
        layout={[
          {
            key: "cardContent",
            width: "100%",
            height: "100%",
            padding: 16,
            children: [
              {
                key: "thumbnailContainer",
                width: "100%",
                marginBottom: 16,
                children: [
                  {
                    key: "thumbnail",
                    width: "100%",
                    height: 100,
                    borderRadius: 12,
                    marginBottom: 0,
                  },
                ],
              },
              {
                key: "title1",
                width: "90%",
                height: 16,
                borderRadius: 4,
                marginBottom: 4,
              },
              {
                key: "title2",
                width: "75%",
                height: 16,
                borderRadius: 4,
                marginBottom: 4,
              },
              {
                key: "metaContainer",
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 16,
                children: [
                  {
                    key: "popularityText",
                    width: 80,
                    height: 12,
                    borderRadius: 3,
                  },
                  {
                    key: "countBadge",
                    width: 60,
                    height: 16,
                    borderRadius: 8,
                  },
                ],
              },
              {
                key: "recipeButton",
                width: "100%",
                height: 34,
                borderRadius: 12,
              },
            ],
          },
        ]}
        boneColor={COLORS.skeleton.bone}
        highlightColor={COLORS.skeleton.highlight}
        animationType="pulse"
        duration={1200}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        numColumns={2}
        scrollEnabled={false}
        keyExtractor={(item) => item.toString()}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContainer}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.white,
  },
  listContainer: {
    paddingHorizontal: responsiveWidth(16),
    paddingTop: responsiveHeight(8),
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingBottom: 8,
  },
  card: {
    flex: 1,
    maxWidth: "48%",
    margin: responsiveWidth(8),
    backgroundColor: COLORS.background.white,
    borderRadius: responsiveWidth(16),
    shadowColor: COLORS.shadow.orange,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    minHeight: responsiveHeight(250),
  },
});
