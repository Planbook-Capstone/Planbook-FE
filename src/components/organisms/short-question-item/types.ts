export interface ShortQuestion {
  id: string;
  text: string;
  answer: string;
  type: "short";
}

export interface ShortQuestionItemProps {
  question: ShortQuestion;
  index: number;
  onUpdate: (question: ShortQuestion) => void;
  onDelete: (id: string) => void;
}
