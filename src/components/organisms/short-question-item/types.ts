export interface ShortQuestion {
  id: string | number;
  question?: string; // For API response
  text?: string; // For backward compatibility
  answer: string;
  type: "short";
  illustrationImage?: string; // URL or path to illustration image
}

export interface ShortQuestionItemProps {
  question: ShortQuestion;
  index: number;
  onUpdate: (question: ShortQuestion) => void;
  onDelete: (id: string) => void;
}
