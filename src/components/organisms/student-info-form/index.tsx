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
    .regex(
      /^[a-zA-ZÀ-ỹ\s]+$/,
      "Tên học sinh chỉ được chứa chữ cái và khoảng trắng"
    ),
});

type StudentInfoFormData = z.infer<typeof studentInfoSchema>;

interface ExamInfo {
  examName: string;
  subject: string;
  grade: number;
  durationMinutes: number;
  code: string;
  school?: string;
  examCode?: string;
  atomicMasses?: string;
  totalScore?: number;
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
    <div
      className={cn(
        "max-w-2xl mx-auto space-y-6 z-50 pointer-events-auto",
        className
      )}
    >
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-calsans text-black">
          Chào mừng đến với bài thi
        </h1>
        <p className="text-black">
          Vui lòng nhập thông tin của bạn để bắt đầu làm bài
        </p>
      </div>

      {/* Exam Information */}
      <Card className="bg-white backdrop-blur-md border border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl text-center text-black">
            {examInfo.examName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-black">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg">
              <div>
                <p className="text-sm text-black/60">Môn học</p>
                <p className="font-medium ">{examInfo.subject}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg">
              <div>
                <p className="text-sm ">Lớp</p>
                <p className="font-medium ">Lớp {examInfo.grade}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg">
              <div>
                <p className="text-sm text-black/60">Thời gian</p>
                <p className="font-medium text-black">
                  {examInfo.durationMinutes} phút
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg">
              <div>
                <p className="text-sm text-black/60">Mã đề</p>
                <p className="font-medium font-questrial">{examInfo.code}</p>
              </div>
            </div>

            {examInfo.school && (
              <div>
                <div>
                  <p className="text-sm text-gray-500 text-nowrap">
                    Trường học
                  </p>
                  <p className="font-medium text-nowrap">{examInfo.school}</p>
                </div>
              </div>
            )}

            {examInfo.totalScore && (
              <div>
                <div>
                  <p className="text-sm text-gray-500 text-nowrap">Tổng điểm</p>
                  <p className="font-medium text-orange-600">
                    {examInfo.totalScore} điểm
                  </p>
                </div>
              </div>
            )}
          </div>
          {/* </div> */}

          {examInfo.atomicMasses && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-700 font-mono break-words">
                {examInfo.atomicMasses}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Info Form */}
      <Card className="bg-white backdrop-blur-md border border-white/20 shadow-xl text-black z-50">
        <CardHeader>
          <CardTitle className="text-xl text-black">
            Thông tin học sinh
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6 z-50"
            >
              <FormField
                control={form.control}
                name="studentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base ">Họ và tên *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập họ và tên của bạn..."
                        className="text-base h-12 bg-neutral-300 border-white/30 text-black placeholder:text-black/60 z-50"
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
    </div>
  );
}
