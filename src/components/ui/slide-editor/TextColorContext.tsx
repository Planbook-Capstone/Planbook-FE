"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface TextColorContextType {
  isTextColorMode: boolean;
  setIsTextColorMode: (value: boolean) => void;
  selectedTextElementId: string | null;
  setSelectedTextElementId: (id: string | null) => void;
  onTextColorChange: ((color: string) => void) | null;
  setOnTextColorChange: (callback: ((color: string) => void) | null) => void;
}

const TextColorContext = createContext<TextColorContextType | undefined>(undefined);

interface TextColorProviderProps {
  children: ReactNode;
}

export function TextColorProvider({ children }: TextColorProviderProps) {
  const [isTextColorMode, setIsTextColorMode] = useState(false);
  const [selectedTextElementId, setSelectedTextElementId] = useState<string | null>(null);
  const [onTextColorChange, setOnTextColorChange] = useState<((color: string) => void) | null>(null);

  return (
    <TextColorContext.Provider
      value={{
        isTextColorMode,
        setIsTextColorMode,
        selectedTextElementId,
        setSelectedTextElementId,
        onTextColorChange,
        setOnTextColorChange,
      }}
    >
      {children}
    </TextColorContext.Provider>
  );
}

export function useTextColor() {
  const context = useContext(TextColorContext);
  if (context === undefined) {
    throw new Error("useTextColor must be used within a TextColorProvider");
  }
  return context;
}
