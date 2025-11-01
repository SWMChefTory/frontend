import { Dimensions, Image, StyleSheet } from "react-native";

const src = Image.resolveAssetSource(
  require("@/assets/images/mainCharacter.png"),
);
const { height, width } = Dimensions.get("window");

const LOGO_W = 180; // 스플래시와 동일
const LOGO_H = LOGO_W * (src.height / src.width);

// 로그인 단계에서 위로 올릴 거리
const HEIGHT_DIFF = -60;

// 📌 로고(앵커) 위치: 세로 40% 지점 + 가로 중앙
const logoMainTop = (height - LOGO_H) / 2;
const logoMainLeft = (width - LOGO_W) / 2;

const OFFSETS = {
  voiceNear: { dx: 160, dy: 30 },
  voiceFar: { dx: 170, dy: 50 },
  cheftory: { dx: 0, dy: 160 },
};

const styles = StyleSheet.create({
  // 로고 (기본)
  logoCenter: {
    position: "absolute",
    width: LOGO_W,
    height: LOGO_H,
    top: logoMainTop,
    left: logoMainLeft,
  },
  // 로고 (로그인 단계)
  logoLogin: {
    position: "absolute",
    width: LOGO_W,
    height: LOGO_H,
    top: logoMainTop + HEIGHT_DIFF,
    left: logoMainLeft,
  },

  // voiceNear
  voiceNear: {
    position: "absolute",
    width: 15,
    height: 45,
    top: logoMainTop + OFFSETS.voiceNear.dy,
    left: logoMainLeft + OFFSETS.voiceNear.dx,
  },
  voiceNearLogin: {
    position: "absolute",
    width: 15,
    height: 45,
    top: logoMainTop + OFFSETS.voiceNear.dy + HEIGHT_DIFF,
    left: logoMainLeft + OFFSETS.voiceNear.dx,
  },

  // voiceFar
  voiceFar: {
    position: "absolute",
    width: 15,
    height: 30,
    top: logoMainTop + OFFSETS.voiceFar.dy,
    left: logoMainLeft + OFFSETS.voiceFar.dx,
  },
  voiceFarLogin: {
    position: "absolute",
    width: 15,
    height: 30,
    top: logoMainTop + OFFSETS.voiceFar.dy + HEIGHT_DIFF,
    left: logoMainLeft + OFFSETS.voiceFar.dx,
  },

  // cheftory
  cheftory: {
    position: "absolute",
    width: 280,
    height: 75,
    top: logoMainTop + OFFSETS.cheftory.dy,
    left: (width - 280) / 2, // ← 화면 가로 중앙
  },
  cheftoryLogin: {
    position: "absolute",
    width: 280,
    height: 75,
    top: logoMainTop + OFFSETS.cheftory.dy + HEIGHT_DIFF,
    left: (width - 280) / 2, // ← 동일하게 중앙
  },
});

export default styles;
