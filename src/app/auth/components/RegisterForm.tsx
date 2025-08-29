"use client";
import React from 'react';
import { Button, Form, Input, Divider } from 'antd';
import { ArrowRight } from 'lucide-react';

interface RegisterFormProps {
  onFinish: (values: any) => void;
  onBackToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onFinish, onBackToLogin }) => {
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

      <Divider />

      <p className="text-sm text-gray-600 font-questrial block">
        Đã có tài khoản?{" "}
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-cyan-500 font-calsans hover:underline bg-transparent border-none cursor-pointer"
        >
          Đăng nhập ngay
        </button>
      </p>
    </>
  );
};

export default RegisterForm;

