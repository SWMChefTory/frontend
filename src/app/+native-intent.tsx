import * as Linking from "expo-linking";
import { reserveMessage, sendMessage } from "@/src/shared/webview/sendMessage";
import { enrollPath } from "../pages/webview/WebViewConfig";

export function redirectSystemPath({
  path,
  initial,
}: {
  path: string;
  initial: boolean;
}) {
  console.log("redirectSystemPath", path);
  try {
    handleExternalDeepLink(path, initial);
    if (initial) {
      return "/";
    }
    return "/";
  } catch {
    // Do not crash inside this function! Instead you should redirect users
    // to a custom route to handle unexpected errors, where they are able to report the incident
    return "/unexpected-error";
  }
}

const handleExternalDeepLink = (url: string, initial: boolean) => {
  console.log("handleExternalDeepLink", url);
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
      if(!initial){
        sendMessage({
          type: "OPEN_CREATING_VIEW",
          data: { videoUrl: "https://www.youtube.com/watch?v=" + queryParams?.["video-id"] },
        });
        return;
      }
      reserveMessage({
        type: "OPEN_CREATING_VIEW",
        data: { videoUrl: "https://www.youtube.com/watch?v=" + queryParams?.["video-id"] },
      });
      return;
    }
    if(queryParams?.["recipeId"]){
      if(!initial){
        sendMessage({
          type: "ROUTE",
          data: { route: "/recipe/" + queryParams?.["recipeId"]+"/detail" },
        });
        return;
      }
      reserveMessage({
        type: "ROUTE",
        data: { route: "/recipe/" + queryParams?.["recipeId"]+"/detail" },
      });
    }
  }
};
