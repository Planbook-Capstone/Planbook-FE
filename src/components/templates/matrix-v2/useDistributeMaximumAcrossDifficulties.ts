import { useCallback } from "react";

/**
 * Hook trả về hàm phân bổ số lượng câu hỏi cho các mức độ khó (NB, TH, VD...)
 * @returns (maximum: number, difficultyLevels: any[]) => Record<string, number>
 */
export function useDistributeMaximumAcrossDifficulties() {
  /**
   * Phân bổ số lượng câu hỏi cho các mức độ khó
   * - Nếu có 3 mức độ (NB, TH, VD):
   *   - Nếu chia 3 không dư: mỗi ô đều nhau
   *   - Nếu dư: VD nhận dư, NB/TH chia đều phần còn lại
   * - Nếu khác 3 mức độ: chia đều, dư dồn ô cuối
   */
  return useCallback((maximum: number, difficultyLevels: any[]) => {
    if (!maximum || !difficultyLevels || difficultyLevels.length === 0) {
      return {};
    }

    const distribution: Record<string, number> = {};
    const numLevels = difficultyLevels.length;

    if (numLevels === 3) {
      const nbId = difficultyLevels[0]?.id;
      const thId = difficultyLevels[1]?.id;
      const vdId = difficultyLevels[2]?.id;
      const remainder = maximum % 3;
      if (remainder === 0) {
        const value = maximum / 3;
        distribution[nbId] = value;
        distribution[thId] = value;
        distribution[vdId] = value;
      } else {
        const rest = maximum - remainder;
        const nb_th = Math.floor(rest / 2);
        distribution[nbId] = nb_th;
        distribution[thId] = nb_th;
        distribution[vdId] = remainder;
      }
      return distribution;
    }

    // Fallback: chia đều cho các mức độ khác
    const baseValue = Math.floor(maximum / numLevels);
    const remainder = maximum % numLevels;
    difficultyLevels.forEach((level: any, idx: number) => {
      distribution[level.id] = baseValue + (idx === numLevels - 1 ? remainder : 0);
    });
    return distribution;
  }, []);
}