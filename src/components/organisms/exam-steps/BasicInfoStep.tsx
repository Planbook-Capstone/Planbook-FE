"use client";

import React from "react";
import BasicExamInfoComponent from "@/components/organisms/basic-exam-info";
import { useExamContext } from "@/contexts/ExamContext";

export default function BasicInfoStep() {
  const { basicExamInfo, updateBasicExamInfo } = useExamContext();

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-calsans text-gray-900">
          Thông tin cơ bản
        </h2>
        <p className="text-sm text-gray-600 font-questrial mt-1">
          Thiết lập thông tin cơ bản cho đề thi của bạn
        </p>
      </div>
      
      <BasicExamInfoComponent
        examInfo={basicExamInfo}
        onUpdate={updateBasicExamInfo}
      />
    </div>
  );
}
