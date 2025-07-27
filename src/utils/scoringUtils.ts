/**
 * Utility functions for calculating exam scores
 */

/**
 * Calculate score for Yes/No question using standard scoring (0.1/0.25/0.5/1.0)
 *
 * @param correctAnswers Number of correct answers (1-4)
 * @returns Calculated score using standard breakdown
 */
export function calculateYesNoQuestionScoreStandard(
  correctAnswers: number
): number {
  const standardScores = { 1: 0.1, 2: 0.25, 3: 0.5, 4: 1.0 };
  return standardScores[correctAnswers as 1 | 2 | 3 | 4] || 0;
}

/**
 * Calculate score for Yes/No question based on number of correct answers
 * Logic: Mỗi ý đúng = điểm tối đa ÷ 4
 *
 * @param correctAnswers Number of correct answers (1-4)
 * @param maxScore Maximum score per question
 * @returns Calculated score
 */
export function calculateYesNoQuestionScore(
  correctAnswers: number,
  maxScore: number
): number {
  if (correctAnswers < 0 || correctAnswers > 4) {
    return 0;
  }

  // Mỗi ý đúng = điểm tối đa ÷ 4
  const scorePerCorrectAnswer = maxScore / 4;
  return correctAnswers * scorePerCorrectAnswer;
}

/**
 * Get scoring breakdown for Yes/No questions using standard scoring
 *
 * @returns Object with standard score breakdown (0.1/0.25/0.5/1.0)
 */
export function getYesNoScoringBreakdownStandard() {
  return {
    1: 0.1,
    2: 0.25,
    3: 0.5,
    4: 1.0,
  };
}

/**
 * Get scoring breakdown for Yes/No questions
 *
 * @param maxScore Maximum score per question
 * @returns Object with score for each number of correct answers
 */
export function getYesNoScoringBreakdown(maxScore: number) {
  return {
    1: calculateYesNoQuestionScore(1, maxScore),
    2: calculateYesNoQuestionScore(2, maxScore),
    3: calculateYesNoQuestionScore(3, maxScore),
    4: calculateYesNoQuestionScore(4, maxScore),
  };
}
