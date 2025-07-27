"use client";

import React, { useState, useRef } from "react";
import { Upload, X, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import DocumentItem from "@/components/molecules/document-item";
import { UploadIcon } from "@/constants/icon";

interface ExamFileUploadProps {
  onFilesChange: (files: File[]) => void;
  onError: (error: string) => void;
}

export default function ExamFileUpload({
  onFilesChange,
  onError,
}: ExamFileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    // Check file type
    if (
      !file.type.includes("wordprocessingml") &&
      !file.name.endsWith(".docx")
    ) {
      return {
        isValid: false,
        error: `File "${file.name}" không đúng định dạng. Chỉ chấp nhận file .docx`,
      };
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return {
        isValid: false,
        error: `File "${file.name}" quá lớn. Kích thước tối đa là 10MB`,
      };
    }

    // Check if file is empty
    if (file.size === 0) {
      return {
        isValid: false,
        error: `File "${file.name}" trống. Vui lòng chọn file khác`,
      };
    }

    return { isValid: true };
  };

  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];

    for (const file of fileArray) {
      const validation = validateFile(file);
      if (!validation.isValid) {
        onError(validation.error!);
        return; // Stop processing if any file is invalid
      }
      validFiles.push(file);
    }

    // All files are valid
    onError(""); // Clear any previous errors
    setSelectedFiles(validFiles);
    onFilesChange(validFiles);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (indexToRemove: number) => {
    const newFiles = selectedFiles.filter(
      (_, index) => index !== indexToRemove
    );
    setSelectedFiles(newFiles);
    onFilesChange(newFiles);

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  console.log(selectedFiles);

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col justify-center items-center gap-2">
          {/* <Image
            src="/images/illustration/packing.svg"
            width="100"
            height="100"
            alt="Upload"
          /> */}
          <div className="w-32 h-32">{UploadIcon}</div>
          <p className="text-base font-medium font-questrial text-gray-900 mb-2">
            Kéo thả file DOCX vào đây
          </p>
        </div>

        {/* <p className="text-gray-500 mb-4">hoặc</p> */}
        {/* <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Chọn file từ máy tính
        </Button> */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <p className="text-sm text-gray-500">
          Chỉ hỗ trợ file .docx (tối đa 10MB mỗi file)
        </p>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-calsans text-gray-900">File đã chọn:</h4>
          {selectedFiles.map((file, index) => (
            <div key={index} className="grid grid-cols-5">
              <DocumentItem
                type="DOCX"
                name={file?.name || "Không xác định"}
                description={(file.size / 1024 / 1024).toFixed(2) + " MB"}
                onRemove={() => removeFile(index)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
