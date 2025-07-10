"use client";

import React, { createContext, useContext, useRef } from "react";

interface ComponentAddContextType {
  addComponentRef: React.MutableRefObject<((componentType: string) => void) | null>;
}

const ComponentAddContext = createContext<ComponentAddContextType | null>(null);

export function ComponentAddProvider({ children }: { children: React.ReactNode }) {
  const addComponentRef = useRef<((componentType: string) => void) | null>(null);

  return (
    <ComponentAddContext.Provider value={{ addComponentRef }}>
      {children}
    </ComponentAddContext.Provider>
  );
}

export function useComponentAdd() {
  const context = useContext(ComponentAddContext);
  if (!context) {
    throw new Error("useComponentAdd must be used within ComponentAddProvider");
  }
  return context;
}
