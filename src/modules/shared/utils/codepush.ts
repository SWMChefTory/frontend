import * as Updates from "expo-updates";
import { SplashScreen } from "expo-router";

export async function checkAndApplyUpdates() {
  try {
    if (__DEV__) {
      await SplashScreen.hideAsync();
      return;
    }

    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } else {
      await SplashScreen.hideAsync();
    }
  } catch (e) {
    console.log("EAS 업데이트 실패:", e);
    await SplashScreen.hideAsync();
  }
}
