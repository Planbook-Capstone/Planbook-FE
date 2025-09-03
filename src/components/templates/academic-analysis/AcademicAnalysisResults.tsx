"use client";

import React, { useState } from "react";
import { AcademicAnalysisResponse } from "@/services/academicAnalysisService";
import { AcademicOverviewCompact } from "@/components/organisms/academic-overview-compact/AcademicOverviewCompact";
import { StudentLists } from "@/components/organisms/student-lists/StudentLists";
import { RecommendationsList } from "@/components/organisms/recommendations/RecommendationsList";
import { StudentRankingTable } from "@/components/organisms/student-ranking-table/StudentRankingTable";
import { ArrowLeft, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { exportAcademicAnalysisToExcel } from "@/utils/academicAnalysisExcelExport";

interface AcademicAnalysisResultsProps {
  data: AcademicAnalysisResponse;
  onReset?: () => void;
}

export function AcademicAnalysisResults({
  data,
  onReset,
}: AcademicAnalysisResultsProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportToExcel = async () => {
    if (!data) return;

    setIsExporting(true);
    try {
      await exportAcademicAnalysisToExcel(data);
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-yellow-400 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-700">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }
  console.log(data);
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Back Button and Supabase URL */}
        <div className="bg-white rounded-xl shadow-lg p-6 border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              {onReset && (
                <Button
                  onClick={onReset}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Up load file khác</span>
                </Button>
              )}
              <h1 className="text-2xl font-calsans text-gray-900">
                Kết quả phân tích học tập
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={handleExportToExcel}
                disabled={isExporting}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>{isExporting ? "Đang xuất..." : "Xuất Excel"}</span>
              </Button>
            </div>
          </div>
        </div>
        {/* Compact Overview with Charts */}
        <AcademicOverviewCompact
          totalStudents={data?.class_statistics.total_students}
          classAverage={data?.class_statistics.overall_average}
          gradeDistribution={data?.class_statistics.grade_distribution}
          subjectStatistics={data?.class_statistics.subject_statistics}
          highestScore={data?.class_statistics.highest_score}
          lowestScore={data?.class_statistics.lowest_score}
        />

        {/* Student Ranking Table */}
        <StudentRankingTable students={data?.student_summaries} />

        {/* Student Lists */}
        <StudentLists students={data?.student_summaries} />

        {/* Recommendations */}
        <RecommendationsList recommendations={data?.recommendations} />
      </div>
    </div>
  );
}
