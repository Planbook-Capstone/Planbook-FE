"use client";

import React, { useState, useEffect } from "react";
import { ExcelUpload } from "@/components/organisms/excel-upload/ExcelUpload";
import { AcademicAnalysisResults } from "./AcademicAnalysisResults";
import {
  useUploadAcademicAnalysis,
  AcademicAnalysisResponse,
} from "@/services/academicAnalysisService";
import { toast } from "sonner";
import { FileSpreadsheet, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function AcademicAnalysisPage() {
  const [analysisData, setAnalysisData] =
    useState<AcademicAnalysisResponse | null>(null);
  const [showResults, setShowResults] = useState(false);

  const uploadMutation = useUploadAcademicAnalysis();

  // Reset state on component mount
  useEffect(() => {
    setAnalysisData(null);
    setShowResults(false);
  }, []);

  const handleFileSelect = async (file: File) => {
    try {
      toast.success("Đang phân tích file Excel...");

      // Create FormData and call API
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadMutation.mutateAsync(formData);

      // Check if result has data property or is the data itself
      const analysisResult = result.data || result;

      if (analysisResult) {
        setAnalysisData(analysisResult);
        setShowResults(true);
        toast.success("Phân tích hoàn tất!");
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

  // Temporary test function with sample data for debugging
  const handleTestWithSampleData = () => {
    const sampleData = {
      class_statistics: {
        class_name: "7A",
        total_students: 10,
        overall_average: 6.6,
        highest_score: 8.72,
        lowest_score: 4.83,
        grade_distribution: {
          Giỏi: 2,
          Khá: 3,
          "Trung bình": 3,
          Yếu: 2,
        },
        top_students: [
          {
            name: "Phạm Như Anh",
            score: 8.72,
          },
          {
            name: "Lê Thị Thanh Bình",
            score: 8.05,
          },
          {
            name: "Trần Quốc Bình",
            score: 6.94,
          },
          {
            name: "Lê Thị Ngọc Diệp",
            score: 6.92,
          },
          {
            name: "Đoàn Văn Hoàng Anh",
            score: 6.65,
          },
        ],
        weak_students: [
          {
            name: "Nguyễn Văn Duy",
            score: 4.89,
          },
          {
            name: "Nguyễn Văn Đức",
            score: 4.83,
          },
        ],
        subject_statistics: [
          {
            subject: "Công Nghệ",
            average_score: 6.4,
            highest_score: 8.9,
            lowest_score: 3.6,
            highest_score_student: "Phạm Như Anh",
            lowest_score_student: "Nguyễn Văn Duy",
            total_students: 10,
            pass_rate: 80,
            excellent_count: 2,
            good_count: 3,
            average_count: 3,
            weak_count: 2,
          },
          {
            subject: "Toán",
            average_score: 6.49,
            highest_score: 8.9,
            lowest_score: 5.1,
            highest_score_student: "Phạm Như Anh",
            lowest_score_student: "Nguyễn Văn Duy",
            total_students: 10,
            pass_rate: 100,
            excellent_count: 2,
            good_count: 2,
            average_count: 6,
            weak_count: 0,
          },
          {
            subject: "Ngữ Văn",
            average_score: 6.3,
            highest_score: 8.4,
            lowest_score: 3,
            highest_score_student: "Phạm Như Anh",
            lowest_score_student: "Nguyễn Văn Đức",
            total_students: 10,
            pass_rate: 80,
            excellent_count: 2,
            good_count: 3,
            average_count: 3,
            weak_count: 2,
          },
          {
            subject: "Tiếng Anh",
            average_score: 5.95,
            highest_score: 9,
            lowest_score: 2.9,
            highest_score_student: "Phạm Như Anh",
            lowest_score_student: "Nguyễn Văn Duy",
            total_students: 10,
            pass_rate: 80,
            excellent_count: 1,
            good_count: 3,
            average_count: 4,
            weak_count: 2,
          },
          {
            subject: "Vật Lý",
            average_score: 6.76,
            highest_score: 9.7,
            lowest_score: 4.4,
            highest_score_student: "Phạm Như Anh",
            lowest_score_student: "Nguyễn Văn Đức",
            total_students: 10,
            pass_rate: 80,
            excellent_count: 2,
            good_count: 4,
            average_count: 2,
            weak_count: 2,
          },
          {
            subject: "Hóa Học",
            average_score: 6.46,
            highest_score: 8.3,
            lowest_score: 4.1,
            highest_score_student: "Phạm Như Anh",
            lowest_score_student: "Nguyễn Văn Đức",
            total_students: 10,
            pass_rate: 80,
            excellent_count: 1,
            good_count: 5,
            average_count: 2,
            weak_count: 2,
          },
          {
            subject: "Sinh Học",
            average_score: 7.13,
            highest_score: 8.8,
            lowest_score: 5.4,
            highest_score_student: "Lê Thị Thanh Bình",
            lowest_score_student: "Nguyễn Văn Đức",
            total_students: 10,
            pass_rate: 100,
            excellent_count: 2,
            good_count: 5,
            average_count: 3,
            weak_count: 0,
          },
          {
            subject: "Lịch Sử",
            average_score: 6.66,
            highest_score: 9.8,
            lowest_score: 3.6,
            highest_score_student: "Phạm Như Anh",
            lowest_score_student: "Nguyễn Văn Duy",
            total_students: 10,
            pass_rate: 90,
            excellent_count: 1,
            good_count: 5,
            average_count: 3,
            weak_count: 1,
          },
          {
            subject: "Địa Lý",
            average_score: 6.83,
            highest_score: 9.1,
            lowest_score: 4.5,
            highest_score_student: "Phạm Như Anh",
            lowest_score_student: "Lê Thị Huyền",
            total_students: 10,
            pass_rate: 90,
            excellent_count: 2,
            good_count: 4,
            average_count: 3,
            weak_count: 1,
          },
          {
            subject: "Tin Học",
            average_score: 7.18,
            highest_score: 8.6,
            lowest_score: 5.1,
            highest_score_student: "Lê Thị Thanh Bình",
            lowest_score_student: "Nguyễn Văn Đức",
            total_students: 10,
            pass_rate: 100,
            excellent_count: 4,
            good_count: 3,
            average_count: 3,
            weak_count: 0,
          },
        ],
      },
      student_summaries: [
        {
          student: {
            id: "HS001",
            name: "Phạm Như Anh",
            class_name: "7A",
            grades: [
              { subject: "Toán", score: 8.9 },
              { subject: "Ngữ Văn", score: 8.4 },
            ],
          },
          average_score: 8.72,
          rank: 1,
          grade_level: "Giỏi",
          weak_subjects: [],
          strong_subjects: ["Toán", "Ngữ Văn", "Vật Lý"],
        },
        {
          student: {
            id: "HS002",
            name: "Nguyễn Văn Duy",
            class_name: "7A",
            grades: [
              { subject: "Toán", score: 5.1 },
              { subject: "Ngữ Văn", score: 3.0 },
            ],
          },
          average_score: 4.89,
          rank: 9,
          grade_level: "Yếu",
          weak_subjects: ["Ngữ Văn", "Tiếng Anh", "Vật Lý"],
          strong_subjects: [],
        },
      ],
      recommendations: [
        "👥 Học sinh cần hỗ trợ cá nhân (2 em):",
        "   • Nguyễn Văn Duy (TB: 4.89) - Yếu: Ngữ Văn, Tiếng Anh, Vật Lý",
        "   • Nguyễn Văn Đức (TB: 4.83) - Yếu: Ngữ Văn, Vật Lý, Hóa Học",
        "🤝 Đề xuất nhóm học tập: Ghép 2 học sinh giỏi với 2 học sinh yếu để hỗ trợ lẫn nhau.",
        "   • Phạm Như Anh (TB: 8.72) hỗ trợ Nguyễn Văn Duy (TB: 4.89)",
        "   • Lê Thị Thanh Bình (TB: 8.05) hỗ trợ Nguyễn Văn Đức (TB: 4.83)",
      ],
    };

    setAnalysisData(sampleData);
    setShowResults(true);
    toast.success("Đã tải dữ liệu test!");
  };

  if (showResults && analysisData) {
    return (
      <div className="relative">
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={handleReset}
            variant="outline"
            className="bg-white shadow-lg"
          >
            Phân tích file khác
          </Button>
        </div>
        <AcademicAnalysisResults data={analysisData} />
      </div>
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
            src="/images/banner/analysis.png"
            className="w-full rounded-2xl"
          />
          <img
            src="/images/logo/glassLogo.svg"
            className="h-16 absolute top-5 left-10"
          />
        </div>

        {/* Main Content - Instructions and Upload */}
        <div className="flex gap-6 my-6">
          {/* Instructions - 2/5 width on the left */}
          <div className="w-2/5 bg-white rounded-xl shadow-lg p-6 border">
            <h3 className="text-lg font-calsans text-gray-900 mb-4">
              Hướng dẫn sử dụng
            </h3>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </span>
                <p>
                  Chuẩn bị file Excel với cấu trúc: ID học sinh, Tên, Lớp, và
                  điểm các môn học
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </span>
                <p>Tải lên file bằng cách kéo thả hoặc click để chọn file</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </span>
                <p>
                  Hệ thống sẽ tự động phân tích và hiển thị kết quả phân loại
                  học lực
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  4
                </span>
                <p>
                  Xem các biểu đồ thống kê và đề xuất cải thiện cho từng nhóm
                  học sinh
                </p>
              </div>
            </div>
          </div>

          {/* Upload Section - 3/5 width on the right */}
          <div className="w-3/5 bg-white rounded-xl shadow-lg p-8 border">
            <div className="flex items-center space-x-3 mb-6">
              <h2 className="text-xl font-calsans text-gray-900">
                Tải lên file điểm số
              </h2>
            </div>

            <ExcelUpload
              onFileSelect={handleFileSelect}
              isUploading={uploadMutation.isPending}
            />

            {/* Test Button for Development */}
            <div className="text-center mt-6">
              <Button
                onClick={handleTestWithSampleData}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                Test với dữ liệu mẫu (Debug)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
