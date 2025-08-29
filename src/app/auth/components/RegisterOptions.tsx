"use client";
import React from 'react';
import { Button, Divider } from 'antd';
import { FcGoogle } from 'react-icons/fc';

interface RegisterOptionsProps {
  onRegisterWithCredentials: () => void;
  onRegisterWithGoogle: () => void;
  onBackToLogin: () => void;
}

const RegisterOptions: React.FC<RegisterOptionsProps> = ({ onRegisterWithCredentials, onRegisterWithGoogle, onBackToLogin }) => {
  return (
    <>
      <div className="space-y-4">
        <Button
          onClick={onRegisterWithCredentials}
          block
          size="large"
          className="w-full btn-base flex !text-white !justify-between !pl-4 !border-none btn-secondary !bg-[#0BD7DA] !hover:bg-cyan-500"
        >
          <span>Đăng ký với tên và mật khẩu</span>
        </Button>

        <Button
          onClick={onRegisterWithGoogle}
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

export default RegisterOptions;

