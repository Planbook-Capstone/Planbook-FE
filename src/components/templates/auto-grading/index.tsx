"use client";

import StepHeader from "@/components/molecules/step-header";
import AutoGradingStepper from "@/components/organisms/auto-grading-stepper";
import AnswerUpload from "@/components/ui/AnswerUpload";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { useState } from "react";

const columns = [
  {
    title: "Mã số học sinh",
    dataIndex: "studentId",
    render: (text: string) => <span>{text}</span>,
  },
  {
    title: "Mã đề",
    dataIndex: "examCode",
  },
  {
    title: "Điểm",
    dataIndex: "score",
  },
  {
    title: "Số câu đúng",
    dataIndex: "correct",
  },
  {
    title: "Số câu sai",
    dataIndex: "incorrect",
  },
  {
    title: "Chi tiết",
    dataIndex: "actions",
    render: (_: any, record: any) => (
      <Button size="sm" variant="outline" onClick={() => console.log(record)}>
        Chi tiết kết quả
      </Button>
    ),
  },
];

const data = Array.from({ length: 15 }, (_, i) => ({
  key: i + 1,
  studentId: i + 1,
  examCode: 111,
  score: 10,
  correct: 10,
  incorrect: 10,
}));

export default function AutoGradingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [testFiles, setTestFiles] = useState<File[]>([]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <StepHeader
        title="12A2 - Kiểm tra 15p (2025-2026)"
        onReportClick={() => console.log("Report clicked")}
        onNextClick={() => setCurrentStep((prev) => prev + 1)}
      />
      <div className="flex flex-col justify-center gap-5">
        <AutoGradingStepper
          current={currentStep}
          steps={[
            {
              title: "Upload bài làm",
              status: currentStep === 0 ? "process" : "finish",
            },
            { title: "Upload đáp án" },
            { title: "Chấm điểm" },
          ]}
        />

        {currentStep == 0 ? (
          <AnswerUpload
            title="Tải bài làm"
            description="Chọn các file ảnh hoặc PDF bài làm của học sinh"
            acceptTypes={["image/png", "image/jpeg", "application/pdf"]}
            onFilesChange={(files) => {
              setTestFiles(files);
            }}
          />
        ) : currentStep == 1 ? (
          <AnswerUpload
            title="Tải file đáp án"
            description="Upload file excel chứa đáp án của từng mã đề"
            acceptTypes={["application/xlsx"]}
            onFilesChange={(files) => {
              setTestFiles(files);
            }}
          />
        ) : (
          <Table columns={columns} dataSource={data} rowSelection={{}} />
        )}
      </div>
    </div>
  );
}
