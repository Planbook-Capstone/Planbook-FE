"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FileUp, Plus, FileText, X } from "lucide-react";
import ExamFileImport from "../exam-file-import";

interface ExamCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportFile: (files: File[]) => void;
  onCreateManually: () => void;
  isImporting?: boolean;
}

export default function ExamCreationModal({
  isOpen,
  onClose,
  onImportFile,
  onCreateManually,
  isImporting = false,
}: ExamCreationModalProps) {
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

  const handleClose = () => {
    setSelectedMode("none");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-calsans text-gray-900">
            Tạo Template Đề Thi
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Show mode selection when no mode is selected */}
          {selectedMode === "none" && (
            <div>
              <p className="text-gray-600 font-questrial text-lg mb-8">
                Chọn cách tạo template đề thi mới. Template có thể được sử dụng
                nhiều lần để tạo các đề thi khác nhau.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Import from file option */}
                <div
                  className="overflow-hidden relative rounded-xl p-6 group hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col items-start justify-end text-center aspect-[4/3] border-2 border-gray-200 hover:border-purple-300"
                  onClick={() => handleModeSelect("import")}
                >
                  <h3 className="text-2xl mb-2 z-10 text-[#C151E3] text-start font-questrial leading-tight">
                    Import từ <br />
                    <span className="font-calsans text-purple-600">DOCX</span>
                  </h3>
                  <FileUp className="absolute bottom-4 right-4 h-12 w-12 text-purple-400 group-hover:scale-110 transition-all duration-300" />
                </div>

                {/* Create manually option */}
                <div
                  className="overflow-hidden relative rounded-xl p-6 group hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col items-start justify-end aspect-[4/3] border-2 border-gray-200 hover:border-blue-300"
                  onClick={() => handleModeSelect("manual")}
                >
                  <h3 className="text-2xl mb-2 z-10 text-blue-600 text-start font-questrial leading-tight">
                    Tạo mới <br />
                    <span className="font-calsans">thủ công</span>
                  </h3>
                  <Plus className="absolute bottom-4 right-4 h-12 w-12 text-blue-400 group-hover:scale-110 transition-all duration-300" />
                </div>
              </div>
            </div>
          )}

          {/* Show file import interface when import mode is selected */}
          {selectedMode === "import" && (
            <div>
              <div className="mb-6">
                <Button
                  variant="ghost"
                  onClick={handleBackToSelection}
                  className="mb-4 text-gray-600 hover:text-gray-900"
                >
                  ← Quay lại
                </Button>
                <h3 className="text-xl font-calsans mb-2 text-gray-900">
                  Import Template từ File DOCX
                </h3>
                <p className="text-gray-600 font-questrial">
                  Tải lên file DOCX để tự động tạo template đề thi
                </p>
              </div>

              <ExamFileImport onSubmit={handleFileSubmit} isLoading={isImporting} />
            </div>
          )}

          {/* Show manual creation interface when manual mode is selected */}
          {selectedMode === "manual" && (
            <div>
              <div className="mb-6">
                <Button
                  variant="ghost"
                  onClick={handleBackToSelection}
                  className="mb-4 text-gray-600 hover:text-gray-900"
                >
                  ← Quay lại
                </Button>
                <h3 className="text-xl font-calsans mb-2 text-gray-900">
                  Tạo Template Thủ Công
                </h3>
                <p className="text-gray-600 font-questrial">
                  Tạo template từ đầu với trình soạn thảo trực quan
                </p>
              </div>

              <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-calsans mb-2 text-gray-900">
                  Bắt đầu tạo template mới
                </h4>
                <p className="text-gray-600 font-questrial mb-6 max-w-md mx-auto">
                  Sử dụng trình soạn thảo để tạo template đề thi với các câu hỏi và
                  phần thi tùy chỉnh
                </p>
                <Button
                  onClick={onCreateManually}
                  size="lg"
                  className="px-8 py-3"
                >
                  Tiếp tục
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
