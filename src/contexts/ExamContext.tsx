'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Question } from '@/components/organisms/exam-question-item/types';
import { YesNoQuestion } from '@/components/organisms/yes-no-question-item/types';
import { ShortQuestion } from '@/components/organisms/short-question-item/types';

interface ExamContextType {
  examQuestions: Question[];
  examYesNoQuestions: YesNoQuestion[];
  examShortQuestions: ShortQuestion[];
  updateQuestion: (question: Question) => void;
  updateYesNoQuestion: (question: YesNoQuestion) => void;
  updateShortQuestion: (question: ShortQuestion) => void;
  deleteQuestion: (questionId: string) => void;
  deleteYesNoQuestion: (questionId: string) => void;
  deleteShortQuestion: (questionId: string) => void;
  addQuestion: () => void;
  addYesNoQuestion: () => void;
  addShortQuestion: () => void;
  updateQuestionImage: (questionId: string, imagePath: string) => void;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const useExamContext = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExamContext must be used within an ExamProvider');
  }
  return context;
};

interface ExamProviderProps {
  children: ReactNode;
}

export const ExamProvider: React.FC<ExamProviderProps> = ({ children }) => {
  const [examQuestions, setExamQuestions] = useState<Question[]>([
    {
      id: '1',
      question: 'Câu hỏi mẫu?',
      options: ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'],
      correctAnswer: 0,
      type: 'single'
    }
  ]);
  
  const [examYesNoQuestions, setExamYesNoQuestions] = useState<YesNoQuestion[]>([]);
  const [examShortQuestions, setExamShortQuestions] = useState<ShortQuestion[]>([]);

  const updateQuestion = (question: Question) => {
    setExamQuestions(prev => prev.map(q => q.id === question.id ? question : q));
  };

  const updateYesNoQuestion = (question: YesNoQuestion) => {
    setExamYesNoQuestions(prev => prev.map(q => q.id === question.id ? question : q));
  };

  const updateShortQuestion = (question: ShortQuestion) => {
    setExamShortQuestions(prev => prev.map(q => q.id === question.id ? question : q));
  };

  const deleteQuestion = (questionId: string) => {
    setExamQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const deleteYesNoQuestion = (questionId: string) => {
    setExamYesNoQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const deleteShortQuestion = (questionId: string) => {
    setExamShortQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      type: 'single'
    };
    setExamQuestions(prev => [...prev, newQuestion]);
  };

  const addYesNoQuestion = () => {
    const newQuestion: YesNoQuestion = {
      id: Date.now().toString(),
      question: '',
      statements: {
        a: { text: '', answer: true },
        b: { text: '', answer: false },
        c: { text: '', answer: true },
        d: { text: '', answer: false }
      },
      type: 'yes-no'
    };
    setExamYesNoQuestions(prev => [...prev, newQuestion]);
  };

  const addShortQuestion = () => {
    const newQuestion: ShortQuestion = {
      id: Date.now().toString(),
      question: '',
      answer: '',
      type: 'short'
    };
    setExamShortQuestions(prev => [...prev, newQuestion]);
  };

  const updateQuestionImage = (questionId: string, imagePath: string) => {
    setExamQuestions(prev => 
      prev.map(q => 
        q.id === questionId 
          ? { ...q, illustrationImage: imagePath }
          : q
      )
    );
  };

  const value: ExamContextType = {
    examQuestions,
    examYesNoQuestions,
    examShortQuestions,
    updateQuestion,
    updateYesNoQuestion,
    updateShortQuestion,
    deleteQuestion,
    deleteYesNoQuestion,
    deleteShortQuestion,
    addQuestion,
    addYesNoQuestion,
    addShortQuestion,
    updateQuestionImage,
  };

  return (
    <ExamContext.Provider value={value}>
      {children}
    </ExamContext.Provider>
  );
};
