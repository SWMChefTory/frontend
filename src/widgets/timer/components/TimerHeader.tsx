import { COLORS } from "@/src/modules/shared/constants/colors";
import { StyleSheet, Text, View } from "react-native";
import { memo } from "react";
import { responsiveFontSize } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveWidth } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveHeight } from "@/src/modules/shared/utils/responsiveUI";
// import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from "@expo/vector-icons";
import {IconButton} from "react-native-paper";


type TimerHeaderProps = {
  recipeTitle: string;
};

export const TimerHeader = memo(({ recipeTitle }: TimerHeaderProps) => {
  return (
    <View style={styles.headerRow}>
      <IconButton icon="close" onPress={()=>{}} />
      <View style={styles.titleContainer}>
        {/* <View style={styles.activityTitleContainer}>
          <Text
            style={styles.activityTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {recipeTitle || " "}
          </Text>
        <Ionicons name="chevron-forward" size={responsiveFontSize(16)} color={COLORS.text.gray} />
        </View> */}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  headerRow: {
    // flexDirection: "row",
    // alignItems: "flex-start",
    // justifyContent: "space-between",
    width: "100%",
  },
  titleContainer: {
    flex: 1,
    paddingLeft: responsiveWidth(8),
    paddingRight: responsiveWidth(12),
    // width:
  },
  activityTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityTitle: {
    overflow: "hidden",
    // paddingTop: responsiveHeight(10),
    color: COLORS.text.gray,
    fontSize: responsiveFontSize(16),
    fontWeight: "600",
    lineHeight: responsiveHeight(20),
    // minHeight: responsiveHeight(40),
  },
});
