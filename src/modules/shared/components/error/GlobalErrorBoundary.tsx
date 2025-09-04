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
      <Sentry.ErrorBoundary fallback={React.createElement(GlobalError)}>  
           {children}
         </Sentry.ErrorBoundary>
    </QueryErrorResetBoundary>
  );
}
