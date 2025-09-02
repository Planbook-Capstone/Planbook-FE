"use client";

import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import { Users, TrendingUp, TrendingDown, Award } from "lucide-react";

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

interface SubjectStatistic {
  subject: string;
  average_score: number;
  highest_score: number;
  lowest_score: number;
  highest_score_student: string;
  lowest_score_student: string;
  total_students: number;
  pass_rate: number;
  excellent_count: number;
  good_count: number;
  average_count: number;
  weak_count: number;
}

interface AcademicOverviewCompactProps {
  totalStudents?: number;
  classAverage?: number;
  gradeDistribution?: GradeDistribution | ApiGradeDistribution;
  subjectStatistics?: SubjectStatistic[];
  highestScore?: number;
  lowestScore?: number;
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

export function AcademicOverviewCompact({
  totalStudents = 0,
  classAverage = 0,
  gradeDistribution,
  subjectStatistics = [],
  highestScore = 0,
  lowestScore = 0,
}: AcademicOverviewCompactProps) {
  const normalizedGradeDistribution =
    normalizeGradeDistribution(gradeDistribution);

  // Prepare pie chart data
  const pieData = [
    {
      id: "Giỏi",
      label: "Giỏi",
      value: normalizedGradeDistribution.excellent,
      color: "#10b981", // green
      percentage: Math.round(
        (normalizedGradeDistribution.excellent / totalStudents) * 100
      ),
    },
    {
      id: "Khá",
      label: "Khá",
      value: normalizedGradeDistribution.good,
      color: "#3b82f6", // blue
      percentage: Math.round(
        (normalizedGradeDistribution.good / totalStudents) * 100
      ),
    },
    {
      id: "Trung bình",
      label: "Trung bình",
      value: normalizedGradeDistribution.average,
      color: "#f59e0b", // yellow
      percentage: Math.round(
        (normalizedGradeDistribution.average / totalStudents) * 100
      ),
    },
    {
      id: "Yếu",
      label: "Yếu",
      value: normalizedGradeDistribution.weak,
      color: "#ef4444", // red
      percentage: Math.round(
        (normalizedGradeDistribution.weak / totalStudents) * 100
      ),
    },
  ].filter((item) => item.value > 0);

  // Prepare bar chart data with full statistics for tooltip
  const barData = subjectStatistics.map((item) => ({
    subject: item.subject,
    average: item.average_score,
    color: "#3b82f6",
    highest_score: item.highest_score,
    lowest_score: item.lowest_score,
    highest_score_student: item.highest_score_student,
    lowest_score_student: item.lowest_score_student,
    pass_rate: item.pass_rate,
    total_students: item.total_students,
  }));

  // Key stats for compact display
  const keyStats = [
    {
      label: "Tổng học sinh",
      value: totalStudents,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Điểm trung bình cả lớp",
      value: classAverage ? classAverage.toFixed(2) : "0.00",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Điểm cao nhất",
      value: highestScore ? highestScore.toFixed(2) : "0.00",
      icon: Award,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      label: "Điểm thấp nhất",
      value: lowestScore ? lowestScore.toFixed(2) : "0.00",
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Tổng Quan Học Lực
      </h2>

      {/* Compact Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {keyStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} rounded-lg p-3 text-center min-w-0`}
            >
              <div className="flex items-center justify-center mb-1">
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="text-lg font-bold text-gray-900 truncate">
                {stat.value}
              </div>
              <div className={`text-xs font-medium ${stat.color} truncate`}>
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Pie Chart - Grade Distribution */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Phân bố học lực
          </h3>
          <div className="h-64">
            <ResponsivePie
              data={pieData}
              margin={{ top: 20, right: 60, bottom: 60, left: 60 }}
              innerRadius={0.4}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              colors={{ datum: "data.color" }}
              borderWidth={1}
              borderColor={{
                from: "color",
                modifiers: [["darker", 0.2]],
              }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: "color" }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{
                from: "color",
                modifiers: [["darker", 2]],
              }}
              arcLabel={(d) => `${d.data.percentage}%`}
              legends={[
                {
                  anchor: "bottom",
                  direction: "row",
                  justify: false,
                  translateX: 0,
                  translateY: 40,
                  itemsSpacing: 0,
                  itemWidth: 50,
                  itemHeight: 18,
                  itemTextColor: "#999",
                  itemDirection: "left-to-right",
                  itemOpacity: 1,
                  symbolSize: 10,
                  symbolShape: "circle",
                  effects: [
                    {
                      on: "hover",
                      style: {
                        itemTextColor: "#000",
                      },
                    },
                  ],
                },
              ]}
            />
          </div>
        </div>

        {/* Bar Chart - Subject Averages */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Điểm trung bình theo môn
          </h3>
          <div className="h-64 min-w-0">
            <ResponsiveBar
              data={barData}
              keys={["average"]}
              indexBy="subject"
              margin={{ top: 20, right: 10, bottom: 80, left: 35 }}
              padding={0.2}
              valueScale={{ type: "linear", min: 0, max: 10 }}
              indexScale={{ type: "band", round: true }}
              colors="#3b82f6"
              borderColor={{
                from: "color",
                modifiers: [["darker", 1.6]],
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 3,
                tickPadding: 3,
                tickRotation: -45,
                legend: "",
                legendPosition: "middle",
                legendOffset: 40,
                format: (value) => {
                  // Truncate long subject names
                  return value.length > 8
                    ? value.substring(0, 6) + "..."
                    : value;
                },
              }}
              axisLeft={{
                tickSize: 3,
                tickPadding: 3,
                tickRotation: 0,
                legend: "",
                legendPosition: "middle",
                legendOffset: -30,
              }}
              labelSkipWidth={8}
              labelSkipHeight={8}
              labelTextColor={{
                from: "color",
                modifiers: [["darker", 1.6]],
              }}
              animate={true}
              tooltip={({ data }) => (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 max-w-xs">
                  <div className="font-semibold text-gray-900 mb-2">
                    {data.subject}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Điểm TB:</span>
                      <span className="font-medium">
                        {data.average.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tỷ lệ đạt:</span>
                      <span className="font-medium">{data.pass_rate}%</span>
                    </div>
                    <hr className="my-2" />
                    <div className="space-y-1">
                      <div className="text-green-600">
                        <div className="flex justify-between">
                          <span>Cao nhất:</span>
                          <span className="font-medium">
                            {data.highest_score}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 text-right">
                          {data.highest_score_student}
                        </div>
                      </div>
                      <div className="text-red-600">
                        <div className="flex justify-between">
                          <span>Thấp nhất:</span>
                          <span className="font-medium">
                            {data.lowest_score}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 text-right">
                          {data.lowest_score_student}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
