import { QueryErrorResetBoundary } from "@tanstack/react-query";
import * as Sentry from "@sentry/react-native";
import React from "react";

interface Props {
  children: React.ReactNode;
  fallbackComponent: React.ComponentType<any>;
}

export function ApiErrorBoundary({ children, fallbackComponent }: Props) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <Sentry.ErrorBoundary
          fallback={React.createElement(fallbackComponent, {
            resetErrorBoundary: reset,
          })}
        >
          {children}
        </Sentry.ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
