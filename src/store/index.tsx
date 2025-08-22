"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define user interface with all fields
interface User {
  id: string;
  fullName: string | null;
  username: string;
  email: string;
  role: string;
  phone: string | null;
  avatar: string | null;
  gender: string | null;
  birthday: string | null;
  status: string | null;
  createdAt: string;
  updatedAt: string;
  token: string;
  refreshToken: string;
}

// Define app state interface
interface AppState {
  theme: "light" | "dark";
  user: User | null;
  // Actions
  setTheme: (theme: "light" | "dark") => void;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  updateUser: (updates: Partial<User>) => void;
  isAuthenticated: () => boolean;
}

// Create Zustand store with localStorage persistence
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: "light",
      user: null,

      // Actions
      setTheme: (theme) => set({ theme }),

      setUser: (user) => set({ user }),

      clearUser: () => set({ user: null }),

      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),

      isAuthenticated: () => {
        const { user } = get();
        return user !== null && user.token !== null;
      },
    }),
    {
      name: 'planbook-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist user data and theme
      partialize: (state) => ({
        user: state.user,
        theme: state.theme
      }),
    }
  )
);

// Legacy AppProvider for backward compatibility (can be removed if not needed)
export function AppProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Legacy hook for backward compatibility (can be removed if not needed)
export function useAppState() {
  const store = useAppStore();
  return {
    state: {
      theme: store.theme,
      user: store.user,
    },
    dispatch: (action: any) => {
      switch (action.type) {
        case "SET_THEME":
          store.setTheme(action.payload);
          break;
        case "SET_USER":
          store.setUser(action.payload);
          break;
      }
    },
  };
}

// Export recent files store
export * from './recentFilesStore';
export * from './recentFilesHelpers';
