"use client";

import React, { Suspense, lazy } from "react";

const LoginForm = lazy(() => import("./components/LoginForm"));
const RegisterForm = lazy(() => import("./components/RegisterForm"));
const ForgotPasswordForm = lazy(
  () => import("./components/ForgotPasswordForm")
);
const RegisterOptions = lazy(() => import("./components/RegisterOptions"));
import Image from "next/image";
import {
  useForgotPasswordService,
  useRegisterService,
  useUserServices,
  useVerifyUserService,
} from "@/services/userService";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "@/store";

// Force dynamic rendering để tránh prerender trong build
export const dynamic = "force-dynamic";

const LoginPage = () => {
  const { mutate } = useUserServices();
  const { mutate: register } = useRegisterService();

  const [isRegister, setIsRegister] = React.useState(false);
  const [showRegisterOptions, setShowRegisterOptions] = React.useState(false);
  const [showForgotPassword, setShowForgotPassword] = React.useState(false);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { setUser } = useAppStore();

  // Get token from URL params
  const token = searchParams.get("token");

  // Use verify service with token
  const {
    data: verifyData,
    isLoading: isVerifyLoading,
    error: verifyError,
  } = useVerifyUserService(token || undefined);

  // Set verifying state when token exists
  React.useEffect(() => {
    if (token) {
      setIsVerifying(true);
    }
  }, [token]);

  // Handle verification result
  React.useEffect(() => {
    if (verifyData && token) {
      toast.success(
        "Xác thực tài khoản thành công! Bạn có thể đăng nhập ngay."
      );
      // Remove token from URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
      setIsVerifying(false);
    }
  }, [verifyData, token]);

  React.useEffect(() => {
    if (verifyError && token) {
      toast.error(
        "Xác thực tài khoản thất bại. Vui lòng thử lại hoặc liên hệ hỗ trợ."
      );
      // Remove token from URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
      setIsVerifying(false);
    }
  }, [verifyError, token]);

  const onFinish = (values: any) => {
    mutate(values, {
      onSuccess: (data) => {
        toast.success("Đăng nhập thành công");

        // Save to Zustand store (exclude wallet field)
        const { wallet, ...userDataWithoutWallet } = data?.data?.data || {};
        setUser(userDataWithoutWallet);

        // Keep localStorage for backward compatibility
        localStorage.setItem("token", data?.data?.data?.token);
        localStorage.setItem("refreshToken", data?.data?.data?.refreshToken);

        // Keep React Query for backward compatibility
        queryClient.setQueryData(["currentUser"], data?.data?.data);

        // Route based on role
        if (data.data.data.role === "ADMIN") {
          router.push("/admin");
        } else if (data.data.data.role === "STAFF") {
          router.push("/staff/textbook");
        } else if (data.data.data.role === "PARTNER") {
          router.push("/tool-manager/dashboard");
        } else {
          router.push("/home");
        }
      },
      onError: (response) => {
        toast.error(
          `${
            response?.response?.data ||
            "Đăng nhập thất bại.Vui lòng kiểm tra kĩ thông tin đăng nhập"
          }`
        );
      },
    });
  };

  const onRegisterFinish = (values: any) => {
    const payload = {
      fullName: values.fullName,
      email: values.email,
      username: values.username,
      password: values.password,
    };

    register(payload, {
      onSuccess: (data) => {
        toast.success(
          "Đăng ký thành công! Vui lòng vào mail xác thực tài khoản."
        );

        setIsRegister(false);
        setShowRegisterOptions(false);
      },
      onError: (response) => {
        toast.error(
          `${
            response?.response?.data ||
            "Đăng ký thất bại.Vui lòng kiểm tra kĩ thông tin đăng ký"
          }`
        );
      },
    });
  };

  const handleShowRegisterOptions = () => {
    setShowRegisterOptions(true);
    setIsRegister(false);
  };

  const handleRegisterWithCredentials = () => {
    setIsRegister(true);
    setShowRegisterOptions(false);
  };

  const handleRegisterWithGoogle = () => {
    // Tạm thời back to login
    toast.info("Đăng ký với Google - Coming soon!");
    setShowRegisterOptions(false);
    setIsRegister(false);
  };

  const handleBackToLogin = () => {
    setIsRegister(false);
    setShowRegisterOptions(false);
    setShowForgotPassword(false);
  };

  const handleShowForgotPassword = () => {
    setShowForgotPassword(true);
    setIsRegister(false);
    setShowRegisterOptions(false);
  };

  const { mutate: forgotPassword } = useForgotPasswordService();

  const onForgotPasswordFinish = (values: any) => {
    forgotPassword(values, {
      onSuccess: () => {
        toast.success("Đã gửi email khôi phục mật khẩu đến: " + values.email);
        setShowForgotPassword(false);
      },
      onError: () => {
        toast.error("Gửi email khôi phục mật khẩu thất bại.Vui lòng thử lại");
      },
    });

    setShowForgotPassword(false);
  };

  const loginGG = async () => {
    // Dynamic import để tránh lỗi build
    const { supabase } = await import("@/config/supabaseClient");

    // Kiểm tra nếu không có env vars
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      toast.error("Chức năng đăng nhập Google chưa được cấu hình");
      return;
    }

    await supabase?.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: process.env.NEXT_PUBLIC_REDIRECT_URL,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  };
  return (
    <div className="h-screen">
      <div className="hidden lg:block w-full">
        {/* Background */}
        <div className="absolute z-0 top-[2rem] left-[2rem] h-[calc(100vh-4rem)] w-[calc(100vw-4rem)] rounded-3xl overflow-hidden">
          <Image
            src="/images/background/loginBG.svg"
            alt="Login background"
            fill
            fetchPriority="high"
            priority
            className="object-cover [object-position:right_bottom]"
          />
        </div>
        <div className="absolute bottom-[2rem] right-[3rem] z-0">
          <div
            className="flex gap-3 pb-10 cursor-pointer"
            onClick={() => router.back()}
          >
            <div className="relative w-15 h-15">
              <Image
                src="/images/logo/logoDark.svg"
                alt="PlanBook Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h3 className="font-calsans text-xl">Planbook</h3>
              <h3 className="font-questrial text-lg">
                ©Copyright Planbook 2025
              </h3>
            </div>
          </div>
        </div>
      </div>
      {/* Login Form */}
      <div className="absolute h-full flex items-center lg:pl-[8rem] justify-end gap-28">
        <div className="min-h-fit flex items-center justify-center bg-white px-4 py-10 z-10 rounded-md">
          <div
            className={`w-full space-y-6 px-4 transition-all duration-300 ${
              showRegisterOptions || isRegister || showForgotPassword
                ? "min-w-sm"
                : "max-w-sm"
            }`}
          >
            <div>
              <h1 className="text-2xl font-questrial text-gray-900">
                {isVerifying ? (
                  <>
                    Đang xác thực{" "}
                    <span className="font-calsans text-gray-900">
                      tài khoản
                    </span>
                  </>
                ) : showRegisterOptions ? (
                  <>
                    Chọn phương thức{" "}
                    <span className="font-calsans text-gray-900">đăng ký</span>
                  </>
                ) : isRegister ? (
                  <>
                    Tạo tài khoản{" "}
                    <span className="font-calsans text-gray-900">mới</span>
                  </>
                ) : showForgotPassword ? (
                  <>
                    Khôi phục{" "}
                    <span className="font-calsans text-gray-900">mật khẩu</span>
                  </>
                ) : (
                  <>
                    Chào mừng{" "}
                    <span className="font-calsans text-gray-900">
                      quay trở lại
                    </span>
                  </>
                )}
              </h1>
              <p className="mt-2 text-sm text-gray-500 font-questrial">
                {isVerifying
                  ? "Vui lòng chờ trong khi chúng tôi xác thực tài khoản của bạn..."
                  : showRegisterOptions
                  ? "Chọn cách bạn muốn tạo tài khoản mới."
                  : isRegister
                  ? "Điền thông tin để tạo tài khoản mới."
                  : showForgotPassword
                  ? "Nhập email để nhận liên kết khôi phục mật khẩu."
                  : "Nhập tên đăng nhập và mật khẩu để đăng nhập vào tài khoản."}
              </p>
            </div>

            <Suspense
              fallback={
                <div className="flex flex-col items-center justify-center space-y-4 py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
                </div>
              }
            >
              {isVerifying ? (
                <div className="flex flex-col items-center justify-center space-y-4 py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
                  <p className="text-sm text-gray-600 font-questrial">
                    Đang xác thực tài khoản...
                  </p>
                </div>
              ) : showRegisterOptions ? (
                <RegisterOptions
                  onRegisterWithCredentials={handleRegisterWithCredentials}
                  onRegisterWithGoogle={loginGG}
                  onBackToLogin={handleBackToLogin}
                />
              ) : showForgotPassword ? (
                <ForgotPasswordForm
                  onFinish={onForgotPasswordFinish}
                  onBackToLogin={handleBackToLogin}
                />
              ) : isRegister ? (
                <RegisterForm
                  onFinish={onRegisterFinish}
                  onBackToLogin={handleBackToLogin}
                />
              ) : (
                <LoginForm
                  onFinish={onFinish}
                  onGoogleLogin={loginGG}
                  onShowForgotPassword={handleShowForgotPassword}
                  onShowRegister={handleShowRegisterOptions}
                />
              )}
            </Suspense>
          </div>
        </div>
        <div className="hidden lg:flex text-white">
          <div className="flex flex-col justify-center items-center gap-3 translate-x-12 -translate-y-16">
            <div className="relative w-17 h-17">
              <Image
                src="/images/logo/logoLight.svg"
                alt="PlanBook Logo Light"
                fill
                onClick={() => router.back()}
                className="object-contain cursor-pointer"
              />
            </div>
            <div className="w-[1px] h-72 bg-white opacity-40"></div>
          </div>
          <div className="flex flex-col justify-center items-start gap-7">
            <h1 className="font-calsans text-6xl leading-24">
              Chào mừng đến <br />
              Planbook.
            </h1>
            <p className="font-questrial w-2xs text-justify translate-x-12 text-sm leading-6">
              Hãy bắt đầu bằng việc xác minh tài khoản cá nhân, sau đó bạn có
              thể thiết lập hồ sơ của mình.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
