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
  const [selectedMode, setSelectedMode] = useState<
    "none" | "import" | "manual"
  >("none");
  const [selectedMode, setSelectedMode] = useState<
    "none" | "import" | "manual"
  >("none");

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
      <div className="w-full max-w-7xl mx-auto p-6 lg:p-8">
        <div className="mb-8 lg:mb-12 text-center lg:text-left">
          <h1 className="text-3xl lg:text-4xl font-calsans mb-3 text-gray-900">
            Tạo Template Đề Thi
          </h1>
          <p className="text-gray-600 font-questrial text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0">
            Chọn cách tạo template đề thi mới. Template có thể được sử dụng
            nhiều lần để tạo các đề thi khác nhau.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Import from file option */}
          <div
            className="overflow-hidden relative rounded-xl p-8 lg:p-10 group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col items-start justify-end text-center aspect-[4/3] w-full lg:w-auto lg:flex-1"
            onClick={() => handleModeSelect("import")}
          >
            <h2 className="text-4xl lg:text-6xl mb-2 z-10 text-[#C151E3] text-start font-questrial leading-tight">
              Import từ <br />
              <span
                className="font-calsans underline text-transparent bg-clip-text leading-tight"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, #6C32EB 0%, #3500A7 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  borderBottom: "4px solid #C151E3",
                }}
              >
                DOCX
              </span>
            </h2>
            <img
              src={"/images/illustration/docx.svg"}
              alt="DOCX Import"
              className="absolute group-hover:scale-110 transition-all duration-300 -bottom-1/4 -right-1/6 h-[105%] object-cover z-10"
            />
            <img
              src={"/images/background/import.svg"}
              alt="Import Background"
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
          </div>

          {/* Create manually option */}
          <div
            className="overflow-hidden relative rounded-xl p-8 lg:p-10 group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col items-end justify-start aspect-[4/3] w-full lg:w-auto lg:flex-1"
            onClick={() => handleModeSelect("manual")}
          >
            <h2 className="text-4xl lg:text-6xl mb-2 z-10 text-white text-end font-questrial leading-tight">
              Tạo mới <br />
              <span className="font-calsans text-[#FFF2C2] bg-clip-text leading-tight">
                thủ công
              </span>
            </h2>
            <img
              src={"/images/illustration/text.svg"}
              alt="Manual Creation"
              className="absolute group-hover:scale-110 h-[70%] left-0 bottom-0 transition-all duration-300 object-cover z-10"
            />
            <img
              src={"/images/background/manual.svg"}
              alt="Manual Background"
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
          </div>
        </div>
      </div>
    );
  }

  // Show file import interface when import mode is selected
  if (selectedMode === "import") {
    return (
      <div className="w-full max-w-5xl mx-auto p-6 lg:p-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBackToSelection}
            className="mb-6 text-gray-600 hover:text-gray-900"
          >
            ← Quay lại
          </Button>
          <h2 className="text-2xl lg:text-3xl font-calsans mb-2 text-gray-900">
            Import Template từ File DOCX
          </h2>
          <p className="text-gray-600 font-questrial">
            Tải lên file DOCX để tự động tạo template đề thi
          </p>
        </div>

        <ExamFileImport onSubmit={handleFileSubmit} isLoading={isImporting} />

        <ExamFileImport onSubmit={handleFileSubmit} isLoading={isImporting} />
      </div>
    );
  }

  // Show manual creation interface when manual mode is selected
  if (selectedMode === "manual") {
    return (
      <div className="w-full max-w-5xl mx-auto p-6 lg:p-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBackToSelection}
            className="mb-6 text-gray-600 hover:text-gray-900"
          >
            ← Quay lại
          </Button>
          <h2 className="text-2xl lg:text-3xl font-calsans mb-2 text-gray-900">
            Tạo Template Thủ Công
          </h2>
          <p className="text-gray-600 font-questrial">
            Tạo template từ đầu với trình soạn thảo trực quan
          </p>
        </div>

        <div className="text-center p-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <FileText className="h-20 w-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-calsans mb-3 text-gray-900">
            Bắt đầu tạo template mới
          </h3>
          <p className="text-gray-600 font-questrial mb-8 max-w-md mx-auto">
            Sử dụng trình soạn thảo để tạo template đề thi với các câu hỏi và
            phần thi tùy chỉnh
          </p>
          <Button
            onClick={onCreateManually}
            size="lg"
            className="px-8 py-3 text-lg"
          >
            Tiếp tục
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
