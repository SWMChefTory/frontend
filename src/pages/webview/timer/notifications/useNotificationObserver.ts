import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { sendMessage } from "@/src/shared/webview/sendMessage";
import * as Linking from "expo-linking";

export function useNotificationObserver() {
  useEffect(() => {
    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;
      if (url && typeof url === "string") {
        setTimeout(() => {
          sendMessage({
            type: "ROUTE",
            data: {
              route:
                "/recipe/" +
                Linking.parse(url).queryParams?.["recipeId"] +
                "/detail",
            },
          });
        }, 100);
      } else {
        console.log("이동 할 딥링크가 없습니다.");
      }
    }

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response?.notification) {
        return;
      }
      redirect(response.notification);
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        redirect(response.notification);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);
}
