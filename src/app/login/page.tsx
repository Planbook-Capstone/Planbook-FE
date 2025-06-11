"use client";
import { Button, Divider, Form, Input } from "antd";
import { ArrowRight } from "lucide-react";
import React from "react";
import Image from "next/image";
import { useUserServices } from "@/services/userService";
import { toast } from "sonner";

const LoginPage = () => {
  const { mutate } = useUserServices();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Form values:", values);
    mutate(values, {
      onSuccess: () => {
        toast.success("Đăng nhập thành công");
      },
      onError: () => {
        toast.error(
          "Đăng nhập thất bại.Vui lòng kiểm tra kĩ thông tin đăng nhập"
        );
      },
    });
  };

  return (
    <div className="h-screen">
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
            <h3 className="font-questrial text-lg">©Copyright Planbook 2025</h3>
          </div>
        </div>
      </div>
      {/* Login Form */}
      <div className="absolute h-full flex items-center pl-[8rem] justify-end gap-28">
        <div className="min-h-fit flex items-center justify-center bg-white px-4 py-10 z-10 rounded-md">
          <div className="w-full max-w-sm space-y-6 px-4">
            <div>
              <h1 className="text-2xl font-questrial text-gray-900">
                Chào mừng{" "}
                <span className="font-calsans text-gray-900">quay trở lại</span>
              </h1>
              <p className="mt-2 text-sm text-gray-500 font-questrial">
                Nhập email và mật khẩu để đăng nhập vào tài khoản.
              </p>
            </div>

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
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
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
                  <span>Đăng nhập</span>{" "}
                  <div className="w-14 h-full flex justify-center items-center bg-[#00BFC9]">
                    <ArrowRight />
                  </div>
                </Button>
              </Form.Item>
            </Form>

            <Button
              block
              size="large"
              className="btn-base btn-secondary flex !justify-between !pl-4 !border-[#E4EBF3] !border-1 !hover:bg-gray-100"
            >
              <div className="flex items-center gap-2">Tiếp tục với Google</div>
              <div className="w-14 h-full flex justify-center items-center bg-[#E4EBF3] text-[#AABBCF]">
                <ArrowRight />
              </div>
            </Button>

            <div className="text-sm font-questrial mt-2">
              <a href="#" className="text-cyan-500 hover:underline">
                Quên mật khẩu
              </a>
            </div>

            <Divider />

            <p className="text-sm text-gray-600 font-questrial block">
              Bạn chưa có tài khoản?{" "}
              <a
                href="#"
                className="text-cyan-500 font-calsans hover:underline"
              >
                Đăng kí ngay
              </a>
            </p>
          </div>
        </div>
        <div className="flex text-white">
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
