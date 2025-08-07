import { StyleSheet } from "react-native";


const heigthDiff = -60;

const logoMainTop = 325;
const logoMainLeft = 100;


const voiceNearTop = 345;
const voiceNearLeft = 254;

const voiceFarTop = 363;
const voiceFarLeft = 266;

const cheftoryTop = 510;
const cheftoryLeft = 60;

const styles = StyleSheet.create({
  logoCenter: {
    width: 170,
    height: 160,
    position: "absolute",
    top: logoMainTop,
    left: logoMainLeft,
  },
  logoLogin: {
    width: 170,
    height: 160,
    position: "absolute",
    top: logoMainTop+heigthDiff,
    left: 100,
  },
  voiceNear: {
    width: 15,
    height: 45,
    position: "absolute",
    top: voiceNearTop,
    left: voiceNearLeft,
  },
  voiceNearLogin:{
    width: 15,
    height: 45,
    position: "absolute",
    top: voiceNearTop+heigthDiff,
    left: voiceNearLeft,
  },
  voiceFar: {
    width: 15,
    height: 30,
    position: "absolute",
    top: voiceFarTop,
    left: voiceFarLeft,
  },
  voiceFarLogin:{
    width: 15,
    height: 30,
    position: "absolute",
    top: voiceFarTop+heigthDiff,
    left: voiceFarLeft,
  },
  cheftory: {
    width: 280,
    height: 75,
    position: "absolute",
    top: cheftoryTop,
    left: cheftoryLeft,
  },
  cheftoryLogin: {
    width: 280,
    height: 75,
    position: "absolute",
    top: cheftoryTop+heigthDiff,
    left: cheftoryLeft,
  },
});

export default styles;