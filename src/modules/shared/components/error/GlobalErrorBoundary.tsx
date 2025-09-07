import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { GlobalError } from "./Fallback";
import * as Sentry from '@sentry/react-native';
import React from "react";

interface Props {
  children: React.ReactNode;
}

export function GlobalErrorBoundary({ children }: Props) {
  return (
    <QueryErrorResetBoundary>
      {({ reset: queryReset }) => (
        <Sentry.ErrorBoundary 
          fallback={({ error, resetError }) => (
            <GlobalError 
              // error={error} 
              resetErrorBoundary={() => {
                resetError();    // Sentry 에러 바운더리 리셋
                queryReset();    // React Query 에러 리셋
              }} 
            />
          )}
        >  
          {children}
        </Sentry.ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

