import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { GlobalError } from "./Fallback";
import * as Sentry from '@sentry/react-native';
import React from "react";
import { AxiosError } from "axios";

interface Props {
  children: React.ReactNode;
}

export function GlobalErrorBoundary({ children }: Props) {
  return (
    <QueryErrorResetBoundary>
      {({ reset: queryReset }) => (
        <Sentry.ErrorBoundary 
          fallback={({ error, resetError }) => {
            console.log("error!!!!!!!!!!!!!!!!!", JSON.stringify(error));
            console.log("resetError!!!!!!!!!!!!!!!!!", JSON.stringify((error as AxiosError).response));
            return (
              <GlobalError 
                // error={error} 
                resetErrorBoundary={() => {
                  resetError();    // Sentry 에러 바운더리 리셋
                  queryReset();    // React Query 에러 리셋
                }} 
              />
            )
          }}
        >  
          {children}
        </Sentry.ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

