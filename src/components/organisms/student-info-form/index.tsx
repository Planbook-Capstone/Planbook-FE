"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User, Clock, BookOpen, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

// Form validation schema
const studentInfoSchema = z.object({
  studentName: z
    .string()
    .min(2, "Tên học sinh phải có ít nhất 2 ký tự")
    .max(100, "Tên học sinh không được vượt quá 100 ký tự")
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, "Tên học sinh chỉ được chứa chữ cái và khoảng trắng"),
});

type StudentInfoFormData = z.infer<typeof studentInfoSchema>;

interface ExamInfo {
  examName: string;
  subject: string;
  grade: number;
  durationMinutes: number;
  code: string;
}

interface StudentInfoFormProps {
  examInfo: ExamInfo;
  onSubmit: (studentName: string) => void;
  isLoading?: boolean;
  className?: string;
}

export function StudentInfoForm({
  examInfo,
  onSubmit,
  isLoading = false,
  className,
}: StudentInfoFormProps) {
  const form = useForm<StudentInfoFormData>({
    resolver: zodResolver(studentInfoSchema),
    defaultValues: {
      studentName: "",
    },
  });

  const handleSubmit = (data: StudentInfoFormData) => {
    onSubmit(data.studentName);
  };

  return (
    <div className={cn("max-w-2xl mx-auto space-y-6", className)}>
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          Chào mừng đến với bài thi
        </h1>
        <p className="text-gray-600">
          Vui lòng nhập thông tin của bạn để bắt đầu làm bài
        </p>
      </div>

      {/* Exam Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-center">Thông tin bài thi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Môn học</p>
                <p className="font-medium">{examInfo.subject}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <GraduationCap className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">Lớp</p>
                <p className="font-medium">Lớp {examInfo.grade}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Thời gian</p>
                <p className="font-medium">{examInfo.durationMinutes} phút</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-5 h-5 text-center text-orange-600 font-bold">#</div>
              <div>
                <p className="text-sm text-gray-500">Mã đề</p>
                <p className="font-medium font-mono">{examInfo.code}</p>
              </div>
            </div>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">{examInfo.examName}</h3>
          </div>
        </CardContent>
      </Card>

      {/* Student Info Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Thông tin học sinh</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="studentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Họ và tên *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập họ và tên của bạn..."
                        className="text-base h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-base"
                size="lg"
              >
                {isLoading ? "Đang xử lý..." : "Bắt đầu làm bài"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <h3 className="font-medium text-yellow-800 mb-3">Lưu ý quan trọng:</h3>
          <ul className="text-sm text-yellow-700 space-y-2">
            <li>• Đảm bảo kết nối internet ổn định trong suốt quá trình làm bài</li>
            <li>• Không được thoát khỏi trang web khi đang làm bài</li>
            <li>• Thời gian làm bài sẽ được tính từ khi bạn nhấn "Bắt đầu làm bài"</li>
            <li>• Nhớ nhấn "Nộp bài" khi hoàn thành để lưu kết quả</li>
            <li>• Nếu gặp sự cố kỹ thuật, hãy liên hệ giám thị ngay lập tức</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
