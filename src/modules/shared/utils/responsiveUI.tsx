import { Dimensions, Platform } from "react-native";

const baseDesignScreenSize = 375;
const baseDesignScreenHeight = 812;

const { width, height } = Dimensions.get("window");

// 기존 함수 (가로)
export function responsiveWidth(baseDesignElementSize: number): number {
  const screenRatio = width / baseDesignScreenSize;
  return baseDesignElementSize * screenRatio;
}

// 세로용 추가
export function responsiveHeight(baseDesignElementSize: number): number {
  const screenRatio = height / baseDesignScreenHeight;
  return baseDesignElementSize * screenRatio;
}

export function responsiveFontSize(baseDesignElementSize: number): number {  
  const screenRatio = width / baseDesignScreenSize;
  
  let calculatedSize = baseDesignElementSize * screenRatio;
  
  if (Platform.OS === 'android') {
    calculatedSize *= 0.8;
  } else if (Platform.OS === 'ios') {
    calculatedSize *= 0.9;
  }
  
  return calculatedSize;
}