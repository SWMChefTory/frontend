export const SPLASH_CONFIG = {
  colors: {
    gradients: ["#fb923c", "#f87171", "#f472b6"] as const,
    background: "#fb923c",
    yellowDot: "#fde047",
    greenDot: "#86efac",
    text: {
      primary: "white",
      secondary: "rgba(255,255,255,0.8)",
      dots: "rgba(255,255,255,0.6)",
    },
    shadow: {
      color: "#000",
      ios: "rgba(255,255,255,0.1)",
      android: "rgba(255,255,255,0.1)",
    },
  },
  animations: {
    delays: {
      initial: 300,
      afterGradient: 200,
      afterDots: 100,
      afterText: 200,
    },
    durations: {
      gradient: 600,
      logoTransform: 600,
      textFade: 400,
      dotsAppear: 300,
      bounce: 400,
      float: 1000,
    },
    spring: {
      tension: 200,
      friction: 4,
    },
    values: {
      logoScale: 0.4,
      logoTranslateY: -60,
      bounceHeight: -8,
      floatScale: 1.2,
    },
  },
  gradient: {
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  text: {
    title: "쉐프토리",
    subtitle: "맛있는 레시피를 준비하고 있어요",
  },
  timing: {
    finishDelay: 2000,
    fallbackTimeout: 5000,
  },
  dimensions: {
    logo: {
      container: { width: 220, height: 220 },
      image: { width: 200, height: 200 },
      borderRadius: 24,
    },
    dots: {
      yellow: { width: 24, height: 24, borderRadius: 12 },
      green: { width: 16, height: 16, borderRadius: 8 },
      loading: { width: 8, height: 8, borderRadius: 4 },
    },
    positioning: {
      logoTranslateY: -60,
      textMarginTop: 200,
      yellowDotPosition: { top: 30, right: 30 },
      greenDotPosition: { bottom: 30, left: 30 },
    },
  },
  shadow: {
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
    },
    android: {
      elevation: 16,
      shadowColor: "#000",
    },
  },
  textShadow: {
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
} as const;
