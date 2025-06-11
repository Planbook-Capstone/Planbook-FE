"use client";
// pages/auth/callback.tsx
import { useEffect } from "react";

import { supabase } from "@/config/supabaseClient";
import { useLoginGoogleService } from "@/services/userService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { da } from "date-fns/locale";

const Callback = () => {
  const router = useRouter();
  const { mutate } = useLoginGoogleService();

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        console.error("Lỗi xác thực hoặc không có session:", error);
        return;
      }
      //   console.log(data.session, "session");
      const idToken = data.session.access_token; // token lấy từ Google

      console.log(data.session," session data");
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
            console.log(res.data, "tran");
            toast.success("Đăng nhập thành công");
          },
          onError: () => {
            toast.error(
              "Đăng nhập thất bại.Vui lòng kiểm tra kĩ thông tin đăng nhập"
            );
          },
        }
      ); // truyền giá trị email + password

      // Gửi token về Spring Boot để xác thực
      //   const res = await fetch("http://localhost:8080/api/auth/google", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({ token: idToken }),
      //   });

      //   const result = await res.json();
      //   console.log("Phản hồi từ backend:", result);

      //   // ✅ Lưu thông tin hoặc chuyển hướng
      //   // Ví dụ: Lưu vào localStorage rồi chuyển về trang chính
      //   localStorage.setItem("accessToken", result.token);
      //   router.push("/"); // chuyển hướng sau khi đăng nhập xong
    };

    handleAuth();
  }, [router]);

  return <p>Đang đăng nhập...</p>;
};

export default Callback;
