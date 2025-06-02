"use client";

import QuestionItem from "@/components/molecules/question-item";
import { Button } from "@/components/ui/Button";

export default function TestEditor() {
  const data = Array.from({ length: 3 }, (_, i) => ({
    question: "Nhúng thanh Fe vào dung dịch CuSO4...",
    options: [
      "Thanh Fe có màu đỏ và dd nhạt dần màu xanh.",
      "Thanh Fe có màu đỏ và dd dần có màu xanh.",
      "Thanh Fe có màu trắng xám và dd nhạt dần màu xanh.",
      "Thanh Fe có màu trắng và dd nhạt dần màu xanh.",
    ],
    correctIndex: 2,
    explanation:
      "Đây là phản ứng thế giữa kim loại Fe và ion Cu2+ trong dd CuSO4.",
  }));

  return (
    <main className="flex-1 px-6 py-4 space-y-4">
      {data.map((q, i) => (
        <QuestionItem key={i} index={i} {...q} />
      ))}
      <Button variant="outline" className="w-full border-dashed">
        + Thêm câu hỏi
      </Button>
    </main>
  );
}
