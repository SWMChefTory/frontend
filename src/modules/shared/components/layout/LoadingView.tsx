import React from "react";
import { View, StyleSheet } from "react-native";
import Skeleton from "react-native-reanimated-skeleton";
import { ICustomViewStyle } from "react-native-reanimated-skeleton/lib/typescript/constants";
import { PopularRecipesSkeleton } from "@/src/modules/recipe/summary/popular/shared/Skeleton";
import { RecentRecipesSkeleton } from "@/src/modules/recipe/summary/recent/shared/Skeleton";

type SkeletonLayout = "popularRecipes" | "recentRecipes" | "default";

type Props = {
  loading: boolean;
  children: React.ReactNode;
  skeletonLayout?: SkeletonLayout;
};

const getSkeletonLayout = (layout: SkeletonLayout): ICustomViewStyle[] => {
  switch (layout) {
    case "default":
    default:
      return [
        {
          key: "header",
          width: "100%",
          height: 220,
          borderRadius: 12,
          marginBottom: 20,
        },
        {
          key: "title",
          width: "60%",
          height: 24,
          borderRadius: 4,
          marginBottom: 12,
        },
        {
          key: "subtitle",
          width: "80%",
          height: 18,
          borderRadius: 4,
          marginBottom: 20,
        },
      ];
  }
};

export function LoadingView({
  loading,
  children,
  skeletonLayout = "default",
}: Props) {
  if (loading) {
    if (skeletonLayout === "popularRecipes") {
      return <PopularRecipesSkeleton />;
    }
    if (skeletonLayout === "recentRecipes") {
      return <RecentRecipesSkeleton />;
    }

    return (
      <View style={styles.container}>
        <Skeleton
          isLoading={true}
          layout={getSkeletonLayout(skeletonLayout)}
          boneColor="#FF4500"
          highlightColor="#F2F8FC"
          animationType="shiver"
        />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {},
});
