import React from "react";
import { View, StyleSheet } from "react-native";
import Skeleton from "react-native-reanimated-skeleton";

type Props = {
  loading: boolean;
  children: React.ReactNode;
};

export function LoadingView({ loading, children }: Props) {
  if (loading) {
    return (
      <View style={styles.container}>
        <Skeleton
          isLoading={true}
          layout={[
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
            {
              key: "block-1",
              width: "90%",
              height: 14,
              borderRadius: 4,
              marginBottom: 10,
            },
            {
              key: "block-2",
              width: "85%",
              height: 14,
              borderRadius: 4,
              marginBottom: 10,
            },
            {
              key: "block-3",
              width: "70%",
              height: 14,
              borderRadius: 4,
              marginBottom: 10,
            },
          ]}
          boneColor="#E1E9EE"
          highlightColor="#F2F8FC"
          animationType="shiver"
        />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
