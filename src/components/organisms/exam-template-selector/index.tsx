"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FileUp, Plus, FileText } from "lucide-react";
import ExamFileImport from "../exam-file-import";

interface ExamTemplateSelectorProps {
  onImportFile: (files: File[]) => void;
  onCreateManually: () => void;
  isImporting?: boolean;
}

export default function ExamTemplateSelector({
  onImportFile,
  onCreateManually,
  isImporting = false,
}: ExamTemplateSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<"none" | "import" | "manual">("none");

  const handleModeSelect = (mode: "import" | "manual") => {
    setSelectedMode(mode);
  };

  const handleFileSubmit = (files: File[]) => {
    onImportFile(files);
  };

  const handleBackToSelection = () => {
    setSelectedMode("none");
  };

  // Show mode selection when no mode is selected
  if (selectedMode === "none") {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Tạo Template Đề Thi</h1>
          <p className="text-gray-600">
            Chọn cách tạo template đề thi mới. Template có thể được sử dụng nhiều lần để tạo các đề thi khác nhau.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Import from file option */}
          <div 
            className="border rounded-lg p-6 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center"
            onClick={() => handleModeSelect("import")}
          >
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <FileUp className="h-8 w-8 text-blue-500" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Import từ file DOCX</h2>
            <p className="text-gray-600 text-sm">
              Tải lên file DOCX có sẵn để tạo template. Hệ thống sẽ tự động phân tích cấu trúc đề thi.
            </p>
          </div>

          {/* Create manually option */}
          <div 
            className="border rounded-lg p-6 hover:border-green-500 hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center"
            onClick={() => handleModeSelect("manual")}
          >
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Tạo mới thủ công</h2>
            <p className="text-gray-600 text-sm">
              Tạo template từ đầu với giao diện trực quan. Thêm câu hỏi, phần thi và cấu hình điểm số.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show file import interface when import mode is selected
  if (selectedMode === "import") {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="mb-4">
          <Button 
            variant="ghost" 
            onClick={handleBackToSelection}
            className="mb-4"
          >
            ← Quay lại
          </Button>
          <h2 className="text-xl font-semibold">Import Template từ File DOCX</h2>
        </div>
        
        <ExamFileImport
          onSubmit={handleFileSubmit}
          isLoading={isImporting}
        />
      </div>
    );
  }

  // Show manual creation interface when manual mode is selected
  if (selectedMode === "manual") {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="mb-4">
          <Button 
            variant="ghost" 
            onClick={handleBackToSelection}
            className="mb-4"
          >
            ← Quay lại
          </Button>
          <h2 className="text-xl font-semibold">Tạo Template Thủ Công</h2>
        </div>
        
        <div className="text-center p-8">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="mb-6">Bắt đầu tạo template đề thi mới với các câu hỏi và phần thi tùy chỉnh</p>
          <Button onClick={onCreateManually}>
            Tiếp tục
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
