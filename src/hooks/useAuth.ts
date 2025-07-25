"use client";

import { useAppStore } from "@/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * Custom hook for authentication-related operations
 * Provides easy access to user data and auth actions
 */
export const useAuth = () => {
  const router = useRouter();
  const { 
    user, 
    setUser, 
    clearUser, 
    updateUser, 
    isAuthenticated 
  } = useAppStore();

  /**
   * Login user and redirect based on role
   */
  const login = (userData: any) => {
    setUser(userData);
    
    // Save to localStorage for backward compatibility
    localStorage.setItem("token", userData.token);
    localStorage.setItem("refreshToken", userData.refreshToken);
    
    // Route based on role
    if (userData.role === "ADMIN") {
      router.push("/admin");
    } else if (userData.role === "STAFF") {
      router.push("/staff");
    } else {
      router.push("/home");
    }
    
    toast.success("Đăng nhập thành công");
  };

  /**
   * Logout user and redirect to auth page
   */
  const logout = () => {
    clearUser();
    
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    
    toast.success("Đăng xuất thành công");
    router.push("/auth");
  };

  /**
   * Check if user has specific role
   */
  const hasRole = (role: string) => {
    return user?.role === role;
  };

  /**
   * Check if user is admin
   */
  const isAdmin = () => hasRole("ADMIN");

  /**
   * Check if user is staff
   */
  const isStaff = () => hasRole("STAFF");

  /**
   * Get user's display name
   */
  const getDisplayName = () => {
    return user?.fullName || user?.username || user?.email || "User";
  };

  /**
   * Get user's avatar URL or fallback
   */
  const getAvatarUrl = () => {
    return user?.avatar || null;
  };

  /**
   * Get user's initials for avatar fallback
   */
  const getInitials = () => {
    const name = getDisplayName();
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return {
    // User data
    user,
    isAuthenticated: isAuthenticated(),
    
    // Actions
    login,
    logout,
    updateUser,
    
    // Role checks
    hasRole,
    isAdmin: isAdmin(),
    isStaff: isStaff(),
    
    // User info helpers
    displayName: getDisplayName(),
    avatarUrl: getAvatarUrl(),
    initials: getInitials(),
  };
};
