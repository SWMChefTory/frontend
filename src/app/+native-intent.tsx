import * as Linking from "expo-linking";
import { reserveMessage, sendMessage } from "@/src/shared/webview/sendMessage";

export function redirectSystemPath({
  path,
  initial,
}: {
  path: string;
  initial: boolean;
}) {
  try {
    handleExternalDeepLink(path, initial);
    if (initial) {
      return "/";
    }
    return "/";
  } catch {
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
      if (!initial) {
        //TODO : 서버에는 주석이 많으면 좋은데, 배포할 때는 주석 없애주는 프로그램 사용하기
        sendMessage({
          type: "OPEN_CREATING_VIEW",
          data: {
            videoUrl:
              "https://www.youtube.com/watch?v=" + queryParams?.["video-id"],
          },
        });
        return;
      }
      reserveMessage({
        type: "OPEN_CREATING_VIEW",
        data: {
          videoUrl:
            "https://www.youtube.com/watch?v=" + queryParams?.["video-id"],
        },
      });
      return;
    }
    if (queryParams?.["recipeId"]) {
      if (!initial) {
        sendMessage({
          type: "ROUTE",
          data: { route: "/recipe/" + queryParams?.["recipeId"] + "/detail" },
        });
        return;
      }
      reserveMessage({
        type: "ROUTE",
        data: { route: "/recipe/" + queryParams?.["recipeId"] + "/detail" },
      });
    }
  }
};
