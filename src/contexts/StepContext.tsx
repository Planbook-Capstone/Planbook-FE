"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type StepId =
  | "basic-info"
  | "scoring-config"
  | "section-1"
  | "section-2"
  | "section-3";

export interface ExamStep {
  id: StepId;
  title: string;
  description?: string;
}

interface StepContextType {
  currentStep: StepId;
  steps: ExamStep[];
  setCurrentStep: (stepId: StepId) => void;
  getStepIndex: (stepId: StepId) => number;
  canNavigateToStep: (stepId: StepId) => boolean;
  nextStep: () => void;
  previousStep: () => void;
  hasNextStep: boolean;
  hasPreviousStep: boolean;
}

const StepContext = createContext<StepContextType | undefined>(undefined);

export const useStepContext = () => {
  const context = useContext(StepContext);
  if (!context) {
    throw new Error("useStepContext must be used within a StepProvider");
  }
  return context;
};

interface StepProviderProps {
  children: ReactNode;
}

export const StepProvider: React.FC<StepProviderProps> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<StepId>("basic-info");

  const [steps] = useState<ExamStep[]>([
    {
      id: "basic-info",
      title: "Thông tin cơ bản",
      description: "Thiết lập thông tin đề thi",
    },
    {
      id: "scoring-config",
      title: "Cấu hình chấm điểm",
      description: "Thiết lập thang điểm",
    },
    {
      id: "section-1",
      title: "Phần I: Trắc nghiệm",
      description: "Câu trắc nghiệm nhiều phương án",
    },
    {
      id: "section-2",
      title: "Phần II: Đúng/Sai",
      description: "Câu trắc nghiệm đúng sai",
    },
    {
      id: "section-3",
      title: "Phần III: Tự luận",
      description: "Câu hỏi tự luận",
    },
  ]);

  // No completion logic needed - these are just sections

  const getStepIndex = (stepId: StepId): number => {
    return steps.findIndex((step) => step.id === stepId);
  };

  const canNavigateToStep = (): boolean => {
    // Allow navigation to all steps - no restrictions
    return true;
  };

  const nextStep = () => {
    const currentIndex = getStepIndex(currentStep);
    if (currentIndex < steps.length - 1) {
      const nextStepId = steps[currentIndex + 1].id;
      setCurrentStep(nextStepId);
    }
  };

  const previousStep = () => {
    const currentIndex = getStepIndex(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const hasNextStep = getStepIndex(currentStep) < steps.length - 1;
  const hasPreviousStep = getStepIndex(currentStep) > 0;

  const value: StepContextType = {
    currentStep,
    steps,
    setCurrentStep,
    getStepIndex,
    canNavigateToStep,
    nextStep,
    previousStep,
    hasNextStep,
    hasPreviousStep,
  };

  return <StepContext.Provider value={value}>{children}</StepContext.Provider>;
};
