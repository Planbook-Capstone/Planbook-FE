"use client";

import React from "react";
import { AcademicAnalysisResponse } from "@/services/academicAnalysisService";
import { AcademicOverviewCompact } from "@/components/organisms/academic-overview-compact/AcademicOverviewCompact";
import { StudentLists } from "@/components/organisms/student-lists/StudentLists";
import { RecommendationsList } from "@/components/organisms/recommendations/RecommendationsList";
import { StudentRankingTable } from "@/components/organisms/student-ranking-table/StudentRankingTable";

interface AcademicAnalysisResultsProps {
  data: AcademicAnalysisResponse;
}

export function AcademicAnalysisResults({
  data,
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
