"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Question } from "@/components/organisms/exam-question-item/types";
import { YesNoQuestion } from "@/components/organisms/yes-no-question-item/types";
import { ShortQuestion } from "@/components/organisms/short-question-item/types";
import {
  BasicExamInfo,
  defaultBasicExamInfo,
} from "@/components/organisms/basic-exam-info/types";

interface ExamContextType {
  basicExamInfo: BasicExamInfo;
  examQuestions: Question[];
  examYesNoQuestions: YesNoQuestion[];
  examShortQuestions: ShortQuestion[];
  updateBasicExamInfo: (info: BasicExamInfo) => void;
  updateQuestion: (question: Question) => void;
  updateYesNoQuestion: (question: YesNoQuestion) => void;
  updateShortQuestion: (question: ShortQuestion) => void;
  deleteQuestion: (questionId: string) => void;
  deleteYesNoQuestion: (questionId: string) => void;
  deleteShortQuestion: (questionId: string) => void;
  addQuestion: () => void;
  addYesNoQuestion: () => void;
  addShortQuestion: () => void;
  addQuestionWithData: (question: Question) => void;
  addYesNoQuestionWithData: (question: YesNoQuestion) => void;
  addShortQuestionWithData: (question: ShortQuestion) => void;
  updateQuestionImage: (questionId: string, imagePath: string) => void;
  updateYesNoQuestionImage: (questionId: string, imagePath: string) => void;
  updateShortQuestionImage: (questionId: string, imagePath: string) => void;
  setExamFromApiResponse: (apiResponse: any) => void;
  clearExamData: () => void;
  clearLocalStorage: () => void;
  hasUnsavedChanges: boolean;
  markAsSaved: () => void;
  disableReloadWarning: boolean;
  setDisableReloadWarning: (value: boolean) => void;
}

// LocalStorage keys
const EXAM_DATA_KEY = "exam_draft_data";
const UNSAVED_CHANGES_KEY = "exam_unsaved_changes";

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const useExamContext = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error("useExamContext must be used within an ExamProvider");
  }
  return context;
};

interface ExamProviderProps {
  children: ReactNode;
}

