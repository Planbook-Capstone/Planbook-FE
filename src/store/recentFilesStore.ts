"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Interface cho file được mở gần nhất
export interface RecentFile {
  id: string; // unique identifier cho file
  name: string; // tên file
  path: string; // đường dẫn file
  data: any; // data của file (có thể là object, string, array...)
  lastOpened: number; // timestamp khi file được mở lần cuối
  type?: string; // loại file (optional)
}

// Interface cho store state
interface RecentFilesState {
  recentFiles: RecentFile[];
  
  // Actions
  addRecentFile: (file: Omit<RecentFile, 'lastOpened'>) => void;
  removeRecentFile: (fileId: string) => void;
  clearRecentFiles: () => void;
  getRecentFile: (fileId: string) => RecentFile | undefined;
  updateFileData: (fileId: string, newData: any) => void;
  getRecentFilesByType: (type: string) => RecentFile[];
}

// Tạo Zustand store với localStorage persistence
export const useRecentFilesStore = create<RecentFilesState>()(
  persist(
    (set, get) => ({
      // Initial state
      recentFiles: [],

      // Thêm file mới vào danh sách recent files
      addRecentFile: (file) => set((state) => {
        const now = Date.now();
        const existingFileIndex = state.recentFiles.findIndex(f => f.id === file.id);
        
        let updatedFiles: RecentFile[];
        
        if (existingFileIndex !== -1) {
          // Nếu file đã tồn tại, cập nhật thời gian và data, đưa lên đầu
          updatedFiles = [...state.recentFiles];
          updatedFiles[existingFileIndex] = {
            ...file,
            lastOpened: now
          };
          // Di chuyển file lên đầu danh sách
          const [updatedFile] = updatedFiles.splice(existingFileIndex, 1);
          updatedFiles.unshift(updatedFile);
        } else {
          // Nếu file mới, thêm vào đầu danh sách
          const newFile: RecentFile = {
            ...file,
            lastOpened: now
          };
          updatedFiles = [newFile, ...state.recentFiles];
        }
        
        // Giữ chỉ 10 file gần nhất
        if (updatedFiles.length > 10) {
          updatedFiles = updatedFiles.slice(0, 10);
        }
        
        return { recentFiles: updatedFiles };
      }),

      // Xóa file khỏi danh sách recent files
      removeRecentFile: (fileId) => set((state) => ({
        recentFiles: state.recentFiles.filter(file => file.id !== fileId)
      })),

      // Xóa tất cả recent files
      clearRecentFiles: () => set({ recentFiles: [] }),

      // Lấy thông tin file theo ID
      getRecentFile: (fileId) => {
        const { recentFiles } = get();
        return recentFiles.find(file => file.id === fileId);
      },

      // Cập nhật data của file
      updateFileData: (fileId, newData) => set((state) => ({
        recentFiles: state.recentFiles.map(file => 
          file.id === fileId 
            ? { ...file, data: newData, lastOpened: Date.now() }
            : file
        )
      })),

      // Lấy danh sách file theo loại
      getRecentFilesByType: (type) => {
        const { recentFiles } = get();
        return recentFiles.filter(file => file.type === type);
      },
    }),
    {
      name: 'recent-files-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Persist toàn bộ state
      partialize: (state) => ({
        recentFiles: state.recentFiles
      }),
    }
  )
);

// Hook helper để sử dụng dễ dàng hơn
export const useRecentFiles = () => {
  const store = useRecentFilesStore();
  
  return {
    // State
    recentFiles: store.recentFiles,
    
    // Actions với tên dễ hiểu hơn
    openFile: store.addRecentFile,
    closeFile: store.removeRecentFile,
    clearAll: store.clearRecentFiles,
    getFile: store.getRecentFile,
    updateFile: store.updateFileData,
    getFilesByType: store.getRecentFilesByType,
    
    // Computed values
    hasRecentFiles: store.recentFiles.length > 0,
    recentFilesCount: store.recentFiles.length,
    
    // Helper methods
    getMostRecentFile: () => store.recentFiles[0] || null,
    getOldestFile: () => store.recentFiles[store.recentFiles.length - 1] || null,
  };
};

// Export types để sử dụng ở nơi khác
export type { RecentFile, RecentFilesState };
