"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { DEFAULT_ROLE } from "@/config/roles";

// Define role types
export type UserRole = "admin" | "staff";

// Define context interface
interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAdmin: boolean;
  isStaff: boolean;
}

// Create context
const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Provider component
interface RoleProviderProps {
  children: ReactNode;
  defaultRole?: UserRole;
}

export function RoleProvider({
  children,
  defaultRole = DEFAULT_ROLE,
}: RoleProviderProps) {
  const [role, setRole] = useState<UserRole>(defaultRole);

  const value: RoleContextType = {
    role,
    setRole,
    isAdmin: role === "admin",
    isStaff: role === "staff",
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

// Custom hook to use role context
export function useRole(): RoleContextType {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}

// Helper hook for permissions
export function usePermissions() {
  const { role, isAdmin, isStaff } = useRole();

  return {
    role,
    isAdmin,
    isStaff,
    // Permission helpers
    canEdit: isStaff,
    canDelete: isStaff,
    canCreate: isStaff,
    canSave: isStaff,
    canDrag: isStaff,
    canViewOnly: isAdmin,
  };
}
