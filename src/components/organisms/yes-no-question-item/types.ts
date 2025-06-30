export interface YesNoOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface YesNoQuestion {
  id: string;
  text: string;
  options: YesNoOption[];
  type: "yes-no";
}

export interface YesNoQuestionItemProps {
  question: YesNoQuestion;
  index: number;
  onUpdate: (question: YesNoQuestion) => void;
  onDelete: (id: string) => void;
}
