export interface Question {
  id: string | number;
  question: string;
  options: string[] | { A: string; B: string; C: string; D: string };
  correctAnswer: number;
  answer?: string; // For API response format
  type: "single" | "multiple" | "essay" | "no-answer";
}

export interface QuestionItemProps {
  question: Question;
  index: number;
  onUpdate: (question: Question) => void;
  onDelete: (id: string) => void;
}
