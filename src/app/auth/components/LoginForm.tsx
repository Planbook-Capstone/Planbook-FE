"use client";
import React from 'react';
import { Button, Form, Input, Divider } from 'antd';
import { ArrowRight } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

interface LoginFormProps {
  onFinish: (values: any) => void;
  onGoogleLogin: () => void;
  onShowForgotPassword: () => void;
  onShowRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onFinish, onGoogleLogin, onShowForgotPassword, onShowRegister }) => {
  const [form] = Form.useForm();

  return (
    <>
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        className="space-y-4 font-questrial"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
        >
          <Input
            placeholder="Tên đăng nhập"
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
            <span>Đăng nhập</span>
            <div className="w-14 h-full flex justify-center items-center bg-[#00BFC9]">
              <ArrowRight />
            </div>
          </Button>
        </Form.Item>
      </Form>

      <Button
        onClick={onGoogleLogin}
        block
        size="large"
        className="btn-base btn-secondary flex !justify-between !pl-4 !border-[#E4EBF3] !border-1 !hover:bg-gray-100"
      >
        <div className="flex items-center gap-2">
          <FcGoogle className="h-6 w-6" />
          Tiếp tục với Google
        </div>
        <div className="w-14 h-full flex justify-center items-center bg-[#E4EBF3] text-[#AABBCF]">
          <ArrowRight />
        </div>
      </Button>

      <div className="text-sm font-questrial mt-2">
        <button
          type="button"
          onClick={onShowForgotPassword}
          className="text-cyan-500 hover:underline bg-transparent border-none cursor-pointer"
        >
          Quên mật khẩu
        </button>
      </div>

      <Divider />

      <p className="text-sm text-gray-600 font-questrial block">
        Bạn chưa có tài khoản?{" "}
        <button
          type="button"
          onClick={onShowRegister}
          className="text-cyan-500 font-calsans hover:underline bg-transparent border-none cursor-pointer"
        >
          Đăng ký ngay
        </button>
      </p>
    </>
  );
};

export default LoginForm;

