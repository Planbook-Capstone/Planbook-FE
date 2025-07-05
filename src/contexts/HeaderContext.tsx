"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";
import type { BreadcrumbItem } from "@/components/ui/BreadcrumbTrail";

export interface HeaderAction {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost" | "destructive";
}

interface HeaderContextType {
  breadcrumbs: BreadcrumbItem[];
  actions: HeaderAction[];
  hideDefaultHeader: boolean;
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
  setActions: (actions: HeaderAction[]) => void;
  setHideDefaultHeader: (hide: boolean) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

interface HeaderProviderProps {
  children: ReactNode;
}

export function HeaderProvider({ children }: HeaderProviderProps) {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [actions, setActions] = useState<HeaderAction[]>([]);
  const [hideDefaultHeader, setHideDefaultHeader] = useState(false);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      breadcrumbs,
      actions,
      hideDefaultHeader,
      setBreadcrumbs,
      setActions,
      setHideDefaultHeader,
    }),
    [breadcrumbs, actions, hideDefaultHeader]
  );

  return (
    <HeaderContext.Provider value={contextValue}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
}
