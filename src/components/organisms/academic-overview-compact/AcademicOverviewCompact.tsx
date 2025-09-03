"use client";

import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";

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
      color: "text-blue-600",
    },
    {
      label: "Điểm trung bình cả lớp",
      value: classAverage ? classAverage.toFixed(2) : "0.00",
      color: "text-green-600",
    },
    {
      label: "Điểm cao nhất",
      value: highestScore ? highestScore.toFixed(2) : "0.00",
      color: "text-yellow-600",
    },
    {
      label: "Điểm thấp nhất",
      value: lowestScore ? lowestScore.toFixed(2) : "0.00",
      color: "text-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overall Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {keyStats.map((stat, index) => {
          return (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="text-sm text-gray-600 font-calsans">
                {stat.label}
              </div>
              <div className={`text-2xl font-calsans ${stat.color}`}>
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Grade Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-calsans mb-4">Phân bố học lực</h2>
          <div className="h-96 w-full">
            <ResponsivePie
              data={pieData}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={50}
              activeOuterRadiusOffset={8}
              defs={[
                {
                  id: "excellentGradient",
                  type: "linearGradient",
                  colors: [
                    { offset: 45, color: "#10b981" },
                    { offset: 80, color: "#059669" },
                    { offset: 100, color: "#047857" },
                  ],
                },
                {
                  id: "goodGradient",
                  type: "linearGradient",
                  colors: [
                    { offset: 45, color: "#3b82f6" },
                    { offset: 80, color: "#2563eb" },
                    { offset: 100, color: "#1d4ed8" },
                  ],
                },
                {
                  id: "averageGradient",
                  type: "linearGradient",
                  colors: [
                    { offset: 45, color: "#f59e0b" },
                    { offset: 80, color: "#d97706" },
                    { offset: 100, color: "#b45309" },
                  ],
                },
                {
                  id: "weakGradient",
                  type: "linearGradient",
                  colors: [
                    { offset: 45, color: "#ef4444" },
                    { offset: 80, color: "#dc2626" },
                    { offset: 100, color: "#b91c1c" },
                  ],
                },
              ]}
              fill={[
                { match: { id: "Giỏi" }, id: "excellentGradient" },
                { match: { id: "Khá" }, id: "goodGradient" },
                { match: { id: "Trung bình" }, id: "averageGradient" },
                { match: { id: "Yếu" }, id: "weakGradient" },
              ]}
              colors={{ datum: "data.color" }}
              borderWidth={0}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: "color" }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{
                from: "color",
                modifiers: [["darker", 2]],
              }}
              theme={{
                labels: {
                  text: {
                    fontFamily: "Questrial, sans-serif",
                  },
                },
                legends: {
                  text: {
                    fontFamily: "Questrial, sans-serif",
                  },
                },
              }}
              legends={[
                {
                  anchor: "bottom",
                  direction: "row",
                  justify: false,
                  translateX: 0,
                  translateY: 56,
                  itemsSpacing: 0,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: "#999",
                  itemDirection: "left-to-right",
                  itemOpacity: 1,
                  symbolSize: 18,
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
              tooltip={({ datum }) => (
                <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg font-questrial min-w-[200px]">
                  <div className="font-calsans text-gray-900 mb-2 whitespace-nowrap">
                    {datum.label}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: datum.color }}
                        />
                        <span className="text-sm text-gray-600">Số lượng:</span>
                      </div>
                      <span className="text-sm font-calsans">
                        {datum.value}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tỷ lệ:</span>
                      <span className="text-sm font-calsans">
                        {datum.data.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
              animate={true}
              motionConfig="gentle"
            />
          </div>
        </div>

        {/* Bar Chart - Subject Averages */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-calsans mb-4">
            Điểm trung bình theo môn
          </h2>
          <div className="h-96 w-full">
            <ResponsiveBar
              data={barData}
              keys={["average"]}
              indexBy="subject"
              margin={{ top: 20, right: 20, bottom: 80, left: 40 }}
              padding={0.3}
              valueScale={{ type: "linear", min: 0, max: 10 }}
              indexScale={{ type: "band", round: true }}
              defs={[
                {
                  id: "barGradient",
                  type: "linearGradient",
                  colors: [
                    { offset: 0, color: "#3AA7FC" },
                    { offset: 50, color: "#407BE9" },
                    { offset: 100, color: "#3714A2" },
                  ],
                },
              ]}
              fill={[{ match: "*", id: "barGradient" }]}
              borderColor={{
                from: "color",
                modifiers: [["darker", 1.6]],
              }}
              borderRadius={4}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: "",
                legendPosition: "middle",
                legendOffset: 40,
                format: (value) => {
                  // Truncate long subject names
                  return value.length > 10
                    ? value.substring(0, 8) + "..."
                    : value;
                },
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "",
                legendPosition: "middle",
                legendOffset: -35,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{
                from: "color",
                modifiers: [["darker", 1.6]],
              }}
              theme={{
                axis: {
                  ticks: {
                    text: {
                      fontFamily: "Questrial, sans-serif",
                    },
                  },
                },
                labels: {
                  text: {
                    fontFamily: "Questrial, sans-serif",
                  },
                },
              }}
              animate={true}
              motionConfig="gentle"
              tooltip={({ data }) => (
                <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg font-questrial min-w-[250px]">
                  <div className="font-calsans text-gray-900 mb-2">
                    {data.subject}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Điểm TB:</span>
                      <span className="font-calsans">
                        {data.average.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tỷ lệ đạt:</span>
                      <span className="font-calsans">{data.pass_rate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tổng HS:</span>
                      <span className="font-calsans">
                        {data.total_students}
                      </span>
                    </div>
                    <hr className="my-2 border-gray-200" />
                    <div className="space-y-2">
                      <div className="text-green-600">
                        <div className="flex justify-between">
                          <span>Cao nhất:</span>
                          <span className="font-calsans">
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
                          <span className="font-calsans">
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
