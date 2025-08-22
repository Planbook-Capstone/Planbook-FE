"use client";

import React from 'react';
import { useRecentFiles, RecentFile } from './recentFilesStore';

// Types cho các loại file cụ thể
export interface ExamData {
  id: number;
  userId: string;
  academicYearId: number;
  type: "EXAM";
  source: string;
  templateId?: number | null;
  lessonIds?: number[];
  name: string;
  description: string;
  data: {
    parts: ExamPart[];
  };
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExamPart {
  part: string;
  title: string;
  questions: ExamQuestion[];
}

export interface ExamQuestion {
  id: string;
  answer?: string;
  options?: Record<string, string>;
  question: string;
  explanation?: string;
  questionNumber: number;
  difficultyLevel?: string;
}

export interface LessonPlanData {
  id: number;
  title: string;
  subject?: string;
  grade?: number;
  children: LessonPlanNode[];
  [key: string]: any;
}

export interface LessonPlanNode {
  id: string;
  type: 'SECTION' | 'SUBSECTION' | 'TEXT' | 'LIST_ITEM' | 'TABLE' | 'IMAGE';
  title?: string;
  content?: string;
  children?: LessonPlanNode[];
  [key: string]: any;
}

// Hook chuyên dụng cho Recent Files với helper methods
export const useRecentFilesWithHelpers = () => {
  const recentFilesStore = useRecentFiles();

  // Helper methods cho Exam
  const openExamFile = (examData: ExamData) => {
    recentFilesStore.openFile({
      id: `exam-${examData.id}`,
      name: examData.name,
      path: `/exam/${examData.id}`,
      data: examData,
      type: 'exam'
    });
  };

  const getExamFiles = (): RecentFile[] => {
    return recentFilesStore.getFilesByType('exam');
  };

  const updateExamData = (examId: number, newExamData: Partial<ExamData>) => {
    const fileId = `exam-${examId}`;
    const existingFile = recentFilesStore.getFile(fileId);
    if (existingFile) {
      const updatedData = { ...existingFile.data, ...newExamData };
      recentFilesStore.updateFile(fileId, updatedData);
    }
  };

  // Helper methods cho Lesson Plan
  const openLessonPlanFile = (lessonPlanData: LessonPlanData) => {
    recentFilesStore.openFile({
      id: `lesson-plan-${lessonPlanData.id}`,
      name: lessonPlanData.title,
      path: `/lesson-plan/${lessonPlanData.id}`,
      data: lessonPlanData,
      type: 'lesson-plan'
    });
  };

  const getLessonPlanFiles = (): RecentFile[] => {
    return recentFilesStore.getFilesByType('lesson-plan');
  };

  const updateLessonPlanData = (lessonPlanId: number, newLessonPlanData: Partial<LessonPlanData>) => {
    const fileId = `lesson-plan-${lessonPlanId}`;
    const existingFile = recentFilesStore.getFile(fileId);
    if (existingFile) {
      const updatedData = { ...existingFile.data, ...newLessonPlanData };
      recentFilesStore.updateFile(fileId, updatedData);
    }
  };

  // Helper method để thêm question vào exam
  const addQuestionToExam = (examId: number, partIndex: number, question: ExamQuestion) => {
    const fileId = `exam-${examId}`;
    const existingFile = recentFilesStore.getFile(fileId);
    if (existingFile && existingFile.data.data?.parts?.[partIndex]) {
      const updatedData = { ...existingFile.data };
      updatedData.data.parts[partIndex].questions.push(question);
      recentFilesStore.updateFile(fileId, updatedData);
    }
  };

  // Helper method để thêm node vào lesson plan
  const addNodeToLessonPlan = (lessonPlanId: number, node: LessonPlanNode, parentId?: string) => {
    const fileId = `lesson-plan-${lessonPlanId}`;
    const existingFile = recentFilesStore.getFile(fileId);
    if (existingFile) {
      const updatedData = { ...existingFile.data };
      
      if (parentId) {
        // Thêm vào node con
        const findAndAddToParent = (nodes: LessonPlanNode[]): boolean => {
          for (const n of nodes) {
            if (n.id === parentId) {
              if (!n.children) n.children = [];
              n.children.push(node);
              return true;
            }
            if (n.children && findAndAddToParent(n.children)) {
              return true;
            }
          }
          return false;
        };
        findAndAddToParent(updatedData.children);
      } else {
        // Thêm vào root level
        updatedData.children.push(node);
      }
      
      recentFilesStore.updateFile(fileId, updatedData);
    }
  };

  // Helper method để lấy thống kê
  const getFileStats = () => {
    const examFiles = getExamFiles();
    const lessonPlanFiles = getLessonPlanFiles();
    
    return {
      totalFiles: recentFilesStore.recentFilesCount,
      examCount: examFiles.length,
      lessonPlanCount: lessonPlanFiles.length,
      otherCount: recentFilesStore.recentFilesCount - examFiles.length - lessonPlanFiles.length,
      lastExamOpened: examFiles[0] || null,
      lastLessonPlanOpened: lessonPlanFiles[0] || null
    };
  };

  // Helper method để search files
  const searchFiles = (searchTerm: string): RecentFile[] => {
    return recentFilesStore.recentFiles.filter(file => 
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (file.data.description && file.data.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  // Helper method để export file data
  const exportFileData = (fileId: string): string | null => {
    const file = recentFilesStore.getFile(fileId);
    if (file) {
      return JSON.stringify(file.data, null, 2);
    }
    return null;
  };

  // Helper method để import file data
  const importFileData = (fileData: string): boolean => {
    try {
      const parsedData = JSON.parse(fileData);

      // Detect file type and create appropriate file
      if (parsedData.type === 'EXAM' && parsedData.data?.parts) {
        openExamFile(parsedData as ExamData);
        return true;
      } else if (parsedData.children && Array.isArray(parsedData.children)) {
        openLessonPlanFile(parsedData as LessonPlanData);
        return true;
      } else {
        // Generic file
        recentFilesStore.openFile({
          id: `imported-${Date.now()}`,
          name: parsedData.name || `Imported File ${Date.now()}`,
          path: parsedData.path || `/imported/${Date.now()}`,
          data: parsedData,
          type: 'imported'
        });
        return true;
      }
    } catch (error) {
      console.error('Error importing file data:', error);
      return false;
    }
  };

  // Helper method để thêm file từ API response (với debounce để tránh duplicate)
  const addFileFromApiResponse = React.useCallback((apiResponse: any, fileType: 'exam' | 'lesson-plan' | 'slide' | 'other' = 'other') => {
    // Kiểm tra xem file đã tồn tại chưa để tránh duplicate
    const fileId = `${fileType}-${apiResponse.id}`;
    const existingFile = recentFilesStore.getFile(fileId);

    // Nếu file đã tồn tại và được thêm trong vòng 5 giây qua thì bỏ qua
    if (existingFile && (Date.now() - existingFile.lastOpened) < 5000) {
      return;
    }
    // Chuẩn hóa data trước khi lưu
    const normalizedData = {
      ...apiResponse,
      // Đảm bảo có timestamp
      viewedAt: Date.now(),
      // Thêm metadata
      metadata: {
        fileType,
        originalType: apiResponse.type,
        source: 'my-library',
        ...apiResponse.metadata
      }
    };

    if (fileType === 'exam' && (apiResponse.type === 'EXAM' || apiResponse.data?.parts)) {
      // Xử lý exam file
      const examData: ExamData = {
        id: apiResponse.id,
        userId: apiResponse.userId || 'unknown',
        academicYearId: apiResponse.academicYearId || 1,
        type: 'EXAM',
        source: apiResponse.source || 'USER',
        templateId: apiResponse.templateId,
        lessonIds: apiResponse.lessonIds || [],
        name: apiResponse.name || `Exam ${apiResponse.id}`,
        description: apiResponse.description || '',
        data: apiResponse.data || { parts: [] },
        status: apiResponse.status || 'ACTIVE',
        createdAt: apiResponse.createdAt,
        updatedAt: apiResponse.updatedAt,
        ...normalizedData
      };
      openExamFile(examData);
    } else if (fileType === 'lesson-plan' && (apiResponse.type === 'LESSON_PLAN' || apiResponse.data?.children || apiResponse.children)) {
      // Xử lý lesson plan file
      const lessonPlanData: LessonPlanData = {
        id: apiResponse.id,
        title: apiResponse.name || apiResponse.title || `Lesson Plan ${apiResponse.id}`,
        subject: apiResponse.lesson?.subject || apiResponse.subject,
        grade: apiResponse.lesson?.grade || apiResponse.grade,
        children: apiResponse.data?.children || apiResponse.children || [],
        ...normalizedData
      };
      openLessonPlanFile(lessonPlanData);
    } else {
      // Generic file from API (slide, other...)
      recentFilesStore.openFile({
        id: fileId,
        name: apiResponse.name || apiResponse.title || `${fileType} ${apiResponse.id || Date.now()}`,
        path: apiResponse.path || `/my-library/file/${apiResponse.id}`,
        data: normalizedData,
        type: fileType
      });
    }
  }, [recentFilesStore]);

  return {
    // Original store methods
    ...recentFilesStore,
    
    // Exam helpers
    openExamFile,
    getExamFiles,
    updateExamData,
    addQuestionToExam,
    
    // Lesson Plan helpers
    openLessonPlanFile,
    getLessonPlanFiles,
    updateLessonPlanData,
    addNodeToLessonPlan,
    
    // Utility helpers
    getFileStats,
    searchFiles,
    exportFileData,
    importFileData,
    addFileFromApiResponse,
  };
};

// Export types
export type { RecentFile };
