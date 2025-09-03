"use client";

import React from "react";
import { AcademicAnalysisResponse } from "@/services/academicAnalysisService";
import { AcademicOverviewCompact } from "@/components/organisms/academic-overview-compact/AcademicOverviewCompact";
import { StudentLists } from "@/components/organisms/student-lists/StudentLists";
import { RecommendationsList } from "@/components/organisms/recommendations/RecommendationsList";
import { StudentRankingTable } from "@/components/organisms/student-ranking-table/StudentRankingTable";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AcademicAnalysisResultsProps {
  data: AcademicAnalysisResponse;
  onReset?: () => void;
  supabaseUrl?: string;
}

export function AcademicAnalysisResults({
  data,
  onReset,
  supabaseUrl,
}: AcademicAnalysisResultsProps) {
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

            {supabaseUrl && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">File nguồn:</span>
                <a
                  href={supabaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Xem file</span>
                </a>
              </div>
            )}
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
