/**
 * Backend Scoring Utilities
 * Các function này có thể được sử dụng bởi backend để tính điểm
 */

import { ScoringConfig, YesNoQuestionAnswer } from "@/types/scoring";

/**
 * Tính điểm cho câu hỏi Yes/No dựa trên scoring config
 *
 * @param userAnswers Đáp án của học sinh { a: true, b: false, c: true, d: false }
 * @param correctAnswers Đáp án đúng { a: true, b: false, c: true, d: true }
 * @param scoringConfig Cấu hình chấm điểm
 * @returns Điểm số đạt được
 */
export function calculateYesNoScore(
  userAnswers: { a: boolean; b: boolean; c: boolean; d: boolean },
  correctAnswers: { a: boolean; b: boolean; c: boolean; d: boolean },
  scoringConfig: ScoringConfig
): number {
  // Đếm số ý trả lời đúng
  let correctCount = 0;
  const keys: (keyof typeof userAnswers)[] = ["a", "b", "c", "d"];

  for (const key of keys) {
    if (userAnswers[key] === correctAnswers[key]) {
      correctCount++;
    }
  }

  // Tính điểm dựa trên scoring config
  if (scoringConfig.part2ScoringType === "standard") {
    // Chuẩn: 0.1/0.25/0.5/1.0
    const standardScores = { 0: 0, 1: 0.1, 2: 0.25, 3: 0.5, 4: 1.0 };
    return standardScores[correctCount as 0 | 1 | 2 | 3 | 4] || 0;
  } else if (scoringConfig.part2ScoringType === "auto") {
    // Tự động: điểm tối đa ÷ 4
    const scorePerCorrect = scoringConfig.part2CustomScore / 4;
    return correctCount * scorePerCorrect;
  } else {
    // Manual: sử dụng điểm đã cấu hình
    return scoringConfig.part2ManualScores[correctCount as 1 | 2 | 3 | 4] || 0;
  }
}

/**
 * Tính điểm cho câu hỏi trắc nghiệm
 *
 * @param userAnswer Đáp án của học sinh (A, B, C, D)
 * @param correctAnswer Đáp án đúng (A, B, C, D)
 * @param scoringConfig Cấu hình chấm điểm
 * @returns Điểm số đạt được
 */
export function calculateMultipleChoiceScore(
  userAnswer: string,
  correctAnswer: string,
  scoringConfig: ScoringConfig
): number {
  if (userAnswer === correctAnswer) {
    return scoringConfig.useStandardScoring ? 0.25 : scoringConfig.part1Score;
  }
  return 0;
}

/**
 * Tính điểm cho câu hỏi tự luận
 *
 * @param userAnswer Đáp án của học sinh
 * @param correctAnswer Đáp án đúng (có thể là array các đáp án chấp nhận được)
 * @param scoringConfig Cấu hình chấm điểm
 * @returns Điểm số đạt được
 */
export function calculateShortAnswerScore(
  userAnswer: string,
  correctAnswer: string | string[],
  scoringConfig: ScoringConfig
): number {
  const userAnswerNormalized = userAnswer.trim().toLowerCase();

  if (Array.isArray(correctAnswer)) {
    // Kiểm tra với nhiều đáp án chấp nhận được
    const isCorrect = correctAnswer.some(
      (answer) => answer.trim().toLowerCase() === userAnswerNormalized
    );
    if (isCorrect) {
      return scoringConfig.useStandardScoring ? 0.25 : scoringConfig.part3Score;
    }
  } else {
    // Kiểm tra với một đáp án
    if (correctAnswer.trim().toLowerCase() === userAnswerNormalized) {
      return scoringConfig.useStandardScoring ? 0.25 : scoringConfig.part3Score;
    }
  }

  return 0;
}

/**
 * Tính tổng điểm cho toàn bộ bài thi
 *
 * @param answers Đáp án của học sinh
 * @param template Template đề thi với đáp án đúng và scoring config
 * @returns Tổng điểm
 */
export function calculateTotalScore(
  answers: {
    part1: { [questionId: string]: string }; // Multiple choice answers
    part2: {
      [questionId: string]: { a: boolean; b: boolean; c: boolean; d: boolean };
    }; // Yes/No answers
    part3: { [questionId: string]: string }; // Short answers
  },
  template: {
    scoringConfig: ScoringConfig;
    contentJson: {
      parts: Array<{
        type: string;
        questions: Array<{
          id: string;
          answer?: string;
          statements?: YesNoQuestionAnswer;
        }>;
      }>;
    };
  }
): {
  part1Score: number;
  part2Score: number;
  part3Score: number;
  totalScore: number;
} {
  let part1Score = 0;
  let part2Score = 0;
  let part3Score = 0;

  for (const part of template.contentJson.parts) {
    if (part.type === "multiple-choice") {
      // Tính điểm phần 1
      for (const question of part.questions) {
        const userAnswer = answers.part1[question.id];
        if (userAnswer && question.answer) {
          part1Score += calculateMultipleChoiceScore(
            userAnswer,
            question.answer,
            template.scoringConfig
          );
        }
      }
    } else if (part.type === "yes-no") {
      // Tính điểm phần 2
      for (const question of part.questions) {
        const userAnswer = answers.part2[question.id];
        if (userAnswer && question.statements) {
          const correctAnswers = {
            a: question.statements.a.answer,
            b: question.statements.b.answer,
            c: question.statements.c.answer,
            d: question.statements.d.answer,
          };
          part2Score += calculateYesNoScore(
            userAnswer,
            correctAnswers,
            template.scoringConfig
          );
        }
      }
    } else if (part.type === "short-answer") {
      // Tính điểm phần 3
      for (const question of part.questions) {
        const userAnswer = answers.part3[question.id];
        if (userAnswer && question.answer) {
          part3Score += calculateShortAnswerScore(
            userAnswer,
            question.answer,
            template.scoringConfig
          );
        }
      }
    }
  }

  const totalScore = part1Score + part2Score + part3Score;
  return { part1Score, part2Score, part3Score, totalScore };
}

/**
 * Validate scoring config
 *
 * @param config Scoring configuration
 * @returns Validation result
 */
export function validateScoringConfig(config: ScoringConfig): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (config.part1Score < 0 || config.part1Score > 10) {
    errors.push("Part 1 score must be between 0 and 10");
  }

  if (config.part2CustomScore < 0 || config.part2CustomScore > 10) {
    errors.push("Part 2 custom score must be between 0 and 10");
  }

  if (config.part3Score < 0 || config.part3Score > 10) {
    errors.push("Part 3 score must be between 0 and 10");
  }

  // Validate manual scores
  for (const [key, value] of Object.entries(config.part2ManualScores)) {
    if (value < 0 || value > 10) {
      errors.push(
        `Part 2 manual score for ${key} correct answers must be between 0 and 10`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
