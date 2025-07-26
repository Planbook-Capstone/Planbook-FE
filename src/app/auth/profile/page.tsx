"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
function ProfilePage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-calsans mb-8">Hồ sơ của bạn</h1>

      {/* Profile Avatar Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-20 h-20 bg-teal-500 text-white text-2xl font-bold">
            <AvatarFallback className="bg-teal-500 text-white text-2xl">
              N
            </AvatarFallback>
          </Avatar>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              Xóa ảnh
            </Button>
            <Button variant="outline" size="sm">
              Thay đổi ảnh
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600">Ảnh hồ sơ</p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6 max-w-2xl">
        {/* Name Field */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <FormField label="Tên">
              <Input defaultValue="Nhi Nguyễn" className="bg-gray-50" />
            </FormField>
          </div>
          <Button variant="outline" size="sm" className="mt-6">
            Sửa
          </Button>
        </div>

        {/* Email Field */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <FormField label="Địa chỉ email">
              <Input
                defaultValue="ynhiworkplace308@gmail.com"
                className="bg-gray-50"
                disabled
              />
            </FormField>
          </div>
          <Button variant="outline" size="sm" className="mt-6">
            Sửa
          </Button>
        </div>

        {/* Work Purpose Dropdown */}
        <FormField label="Bạn sẽ sử dụng Canva cho công việc gì?">
          <Select defaultValue="business">
            <SelectTrigger>
              <SelectValue placeholder="Chọn mục đích sử dụng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="business">Doanh nghiệp nhỏ</SelectItem>
              <SelectItem value="education">Giáo dục</SelectItem>
              <SelectItem value="personal">Cá nhân</SelectItem>
              <SelectItem value="nonprofit">Tổ chức phi lợi nhuận</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        {/* Language Dropdown */}
        <FormField label="Ngôn ngữ">
          <Select defaultValue="vietnamese">
            <SelectTrigger>
              <SelectValue placeholder="Chọn ngôn ngữ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vietnamese">Tiếng Việt</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="chinese">中文</SelectItem>
              <SelectItem value="japanese">日本語</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        {/* Social Accounts Section */}
        <div className="pt-8">
          <h2 className="text-lg font-semibold mb-4">
            Các tài khoản mạng xã hội được kết nối
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Các dịch vụ mà bạn dùng để đăng nhập vào Canva
          </p>

          {/* Google Account */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center bg-red-500 rounded-full">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <div>
                <p className="font-medium">Google</p>
                <p className="text-sm text-gray-600">Nhi Nguyễn</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Hủy kết nối
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
