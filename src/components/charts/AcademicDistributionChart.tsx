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

interface SubjectAverage {
  subject: string;
  average: number;
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

interface AcademicDistributionChartProps {
  gradeDistribution?: GradeDistribution | ApiGradeDistribution;
  subjectAverages?: SubjectAverage[] | SubjectStatistic[];
  totalStudents?: number;
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

// Helper function to normalize subject averages
function normalizeSubjectAverages(
  subjectAverages?: SubjectAverage[] | SubjectStatistic[]
): SubjectAverage[] {
  if (!subjectAverages || subjectAverages.length === 0) {
    return [];
  }

  // Check if it's the API format (SubjectStatistic)
  if ("average_score" in subjectAverages[0]) {
    return (subjectAverages as SubjectStatistic[]).map((item) => ({
      subject: item.subject,
      average: item.average_score,
    }));
  }

  // It's already in the expected format
  return subjectAverages as SubjectAverage[];
}

// Helper function to get full subject statistics
function getSubjectStatistics(
  subjectAverages?: SubjectAverage[] | SubjectStatistic[]
): SubjectStatistic[] {
  if (!subjectAverages || subjectAverages.length === 0) {
    return [];
  }

  // Check if it's the API format (SubjectStatistic)
  if ("average_score" in subjectAverages[0]) {
    return subjectAverages as SubjectStatistic[];
  }

  // Convert from simple format to full statistics (fallback)
  return (subjectAverages as SubjectAverage[]).map((item) => ({
    subject: item.subject,
    average_score: item.average,
    highest_score: 0,
    lowest_score: 0,
    highest_score_student: "",
    lowest_score_student: "",
    total_students: 0,
    pass_rate: 0,
    excellent_count: 0,
    good_count: 0,
    average_count: 0,
    weak_count: 0,
  }));
}

export function AcademicDistributionChart({
  gradeDistribution,
  subjectAverages,
  totalStudents = 0,
}: AcademicDistributionChartProps) {
  const normalizedGradeDistribution =
    normalizeGradeDistribution(gradeDistribution);
  const normalizedSubjectAverages = normalizeSubjectAverages(subjectAverages);
  const fullSubjectStatistics = getSubjectStatistics(subjectAverages);

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
  const barData = normalizedSubjectAverages.map((item, index) => {
    const fullStats = fullSubjectStatistics[index];
    return {
      subject: item.subject,
      average: item.average,
      color: "#3b82f6",
      // Add full statistics for tooltip
      highest_score: fullStats?.highest_score || 0,
      lowest_score: fullStats?.lowest_score || 0,
      highest_score_student: fullStats?.highest_score_student || "",
      lowest_score_student: fullStats?.lowest_score_student || "",
      pass_rate: fullStats?.pass_rate || 0,
      total_students: fullStats?.total_students || 0,
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart - Grade Distribution */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Phân bố học lực
        </h3>
        <div className="h-80">
          <ResponsivePie
            data={pieData}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
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
                translateY: 56,
                itemsSpacing: 0,
                itemWidth: 60,
                itemHeight: 18,
                itemTextColor: "#999",
                itemDirection: "left-to-right",
                itemOpacity: 1,
                symbolSize: 12,
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
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Điểm trung bình theo môn học
        </h3>
        <div className="h-80">
          <ResponsiveBar
            data={barData}
            keys={["average"]}
            indexBy="subject"
            margin={{ top: 20, right: 30, bottom: 80, left: 60 }}
            padding={0.3}
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
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: "Môn học",
              legendPosition: "middle",
              legendOffset: 60,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Điểm trung bình",
              legendPosition: "middle",
              legendOffset: -45,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{
              from: "color",
              modifiers: [["darker", 1.6]],
            }}
            animate={true}
            tooltip={({ data }) => (
              <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-xs">
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
                        <span className="font-medium">{data.lowest_score}</span>
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
  );
}
