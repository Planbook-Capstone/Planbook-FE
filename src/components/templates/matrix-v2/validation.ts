// Types for validation
export type DistributionLevel = {
  biet: number;
  hieu: number;
  vd: number;
};

export type MatrixRow = {
  lessonID: string;
  distribution: {
    part1: DistributionLevel;
    part2: DistributionLevel;
    part3: DistributionLevel;
  };
  total: number;
};

export type ValidationResult = {
  isValid: boolean;
  errors: string[];
  fieldErrors: { [key: string]: string };
};

export type FormData = {
  school: string;
  examTitle: string;
  duration: number;
  matrix: MatrixRow[];
};

// Helper function để tính tổng số câu hỏi của 1 hàng
export const calculateRowTotal = (row: MatrixRow): number => {
  return (
    row.distribution.part1.biet +
    row.distribution.part1.hieu +
    row.distribution.part1.vd +
    row.distribution.part2.biet +
    row.distribution.part2.hieu +
    row.distribution.part2.vd +
    row.distribution.part3.biet +
    row.distribution.part3.hieu +
    row.distribution.part3.vd
  );
};

// Helper function để tính tổng từng phần (NB+TH+VD của mỗi phần)
export const calculateColumnTotals = (matrix: MatrixRow[]) => {
  const totals = {
    part1Total: 0, // Tổng NB+TH+VD của phần 1
    part2Total: 0, // Tổng NB+TH+VD của phần 2
    part3Total: 0, // Tổng NB+TH+VD của phần 3
    grandTotal: 0,
  };

  matrix.forEach((row) => {
    // Tính tổng từng phần
    totals.part1Total +=
      row.distribution.part1.biet +
      row.distribution.part1.hieu +
      row.distribution.part1.vd;
    totals.part2Total +=
      row.distribution.part2.biet +
      row.distribution.part2.hieu +
      row.distribution.part2.vd;
    totals.part3Total +=
      row.distribution.part3.biet +
      row.distribution.part3.hieu +
      row.distribution.part3.vd;
  });

  // Tính tổng tổng
  totals.grandTotal =
    totals.part1Total + totals.part2Total + totals.part3Total;

  return totals;
};

// Main validation function
export const validateMatrixForm = (formData: FormData): ValidationResult => {
  const validationErrors: string[] = [];
  const fieldErrors: { [key: string]: string } = {};

  // Validate school name
  if (!formData.school.trim()) {
    validationErrors.push("Tên trường không được để trống");
    fieldErrors.school = "Tên trường không được để trống";
  }

  // Validate exam title
  if (!formData.examTitle.trim()) {
    validationErrors.push("Tên đề kiểm tra không được để trống");
    fieldErrors.examTitle = "Tên đề kiểm tra không được để trống";
  }

  // Validate duration
  if (!formData.duration || formData.duration < 15) {
    validationErrors.push("Thời gian làm bài phải ít nhất 15 phút");
    fieldErrors.duration = "Thời gian làm bài phải ít nhất 15 phút";
  }

  // Validate matrix rows
  formData.matrix.forEach((row, index) => {
    if (!row.lessonID) {
      validationErrors.push(`Dòng ${index + 1}: Chưa chọn bài học`);
      fieldErrors[`matrix_${index}_lesson`] = "Chưa chọn bài học";
    }

    // Validate individual input fields - chỉ kiểm tra số âm
    (["part1", "part2", "part3"] as const).forEach((part) => {
      (["biet", "hieu", "vd"] as const).forEach((level) => {
        const value = row.distribution[part][level];
        const fieldKey = `matrix_${index}_${part}_${level}`;

        // Check for negative values only
        if (value < 0) {
          validationErrors.push(
            `Dòng ${index + 1}: Số câu hỏi không được âm`
          );
          fieldErrors[fieldKey] = "Không được âm";
        }
      });
    });

    // Validate tổng số câu của hàng phải >= 1
    const rowTotal = calculateRowTotal(row);
    if (rowTotal < 1) {
      validationErrors.push(
        `Dòng ${index + 1}: Tổng số câu phải ít nhất 1 câu`
      );
      fieldErrors[`matrix_${index}_total`] = "Tổng số câu phải >= 1";
    }
  });

  // Validate tổng số câu của từng phần
  const columnTotals = calculateColumnTotals(formData.matrix);

  // Phần 1: không được quá 40 câu
  if (columnTotals.part1Total > 40) {
    validationErrors.push("Tổng số câu phần 1 không được vượt quá 40 câu");
    fieldErrors.part1Total = "Không được vượt quá 40 câu";
  }

  // Phần 2: không được quá 8 câu
  if (columnTotals.part2Total > 8) {
    validationErrors.push("Tổng số câu phần 2 không được vượt quá 8 câu");
    fieldErrors.part2Total = "Không được vượt quá 8 câu";
  }

  // Phần 3: không được quá 6 câu
  if (columnTotals.part3Total > 6) {
    validationErrors.push("Tổng số câu phần 3 không được vượt quá 6 câu");
    fieldErrors.part3Total = "Không được vượt quá 6 câu";
  }

  return {
    isValid: validationErrors.length === 0,
    errors: validationErrors,
    fieldErrors,
  };
};

// Validation constants
export const VALIDATION_LIMITS = {
  MIN_DURATION: 15,
  MAX_PART1_QUESTIONS: 40,
  MAX_PART2_QUESTIONS: 8,
  MAX_PART3_QUESTIONS: 6,
  MIN_ROW_TOTAL: 1,
} as const;

// Helper function to check if a specific field has error
export const hasFieldError = (
  fieldErrors: { [key: string]: string },
  fieldKey: string
): boolean => {
  return !!fieldErrors[fieldKey];
};

// Helper function to get field error message
export const getFieldError = (
  fieldErrors: { [key: string]: string },
  fieldKey: string
): string => {
  return fieldErrors[fieldKey] || "";
};

// Helper function to clear specific field error
export const clearFieldError = (
  fieldErrors: { [key: string]: string },
  fieldKey: string
): { [key: string]: string } => {
  const newErrors = { ...fieldErrors };
  newErrors[fieldKey] = "";
  return newErrors;
};

// Helper function to clear multiple field errors
export const clearFieldErrors = (
  fieldErrors: { [key: string]: string },
  fieldKeys: string[]
): { [key: string]: string } => {
  const newErrors = { ...fieldErrors };
  fieldKeys.forEach((key) => {
    newErrors[key] = "";
  });
  return newErrors;
};
