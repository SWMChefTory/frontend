import * as Linking from "expo-linking";
import { publishOpenCreatingView } from "@/src/widgets/create-recipe-view/event/videoUrlDeepLinkEvent";
import {useCreatingRecipeViewStore} from "@/src/widgets/create-recipe-view/store/creatingRecipeViewStore";

export function redirectSystemPath({ path, initial }: { path: string, initial: boolean }) {
  console.log("redirectSystemPath", path);
  try {
    handleExternalDeepLink(path);
    if (initial) {
      console.log("이니셜", path);
      return '/';
    } 
    return '/';
  } catch {
    // Do not crash inside this function! Instead you should redirect users
    // to a custom route to handle unexpected errors, where they are able to report the incident
    return '/unexpected-error';
  }
}


const handleExternalDeepLink = (url: string) => {
    const parsedUrl = Linking.parse(url);
    const queryParams = parsedUrl.queryParams;
    if (
      url.includes("expo-development-client") ||
      url.includes("com.googleusercontent.apps") ||
      url.startsWith("com.googleusercontent.apps")
    ) {
      console.log("시스템 개발 URL 무시:", url);
      return;
    }

    console.log("External deep link:", {
      url,
      source: parsedUrl.queryParams?.source || "unknown",
      timestamp: new Date().toISOString(),
    });

    if (!parsedUrl.hostname) {
      if (queryParams?.["video-id"]) {
        publishOpenCreatingView({videoId: queryParams?.["video-id"] as string});
        useCreatingRecipeViewStore.setState({isCreatingOpened: true});
      }
    }
  };
