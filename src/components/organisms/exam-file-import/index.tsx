"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { AlertCircle, Loader2 } from "lucide-react";
import ExamFileUpload from "./ExamFileUpload";
import { useExamImportService } from "@/services/examImportServices";
import { toast } from "sonner";

interface ExamFileImportProps {
  onSubmit?: (files: File[], apiResponse?: any) => void;
}

export default function ExamFileImport({ onSubmit }: ExamFileImportProps) {
  const [testFiles, setTestFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>("");

  // Initialize the exam import service
  const { mutate: importExam, isPending: isImporting } = useExamImportService();

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

    // Create FormData for file upload
    const formData = new FormData();

    // Add each file to FormData
    testFiles.forEach((file) => {
      formData.append(`file`, file); // Use 'files' as the key for multiple files
    });

    // Log FormData contents
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // Call the exam import service
    importExam(formData, {
      onSuccess: (response) => {
        console.log("✅ Exam import successful:", response);
        toast.success("Import đề thi thành công!");

        // Call the onSubmit callback with files and API response
        onSubmit?.(testFiles, response);
      },
      onError: (error) => {
        console.error("❌ Exam import failed:", error);
        toast.error("Import đề thi thất bại. Vui lòng thử lại!");
        setError("Import thất bại. Vui lòng kiểm tra file và thử lại.");
      }
    });
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
          disabled={testFiles.length === 0 || isImporting}
          className="disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isImporting ? (
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
