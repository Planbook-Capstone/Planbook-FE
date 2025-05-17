"use client";

/**
 * This is a placeholder for your state management solution
 * You can replace this with Redux, Zustand, Jotai, or any other state management library
 */

import { createContext, useContext, useState, ReactNode } from "react";

// Define your state types
interface AppState {
  theme: "light" | "dark";
  user: User | null;
}

interface User {
  id: string;
  name: string;
  email: string;
}

// Define your actions
type Action =
  | { type: "SET_THEME"; payload: "light" | "dark" }
  | { type: "SET_USER"; payload: User | null };

// Create the initial state
const initialState: AppState = {
  theme: "light",
  user: null,
};

// Create the context
const AppContext = createContext<{
  state: AppState;
  dispatch: (action: Action) => void;
}>({
  state: initialState,
  dispatch: () => null,
});

// Create a reducer function
function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "SET_USER":
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

// Create a provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  const dispatch = (action: Action) => {
    setState(reducer(state, action));
  };

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppProvider");
  }
  return context;
}
