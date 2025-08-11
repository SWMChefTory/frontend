import { useFocusEffect } from "@react-navigation/native";
import React from "react";

export function useRefreshOnFocus(refetch: () => void) {
  const firstTimeRef = React.useRef(true);

  useFocusEffect(
    React.useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }

      refetch();
    }, [refetch]),
  );
}
