import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import MatrixContentBlock from "@/components/organisms/matrix-content-block";

type Content = {
  contentName: string;
  requirement: string;
  levels: {
    type: string;
    questionCount: number;
    questionTypes: string[];
  }[];
};

type Lesson = {
  lessonName: string;
  questionCount: number;
  contents: Content[];
};

export default function MatrixLessonBlock({
  value,
  onChange,
  onRemove,
}: {
  value: Lesson;
  onChange: (v: Lesson) => void;
  onRemove: () => void;
}) {
  const handleContentChange = (idx: number, newContent: Content) => {
    onChange({
      ...value,
      contents: value.contents.map((content, i) =>
        i === idx ? newContent : content
      ),
    });
  };

  const addContent = () => {
    onChange({
      ...value,
      contents: [
        ...value.contents,
        {
          contentName: "",
          requirement: "",
          levels: [
            { type: "Nhận biết", questionCount: 1, questionTypes: ["TN"] },
          ],
        },
      ],
    });
  };

  const removeContent = (idx: number) => {
    onChange({
      ...value,
      contents: value.contents.filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="border-2 p-3 mb-4 rounded">
      <div className="flex gap-2 items-end mb-2">
        <Input
          placeholder="Lesson name"
          value={value.lessonName}
          onChange={(e: any) =>
            onChange({ ...value, lessonName: e.target.value })
          }
        />
        <Input
          type="number"
          min={1}
          placeholder="Question count"
          value={value.questionCount}
          onChange={(e: any) =>
            onChange({ ...value, questionCount: Number(e.target.value) })
          }
        />
        <Button
          variant="destructive"
          size="sm"
          type="button"
          onClick={onRemove}
        >
          Remove Lesson
        </Button>
      </div>
      {value.contents.map((content, idx) => (
        <MatrixContentBlock
          key={idx}
          value={content}
          onChange={(newContent) => handleContentChange(idx, newContent)}
          onRemove={() => removeContent(idx)}
        />
      ))}
      <Button variant="dash" size="sm" type="button" onClick={addContent}>
        Add Content
      </Button>
    </div>
  );
}
