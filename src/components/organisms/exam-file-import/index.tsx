"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { AlertCircle, Loader2 } from "lucide-react";
import ExamFileUpload from "./ExamFileUpload";

interface ExamFileImportProps {
  onSubmit?: (files: File[]) => void;
  isLoading?: boolean;
}

export default function ExamFileImport({ onSubmit, isLoading }: ExamFileImportProps) {
  const [testFiles, setTestFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>("");

  const handleFilesChange = (files: File[]) => {
    console.log("Files received from ExamFileUpload:", files);
    setTestFiles(files);
  };

  const handleSubmit = () => {
    if (testFiles.length === 0) {
      setError("Vui lòng chọn ít nhất một file");
      return;
    }

    console.log("=== EXAM IMPORT SUBMISSION ===");
    console.log("Submitted files:", testFiles);
    console.log("File details:", testFiles.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified)
    })));

    // Clear any previous errors
    setError("");

    // Call the onSubmit callback with files
    onSubmit?.(testFiles);
  };

  return (
    <div className="px-3 space-y-5">
      <h1 className="font-calsans text-base py-3">
        Vui lòng chọn upload đề thi
      </h1>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      <ExamFileUpload
        onFilesChange={handleFilesChange}
        onError={setError}
      />

      <div className="float-end mt-5">
        <Button
          onClick={handleSubmit}
          disabled={testFiles.length === 0 || isLoading}
          className="disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Đang xử lý...
            </>
          ) : (
            `Tạo (${testFiles.length} file)`
          )}
        </Button>
      </div>
    </div>
  );
}
