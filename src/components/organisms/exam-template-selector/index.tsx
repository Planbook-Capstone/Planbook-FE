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
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-calsans mb-2">Tạo Template Đề Thi</h1>
          <p className="text-gray-600 font-questrial">
            Chọn cách tạo template đề thi mới. Template có thể được sử dụng
            nhiều lần để tạo các đề thi khác nhau.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Import from file option */}
          <div
            className="overflow-hidden relative rounded-lg p-10 group hover:shadow-md transition-all cursor-pointer flex flex-col items-start justify-end text-center aspect-[4/3] w-full md:w-auto md:flex-1"
            onClick={() => handleModeSelect("import")}
          >
            <h2 className="text-6xl mb-2 z-10 text-[#C151E3] text-start">
              Import từ <br />
              <span
                className="font-calsans underline text-transparent bg-clip-text leading-tight"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, #6C32EB 0%, #3500A7 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  borderBottom: "6px solid #C151E3",
                }}
              >
                DOCX
              </span>
            </h2>
            <img
              src={"/images/illustration/docx.svg"}
              className="absolute group group-hover:scale-110 transition-all -bottom-1/4 -right-1/6 h-[105%] object-cover z-10"
            />
            <img
              src={"/images/background/import.svg"}
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
          </div>

          {/* Create manually option */}
          <div
            className="overflow-hidden relative rounded-lg p-10 group hover:shadow-md transition-all cursor-pointer flex flex-col items-end justify-start aspect-[4/3] w-full md:w-auto md:flex-1"
            onClick={() => handleModeSelect("manual")}
          >
            <h2 className="text-6xl mb-2 z-10 text-white text-end">
              Tạo mới <br />
              <span className="font-calsans text-[#FFF2C2] bg-clip-text leading-tight">
                thủ công
              </span>
            </h2>
            <img
              src={"/images/illustration/text.svg"}
              className="absolute group group-hover:scale-110 h-[70%] left-0 bottom-0 transition-all object-cover z-10"
            />
            <img
              src={"/images/background/manual.svg"}
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
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={handleBackToSelection}
            className="mb-4"
          >
            ← Quay lại
          </Button>
          <h2 className="text-xl font-semibold">
            Import Template từ File DOCX
          </h2>
        </div>

        <ExamFileImport onSubmit={handleFileSubmit} isLoading={isImporting} />
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
          <p className="mb-6">
            Bắt đầu tạo template đề thi mới với các câu hỏi và phần thi tùy
            chỉnh
          </p>
          <Button onClick={onCreateManually}>Tiếp tục</Button>
        </div>
      </div>
    );
  }

  return null;
}
