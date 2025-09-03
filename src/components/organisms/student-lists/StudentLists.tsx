"use client";

import React from "react";
import { Star, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StudentAnalysis } from "@/services/academicAnalysisService";

interface StudentListsProps {
  students?: StudentAnalysis[];
}

export function StudentLists({ students = [] }: StudentListsProps) {
  // Filter students by grade level
  const excellentStudents = students.filter((s) => s.grade_level === "Giỏi");
  const goodStudents = students.filter((s) => s.grade_level === "Khá");
  const averageStudents = students.filter(
    (s) => s.grade_level === "Trung bình"
  );
  const weakStudents = students.filter((s) => s.grade_level === "Yếu");

  const StudentCard = ({
    student,
    type,
  }: {
    student: StudentAnalysis;
    type: "excellent" | "weak";
  }) => {
    const isExcellent = type === "excellent";

    return (
      <div
        className={`p-4 rounded-lg border ${
          isExcellent
            ? "bg-green-50 border-green-200"
            : "bg-orange-50 border-orange-200"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {isExcellent ? (
              <Star className="w-4 h-4 text-green-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-orange-600" />
            )}
            <span className="font-medium text-gray-900">
              {student.student.name}
            </span>
          </div>
          <Badge
            variant={isExcellent ? "default" : "destructive"}
            className={
              isExcellent
                ? "bg-green-100 text-green-800"
                : "bg-orange-100 text-orange-800"
            }
          >
            {student.average_score.toFixed(2)} điểm
          </Badge>
        </div>

        <div className="text-sm text-gray-600 mb-2">
          Lớp: {student.student.class_name} • Xếp hạng: #{student.rank}
        </div>

        {isExcellent && student.strong_subjects.length > 0 && (
          <div className="flex items-center space-x-1 mb-2">
            <TrendingUp className="w-3 h-3 text-green-600" />
            <span className="text-xs text-green-700">
              Môn mạnh: {student.strong_subjects.slice(0, 3).join(", ")}
              {student.strong_subjects.length > 3 && "..."}
            </span>
          </div>
        )}

        {!isExcellent && student.weak_subjects.length > 0 && (
          <div className="flex items-center space-x-1">
            <TrendingDown className="w-3 h-3 text-orange-600" />
            <span className="text-xs text-orange-700">
              Cần cải thiện: {student.weak_subjects.slice(0, 3).join(", ")}
              {student.weak_subjects.length > 3 && "..."}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Excellent Students */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center space-x-2 mb-4">
          <Star className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Học sinh xuất sắc
          </h3>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {excellentStudents.length + goodStudents.length} em
          </Badge>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {excellentStudents.map((student) => (
            <StudentCard
              key={student.student.id}
              student={student}
              type="excellent"
            />
          ))}
          {goodStudents.map((student) => (
            <StudentCard
              key={student.student.id}
              student={student}
              type="excellent"
            />
          ))}

          {excellentStudents.length === 0 && goodStudents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Star className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>Chưa có học sinh xuất sắc</p>
            </div>
          )}
        </div>
      </div>

      {/* Students Need Support */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Học sinh cần hỗ trợ
          </h3>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            {weakStudents.length + averageStudents.length} em
          </Badge>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {weakStudents.map((student) => (
            <StudentCard
              key={student.student.id}
              student={student}
              type="weak"
            />
          ))}
          {averageStudents.map((student) => (
            <StudentCard
              key={student.student.id}
              student={student}
              type="weak"
            />
          ))}

          {weakStudents.length === 0 && averageStudents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>Tất cả học sinh đều có kết quả tốt</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
