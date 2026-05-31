"use client";

import React from "react";

export default function ButtonLoader({ className = "" }) {
  return (
    <div className={`inline-flex items-center justify-center gap-1.5 ${className}`} aria-hidden="true">
      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" />
    </div>
  );
}
