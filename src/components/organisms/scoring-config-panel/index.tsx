"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/Switch";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Settings, ChevronDown, ChevronRight } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ScoringConfig } from "@/types/scoring";
import {
  getYesNoScoringBreakdown,
  getYesNoScoringBreakdownStandard,
} from "@/utils/scoringUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScoringConfigPanelProps {
  scoringConfig: ScoringConfig;
  onScoringConfigChange: (config: ScoringConfig) => void;
  questionsCount: number;
  yesNoQuestionsCount: number;
  shortQuestionsCount: number;
}

const defaultScoringConfig: ScoringConfig = {
  useStandardScoring: true,
  part1Score: 0.25,
  part2ScoringType: "standard",
  part2CustomScore: 1.0,
  part2ManualScores: {
    1: 0.1,
    2: 0.25,
    3: 0.5,
    4: 1.0,
  },
  part3Score: 0.25,
};

export default function ScoringConfigPanel({
  scoringConfig = defaultScoringConfig,
  onScoringConfigChange,
  questionsCount,
  yesNoQuestionsCount,
  shortQuestionsCount,
}: ScoringConfigPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleConfigChange = (updates: Partial<ScoringConfig>) => {
    const newConfig = { ...scoringConfig, ...updates };
    onScoringConfigChange(newConfig);
  };

  const handlePart2ScoringTypeChange = (
    value: "standard" | "auto" | "manual"
  ) => {
    console.log("Test", value);
    handleConfigChange({ part2ScoringType: value });
  };

  const calculateTotalScore = () => {
    if (scoringConfig.useStandardScoring) {
      // Thang điểm chuẩn: Phần 1 = 0.25, Phần 2 = 1.0, Phần 3 = 0.25
      return (
        questionsCount * 0.25 +
        yesNoQuestionsCount * 1.0 +
        shortQuestionsCount * 0.25
      );
    } else {
      // Thang điểm tùy chỉnh
      let part2Score: number;
      if (scoringConfig.part2ScoringType === "standard") {
        part2Score = 1.0;
      } else if (scoringConfig.part2ScoringType === "auto") {
        part2Score = scoringConfig.part2CustomScore;
      } else {
        // manual - tính trung bình điểm tối đa (4 ý đúng)
        part2Score = scoringConfig.part2ManualScores[4];
      }

      return (
        questionsCount * scoringConfig.part1Score +
        yesNoQuestionsCount * part2Score +
        shortQuestionsCount * scoringConfig.part3Score
      );
    }
  };

  return (
    <div className="mt-4 space-y-4">
      {/* Toggle Switch */}
      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
        <div>
          <Label className="text-sm font-calsans text-gray-700">
            Chế độ chấm điểm
          </Label>
          <p className="text-xs font-questrial text-gray-500 mt-1">
            {scoringConfig.useStandardScoring
              ? "Sử dụng thang điểm chuẩn của Bộ GD&ĐT"
              : "Tùy chỉnh điểm số cho từng phần"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`text-sm font-questrial ${
              scoringConfig.useStandardScoring
                ? "text-neutral-600 font-calsans"
                : "text-gray-500"
            }`}
          >
            Chuẩn
          </span>
          <Switch
            checked={!scoringConfig.useStandardScoring}
            onCheckedChange={(checked) =>
              handleConfigChange({ useStandardScoring: !checked })
            }
          />
          <span
            className={`text-sm ${
              !scoringConfig.useStandardScoring
                ? "font-calsans"
                : "text-gray-500 font-questrial"
            }`}
          >
            Tùy chỉnh
          </span>
        </div>
      </div>

      {/* Standard Scoring Info */}
      {scoringConfig.useStandardScoring && (
        <div className=" rounded-lg">
          <h4 className="text-base font-calsans text-neutral-800 mb-2">
            Thang điểm chuẩn THPT Quốc gia
          </h4>
          <div className="border border-cyan-300 rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-cyan-50 border-cyan-300 ">
                  <TableHead className="text-center font-calsans text-cyan-600">
                    Phần thi
                  </TableHead>
                  <TableHead className="text-center font-calsans text-cyan-600">
                    Điểm/câu
                  </TableHead>
                  <TableHead className="text-center font-calsans text-cyan-600">
                    Tổng điểm
                  </TableHead>
                  <TableHead className="text-center font-calsans text-cyan-600">
                    Chi tiết
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-none">
                  <TableCell className="text-center font-calsans">
                    Phần I
                  </TableCell>
                  <TableCell className="text-center font-questrial">
                    0.25 điểm/câu
                  </TableCell>
                  <TableCell className="text-center font-questrial text-gray-600">
                    {questionsCount} câu = {(questionsCount * 0.25).toFixed(2)}{" "}
                    điểm
                  </TableCell>
                  <TableCell className="text-center font-questrial text-gray-500 text-sm">
                    Trắc nghiệm nhiều phương án
                  </TableCell>
                </TableRow>
                <TableRow className="border-none">
                  <TableCell className="text-center font-calsans">
                    Phần II
                  </TableCell>
                  <TableCell className="text-center font-questrial">
                    1.0 điểm/câu
                  </TableCell>
                  <TableCell className="text-center font-questrial text-gray-600">
                    {yesNoQuestionsCount} câu ={" "}
                    {(yesNoQuestionsCount * 1.0).toFixed(2)} điểm
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="text-sm font-questrial text-gray-400 p-1 rounded">
                      <div className="font-calsans mb-1">Cách tính điểm:</div>
                      {(() => {
                        const breakdown = getYesNoScoringBreakdownStandard();
                        return (
                          <>
                            <div>
                              1 ý: {breakdown[1].toFixed(2)}đ | 2 ý:{" "}
                              {breakdown[2].toFixed(2)}đ
                            </div>
                            <div>
                              3 ý: {breakdown[3].toFixed(2)}đ | 4 ý:{" "}
                              {breakdown[4].toFixed(2)}đ
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow className="border-none">
                  <TableCell className="text-center font-calsans">
                    Phần III
                  </TableCell>
                  <TableCell className="text-center font-questrial">
                    0.25 điểm/câu
                  </TableCell>
                  <TableCell className="text-center font-questrial text-gray-600">
                    {shortQuestionsCount} câu ={" "}
                    {(shortQuestionsCount * 0.25).toFixed(2)} điểm
                  </TableCell>
                  <TableCell className="text-center font-questrial text-gray-500 text-sm">
                    Câu hỏi tự luận
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Custom Scoring Controls */}
      {!scoringConfig.useStandardScoring && (
        <div className="space-y-4">
          <h4 className="text-base font-calsans text-neutral-800 mb-3">
            Tùy chỉnh điểm số
          </h4>
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
              {/* Phần I */}
              <div className="space-y-2">
                <Label className="text-sm font-calsans text-gray-700">
                  Phần I - Điểm mỗi câu
                </Label>
                <Input
                  type="number"
                  step="0.05"
                  min="0"
                  max="10"
                  value={scoringConfig.part1Score}
                  onChange={(e) =>
                    handleConfigChange({
                      part1Score: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="text-sm font-questrial"
                />
                <p className="text-xs font-questrial text-gray-500">
                  {questionsCount} câu ={" "}
                  {(questionsCount * scoringConfig.part1Score).toFixed(2)} điểm
                </p>
              </div>

              {/* Phần II */}
              <div className="space-y-2 relative">
                <Label className="text-sm font-calsans text-gray-700">
                  Phần II - Cách tính điểm
                </Label>

                <Select
                  value={scoringConfig.part2ScoringType}
                  onValueChange={(value: "standard" | "auto" | "manual") =>
                    handlePart2ScoringTypeChange(value)
                  }
                >
                  <SelectTrigger className="w-full font-questrial">
                    <SelectValue placeholder="Quy chuẩn" />
                  </SelectTrigger>
                  <SelectContent className="z-50">
                    <SelectItem value="standard">
                      Chuẩn (0.1/0.25/0.5/1.0)
                    </SelectItem>
                    <SelectItem value="auto">
                      Tự động (điểm tối đa ÷ 4)
                    </SelectItem>
                    <SelectItem value="manual">Tùy chỉnh từng ý</SelectItem>
                  </SelectContent>
                </Select>

                {/* Auto mode - input điểm tối đa */}
                {scoringConfig.part2ScoringType === "auto" && (
                  <Input
                    type="number"
                    step="0.05"
                    min="0"
                    max="10"
                    value={scoringConfig.part2CustomScore}
                    onChange={(e) =>
                      handleConfigChange({
                        part2CustomScore: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="text-sm font-questrial"
                    placeholder="Điểm tối đa mỗi câu"
                  />
                )}

                {/* Manual mode - input từng ý */}
                {scoringConfig.part2ScoringType === "manual" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs font-questrial text-gray-600">
                        1 ý đúng
                      </Label>
                      <Input
                        type="number"
                        step="0.05"
                        min="0"
                        max="10"
                        value={scoringConfig.part2ManualScores[1]}
                        onChange={(e) =>
                          handleConfigChange({
                            part2ManualScores: {
                              ...scoringConfig.part2ManualScores,
                              1: parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        className="text-sm font-questrial"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-questrial text-gray-600">
                        2 ý đúng
                      </Label>
                      <Input
                        type="number"
                        step="0.05"
                        min="0"
                        max="10"
                        value={scoringConfig.part2ManualScores[2]}
                        onChange={(e) =>
                          handleConfigChange({
                            part2ManualScores: {
                              ...scoringConfig.part2ManualScores,
                              2: parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        className="text-sm font-questrial"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-questrial text-gray-600">
                        3 ý đúng
                      </Label>
                      <Input
                        type="number"
                        step="0.05"
                        min="0"
                        max="10"
                        value={scoringConfig.part2ManualScores[3]}
                        onChange={(e) =>
                          handleConfigChange({
                            part2ManualScores: {
                              ...scoringConfig.part2ManualScores,
                              3: parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        className="text-sm font-questrial"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-questrial text-gray-600">
                        4 ý đúng
                      </Label>
                      <Input
                        type="number"
                        step="0.05"
                        min="0"
                        max="10"
                        value={scoringConfig.part2ManualScores[4]}
                        onChange={(e) =>
                          handleConfigChange({
                            part2ManualScores: {
                              ...scoringConfig.part2ManualScores,
                              4: parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        className="text-sm font-questrial"
                      />
                    </div>
                  </div>
                )}

                <p className="text-xs font-questrial text-gray-500">
                  {yesNoQuestionsCount} câu ={" "}
                  {(() => {
                    let maxScore: number;
                    if (scoringConfig.part2ScoringType === "standard") {
                      maxScore = 1.0;
                    } else if (scoringConfig.part2ScoringType === "auto") {
                      maxScore = scoringConfig.part2CustomScore;
                    } else {
                      maxScore = scoringConfig.part2ManualScores[4];
                    }
                    return (yesNoQuestionsCount * maxScore).toFixed(2);
                  })()}{" "}
                  điểm
                </p>

                {/* Hiển thị breakdown cho tất cả modes */}
                {scoringConfig.part2ScoringType !== "standard" && (
                  <div className="text-xs font-questrial text-gray-400 mt-1 p-2 bg-gray-50 rounded">
                    <div className="font-calsans mb-1">Cách tính điểm:</div>
                    {(() => {
                      let breakdown: { [key: number]: number };
                      if (scoringConfig.part2ScoringType === "auto") {
                        breakdown = getYesNoScoringBreakdown(
                          scoringConfig.part2CustomScore
                        );
                      } else {
                        breakdown = scoringConfig.part2ManualScores;
                      }
                      return (
                        <>
                          <div>
                            1 ý: {breakdown[1].toFixed(2)}đ | 2 ý:{" "}
                            {breakdown[2].toFixed(2)}đ
                          </div>
                          <div>
                            3 ý: {breakdown[3].toFixed(2)}đ | 4 ý:{" "}
                            {breakdown[4].toFixed(2)}đ
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Phần III */}
              <div className="space-y-2">
                <Label className="text-sm font-calsans text-gray-700">
                  Phần III - Điểm mỗi câu
                </Label>
                <Input
                  type="number"
                  step="0.05"
                  min="0"
                  max="10"
                  value={scoringConfig.part3Score}
                  onChange={(e) =>
                    handleConfigChange({
                      part3Score: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="text-sm font-questrial"
                />
                <p className="text-xs font-questrial text-gray-500">
                  {shortQuestionsCount} câu ={" "}
                  {(shortQuestionsCount * scoringConfig.part3Score).toFixed(2)}{" "}
                  điểm
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { defaultScoringConfig };
export type { ScoringConfig };
