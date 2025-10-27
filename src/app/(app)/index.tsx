import { View } from "react-native";
import { RecipeWebView } from "@/src/pages/webview/RecipeWebView";
import { track } from "@/src/modules/shared/utils/analytics";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function WebViewScreen() {
  useEffect(() => {
    track.screen("RecipeDetail");
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          shouldDuckAndroid: false,
          staysActiveInBackground: false,
          playThroughEarpieceAndroid: true,
        });
      } catch (e) {
        console.warn("Failed to set audio mode", e);
      }
    })();

    return () => {
      (async () => {
        try {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: false,
            interruptionModeIOS: InterruptionModeIOS.DuckOthers,
            interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
            shouldDuckAndroid: true,
            staysActiveInBackground: false,
            playThroughEarpieceAndroid: false,
          });
        } catch (e) {
          console.warn("Failed to reset audio mode", e);
        }
      })();
    };
  }, []);

  return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <Stack.Screen options={{ headerShown: false }} />
        <RecipeWebView />
      </View>
  );
}
