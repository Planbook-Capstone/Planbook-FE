"use client";

import { useState } from "react";
import { Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import AnswerOption from "@/components/ui/AnswerOption";

interface QuestionItemProps {
  index: number;
  question: string;
  options: string[];
  correctIndex?: number;
  explanation?: string;
  onChange?: (newData: any) => void;
}

export default function QuestionItem({
  index,
  question,
  options,
  correctIndex,
  explanation,
  onChange,
}: QuestionItemProps) {
  const [selected, setSelected] = useState(correctIndex ?? -1);
  const [note, setNote] = useState(explanation ?? "");

  return (
    <div className="space-y-3 border rounded-md p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Câu {index + 1}:</h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Copy size={16} />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
      <input
        type="text"
        defaultValue={question}
        placeholder="Nhập nội dung câu hỏi"
        className="w-full px-3 py-2 border rounded-md text-sm"
      />
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt, i) => (
          <AnswerOption
            key={i}
            label={String.fromCharCode(65 + i)}
            checked={selected === i}
            onChange={() => setSelected(i)}
          />
        ))}
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Giải thích đáp án..."
        className="w-full border rounded-md text-sm px-3 py-2"
      />
    </div>
  );
}
