"use client";
// pages/auth/callback.tsx
import { useEffect } from "react";

// Force dynamic rendering để tránh prerender trong build
export const dynamic = "force-dynamic";

import { useLoginGoogleService } from "@/services/userService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store";
import Loading from "@/components/ui/loading";

const Callback = () => {
  const router = useRouter();
  const { mutate } = useLoginGoogleService();
  const { setUser } = useAppStore();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Dynamic import để tránh lỗi build
        const { supabase } = await import("@/config/supabaseClient");

        // Kiểm tra nếu không có env vars thì redirect về trang chính
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
          console.warn(
            "Supabase không được cấu hình, chuyển hướng về trang chính"
          );
          router.push("/");
          return;
        }

        // Xử lý authentication callback
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Lỗi xác thực:", error);
          toast.error("Lỗi xác thực. Vui lòng thử lại.");
          router.push("/auth");
          return;
        }

        if (!data.session) {
          console.log("Không có session, đang xử lý callback...");

          // Kiểm tra URL fragments (implicit flow)
          const hashParams = new URLSearchParams(
            window.location.hash.substring(1)
          );
          const accessToken = hashParams.get("access_token");

          if (accessToken) {
            console.log("Tìm thấy access token trong URL fragment");
            // Xử lý implicit flow
            mutate(
              { token: accessToken },
              {
                onSuccess: (res) => {
                  console.log(res.data, "Google login response");
                  handleLoginSuccess(res);
                },
                onError: (error) => {
                  console.error("Login error:", error);
                  toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
                  router.push("/auth");
                },
              }
            );
            return;
          }

          // Nếu không có access token trong fragment, redirect về login
          console.log("Không tìm thấy session hoặc access token");
          router.push("/auth");
          return;
        }

        console.log(data.session, "session data");
        const idToken = data.session.access_token;

        if (!idToken) {
          console.error("Không lấy được access_token từ session");
          toast.error("Lỗi xác thực. Vui lòng thử lại.");
          router.push("/auth");
          return;
        }

        // Xử lý authorization code flow
        mutate(
          { token: idToken },
          {
            onSuccess: (res) => {
              console.log(res.data, "Google login response");
              handleLoginSuccess(res);
            },
            onError: (error) => {
              console.error("Login error:", error);
              toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
              router.push("/auth");
            },
          }
        );
      } catch (error) {
        console.error("Unexpected error in handleAuth:", error);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
        router.push("/auth");
      }
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
        router.push("/auth");
      }
    };

    handleAuth();
  }, [router, mutate, setUser]);

  return (
    <div>
      <Loading />
    </div>
  );
};

export default Callback;
