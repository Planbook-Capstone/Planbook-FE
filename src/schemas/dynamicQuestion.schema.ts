import { z } from "zod";

// Base question schema
export const dynamicQuestionSchema = z.object({
  // Required fields
  question: z
    .string()
    .min(1, "Nội dung câu hỏi không được để trống")
    .min(10, "Nội dung câu hỏi phải có ít nhất 10 ký tự"),

  questionType: z.enum(["PART_I", "PART_II", "PART_III"], {
    required_error: "Vui lòng chọn loại câu hỏi",
  }),

  // Optional fields
  lessonIds: z.array(z.number()).nullable().optional(),
  referenceSource: z.string().optional(),
  difficultyLevel: z.enum(["KNOWLEDGE", "COMPREHENSION", "APPLICATION", "ANALYSIS"]).optional(),
  explanation: z.string().optional(),
  hasImage: z.boolean().default(false),
  image: z.instanceof(File).optional(),

  // PART_I (Multiple Choice) fields
  optionA: z.string().optional(),
  optionB: z.string().optional(),
  optionC: z.string().optional(),
  optionD: z.string().optional(),
  correctAnswers: z.array(z.boolean()).optional(),

  // PART_II (True/False) fields
  statementA: z.string().optional(),
  answerA: z.boolean().optional(),
  statementB: z.string().optional(),
  answerB: z.boolean().optional(),
  statementC: z.string().optional(),
  answerC: z.boolean().optional(),
  statementD: z.string().optional(),
  answerD: z.boolean().optional(),

  // PART_III (Essay) fields
  essayAnswer: z.string().optional(),
})
.refine((data) => {
  // Validate PART_I specific fields
  if (data.questionType === "PART_I") {
    return (
      data.optionA && data.optionA.length > 0 &&
      data.optionB && data.optionB.length > 0 &&
      data.optionC && data.optionC.length > 0 &&
      data.optionD && data.optionD.length > 0 &&
      data.correctAnswers && data.correctAnswers.some(answer => answer === true)
    );
  }
  return true;
}, {
  message: "Câu hỏi trắc nghiệm phải có đầy đủ 4 đáp án và ít nhất 1 đáp án đúng",
  path: ["optionA"]
})
.refine((data) => {
  // Validate PART_II specific fields
  if (data.questionType === "PART_II") {
    return (
      data.statementA && data.statementA.length > 0 &&
      data.statementB && data.statementB.length > 0 &&
      data.statementC && data.statementC.length > 0 &&
      data.statementD && data.statementD.length > 0
    );
  }
  return true;
}, {
  message: "Câu hỏi đúng/sai phải có đầy đủ 4 câu phát biểu",
  path: ["statementA"]
})
.refine((data) => {
  // Validate PART_III specific fields
  if (data.questionType === "PART_III") {
    return data.essayAnswer && data.essayAnswer.length > 0;
  }
  return true;
}, {
  message: "Câu hỏi tự luận phải có đáp án",
  path: ["essayAnswer"]
})
.refine((data) => {
  // Validate image if hasImage is true
  if (data.hasImage && !data.image) {
    return false;
  }
  return true;
}, {
  message: "Vui lòng chọn ảnh minh họa",
  path: ["image"]
});

export type DynamicQuestionFormData = z.infer<typeof dynamicQuestionSchema>;

// Helper function to get initial form values based on question type
export const getInitialFormValues = (questionType: "PART_I" | "PART_II" | "PART_III"): Partial<DynamicQuestionFormData> => {
  const baseValues: Partial<DynamicQuestionFormData> = {
    question: "",
    questionType,
    referenceSource: "",
    difficultyLevel: "KNOWLEDGE",
    explanation: "",
    hasImage: false,
    lessonIds: null,
  };

  switch (questionType) {
    case "PART_I":
      return {
        ...baseValues,
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswers: [false, false, false, false],
      };
    case "PART_II":
      return {
        ...baseValues,
        statementA: "",
        answerA: false,
        statementB: "",
        answerB: false,
        statementC: "",
        answerC: false,
        statementD: "",
        answerD: false,
      };
    case "PART_III":
      return {
        ...baseValues,
        essayAnswer: "",
      };
    default:
      return baseValues;
  }
};
