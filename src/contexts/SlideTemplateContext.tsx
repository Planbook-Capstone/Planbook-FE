"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface SlideTemplateTempData {
  name: string;
  description?: string;
  imageBlocks?: Record<string, string>;
}

interface SlideTemplateContextType {
  tempData: SlideTemplateTempData | null;
  setTempData: (data: SlideTemplateTempData | null) => void;
  clearTempData: () => void;
}

const SlideTemplateContext = createContext<SlideTemplateContextType | undefined>(
  undefined
);

export const useSlideTemplateContext = () => {
  const context = useContext(SlideTemplateContext);
  if (context === undefined) {
    throw new Error(
      "useSlideTemplateContext must be used within a SlideTemplateProvider"
    );
  }
  return context;
};

interface SlideTemplateProviderProps {
  children: ReactNode;
}

export const SlideTemplateProvider: React.FC<SlideTemplateProviderProps> = ({
  children,
}) => {
  const [tempData, setTempDataState] = useState<SlideTemplateTempData | null>(
    null
  );

  const setTempData = (data: SlideTemplateTempData | null) => {
    setTempDataState(data);
  };

  const clearTempData = () => {
    setTempDataState(null);
  };

  const value: SlideTemplateContextType = {
    tempData,
    setTempData,
    clearTempData,
  };

  return (
    <SlideTemplateContext.Provider value={value}>
      {children}
    </SlideTemplateContext.Provider>
  );
};
