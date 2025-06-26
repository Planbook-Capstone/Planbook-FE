import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/Button";

const levelOptions = ["Nhận biết", "Thông hiểu", "Vận dụng"];
const questionTypeOptions = ["TN", "TL"];

type Level = {
  type: string;
  questionCount: number;
  questionTypes: string[];
};

export default function MatrixLevelRow({
  value,
  onChange,
  onRemove,
}: {
  value: Level;
  onChange: (v: Level) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex gap-2 items-end mb-2">
      <Select
        value={value.type}
        onValueChange={(type) => onChange({ ...value, type })}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Level" />
        </SelectTrigger>
        <SelectContent>
          {levelOptions.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="number"
        min={1}
        value={value.questionCount}
        onChange={(e: any) =>
          onChange({ ...value, questionCount: Number(e.target.value) })
        }
        placeholder="Question count"
        className="w-24"
      />
      <Select
        value={value.questionTypes[0]}
        onValueChange={(type) => onChange({ ...value, questionTypes: [type] })}
      >
        <SelectTrigger className="w-24">
          <SelectValue placeholder="Question type" />
        </SelectTrigger>
        <SelectContent>
          {questionTypeOptions.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="destructive" size="sm" type="button" onClick={onRemove}>
        Remove
      </Button>
    </div>
  );
}
