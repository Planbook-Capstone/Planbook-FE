"use client";
// pages/auth/callback.tsx
import { useEffect } from "react";

import { supabase } from "@/config/supabaseClient";
import { useLoginGoogleService } from "@/services/userService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { da } from "date-fns/locale";
import { useAppStore } from "@/store";
import Loading from "@/components/ui/loading";

const Callback = () => {
  const router = useRouter();
  const { mutate } = useLoginGoogleService();
  const { setUser } = useAppStore();

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        console.error("Lỗi xác thực hoặc không có session:", error);
        return;
      }
      //   console.log(data.session, "session");
      const idToken = data.session.access_token; // token lấy từ Google

      console.log(data.session, " session data");
      //   console.log(idToken)

      if (!idToken) {
        console.error("Không lấy được provider_token từ session");
        return;
      }
      //   console.log(idToken, "idToken");
      mutate(
        { token: idToken },
        {
          onSuccess: (res) => {
            console.log(res.data, "Google login response");

            // Save user to Zustand store
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
            }

            toast.success("Đăng nhập thành công");
          },
          onError: () => {
            toast.error(
              "Đăng nhập thất bại.Vui lòng kiểm tra kĩ thông tin đăng nhập"
            );
          },
        }
      ); // truyền giá trị email + password
    };

    handleAuth();
  }, [router]);

  return (
    <div>
      <Loading />
    </div>
  );
};

export default Callback;
