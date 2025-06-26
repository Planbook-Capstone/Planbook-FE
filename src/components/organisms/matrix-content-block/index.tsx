import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import MatrixLevelRow from "@/components/molecules/matrix-level-row";

type Content = {
  contentName: string;
  requirement: string;
  levels: {
    type: string;
    questionCount: number;
    questionTypes: string[];
  }[];
};

export default function MatrixContentBlock({
  value,
  onChange,
  onRemove,
}: {
  value: Content;
  onChange: (v: Content) => void;
  onRemove: () => void;
}) {
  const handleLevelChange = (idx: number, newLevel: Content["levels"][0]) => {
    const newLevels = value.levels.map((lv, i) => (i === idx ? newLevel : lv));
    onChange({ ...value, levels: newLevels });
  };
  const addLevel = () => {
    onChange({
      ...value,
      levels: [
        ...value.levels,
        { type: "Nhận biết", questionCount: 1, questionTypes: ["TN"] },
      ],
    });
  };
  const removeLevel = (idx: number) => {
    onChange({
      ...value,
      levels: value.levels.filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="border p-2 mb-2 rounded">
      <div className="flex gap-2">
        <Input
          placeholder="Content name"
          value={value.contentName}
          onChange={(e: any) =>
            onChange({ ...value, contentName: e.target.value })
          }
        />
        <Input
          placeholder="Requirement"
          value={value.requirement}
          onChange={(e: any) =>
            onChange({ ...value, requirement: e.target.value })
          }
        />
        <Button
          variant="destructive"
          size="sm"
          type="button"
          onClick={onRemove}
        >
          Remove Content
        </Button>
      </div>
      <div>
        {value.levels.map((level, idx) => (
          <MatrixLevelRow
            key={idx}
            value={level}
            onChange={(newLevel) => handleLevelChange(idx, newLevel)}
            onRemove={() => removeLevel(idx)}
          />
        ))}
        <Button variant="dash" size="sm" type="button" onClick={addLevel}>
          Add Level
        </Button>
      </div>
    </div>
  );
}
