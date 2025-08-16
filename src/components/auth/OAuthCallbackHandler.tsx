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
      // Kiểm tra xem có OAuth callback parameters không
      if (typeof window === "undefined") return;

      console.log("=== OAuth Callback Debug ===");
      console.log("Current URL:", window.location.href);
      console.log("Search params:", window.location.search);
      console.log("Hash:", window.location.hash);

      // Kiểm tra authorization code trong query parameters (PKCE flow)
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get("code");
      const error = searchParams.get("error");

      // Kiểm tra access token trong hash fragment (implicit flow)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const hashError = hashParams.get("error");

      // Xử lý lỗi từ cả hai flow
      if (error || hashError) {
        console.error("OAuth error:", error || hashError);
        toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
        // Clear URL
        window.history.replaceState(null, "", window.location.pathname);
        return;
      }

      // Xử lý authorization code (PKCE flow)
      if (code) {
        console.log("Tìm thấy authorization code, đang xử lý PKCE flow...");

        try {
          // Dynamic import để tránh lỗi build
          const { supabase } = await import("@/config/supabaseClient");

          // Exchange code for session
          const { data, error: sessionError } =
            await supabase.auth.exchangeCodeForSession(code);

          if (sessionError || !data.session) {
            console.error("Lỗi exchange code:", sessionError);
            toast.error("Lỗi xác thực. Vui lòng thử lại.");
            window.history.replaceState(null, "", window.location.pathname);
            return;
          }

          console.log("PKCE session data:", data.session);

          // Clear URL immediately
          window.history.replaceState(null, "", window.location.pathname);

          // Process the login with access token
          handleLoginWithToken(data.session.access_token);
        } catch (error) {
          console.error("PKCE flow error:", error);
          toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
          window.history.replaceState(null, "", window.location.pathname);
        }

        return;
      }

      // Xử lý access token (implicit flow)
      if (accessToken) {
        console.log(
          "Tìm thấy access token trong URL fragment, đang xử lý implicit flow..."
        );

        // Clear the hash immediately to clean up URL
        window.history.replaceState(null, "", window.location.pathname);

        // Process the login
        handleLoginWithToken(accessToken);
      }
    };

    const handleLoginWithToken = (token: string) => {
      mutate(
        { token },
        {
          onSuccess: (res) => {
            console.log(res.data, "Google login response");
            handleLoginSuccess(res);
          },
          onError: (error) => {
            console.error("Login error:", error);
            toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
          },
        }
      );
    };

    const handleLoginSuccess = (res: any) => {
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
    };

    handleOAuthCallback();
  }, [router, mutate, setUser]);

  // This component doesn't render anything
  return null;
};
