"use client";
import React from 'react';
import { Button, Form, Input, Divider } from 'antd';
import { ArrowRight } from 'lucide-react';

interface ForgotPasswordFormProps {
  onFinish: (values: any) => void;
  onBackToLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onFinish, onBackToLogin }) => {
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

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className="w-full btn-base flex !justify-between !pl-4 !border-none btn-secondary !bg-[#0BD7DA] !hover:bg-cyan-500"
          >
            <span>Gửi email khôi phục</span>
            <div className="w-14 h-full flex justify-center items-center bg-[#00BFC9]">
              <ArrowRight />
            </div>
          </Button>
        </Form.Item>
      </Form>

      <Divider />

      <p className="text-sm text-gray-600 font-questrial block">
        Nhớ mật khẩu?{" "}
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

export default ForgotPasswordForm;

