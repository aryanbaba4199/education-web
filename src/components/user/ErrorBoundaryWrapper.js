// src/components/ErrorBoundaryWrapper.js
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorPage from '../ErrorPage';

const ErrorBoundaryWrapper = ({ children }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorPage}
      onReset={() => {
        // Optionally reset some global state or reload data
        window.location.reload();
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryWrapper;
