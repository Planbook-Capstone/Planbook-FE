"use client";

import React from "react";
import { CanvasElement } from "@/components/templates/canva-layout";
import ExamPreview from '@/components/organisms/exam-preview';
import { useExamContext } from '@/contexts/ExamContext';
import { Button } from "@/components/ui/Button";
import { X, Download, Share2 } from "lucide-react";

interface ExamPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  elements: CanvasElement[];
}

export default function ExamPreviewModal({ isOpen, onClose, elements }: ExamPreviewModalProps) {
  const { examQuestions, examYesNoQuestions, examShortQuestions } = useExamContext();

  if (!isOpen) return null;

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log("Download exam");
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
          <h2 className="text-xl font-semibold text-gray-800">
            Xem trước đề thi
          </h2>
          <div className="flex items-center gap-3">
            <Button onClick={handleDownload} variant="default">
              <Download className="w-4 h-4" />
              <span>Tải về</span>
            </Button>
            <Button onClick={handleShare} variant="outline">
              <Share2 className="w-4 h-4" />
              <span>Chia sẻ</span>
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
