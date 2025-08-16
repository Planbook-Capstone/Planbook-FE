"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLoginGoogleService } from "@/services/userService";
import { useAppStore } from "@/store";
import { toast } from "sonner";

export const OAuthCallbackHandler = () => {
  const router = useRouter();
  const { mutate } = useLoginGoogleService();
  const { setUser } = useAppStore();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Kiểm tra xem có access token trong URL fragment không
      if (typeof window === "undefined") return;

      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const error = hashParams.get("error");

      if (error) {
        console.error("OAuth error:", error);
        toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
        // Clear the hash
        window.history.replaceState(null, "", window.location.pathname);
        return;
      }

      if (accessToken) {
        console.log("Tìm thấy access token trong URL fragment, đang xử lý...");
        
        // Clear the hash immediately to clean up URL
        window.history.replaceState(null, "", window.location.pathname);

        // Process the login
        mutate(
          { token: accessToken },
          {
            onSuccess: (res) => {
              console.log(res.data, "Google login response");

              if (res?.data?.data) {
                setUser(res.data.data);

                // Save to localStorage for backward compatibility
                localStorage.setItem("token", res.data.data.token);
                localStorage.setItem("refreshToken", res.data.data.refreshToken);

                // Route based on role
                if (res.data.data.role === "ADMIN") {
                  router.push("/admin");
                } else if (res.data.data.role === "STAFF") {
                  router.push("/staff");
                } else {
                  router.push("/home");
                }

                toast.success("Đăng nhập thành công");
              } else {
                toast.error("Không thể lấy thông tin người dùng");
              }
            },
            onError: (error) => {
              console.error("Login error:", error);
              toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
            },
          }
        );
      }
    };

    handleOAuthCallback();
  }, [router, mutate, setUser]);

  // This component doesn't render anything
  return null;
};
