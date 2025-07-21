"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import {
  BookOpen,
  FileText,
  GraduationCap,
  Settings,
  BarChart3,
  MessageSquare,
  Plus,
  Eye,
  Edit,
  Database,
} from "lucide-react";

interface ToolItem {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  status?: "active" | "beta" | "coming-soon";
}

const tools: ToolItem[] = [
  {
    title: "Tạo giáo án",
    description: "Tạo và quản lý giáo án với AI hỗ trợ",
    href: "/lesson-plan",
    icon: <BookOpen className="w-6 h-6" />,
    color: "bg-blue-500",
    status: "active",
  },
  {
    title: "Tạo bài kiểm tra",
    description: "Tạo đề thi và bài kiểm tra tự động",
    href: "/exam-creation",
    icon: <FileText className="w-6 h-6" />,
    color: "bg-green-500",
    status: "active",
  },
  {
    title: "Quản lý Template",
    description: "Quản lý các template đề thi và bài kiểm tra",
    href: "/exam-templates",
    icon: <Database className="w-6 h-6" />,
    color: "bg-purple-500",
    status: "active",
  },
  {
    title: "Quản lý Exam Instances",
    description: "Tạo và quản lý các instance từ templates",
    href: "/exam-instances",
    icon: <Settings className="w-6 h-6" />,
    color: "bg-orange-500",
    status: "active",
  },
  {
    title: "Chấm điểm tự động",
    description: "Chấm điểm bài thi tự động với AI",
    href: "/grading-test",
    icon: <GraduationCap className="w-6 h-6" />,
    color: "bg-red-500",
    status: "active",
  },
  {
    title: "Tạo slide bài giảng",
    description: "Tạo slide thuyết trình với AI",
    href: "/chats",
    icon: <MessageSquare className="w-6 h-6" />,
    color: "bg-indigo-500",
    status: "active",
  },
  {
    title: "Báo cáo",
    description: "Xem báo cáo và thống kê",
    href: "/reports",
    icon: <BarChart3 className="w-6 h-6" />,
    color: "bg-yellow-500",
    status: "coming-soon",
  },
];

const statusConfig = {
  active: {
    label: "Hoạt động",
    color: "bg-green-100 text-green-800",
  },
  beta: {
    label: "Beta",
    color: "bg-blue-100 text-blue-800",
  },
  "coming-soon": {
    label: "Sắp ra mắt",
    color: "bg-gray-100 text-gray-800",
  },
};

export default function ToolsPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Bộ công cụ PlanBook
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Khám phá các công cụ mạnh mẽ được hỗ trợ bởi AI để tạo giáo án, 
          đề thi và quản lý giáo dục hiệu quả
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const statusInfo = statusConfig[tool.status || "active"];
          const isDisabled = tool.status === "coming-soon";
          
          return (
            <Card
              key={tool.href}
              className={`group transition-all duration-200 hover:shadow-lg ${
                isDisabled ? "opacity-60" : "hover:scale-105"
              }`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${tool.color} text-white`}>
                    {tool.icon}
                  </div>
                  {tool.status && (
                    <span className={`px-2 py-1 text-xs rounded-full ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  )}
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                  {tool.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {tool.description}
                </p>
                
                {isDisabled ? (
                  <Button disabled className="w-full">
                    Sắp ra mắt
                  </Button>
                ) : (
                  <Link href={tool.href} className="block">
                    <Button className="w-full group-hover:bg-blue-600 transition-colors">
                      Sử dụng ngay
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Hành động nhanh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/exam-templates">
            <Button variant="outline" className="w-full flex items-center gap-2 h-12">
              <Plus className="w-4 h-4" />
              Tạo Template mới
            </Button>
          </Link>
          <Link href="/exam-instances">
            <Button variant="outline" className="w-full flex items-center gap-2 h-12">
              <Settings className="w-4 h-4" />
              Tạo Instance mới
            </Button>
          </Link>
          <Link href="/exam-creation">
            <Button variant="outline" className="w-full flex items-center gap-2 h-12">
              <FileText className="w-4 h-4" />
              Tạo đề thi mới
            </Button>
          </Link>
        </div>
      </div>

      {/* Help Section */}
      <div className="text-center space-y-4 pt-8 border-t">
        <h3 className="text-lg font-semibold text-gray-900">
          Cần hỗ trợ?
        </h3>
        <p className="text-gray-600">
          Liên hệ với chúng tôi qua chat box ở góc dưới bên trái hoặc 
          xem hướng dẫn sử dụng chi tiết
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline">
            Xem hướng dẫn
          </Button>
          <Button variant="outline">
            Liên hệ hỗ trợ
          </Button>
        </div>
      </div>
    </div>
  );
}
