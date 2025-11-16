import type {CSSProperties} from "react";
import {isRouteErrorResponse, useRouteError} from "react-router";

export default function ErrorBoundary() {
  const error = useRouteError();

  return (
    <div style={rootStyles()}>
      <div style={containerStyles()}>{renderErrorMessage(error)}</div>
    </div>
  );
}

function parseStackTrace(stack?: string) {
  if (!stack) return {filePath: null, functionName: null};

  const filePathMatch = stack.match(/\/src\/[^?]+/);
  const functionNameMatch = stack.match(/at (\S+)/);

  return {
    filePath: filePathMatch ? filePathMatch[0] : null,
    functionName: functionNameMatch ? functionNameMatch[1] : null,
  };
}

function renderErrorMessage(error: unknown) {
  if (isRouteErrorResponse(error)) {
    return (
      <>
        <h2>
          {error.status}: {error.statusText}
        </h2>
        <p style={messageStyles()}>{error.data}</p>
      </>
    );
  }

  if (error instanceof Error) {
    const { filePath, functionName } = parseStackTrace(error.stack);

    return (
      <>
        <h2>Unexpected Application Error!</h2>
        <p style={messageStyles()}>
          {error.name}: {error.message}
        </p>
        <pre style={detailsStyles()}>{error.stack}</pre>
        {(filePath || functionName) && (
          <p style={filePathStyles()}>
            {filePath} ({functionName})
          </p>
        )}
      </>
    );
  }

  return <h2>Unknown Error</h2>;
}

const rootStyles = (): CSSProperties => {
  return {
    display: "flex",
    height: "100vh",
    flex: "1 1 auto",
    alignItems: "center",
    padding: "10vh 15px",
    flexDirection: "column",
    color: "white",
    backgroundColor: "#2c2c2e",
  };
};

const containerStyles = (): CSSProperties => {
  return {
    gap: 24,
    padding: 20,
    width: "100%",
    maxWidth: 960,
    display: "flex",
    borderRadius: 8,
    flexDirection: "column",
    backgroundColor: "#1c1c1e",
  };
};

const messageStyles = (): CSSProperties => {
  return {
    margin: 0,
    lineHeight: 1.5,
    padding: "12px 16px",
    whiteSpace: "pre-wrap",
    backgroundColor: "#2a1e1e",
    fontWeight: 700,
  };
};

const detailsStyles = (): CSSProperties => {
  return {
    margin: 0,
    padding: 16,
    lineHeight: 1.5,
    overflow: "auto",
    borderRadius: "inherit",
    whiteSpace: "pre-wrap",
    backgroundColor: "#111111",
  };
};

const filePathStyles = (): CSSProperties => {
  return {
    marginTop: 16,
  };
};