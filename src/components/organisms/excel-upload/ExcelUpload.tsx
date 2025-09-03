"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileSpreadsheet, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { UploadCloudIcon } from "@/constants/icon";
import DocumentItem from "@/components/molecules/document-item";

interface ExcelUploadProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
  className?: string;
}

export function ExcelUpload({
  onFileSelect,
  isUploading = false,
  className,
}: ExcelUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus("idle");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    multiple: false,
    disabled: isUploading,
  });

  const handleUpload = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
      setUploadStatus("success");
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadStatus("idle");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={cn("w-full", className)}>
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400",
            isUploading && "opacity-50 cursor-not-allowed"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 h-28 w-28 rounded-full">
              {/* <Upload className="w-8 h-8 text-gray-600" /> */}
              {UploadCloudIcon}
            </div>
            <div>
              <p className="text-lg font-calsans text-gray-500">
                {isDragActive ? "Thả file vào đây..." : "Tải lên file Excel"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Kéo thả file hoặc click để chọn file
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Hỗ trợ: .xlsx, .xls, .csv (tối đa 10MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <DocumentItem
              name={selectedFile.name}
              description={formatFileSize(selectedFile.size)}
              type="XLSX"
              onRemove={handleRemoveFile}
            />
          </div>

          {uploadStatus !== "success" && (
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang xử lý...
                  </>
                ) : (
                  "Phân tích file"
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
