"use client";
import { Button, Divider, Form, Input } from "antd";
import { ArrowRight } from "lucide-react";
import React from "react";
import Image from "next/image";
import { useRegisterService, useUserServices } from "@/services/userService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "@/store";

// Force dynamic rendering để tránh prerender trong build
export const dynamic = "force-dynamic";

const LoginPage = () => {
  const { mutate } = useUserServices();
  const { mutate: register } = useRegisterService();
  const [form] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [isRegister, setIsRegister] = React.useState(false);
  const [showRegisterOptions, setShowRegisterOptions] = React.useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser } = useAppStore();

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
      onError: () => {
        toast.error(
          "Đăng nhập thất bại.Vui lòng kiểm tra kĩ thông tin đăng nhập"
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
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");

        setIsRegister(false);
        setShowRegisterOptions(false);
        registerForm.resetFields();
      },
      onError: () => {
        toast.error("Đăng ký thất bại.Vui lòng kiểm tra kĩ thông tin đăng ký");
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
            priority
            className="object-cover [object-position:right_bottom]"
          />
        </div>
        <div className="absolute bottom-[2rem] right-[3rem] z-0">
          <div className="flex gap-3 pb-10">
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
              showRegisterOptions || isRegister ? "min-w-sm" : "max-w-sm"
            }`}
          >
            <div>
              <h1 className="text-2xl font-questrial text-gray-900">
                {showRegisterOptions ? (
                  <>
                    Chọn phương thức{" "}
                    <span className="font-calsans text-gray-900">đăng ký</span>
                  </>
                ) : isRegister ? (
                  <>
                    Tạo tài khoản{" "}
                    <span className="font-calsans text-gray-900">mới</span>
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
                {showRegisterOptions
                  ? "Chọn cách bạn muốn tạo tài khoản mới."
                  : isRegister
                  ? "Điền thông tin để tạo tài khoản mới."
                  : "Nhập email và mật khẩu để đăng nhập vào tài khoản."}
              </p>
            </div>

            {showRegisterOptions ? (
              // Register Options
              <div className="space-y-4">
                <Button
                  onClick={handleRegisterWithCredentials}
                  block
                  size="large"
                  className="w-full btn-base flex !text-white !justify-between !pl-4 !border-none btn-secondary !bg-[#0BD7DA] !hover:bg-cyan-500"
                >
                  <span>Đăng ký với tên và mật khẩu</span>
                </Button>

                <Button
                  onClick={handleRegisterWithGoogle}
                  block
                  size="large"
                  className="btn-base btn-secondary flex !justify-between !pl-4 !border-[#E4EBF3] !border-1 !hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <FcGoogle className="h-6 w-6" />
                    Đăng ký với Google
                  </div>
                </Button>
              </div>
            ) : isRegister ? (
              // Register Form
              <Form
                form={registerForm}
                onFinish={onRegisterFinish}
                layout="vertical"
                className="space-y-4 font-questrial"
              >
                <Form.Item
                  name="fullName"
                  rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
                >
                  <Input
                    placeholder="Họ và tên"
                    size="large"
                    className="input-base input-secondary"
                  />
                </Form.Item>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email!" },
                    { type: "email", message: "Email không hợp lệ!" },
                  ]}
                >
                  <Input
                    placeholder="Email"
                    size="large"
                    className="input-base input-secondary"
                  />
                </Form.Item>
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên đăng nhập!" },
                  ]}
                >
                  <Input
                    placeholder="Tên đăng nhập"
                    size="large"
                    className="input-base input-secondary"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                    { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                  ]}
                >
                  <Input.Password
                    placeholder="Mật khẩu"
                    size="large"
                    className="input-base input-secondary"
                  />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Mật khẩu xác nhận không khớp!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    placeholder="Xác nhận mật khẩu"
                    size="large"
                    className="input-base input-secondary"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    className="w-full btn-base flex !justify-between !pl-4 !border-none btn-secondary !bg-[#0BD7DA] !hover:bg-cyan-500"
                  >
                    <span>Đăng ký</span>
                    <div className="w-14 h-full flex justify-center items-center bg-[#00BFC9]">
                      <ArrowRight />
                    </div>
                  </Button>
                </Form.Item>
              </Form>
            ) : (
              // Login Form
              <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                className="space-y-4 font-questrial"
              >
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: "Vui lòng nhập email!" }]}
                >
                  <Input
                    placeholder="Username"
                    size="large"
                    className="input-base input-secondary"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                  ]}
                >
                  <Input.Password
                    placeholder="Mật khẩu"
                    size="large"
                    className="input-base input-secondary"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    className="w-full btn-base flex !justify-between !pl-4 !border-none btn-secondary !bg-[#0BD7DA] !hover:bg-cyan-500"
                  >
                    <span>Đăng nhập</span>
                    <div className="w-14 h-full flex justify-center items-center bg-[#00BFC9]">
                      <ArrowRight />
                    </div>
                  </Button>
                </Form.Item>
              </Form>
            )}
            {!isRegister && !showRegisterOptions && (
              <Button
                onClick={loginGG}
                block
                size="large"
                className="btn-base btn-secondary flex !justify-between !pl-4 !border-[#E4EBF3] !border-1 !hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  Tiếp tục với Google
                </div>
                <div className="w-14 h-full flex justify-center items-center bg-[#E4EBF3] text-[#AABBCF]">
                  <ArrowRight />
                </div>
              </Button>
            )}

            {!isRegister && (
              <div className="text-sm font-questrial mt-2">
                <a href="#" className="text-cyan-500 hover:underline">
                  Quên mật khẩu
                </a>
              </div>
            )}

            <Divider />

            <p className="text-sm text-gray-600 font-questrial block">
              {showRegisterOptions ? (
                <>
                  Đã có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="text-cyan-500 font-calsans hover:underline bg-transparent border-none cursor-pointer"
                  >
                    Đăng nhập ngay
                  </button>
                </>
              ) : isRegister ? (
                <>
                  Đã có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="text-cyan-500 font-calsans hover:underline bg-transparent border-none cursor-pointer"
                  >
                    Đăng nhập ngay
                  </button>
                </>
              ) : (
                <>
                  Bạn chưa có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={handleShowRegisterOptions}
                    className="text-cyan-500 font-calsans hover:underline bg-transparent border-none cursor-pointer"
                  >
                    Đăng ký ngay
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
        <div className="hidden lg:flex text-white">
          <div className="flex flex-col justify-center items-center gap-3 translate-x-12 -translate-y-16">
            <div className="relative w-17 h-17">
              <Image
                src="/images/logo/logoLight.svg"
                alt="PlanBook Logo Light"
                fill
                className="object-contain"
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