export const ExamProvider: React.FC<ExamProviderProps> = ({ children }) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [disableReloadWarning, setDisableReloadWarning] = useState(false);

  // Initialize state from localStorage or defaults
  const [basicExamInfo, setBasicExamInfo] = useState<BasicExamInfo>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(EXAM_DATA_KEY);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          return data.basicExamInfo || defaultBasicExamInfo;
        } catch (e) {
          console.error("Error parsing saved exam data:", e);
        }
      }
    }
    return defaultBasicExamInfo;
  });

  const [examQuestions, setExamQuestions] = useState<Question[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(EXAM_DATA_KEY);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          return data.examQuestions || [];
        } catch (e) {
          console.error("Error parsing saved exam data:", e);
        }
      }
    }
    return [
      {
        id: "1",
        question: "Câu hỏi mẫu?",
        options: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
        correctAnswer: 0,
        type: "single",
      },
    ];
  });

  const [examYesNoQuestions, setExamYesNoQuestions] = useState<YesNoQuestion[]>(
    () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(EXAM_DATA_KEY);
        if (saved) {
          try {
            const data = JSON.parse(saved);
            const questions = data.examYesNoQuestions || [];

            // Migrate old format to new format
            return questions.map((question: any) => {
              if (question.statements) {
                // Ensure statements have proper format
                const migratedStatements = {
                  a: {
                    text: String(question.statements.a?.text || ""),
                    answer: Boolean(question.statements.a?.answer || false),
                  },
                  b: {
                    text: String(question.statements.b?.text || ""),
                    answer: Boolean(question.statements.b?.answer || false),
                  },
                  c: {
                    text: String(question.statements.c?.text || ""),
                    answer: Boolean(question.statements.c?.answer || false),
                  },
                  d: {
                    text: String(question.statements.d?.text || ""),
                    answer: Boolean(question.statements.d?.answer || false),
                  },
                };
                return {
                  ...question,
                  statements: migratedStatements,
                };
              }
              return question;
            });
          } catch (e) {
            console.error("Error parsing saved exam data:", e);
          }
        }
      }
      return [];
    }
  );

  const [examShortQuestions, setExamShortQuestions] = useState<ShortQuestion[]>(
    () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(EXAM_DATA_KEY);
        if (saved) {
          try {
            const data = JSON.parse(saved);
            return data.examShortQuestions || [];
          } catch (e) {
            console.error("Error parsing saved exam data:", e);
          }
        }
      }
      return [];
    }
  );

  // Save data to localStorage
  const saveToLocalStorage = () => {
    if (typeof window !== "undefined") {
      const data = {
        basicExamInfo,
        examQuestions,
        examYesNoQuestions,
        examShortQuestions,
        timestamp: Date.now(),
      };
      localStorage.setItem(EXAM_DATA_KEY, JSON.stringify(data));
      localStorage.setItem(UNSAVED_CHANGES_KEY, "true");
    }
  };

  // Clear localStorage data
  const clearLocalStorage = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(EXAM_DATA_KEY);
      localStorage.removeItem(UNSAVED_CHANGES_KEY);
    }
  };

  // Clear exam data
  const clearExamData = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(EXAM_DATA_KEY);
      localStorage.removeItem(UNSAVED_CHANGES_KEY);
    }
    setBasicExamInfo(defaultBasicExamInfo);
    setExamQuestions([
      {
        id: "1",
        question: "Câu hỏi mẫu?",
        options: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
        correctAnswer: 0,
        type: "single",
      },
    ]);
    setExamYesNoQuestions([]);
    setExamShortQuestions([]);
    setHasUnsavedChanges(false);
  };

  // Mark as saved (when user successfully saves)
  const markAsSaved = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(UNSAVED_CHANGES_KEY);
    }
    setHasUnsavedChanges(false);
  };

  // Auto-save when data changes
  useEffect(() => {
    const hasData =
      examQuestions.length > 0 ||
      examYesNoQuestions.length > 0 ||
      examShortQuestions.length > 0;
    if (hasData) {
      saveToLocalStorage();
      setHasUnsavedChanges(true);
    }
  }, [basicExamInfo, examQuestions, examYesNoQuestions, examShortQuestions]);

  // Handle beforeunload event
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !disableReloadWarning) {
        e.preventDefault();
        e.returnValue =
          "Bạn có thay đổi chưa được lưu. Bạn có chắc chắn muốn thoát?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges, disableReloadWarning]);

  const updateQuestion = (question: Question) => {
    setExamQuestions((prev) => {
      const updated = prev.map((q) => {
        // Use string comparison to handle both string and number IDs
        if (String(q.id) === String(question.id)) {
          return question;
        }
        return q;
      });
      return updated;
    });
    setHasUnsavedChanges(true);
  };

  const updateYesNoQuestion = (question: YesNoQuestion) => {
    setExamYesNoQuestions((prev) =>
      prev.map((q) => (q.id === question.id ? question : q))
    );
    setHasUnsavedChanges(true);
  };

  const updateShortQuestion = (question: ShortQuestion) => {
    setExamShortQuestions((prev) =>
      prev.map((q) => (q.id === question.id ? question : q))
    );
    setHasUnsavedChanges(true);
  };

  const deleteQuestion = (questionId: string) => {
    setExamQuestions((prev) => prev.filter((q) => q.id !== questionId));
    setHasUnsavedChanges(true);
  };

  const deleteYesNoQuestion = (questionId: string) => {
    setExamYesNoQuestions((prev) => prev.filter((q) => q.id !== questionId));
    setHasUnsavedChanges(true);
  };

  const deleteShortQuestion = (questionId: string) => {
    setExamShortQuestions((prev) => prev.filter((q) => q.id !== questionId));
    setHasUnsavedChanges(true);
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      type: "single",
    };
    setExamQuestions((prev) => [...prev, newQuestion]);
    setHasUnsavedChanges(true);
  };

  const addYesNoQuestion = () => {
    const newQuestion: YesNoQuestion = {
      id: Date.now().toString(),
      question: "",
      statements: {
        a: { text: "", answer: true },
        b: { text: "", answer: false },
        c: { text: "", answer: true },
        d: { text: "", answer: false },
      },
      type: "yes-no",
    };
    setExamYesNoQuestions((prev) => [...prev, newQuestion]);
    setHasUnsavedChanges(true);
  };

  const addShortQuestion = () => {
    const newQuestion: ShortQuestion = {
      id: Date.now().toString(),
      question: "",
      answer: "",
      type: "short",
    };
    setExamShortQuestions((prev) => [...prev, newQuestion]);
    setHasUnsavedChanges(true);
  };

  // New functions to add questions with data
  const addQuestionWithData = (question: Question) => {
    setExamQuestions((prev) => [...prev, question]);
    setHasUnsavedChanges(true);
  };

  const addYesNoQuestionWithData = (question: YesNoQuestion) => {
    setExamYesNoQuestions((prev) => [...prev, question]);
    setHasUnsavedChanges(true);
  };

  const addShortQuestionWithData = (question: ShortQuestion) => {
    setExamShortQuestions((prev) => [...prev, question]);
    setHasUnsavedChanges(true);
  };

  const updateQuestionImage = (questionId: string, imagePath: string) => {
    setExamQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, illustrationImage: imagePath } : q
      )
    );
    setHasUnsavedChanges(true);
  };

  const updateYesNoQuestionImage = (questionId: string, imagePath: string) => {
    setExamYesNoQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, illustrationImage: imagePath } : q
      )
    );
    setHasUnsavedChanges(true);
  };

  const updateShortQuestionImage = (questionId: string, imagePath: string) => {
    setExamShortQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, illustrationImage: imagePath } : q
      )
    );
    setHasUnsavedChanges(true);
  };

  const updateBasicExamInfo = (info: BasicExamInfo) => {
    setBasicExamInfo(info);
    setHasUnsavedChanges(true);
  };

  const setExamFromApiResponse = (apiResponse: any) => {
    const examData = apiResponse?.data?.data || apiResponse?.data;
    if (!examData) {
      console.error("No exam data found in API response");
      return;
    }

    const newBasicInfo: BasicExamInfo = {
      template_name:
        examData.templateName || examData.template_name || examData.name || "",
      subject: examData.subject || "Hóa học",
      grade: examData.grade || 10,
      duration_minutes:
        examData.durationMinutes || examData.duration_minutes || 45, // Map from API field name
      school: examData.school || "",
      exam_code: examData.examCode || examData.exam_code || "1234", // Map from API field name
      atomic_masses: examData.atomicMasses || examData.atomic_masses || null, // Map from API field name
    };

    setBasicExamInfo(newBasicInfo);

    // Process parts and questions
    const parts = examData.parts || examData.contentJson?.parts || [];
    let allQuestions: Question[] = [];
    let allYesNoQuestions: YesNoQuestion[] = [];
    let allShortQuestions: ShortQuestion[] = [];

    parts.forEach((part: any, partIndex: number) => {
      const questions = part.questions || [];

      questions.forEach((q: any, qIndex: number) => {
        // Use original ID if available, otherwise create format-based ID
        const questionId = q.id || `${partIndex}-${qIndex}`;

        // Determine question type based on part index
        if (partIndex === 0) {
          // PHẦN I - Multiple choice questions (parts[0])
          // Handle both array and object format for options
          let options: string[];
          if (Array.isArray(q.options)) {
            options = q.options;
          } else if (q.options && typeof q.options === "object") {
            // Convert object format {A: "...", B: "...", C: "...", D: "..."} to array
            options = [
              q.options.A || q.options.a || "",
              q.options.B || q.options.b || "",
              q.options.C || q.options.c || "",
              q.options.D || q.options.d || "",
            ];
          } else {
            options = ["", "", "", ""];
          }

          const question: Question = {
            id: questionId,
            question: q.question || "",
            options: options,
            correctAnswer: q.answer ? q.answer.charCodeAt(0) - 65 : 0, // Convert A,B,C,D to 0,1,2,3
            answer: q.answer,
            type: "single",
            illustrationImage: q.illustrationImage || undefined,
          };
          allQuestions.push(question);
        } else if (partIndex === 1) {
          // PHẦN II - Yes/No questions (parts[1])
          const question: YesNoQuestion = {
            id: questionId,
            question: q.question || "",
            statements: q.statements || {
              a: { text: "", answer: true },
              b: { text: "", answer: false },
              c: { text: "", answer: true },
              d: { text: "", answer: false },
            },
            type: "yes-no",
            illustrationImage: q.illustrationImage || undefined,
          };
          allYesNoQuestions.push(question);
        } else if (partIndex === 2) {
          // PHẦN III - Short answer questions (parts[2])
          const question: ShortQuestion = {
            id: questionId,
            question: q.question || "",
            answer: q.answer || "",
            type: "short",
            illustrationImage: q.illustrationImage || undefined,
          };
          allShortQuestions.push(question);
        }
      });
    });

    // Update state
    setExamQuestions(allQuestions);
    setExamYesNoQuestions(allYesNoQuestions);
    setExamShortQuestions(allShortQuestions);
    setHasUnsavedChanges(true);
  };

  const value: ExamContextType = {
    basicExamInfo,
    examQuestions,
    examYesNoQuestions,
    examShortQuestions,
    updateBasicExamInfo,
    updateQuestion,
    updateYesNoQuestion,
    updateShortQuestion,
    deleteQuestion,
    deleteYesNoQuestion,
    deleteShortQuestion,
    addQuestion,
    addYesNoQuestion,
    addShortQuestion,
    addQuestionWithData,
    addYesNoQuestionWithData,
    addShortQuestionWithData,
    updateQuestionImage,
    updateYesNoQuestionImage,
    updateShortQuestionImage,
    setExamFromApiResponse,
    clearExamData,
    clearLocalStorage,
    hasUnsavedChanges,
    markAsSaved,
    disableReloadWarning,
    setDisableReloadWarning,
  };

  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
};
