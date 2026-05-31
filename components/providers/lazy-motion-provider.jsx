"use client";

import { LazyMotion, domAnimation } from "framer-motion";

export function LazyMotionProvider({ children }) {
  return (
    <LazyMotion features={domAnimation}>
      {children}
    </LazyMotion>
  );
}
