"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the matrix data structure for a single lesson
export interface LessonMatrixData {
  lessonID: string;
  distribution: {
    [partKey: string]: {
      [levelId: string]: number;
    };
  };
  total: number;
  timestamp: number; // When this data was saved
}

// Define the input history state interface
interface InputHistoryState {
  // Dictionary with lesson ID as key and matrix data as value
  lessonHistory: { [lessonId: string]: LessonMatrixData };

  // Actions
  saveLessonInput: (lessonId: string, matrixData: LessonMatrixData) => void;
  getLessonInput: (lessonId: string) => LessonMatrixData | null;
  removeLessonInput: (lessonId: string) => void;
  clearAllHistory: () => void;
  hasLessonHistory: (lessonId: string) => boolean;
  getAllLessonIds: () => string[];
  getHistoryCount: () => number;
}

// Maximum number of lessons to keep in history
const MAX_HISTORY_COUNT = 20;

// Create Zustand store with localStorage persistence
export const useInputHistoryStore = create<InputHistoryState>()(
  persist(
    (set, get) => ({
      // Initial state
      lessonHistory: {},

      // Actions
      saveLessonInput: (lessonId: string, matrixData: LessonMatrixData) => {
        set((state) => {
          const newHistory = { ...state.lessonHistory };

          // Add or update the lesson data
          newHistory[lessonId] = {
            ...matrixData,
            timestamp: Date.now(),
          };

          // Check if we exceed the maximum count
          const historyEntries = Object.entries(newHistory);
          if (historyEntries.length > MAX_HISTORY_COUNT) {
            // Sort by timestamp (oldest first) and remove the oldest entries
            const sortedEntries = historyEntries.sort((a, b) => a[1].timestamp - b[1].timestamp);
            const entriesToKeep = sortedEntries.slice(-MAX_HISTORY_COUNT);

            // Create new history with only the entries to keep
            const limitedHistory: { [lessonId: string]: LessonMatrixData } = {};
            entriesToKeep.forEach(([id, data]) => {
              limitedHistory[id] = data;
            });

            return { lessonHistory: limitedHistory };
          }

          return { lessonHistory: newHistory };
        });
      },

      getLessonInput: (lessonId: string) => {
        const { lessonHistory } = get();
        return lessonHistory[lessonId] || null;
      },

      removeLessonInput: (lessonId: string) => {
        set((state) => {
          const newHistory = { ...state.lessonHistory };
          delete newHistory[lessonId];
          return { lessonHistory: newHistory };
        });
      },

      clearAllHistory: () => {
        set({ lessonHistory: {} });
      },

      hasLessonHistory: (lessonId: string) => {
        const { lessonHistory } = get();
        return lessonId in lessonHistory;
      },

      getAllLessonIds: () => {
        const { lessonHistory } = get();
        return Object.keys(lessonHistory);
      },

      getHistoryCount: () => {
        const { lessonHistory } = get();
        return Object.keys(lessonHistory).length;
      },
    }),
    {
      name: 'planbook-input-history', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Persist all state
      partialize: (state) => ({
        lessonHistory: state.lessonHistory,
      }),
    }
  )
);

// Helper function to create matrix data from current matrix row
export const createLessonMatrixData = (
  lessonID: string,
  distribution: any,
  total: number
): LessonMatrixData => ({
  lessonID,
  distribution,
  total,
  timestamp: Date.now(),
});

// Helper function to check if two matrix data are similar (for comparison)
export const isMatrixDataSimilar = (
  data1: LessonMatrixData,
  data2: LessonMatrixData
): boolean => {
  if (data1.lessonID !== data2.lessonID) return false;
  if (data1.total !== data2.total) return false;
  
  // Deep compare distribution
  const parts1 = Object.keys(data1.distribution);
  const parts2 = Object.keys(data2.distribution);
  
  if (parts1.length !== parts2.length) return false;
  
  for (const part of parts1) {
    if (!data2.distribution[part]) return false;
    
    const levels1 = Object.keys(data1.distribution[part]);
    const levels2 = Object.keys(data2.distribution[part]);
    
    if (levels1.length !== levels2.length) return false;
    
    for (const level of levels1) {
      if (data1.distribution[part][level] !== data2.distribution[part][level]) {
        return false;
      }
    }
  }
  
  return true;
};
