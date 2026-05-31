"use client";

import React, { createContext, useContext, useState } from "react";
import GlobalLoader from "../loaders/GlobalLoader";
import AILoader from "../loaders/AILoader";

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [globalLoading, setGlobalLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState("");

  const startLoading = (type = "global", message = "") => {
    if (type === "ai") {
      setAiLoading(true);
      setAiMessage(message);
    } else {
      setGlobalLoading(true);
    }
  };

  const stopLoading = () => {
    setGlobalLoading(false);
    setAiLoading(false);
    setAiMessage("");
  };

  return (
    <LoadingContext.Provider
      value={{
        globalLoading,
        aiLoading,
        aiMessage,
        startLoading,
        stopLoading,
      }}
    >
      {children}
      {globalLoading && <GlobalLoader />}
      {aiLoading && <AILoader message={aiMessage} />}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
