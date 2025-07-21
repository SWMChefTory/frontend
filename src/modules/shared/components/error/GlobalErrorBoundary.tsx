import { QueryErrorResetBoundary } from "@tanstack/react-query";
import ErrorBoundary from "react-native-error-boundary";
import { GlobalError } from "./Fallback";

interface Props {
  children: React.ReactNode;
}

export function GlobalErrorBoundary({ children }: Props) {
  return (
    <QueryErrorResetBoundary>
      <ErrorBoundary FallbackComponent={GlobalError}>
        {children}
      </ErrorBoundary>
    </QueryErrorResetBoundary>
  );
}
