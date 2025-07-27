"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FileUp, Plus, FileText, X, ChevronLeft } from "lucide-react";
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
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center">
            {(selectedMode === "import" || selectedMode === "manual") && (
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  onClick={handleBackToSelection}
                  className=" text-gray-600 hover:text-gray-900 hover:bg-transparent"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Quay lại
                </Button>
                <div className="bg-neutral-300 w-[1px] h-6 mr-2"></div>
              </div>
            )}

            <h2 className="text-2xl font-calsans text-gray-900">
              Tạo mẫu đề thi
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 border rounded-full p-0 h-8 w-8"
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
                Chọn cách tạo mẫu đề thi mới. Mẫu có thể được sử dụng nhiều lần
                để tạo các đề thi khác nhau.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Import từ DOCX */}
                <div
                  className="overflow-hidden relative rounded-lg p-10 group hover:shadow-md transition-all cursor-pointer flex flex-col items-start justify-end text-center aspect-[4/3] w-full"
                  onClick={() => handleModeSelect("import")}
                >
                  <h2 className="text-6xl mb-2 z-10 text-white text-start">
                    Import từ <br />
                    <span className="font-calsans text-white underline bg-clip-text leading-tight">
                      DOCX
                    </span>
                  </h2>
                  <img
                    src={"/images/illustration/docx.svg"}
                    className="absolute group-hover:scale-110 transition-all -bottom-1/4 -right-1/6 h-[110%] object-cover z-10"
                  />
                  <img
                    src={"/images/background/import.svg"}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                </div>

                {/* Tạo thủ công */}
                <div
                  className="overflow-hidden relative rounded-lg p-10 group hover:shadow-md transition-all cursor-pointer flex flex-col items-end justify-start aspect-[4/3] w-full"
                  // onClick={() => handleModeSelect("manual")}
                  onClick={onCreateManually}
                >
                  <h2 className="text-6xl mb-2 z-10 text-white text-end">
                    Tạo mới <br />
                    <span className="font-calsans bg-clip-text leading-tight">
                      thủ công
                    </span>
                  </h2>
                  <img
                    src={"/images/illustration/text.svg"}
                    className="absolute group-hover:scale-110 h-[70%] left-0 bottom-0 transition-all object-cover z-10"
                  />
                  <img
                    src={"/images/background/manual.svg"}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Show file import interface when import mode is selected */}
          {selectedMode === "import" && (
            <div>
              <div className="mb-6 mx-3">
                <h3 className="text-xl font-calsans mb-2 text-gray-900">
                  Import Template từ File DOCX
                </h3>
                <p className="text-gray-600 font-questrial">
                  Tải lên file DOCX để tự động tạo template đề thi
                </p>
              </div>

              <ExamFileImport
                onSubmit={handleFileSubmit}
                isLoading={isImporting}
              />
            </div>
          )}

          {/* Show manual creation interface when manual mode is selected */}
          {selectedMode === "manual" && (
            <div>
              <div className="mb-6">
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
                  Sử dụng trình soạn thảo để tạo template đề thi với các câu hỏi
                  và phần thi tùy chỉnh
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
