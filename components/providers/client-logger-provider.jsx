"use client";

import { useEffect, useRef } from "react";

export function ClientLoggerProvider({ children }) {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development" || isInitialized.current) return;
    isInitialized.current = true;

    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
    };

    let logQueue = [];
    let isSending = false;

    // Process logs sequentially to avoid race conditions or out-of-order logs
    const processQueue = async () => {
      if (logQueue.length === 0 || isSending) return;
      isSending = true;

      const { level, args, url } = logQueue.shift();

      try {
        await fetch("/api/client-logs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ level, args, url }),
          keepalive: true,
        });
      } catch (err) {
        // Fallback silently if logging endpoint is unreachable
      } finally {
        isSending = false;
        // Schedule next log
        setTimeout(processQueue, 50);
      }
    };

    const sendLogToServer = (level, args) => {
      try {
        const formattedArgs = args.map((arg) => {
          if (arg instanceof Error) {
            return {
              name: arg.name,
              message: arg.message,
              stack: arg.stack,
            };
          }
          if (typeof arg === "object" && arg !== null) {
            try {
              // Strip potential circular dependencies
              return JSON.parse(JSON.stringify(arg));
            } catch (e) {
              return String(arg);
            }
          }
          return String(arg);
        });

        logQueue.push({
          level,
          args: formattedArgs,
          url: window.location.href,
        });

        processQueue();
      } catch (err) {
        // Fallback silently
      }
    };

    // Override console methods to intercept
    console.log = (...args) => {
      originalConsole.log.apply(console, args);
      // Skip Inngest development logging poller to prevent logs flood
      const logStr = String(args[0] || "");
      if (logStr.includes("inngest") || logStr.includes("poll") || logStr.includes("DevTools")) {
        return;
      }
      sendLogToServer("INFO", args);
    };

    console.warn = (...args) => {
      originalConsole.warn.apply(console, args);
      sendLogToServer("WARN", args);
    };

    console.error = (...args) => {
      originalConsole.error.apply(console, args);
      sendLogToServer("ERROR", args);
    };

    // Intercept global runtime errors
    const handleGlobalError = (event) => {
      sendLogToServer("ERROR", [
        `Runtime Error: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`,
        event.error,
      ]);
    };

    // Intercept global promise rejections
    const handleUnhandledRejection = (event) => {
      sendLogToServer("ERROR", [
        `Unhandled Promise Rejection: ${event.reason?.message || event.reason}`,
        event.reason,
      ]);
    };

    window.addEventListener("error", handleGlobalError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      console.log = originalConsole.log;
      console.warn = originalConsole.warn;
      console.error = originalConsole.error;
      window.removeEventListener("error", handleGlobalError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return children;
}
