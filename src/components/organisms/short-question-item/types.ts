export interface ShortQuestion {
  id: string | number;
  question?: string; // For API response
  text?: string; // For backward compatibility
  answer: string;
  type: "short";
}

export interface ShortQuestionItemProps {
  question: ShortQuestion;
  index: number;
  onUpdate: (question: ShortQuestion) => void;
  onDelete: (id: string) => void;
}
