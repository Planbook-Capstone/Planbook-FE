"use client";

import { Modal } from "antd";
import Image from "next/image";
import AnswerSheetOption from "@/components/molecules/answer-sheet-option";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface Option {
  label: string;
  description?: string;
  image: string;
  isRecommend?: boolean;
}

interface SelectAnswerSheetModalProps {
  open: boolean;
  onClose: () => void;
  options: Option[];
}

export default function SelectAnswerSheetModal({
  open,
  onClose,
  options,
}: SelectAnswerSheetModalProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(2);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={1000}
      centered
      title="Chọn mẫu phiếu trả lời trắc nghiệm"
    >
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          {options.map((option, index) => (
            <AnswerSheetOption
              key={index}
              label={option.label}
              description={option.description}
              selected={index === selectedIndex}
              isRecommend={option.isRecommend}
              onSelect={() => setSelectedIndex(index)}
            />
          ))}
        </div>

        <div className="flex items-center justify-center border rounded-lg p-4">
          <Image
            src={options[selectedIndex || 0]?.image}
            alt="Preview"
            width={400}
            height={500}
            className="object-contain max-h-[600px]"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Hủy
        </Button>
        <Button>In ngay</Button>
      </div>
    </Modal>
  );
}
