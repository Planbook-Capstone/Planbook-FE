"use client";

import React, { createContext, useContext, useState } from "react";
import { ExamTemplateMetadata } from "@/components/organisms/exam-template-metadata-form";

interface ExamTemplateContextType {
  templateMetadata: ExamTemplateMetadata | null;
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

  const value: ExamTemplateContextType = {
    templateMetadata,
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
