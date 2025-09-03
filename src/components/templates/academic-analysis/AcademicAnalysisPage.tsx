"use client";

import React, { useState, useEffect } from "react";
import { ExcelUpload } from "@/components/organisms/excel-upload/ExcelUpload";
import { AcademicAnalysisResults } from "./AcademicAnalysisResults";
import {
  useUploadAcademicAnalysis,
  AcademicAnalysisResponse,
} from "@/services/academicAnalysisService";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSearchParams } from "next/navigation";
import { useUploadAndExecuteToolService } from "@/services/executeToolServices";

export function AcademicAnalysisPage() {
  const [analysisData, setAnalysisData] =
    useState<AcademicAnalysisResponse | null>(null);
  const [showResults, setShowResults] = useState(false);

  const searchParams = useSearchParams();
  const bookTypeId = searchParams.get("bookTypeId") || "";

  const uploadAndExecuteMutation = useUploadAndExecuteToolService();

  // Reset state on component mount
  useEffect(() => {
    setAnalysisData(null);
    setShowResults(false);
  }, []);

  const handleFileSelect = async (file: File) => {
    try {
      toast.success("Đang tiến phân tích...");

      const result = await uploadAndExecuteMutation.mutateAsync({
        file,
        toolId: bookTypeId,
        bookId: 1,
        lessonId: 1,
        academicYearId: 1,
        bucketName: "planbook",
      });

      // Extract analysis result from tool execution
      const analysisResult = result.toolResult?.data?.data.data;

      if (analysisResult) {
        setAnalysisData(analysisResult);
        setShowResults(true);
        toast.success("Phân tích hoàn tất!");
        console.log("Supabase URL:", result.supabaseUrl);
        console.log("Tool Result:", result.toolResult?.data?.data?.data);
      } else {
        toast.error("Không nhận được dữ liệu từ server");
      }
    } catch (error) {
      console.error("Error analyzing file:", error);
      toast.error("Có lỗi xảy ra khi phân tích file");
    }
  };

  const handleReset = () => {
    setAnalysisData(null);
    setShowResults(false);
  };

  const handleDownloadTemplate = () => {
    const templateUrl =
      "https://gdwgakooknyysyrltfmq.supabase.co/storage/v1/object/public/planbook/bang_diem_format_ngang.xlsx";
    const link = document.createElement("a");
    link.href = templateUrl;
    link.download = "template_phan_tich_hoc_luc.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Đang tải template...");
  };

  if (showResults && analysisData) {
    return (
      <AcademicAnalysisResults data={analysisData} onReset={handleReset} />
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {/* <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gray-600 rounded-full">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Phân Tích Học Lực
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tải lên file Excel chứa điểm số học sinh để phân tích học lực, xếp
            loại và đưa ra các đề xuất cải thiện
          </p>
        </div> */}
        <div className="relative">
          <img
            src="/images/banner/bannerAcademicAnalysis.svg"
            className="w-full rounded-2xl"
          />
          <img
            src="/images/logo/glassLogo.svg"
            className="h-16 absolute top-5 left-10"
          />
        </div>

        {/* Main Content - Instructions and Upload */}
        <div className="flex flex-col md:flex-row gap-6 my-6">
          {/* Instructions - 2/5 width on the left */}
          <div className="w-full md:w-2/5 bg-white rounded-xl shadow-lg p-6 border">
            <h3 className="text-lg font-calsans text-gray-900 mb-4">
              Hướng dẫn sử dụng
            </h3>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </span>
                <div className="flex-1">
                  <p className="mb-2">
                    Tải xuống template mẫu để chuẩn bị file Excel đúng cấu trúc
                  </p>
                  <Button
                    onClick={handleDownloadTemplate}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>Tải template mẫu</span>
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </span>
                <p>
                  Điền thông tin học sinh và điểm số vào template theo đúng cấu
                  trúc: mã học sinh, Tên, Lớp, và điểm các môn học
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </span>
                <p>Tải lên file bằng cách kéo thả hoặc click để chọn file</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  4
                </span>
                <p>
                  Hệ thống sẽ tự động phân tích và hiển thị kết quả phân loại
                  học lực
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  5
                </span>
                <p>
                  Xem các biểu đồ thống kê và đề xuất cải thiện cho từng nhóm
                  học sinh
                </p>
              </div>
            </div>
          </div>

          {/* Upload Section - 3/5 width on the right */}
          <div className="w-full md:w-3/5 bg-white rounded-xl shadow-lg p-8 border">
            <div className="flex items-center space-x-3 mb-6">
              <h2 className="text-xl font-calsans text-gray-900">
                Tải lên file điểm số
              </h2>
            </div>

            <ExcelUpload
              onFileSelect={handleFileSelect}
              isUploading={uploadAndExecuteMutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
