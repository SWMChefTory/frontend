import { QueryErrorResetBoundary } from "@tanstack/react-query";
import ErrorBoundary from "react-native-error-boundary";

interface Props {
  children: React.ReactNode;
  fallbackComponent: React.ComponentType<any>;
}

export function ApiErrorBoundary({ children, fallbackComponent }: Props) {
  return (
    <QueryErrorResetBoundary>
      <ErrorBoundary FallbackComponent={fallbackComponent}>
        {children}
      </ErrorBoundary>
    </QueryErrorResetBoundary>
  );
}
