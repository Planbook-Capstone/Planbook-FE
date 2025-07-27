/**
 * Shared types for scoring system
 */

export interface ScoringConfig {
  useStandardScoring: boolean; // true = dùng thang điểm chuẩn, false = tùy chỉnh
  part1Score: number; // điểm mỗi câu phần 1
  part2ScoringType: "standard" | "auto" | "manual"; // standard = chuẩn, auto = điểm tối đa ÷ 4, manual = tùy chỉnh từng ý
  part2CustomScore: number; // điểm tối đa cho phần 2 (khi dùng auto)
  part2ManualScores: {
    // điểm cho từng số ý đúng (khi dùng manual)
    1: number; // 1 ý đúng
    2: number; // 2 ý đúng
    3: number; // 3 ý đúng
    4: number; // 4 ý đúng
  };
  part3Score: number; // điểm mỗi câu phần 3
}

export interface YesNoQuestionAnswer {
  a: { text: string; answer: boolean };
  b: { text: string; answer: boolean };
  c: { text: string; answer: boolean };
  d: { text: string; answer: boolean };
}
