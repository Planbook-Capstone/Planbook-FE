"use client";

import React, { useMemo } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { SubmissionData } from "@/services/examInstanceServices";

interface ScoreDistributionChartProps {
  submissions: SubmissionData[];
  maxScore?: number;
}

interface ScoreRange {
  range: string;
  count: number;
  percentage: number;
}

export function ScoreDistributionChart({ 
  submissions, 
  maxScore = 10 
}: ScoreDistributionChartProps) {
  const chartData = useMemo(() => {
    if (!submissions || submissions.length === 0) {
      return [];
    }

    // Define score ranges based on maxScore with grade-like labels
    const ranges = [
      {
        min: 0,
        max: maxScore * 0.2,
        label: `0-${(maxScore * 0.2).toFixed(1)}`,
        grade: "Yếu",
        color: "#ef4444" // red
      },
      {
        min: maxScore * 0.2,
        max: maxScore * 0.4,
        label: `${(maxScore * 0.2).toFixed(1)}-${(maxScore * 0.4).toFixed(1)}`,
        grade: "Kém",
        color: "#E58536" // orange
      },
      {
        min: maxScore * 0.4,
        max: maxScore * 0.6,
        label: `${(maxScore * 0.4).toFixed(1)}-${(maxScore * 0.6).toFixed(1)}`,
        grade: "Trung bình",
        color: "#EFC14A" // yellow
      },
      {
        min: maxScore * 0.6,
        max: maxScore * 0.8,
        label: `${(maxScore * 0.6).toFixed(1)}-${(maxScore * 0.8).toFixed(1)}`,
        grade: "Khá",
        color: "#5BBAAC" // green
      },
      {
        min: maxScore * 0.8,
        max: maxScore,
        label: `${(maxScore * 0.8).toFixed(1)}-${maxScore}`,
        grade: "Giỏi",
        color: "#3b82f6" // blue
      },
    ];

    // Count submissions in each range
    const rangeCounts = ranges.map((range, index) => {
      const count = submissions.filter(submission => {
        // For the first range (index 0), include the minimum value
        // For other ranges, exclude the minimum to avoid double counting
        const minCondition = index === 0
          ? submission.score >= range.min
          : submission.score > range.min;

        return minCondition && submission.score <= range.max;
      }).length;

      return {
        range: range.label,
        grade: range.grade,
        count,
        percentage: submissions.length > 0 ? (count / submissions.length) * 100 : 0,
        color: range.color
      };
    });

    return rangeCounts;
  }, [submissions, maxScore]);

  if (!submissions || submissions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Chưa có dữ liệu để hiển thị biểu đồ</p>
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveBar
        data={chartData}
        keys={['count']}
        indexBy="range"
        margin={{ top: 20, right: 30, bottom: 80, left: 60 }}
        padding={0.6}
        valueScale={{ type: 'linear', min: 0 }}
        indexScale={{ type: 'band', round: true }}
        colors={(bar) => bar.data.color}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 1.6]]
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: 'Khoảng điểm',
          legendPosition: 'middle',
          legendOffset: 60,
          format: (value) => {
            const item = chartData.find(d => d.range === value);
            return item ? `${item.range}\n(${item.grade})` : value;
          }
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Số lượng học sinh',
          legendPosition: 'middle',
          legendOffset: -45,
          format: (value) => Number.isInteger(value) ? value.toString() : ''
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: 'color',
          modifiers: [['darker', 1.6]]
        }}
        tooltip={({ id, value, data }) => (
          <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg max-w-xs">
            <div className="font-semibold text-gray-900 mb-2">
              {data.grade} ({data.range} điểm)
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Số học sinh:</span>
                <span className="text-sm font-medium">{value}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tỷ lệ:</span>
                <span className="text-sm font-medium">{data.percentage.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        )}
        animate={true}
        motionConfig="gentle"
      />
    </div>
  );
}

// Additional component for detailed statistics
export function ScoreStatistics({ submissions }: { submissions: SubmissionData[] }) {
  const stats = useMemo(() => {
    if (!submissions || submissions.length === 0) {
      return null;
    }

    const scores = submissions.map(s => s.score);
    const total = submissions.length;
    const sum = scores.reduce((acc, score) => acc + score, 0);
    const average = sum / total;
    const min = Math.min(...scores);
    const max = Math.max(...scores);

    // Calculate median
    const sortedScores = [...scores].sort((a, b) => a - b);
    const median = total % 2 === 0
      ? (sortedScores[total / 2 - 1] + sortedScores[total / 2]) / 2
      : sortedScores[Math.floor(total / 2)];

    // Calculate pass/fail (assuming pass threshold is 50% of max score)
    const maxScore = submissions.length > 0 ? submissions[0].maxScore || 10 : 10;
    const passThreshold = maxScore * 0.5;
    const passCount = scores.filter(score => score >= passThreshold).length;
    const failCount = total - passCount;
    const passRate = (passCount / total) * 100;

    return {
      total,
      average: average.toFixed(2),
      median: median.toFixed(2),
      min,
      max,
      passCount,
      failCount,
      passRate: passRate.toFixed(1)
    };
  }, [submissions]);

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
      <div className="text-center p-3 bg-blue-50 rounded-lg">
        <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
        <div className="text-sm text-gray-600">Tổng số bài</div>
      </div>
      <div className="text-center p-3 bg-green-50 rounded-lg">
        <div className="text-2xl font-bold text-green-600">{stats.average}</div>
        <div className="text-sm text-gray-600">Điểm TB</div>
      </div>
      <div className="text-center p-3 bg-purple-50 rounded-lg">
        <div className="text-2xl font-bold text-purple-600">{stats.median}</div>
        <div className="text-sm text-gray-600">Điểm trung vị</div>
      </div>
      <div className="text-center p-3 bg-red-50 rounded-lg">
        <div className="text-2xl font-bold text-red-600">{stats.min}</div>
        <div className="text-sm text-gray-600">Thấp nhất</div>
      </div>
      <div className="text-center p-3 bg-orange-50 rounded-lg">
        <div className="text-2xl font-bold text-orange-600">{stats.max}</div>
        <div className="text-sm text-gray-600">Cao nhất</div>
      </div>
      <div className="text-center p-3 bg-emerald-50 rounded-lg">
        <div className="text-2xl font-bold text-emerald-600">{stats.passCount}</div>
        <div className="text-sm text-gray-600">Đạt</div>
      </div>
      <div className="text-center p-3 bg-rose-50 rounded-lg">
        <div className="text-2xl font-bold text-rose-600">{stats.failCount}</div>
        <div className="text-sm text-gray-600">Không đạt</div>
      </div>
      <div className="text-center p-3 bg-indigo-50 rounded-lg">
        <div className="text-2xl font-bold text-indigo-600">{stats.passRate}%</div>
        <div className="text-sm text-gray-600">Tỷ lệ đạt</div>
      </div>
    </div>
  );
}
