"use client";

import React, { createContext, useContext, useState } from "react";
import { ExamTemplateMetadata } from "@/components/organisms/exam-template-metadata-form";

interface ExamTemplateContextType {
  isTemplateMode: boolean;
  templateMetadata: ExamTemplateMetadata | null;
  setTemplateMode: (isTemplate: boolean) => void;
  setTemplateMetadata: (metadata: ExamTemplateMetadata) => void;
  convertToTemplateFormat: () => any;
}

const ExamTemplateContext = createContext<ExamTemplateContextType | undefined>(
  undefined
);

export const useExamTemplateContext = () => {
  const context = useContext(ExamTemplateContext);
  if (!context) {
    throw new Error(
      "useExamTemplateContext must be used within an ExamTemplateProvider"
    );
  }
  return context;
};

interface ExamTemplateProviderProps {
  children: React.ReactNode;
}

export const ExamTemplateProvider: React.FC<ExamTemplateProviderProps> = ({
  children,
}) => {
  const [isTemplateMode, setIsTemplateMode] = useState<boolean>(false);
  const [templateMetadata, setTemplateMetadata] =
    useState<ExamTemplateMetadata | null>(null);

  // Function to convert exam context data to template format
  const convertToTemplateFormat = () => {
    if (!templateMetadata) {
      return null;
    }

    // This will be implemented to convert the current exam data to template format
    // It will be called when saving the template
    return {
      name: templateMetadata.name,
      subject: templateMetadata.subject,
      grade: templateMetadata.grade,
      durationMinutes: templateMetadata.durationMinutes,
      totalScore: templateMetadata.totalScore,
      gradingConfig: templateMetadata.gradingConfig,
      contentJson: {
        parts: [],
      },
    };
  };

  const setTemplateMode = (isTemplate: boolean) => {
    setIsTemplateMode(isTemplate);
    if (!isTemplate) {
      setTemplateMetadata(null);
    }
    // Don't auto-set default metadata here to avoid infinite loops
    // Default metadata will be set in the form component instead
  };

  const value: ExamTemplateContextType = {
    isTemplateMode,
    templateMetadata,
    setTemplateMode,
    setTemplateMetadata,
    convertToTemplateFormat,
  };

  return (
    <ExamTemplateContext.Provider value={value}>
      {children}
    </ExamTemplateContext.Provider>
  );
};

// Combined provider for both exam and template contexts
export const CombinedExamProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <ExamTemplateProvider>{children}</ExamTemplateProvider>;
};
