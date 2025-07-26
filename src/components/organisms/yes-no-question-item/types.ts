export interface YesNoOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface YesNoStatement {
  text: string;
  answer: boolean;
}

export interface YesNoQuestion {
  id: string | number;
  question: string; // Main question text from API
  text?: string; // For backward compatibility
  options?: YesNoOption[]; // For backward compatibility
  statements: { // API response format - required
    a: YesNoStatement;
    b: YesNoStatement;
    c: YesNoStatement;
    d: YesNoStatement;
  };
  type: "yes-no";
  illustrationImage?: string; // URL or path to illustration image
}

export interface YesNoQuestionItemProps {
  question: YesNoQuestion;
  index: number;
  onUpdate: (question: YesNoQuestion) => void;
  onDelete: (id: string) => void;
}
