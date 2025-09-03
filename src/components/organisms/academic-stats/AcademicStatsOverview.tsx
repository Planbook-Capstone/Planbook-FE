"use client";

import React from "react";
import { Users, TrendingUp, Award, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GradeDistribution {
  excellent: number;
  good: number;
  average: number;
  weak: number;
}

interface ApiGradeDistribution {
  Giỏi: number;
  Khá: number;
  "Trung bình": number;
  Yếu: number;
}

interface AcademicStatsOverviewProps {
  totalStudents?: number;
  classAverage?: number;
  gradeDistribution?: GradeDistribution | ApiGradeDistribution;
}

// Helper function to normalize grade distribution
function normalizeGradeDistribution(
  gradeDistribution?: GradeDistribution | ApiGradeDistribution
): GradeDistribution {
  if (!gradeDistribution) {
    return { excellent: 0, good: 0, average: 0, weak: 0 };
  }

  // Check if it's the API format
  if ("Giỏi" in gradeDistribution) {
    return {
      excellent: gradeDistribution["Giỏi"] || 0,
      good: gradeDistribution["Khá"] || 0,
      average: gradeDistribution["Trung bình"] || 0,
      weak: gradeDistribution["Yếu"] || 0,
    };
  }

  // It's already in the expected format
  return gradeDistribution as GradeDistribution;
}

export function AcademicStatsOverview({
  totalStudents = 0,
  classAverage = 0,
  gradeDistribution,
}: AcademicStatsOverviewProps) {
  const normalizedGradeDistribution =
    normalizeGradeDistribution(gradeDistribution);
  const stats = [
    {
      label: "Tổng số học sinh",
      value: totalStudents,
      icon: Users,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      label: "Điểm trung bình lớp",
      value: classAverage ? classAverage.toFixed(2) : "0.00",
      icon: TrendingUp,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      label: "Học sinh giỏi/khá",
      value:
        (normalizedGradeDistribution?.excellent || 0) +
        (normalizedGradeDistribution?.good || 0),
      icon: Award,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
    },
    {
      label: "Học sinh cần hỗ trợ",
      value:
        (normalizedGradeDistribution?.weak || 0) +
        (normalizedGradeDistribution?.average || 0),
      icon: AlertCircle,
      color: "bg-red-500",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
    },
  ];

  const gradeLabels = [
    {
      key: "excellent",
      label: "Giỏi",
      count: normalizedGradeDistribution?.excellent || 0,
      color: "bg-green-500",
    },
    {
      key: "good",
      label: "Khá",
      count: normalizedGradeDistribution?.good || 0,
      color: "bg-blue-500",
    },
    {
      key: "average",
      label: "Trung bình",
      count: normalizedGradeDistribution?.average || 0,
      color: "bg-yellow-500",
    },
    {
      key: "weak",
      label: "Yếu",
      count: normalizedGradeDistribution?.weak || 0,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Phân loại học lực
      </h2>

      {/* Grade Distribution Badges */}
      <div className="flex flex-wrap gap-3 mb-6">
        {gradeLabels.map((grade) => (
          <Badge
            key={grade.key}
            variant="secondary"
            className={`${grade.color} text-white px-3 py-1 text-sm font-medium`}
          >
            {grade.label}: {grade.count} học sinh (
            {totalStudents > 0
              ? Math.round((grade.count / totalStudents) * 100)
              : 0}
            %)
          </Badge>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} rounded-lg p-4 border border-gray-100`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 ${stat.color} rounded-lg`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm font-medium ${stat.textColor}`}>
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
