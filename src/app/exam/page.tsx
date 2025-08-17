"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileText, ArrowRight, HelpCircle, Clock, Users } from "lucide-react";
import Squares from "@/components/ui/Squares";

export default function ExamEntryPage() {
  const router = useRouter();
  const [examCode, setExamCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!examCode.trim()) {
      setError("Vui lòng nhập mã đề thi");
      return;
    }

    if (examCode.length > 20) {
      setError("Mã đề thi không được vượt quá 20 ký tự");
      return;
    }

    if (!/^[A-Z0-9]+$/.test(examCode)) {
      setError("Mã đề thi chỉ được chứa chữ cái in hoa và số");
      return;
    }

    setError("");
    router.push(`/exam/${examCode}`);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Squares Background */}
      <div className="absolute inset-0 z-0">
        <Squares
          direction="diagonal"
          speed={0.5}
          borderColor="grey"
          squareSize={100}
          hoverFillColor="rgba(200, 200, 200, 0.5)"
        />
      </div>

      {/* Overlay để làm mờ video */}
      <div className="absolute inset-0 bg-black/20 z-10"></div>

      {/* Content wrapper */}
      <div className="relative z-50 w-full">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-white">Thi trực tuyến</h1>
              <p className="text-xl text-white/80">
                Nhập mã đề thi để bắt đầu làm bài
              </p>
            </div>

            {/* Main Form */}
            <Card className="bg-white backdrop-blur-md border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-center tex">
                  Nhập mã đề thi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-base font-medium tex">
                      Mã đề thi *
                    </label>
                    <Input
                      className="font-questrial text-lg h-14 text-center tracking-wider bg-white/20 border-black  placeholder:tex/60"
                      style={{ textTransform: "uppercase" }}
                      placeholder="Nhập mã đề thi (VD: ABC123)"
                      value={examCode}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setExamCode(e.target.value.toUpperCase())
                      }
                    />
                    {error && <p className="text-sm text-red-400">{error}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 text-lg"
                    size="lg"
                  >
                    Vào phòng thi
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className=" bg-blue-100/20 backdrop-blur-md border border-blue-300/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 tex">
                  <HelpCircle className="w-5 h-5 text-white" />
                  Hướng dẫn sử dụng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-blue-600 font-bold text-lg">1</span>
                    </div>
                    <h3 className="font-medium text-blue-900">Nhập mã đề</h3>
                    <p className="text-sm text-blue-700">
                      Nhập mã đề thi do giáo viên cung cấp
                    </p>
                  </div>

                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-blue-600 font-bold text-lg">2</span>
                    </div>
                    <h3 className="font-medium text-blue-900">
                      Điền thông tin
                    </h3>
                    <p className="text-sm text-blue-700">
                      Nhập họ tên và xác nhận thông tin
                    </p>
                  </div>

                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-blue-600 font-bold text-lg">3</span>
                    </div>
                    <h3 className="font-medium text-blue-900">Làm bài thi</h3>
                    <p className="text-sm text-blue-700">
                      Hoàn thành bài thi trong thời gian quy định
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
                <CardContent className="pt-6">
                  <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">1000+</p>
                  <p className="text-sm text-gray-600">Học sinh đã tham gia</p>
                </CardContent>
              </Card>

              <Card className="text-center bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
                <CardContent className="pt-6">
                  <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">500+</p>
                  <p className="text-sm text-gray-600">Bài thi đã hoàn thành</p>
                </CardContent>
              </Card>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500">
              <p>
                Hệ thống thi trực tuyến PlanBook - An toàn, chính xác, tiện lợi
              </p>
              <p className="mt-1">
                © {new Date().getFullYear()} - Phát triển bởi đội ngũ PlanBook
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
