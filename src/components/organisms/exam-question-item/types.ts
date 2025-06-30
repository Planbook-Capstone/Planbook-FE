export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  type: "single" | "multiple" | "essay" | "no-answer";
}

export interface QuestionItemProps {
  question: Question;
  index: number;
  onUpdate: (question: Question) => void;
  onDelete: (id: string) => void;
}
