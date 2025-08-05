import React from "react";
import { View, StyleSheet } from "react-native";
import Skeleton from "react-native-reanimated-skeleton";
import { ICustomViewStyle } from "react-native-reanimated-skeleton/lib/typescript/constants";

type SkeletonLayout = "default";

type Props = {
  loading: boolean;
  children: React.ReactNode;
  skeletonComponent?: React.ReactNode;
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

export function LoadingView({ loading, children, skeletonComponent }: Props) {
  if (loading) {
    if (skeletonComponent) {
      return skeletonComponent;
    }
    return (
      <View style={styles.container}>
        <Skeleton
          isLoading={true}
          layout={getSkeletonLayout("default")}
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
