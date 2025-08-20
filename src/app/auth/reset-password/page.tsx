"use client";

import { Button, Form, Input } from "antd";
import { ArrowRight } from "lucide-react";
import React from "react";
import Image from "next/image";
import { useResetPasswordService } from "@/services/userService";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

// Force dynamic rendering để tránh prerender trong build
export const dynamic = "force-dynamic";

function ResetPasswordPage() {
  const [form] = Form.useForm();
  const [isResetting, setIsResetting] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get token from URL params
  const token = searchParams.get("token");

  // Reset password service
  const resetPasswordMutation = useResetPasswordService(token || undefined);

  // Redirect if no token
  React.useEffect(() => {
    if (!token) {
      toast.error("Link reset password không hợp lệ");
      router.push("/auth");
    }
  }, [token, router]);

  const onFinish = (values: any) => {
    if (!token) {
      toast.error("Token không hợp lệ");
      return;
    }

    setIsResetting(true);
    resetPasswordMutation.mutate(
      {
        password: values.password,
      },
      {
        onSuccess: () => {
          toast.success(
            "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới."
          );
          router.push("/auth");
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ||
              "Đặt lại mật khẩu thất bại. Vui lòng thử lại."
          );
          setIsResetting(false);
        },
      }
    );
  };

  const handleBackToLogin = () => {
    router.push("/auth");
  };

  if (!token) {
    return null; // Will redirect in useEffect
  }
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
      {/* Reset Password Form */}
      <div className="absolute h-full flex items-center lg:pl-[8rem] justify-end gap-28">
        <div className="min-h-fit flex items-center justify-center bg-white px-4 py-10 z-10 rounded-md">
          <div className="w-full max-w-sm space-y-6 px-4">
            <div>
              <h1 className="text-2xl font-questrial text-gray-900">
                {isResetting ? (
                  <>
                    Đang đặt lại{" "}
                    <span className="font-calsans text-gray-900">mật khẩu</span>
                  </>
                ) : (
                  <>
                    Đặt lại{" "}
                    <span className="font-calsans text-gray-900">mật khẩu</span>
                  </>
                )}
              </h1>
              <p className="mt-2 text-sm text-gray-500 font-questrial">
                {isResetting
                  ? "Vui lòng chờ trong khi chúng tôi đặt lại mật khẩu của bạn..."
                  : "Nhập mật khẩu mới để hoàn tất việc đặt lại mật khẩu."}
              </p>
            </div>

            {isResetting ? (
              // Reset Password Loading
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
                <p className="text-sm text-gray-600 font-questrial">
                  Đang đặt lại mật khẩu...
                </p>
              </div>
            ) : (
              // Reset Password Form
              <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                className="space-y-4 font-questrial"
              >
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                    { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                  ]}
                >
                  <Input.Password
                    placeholder="Mật khẩu mới"
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
                    placeholder="Xác nhận mật khẩu mới"
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
                    loading={isResetting}
                    disabled={isResetting}
                    className="w-full btn-base flex !justify-between !pl-4 !border-none btn-secondary !bg-[#0BD7DA] !hover:bg-cyan-500"
                  >
                    <span>
                      {isResetting ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
                    </span>
                    <div className="w-14 h-full flex justify-center items-center bg-[#00BFC9]">
                      <ArrowRight />
                    </div>
                  </Button>
                </Form.Item>
              </Form>
            )}

            <div className="text-sm font-questrial mt-4">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="text-cyan-500 hover:underline bg-transparent border-none cursor-pointer"
              >
                ← Quay lại đăng nhập
              </button>
            </div>
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
              Đặt lại <br />
              mật khẩu.
            </h1>
            <p className="font-questrial w-2xs text-justify translate-x-12 text-sm leading-6">
              Nhập mật khẩu mới để hoàn tất việc đặt lại mật khẩu cho tài khoản
              của bạn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
