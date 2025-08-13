"use client";

import { CanvasElement } from "@/components/templates/canva-layout";
import ExamPreview from "@/components/organisms/exam-preview";
import { useExamContext } from "@/contexts/ExamContext";
import { Button } from "@/components/ui/Button";
import { X, Share2 } from "lucide-react";
import { DowloadIcon } from "@/constants/icon";
import { generateExamDocx, ExamData } from "@/utils/docxGeneratorExam";

interface ExamPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  elements: CanvasElement[];
}

export default function ExamPreviewModal({
  isOpen,
  onClose,
  elements,
}: ExamPreviewModalProps) {
  const { examQuestions, examYesNoQuestions, examShortQuestions, basicExamInfo } =
    useExamContext();

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      const examData: ExamData = {
        examTitle: "ĐỀ KIỂM TRA LỚP 12",
        examSubject: basicExamInfo.subject,
        examTime: `${basicExamInfo.duration_minutes} phút, không kể thời gian phát đề`,
        examDate: new Date().toLocaleDateString("vi-VN"),
        examCode: basicExamInfo.exam_code,
        atomic_masses: basicExamInfo.atomic_masses,
        questions: examQuestions.map((q) => ({
          question: q.question,
          options: q.options,
          illustrationImage: q.illustrationImage,
        })),
        yesNoQuestions: examYesNoQuestions.map((q) => ({
          question: q.question,
          statements: {
            a: { text: q.statements.a.text },
            b: { text: q.statements.b.text },
            c: { text: q.statements.c.text },
            d: { text: q.statements.d.text },
          },
          illustrationImage: q.illustrationImage,
        })),
        shortQuestions: examShortQuestions.map((q) => ({
          question: q.question || q.text || "",
          illustrationImage: q.illustrationImage,
        })),
      };

      await generateExamDocx(examData);
    } catch (error) {
      console.error("Error downloading exam:", error);
      alert("Có lỗi xảy ra khi tải xuống đề thi. Vui lòng thử lại.");
    }
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log("Share exam");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-calsans text-gray-800">
            Xem trước đề thi
          </h2>
          <div className="flex items-center gap-3">
            <Button onClick={handleDownload}>
              {DowloadIcon}
              <span>Tải về</span>
            </Button>
       
            <Button onClick={onClose} variant="outline">
              <X className="w-4 h-4" />
              <span>Đóng</span>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <ExamPreview
            questions={examQuestions}
            yesNoQuestions={examYesNoQuestions}
            shortQuestions={examShortQuestions}
          />
        </div>
      </div>
    </div>
  );
}
