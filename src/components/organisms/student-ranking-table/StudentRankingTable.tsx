"use client";

import React, { useState } from "react";
import { StudentAnalysis } from "@/services/academicAnalysisService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface StudentRankingTableProps {
  students?: StudentAnalysis[];
}

export function StudentRankingTable({
  students = [],
}: StudentRankingTableProps) {
  const [showAllStudents, setShowAllStudents] = useState(false);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  // Sort students by rank
  const sortedStudents = [...students].sort((a, b) => a.rank - b.rank);

  // Show top 5 by default, all if expanded
  const displayedStudents = showAllStudents
    ? sortedStudents
    : sortedStudents.slice(0, 5);

  const getRankDisplay = (rank: number) => {
    return (
      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
        <span className="text-sm font-calsans text-gray-700">#{rank}</span>
      </div>
    );
  };

  const getGradeLevelColor = (gradeLevel: string) => {
    switch (gradeLevel) {
      case "Giỏi":
        return "bg-green-100 text-green-800 border-green-200";
      case "Khá":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Trung bình":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Yếu":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const toggleStudentDetails = (studentId: string) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-calsans">Bảng Xếp Hạng Học Sinh</h2>
        <Button
          variant="outline"
          onClick={() => setShowAllStudents(!showAllStudents)}
          className="flex items-center gap-2"
        >
          {showAllStudents ? <>Ẩn bớt</> : <>Xem tất cả ({students.length})</>}
        </Button>
      </div>

      <div className="space-y-3">
        {displayedStudents.map((studentData) => (
          <div
            key={studentData.student.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            {/* Main student info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getRankDisplay(studentData.rank)}
                </div>

                <div>
                  <h4 className="font-calsans text-gray-900">
                    {studentData.student.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Lớp: {studentData.student.class_name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-lg font-calsans text-gray-900">
                    {studentData.average_score.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Điểm TB</div>
                </div>

                <Badge className={getGradeLevelColor(studentData.grade_level)}>
                  {studentData.grade_level}
                </Badge>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleStudentDetails(studentData.student.id)}
                  className="p-2"
                >
                  {expandedStudent === studentData.student.id ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Expanded details */}
            {expandedStudent === studentData.student.id && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Strong subjects */}
                  {studentData.strong_subjects.length > 0 && (
                    <div>
                      <h5 className="font-calsans text-green-700 mb-2">
                        Môn mạnh
                      </h5>
                      <div className="flex flex-wrap gap-1">
                        {studentData.strong_subjects.map((subject) => (
                          <Badge
                            key={subject}
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Weak subjects */}
                  {studentData.weak_subjects.length > 0 && (
                    <div>
                      <h5 className="font-calsans text-red-700 mb-2">
                        Môn cần cải thiện
                      </h5>
                      <div className="flex flex-wrap gap-1">
                        {studentData.weak_subjects.map((subject) => (
                          <Badge
                            key={subject}
                            className="bg-red-50 text-red-700 border-red-200"
                          >
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Subject grades */}
                <div className="mt-4">
                  <h5 className="font-calsans text-gray-700 mb-3">
                    Điểm chi tiết theo môn
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {studentData.student.grades.map((grade) => (
                      <div
                        key={grade.subject}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm"
                      >
                        <span className="text-gray-600">{grade.subject}:</span>
                        <span className="font-calsans">{grade.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {!showAllStudents && students.length > 5 && (
        <div className="mt-4 text-center">
          <Button
            variant="outline"
            onClick={() => setShowAllStudents(true)}
            className="flex items-center gap-2 mx-auto"
          >
            Xem thêm {students.length - 5} học sinh
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
