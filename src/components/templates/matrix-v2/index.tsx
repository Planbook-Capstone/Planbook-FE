"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import BookSelector from "@/components/molecules/book-selector";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { TrashIcon } from "lucide-react";
import { useGradesService } from "@/services/gradeServices";
import { useSubjectsByGradeService } from "@/services/subjectServices";
import { useBooksBySubjectService } from "@/services/bookServices";
import { FormField } from "@/components/ui/FormField";
import { toast } from "sonner";
import { useGenerateSmartExamService } from "@/services/examGenerateServices";

// Dữ liệu ảo cho bài học, bạn có thể thay bằng API nếu cần
const LESSON_OPTIONS = [
  { id: "5", name: "Hình học Oxyz" },
  { id: "4", name: "Hàm số" },
  { id: "6", name: "Tích phân" },
];

type DistributionLevel = {
  biet: number;
  hieu: number;
  vd: number;
};

type MatrixRow = {
  lessonID: string;
  distribution: {
    part1: DistributionLevel;
    part2: DistributionLevel;
    part3: DistributionLevel;
  };
  total: number;
};

export default function MatrixTemplate2() {
  // State cho chọn trường, lớp, môn
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [school, setSchool] = useState("");
  const [examTitle, setExamTitle] = useState("");
  const [duration, setDuration] = useState(45);

  // State for validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Lấy data động từ API
  const { data: grades } = useGradesService();
  const { data: subjects } = useSubjectsByGradeService(selectedGrade, {
    enabled: !!selectedGrade,
  });

  const { mutate, isPending } = useGenerateSmartExamService();
  // Nếu muốn chọn sách thì mở dòng dưới, còn không thì bỏ qua
  // const { data: books } = useBooksBySubjectService(selectedSubject, { enabled: !!selectedSubject });

  // State cho bảng matrix
  const [matrix, setMatrix] = useState<MatrixRow[]>([
    {
      lessonID: "",
      distribution: {
        part1: { biet: 0, hieu: 0, vd: 0 },
        part2: { biet: 0, hieu: 0, vd: 0 },
        part3: { biet: 0, hieu: 0, vd: 0 },
      },
      total: 0,
    },
  ]);

  // Xử lý thay đổi matrix
  const handleMatrixChange = (
    idx: number,
    field: keyof MatrixRow,
    value: any
  ) => {
    setMatrix((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );
  };

  const handleDistributionChange = (
    rowIdx: number,
    part: "part1" | "part2" | "part3",
    level: keyof DistributionLevel,
    value: number
  ) => {
    // Update matrix state
    const updatedMatrix = matrix.map((row, i) =>
      i === rowIdx
        ? {
            ...row,
            distribution: {
              ...row.distribution,
              [part]: {
                ...row.distribution[part],
                [level]: value,
              },
            },
          }
        : row
    );

    setMatrix(updatedMatrix);

    // Clear total error for this row when user changes any value
    const totalErrorKey = `matrix_${rowIdx}_total`;
    const newErrors = { ...errors };

    if (errors[totalErrorKey]) {
      // Calculate new total to check if error should be cleared
      const updatedRow = updatedMatrix[rowIdx];
      const newTotal = calculateRowTotal(updatedRow);

      if (newTotal >= 1) {
        newErrors[totalErrorKey] = "";
      }
    }

    // Clear part total errors when user changes values and totals become valid
    // Calculate new column totals with the updated matrix
    const newColumnTotals = {
      part1Total: 0,
      part2Total: 0,
      part3Total: 0,
    };

    updatedMatrix.forEach((row) => {
      newColumnTotals.part1Total +=
        row.distribution.part1.biet +
        row.distribution.part1.hieu +
        row.distribution.part1.vd;
      newColumnTotals.part2Total +=
        row.distribution.part2.biet +
        row.distribution.part2.hieu +
        row.distribution.part2.vd;
      newColumnTotals.part3Total +=
        row.distribution.part3.biet +
        row.distribution.part3.hieu +
        row.distribution.part3.vd;
    });

    // Clear part total errors if they become valid
    if (errors.part1Total && newColumnTotals.part1Total <= 40) {
      newErrors.part1Total = "";
    }
    if (errors.part2Total && newColumnTotals.part2Total <= 64) {
      newErrors.part2Total = "";
    }
    if (errors.part3Total && newColumnTotals.part3Total <= 6) {
      newErrors.part3Total = "";
    }

    // Update errors state
    setErrors(newErrors);
  };

  const addMatrixRow = () => {
    setMatrix([
      ...matrix,
      {
        lessonID: "",
        distribution: {
          part1: { biet: 0, hieu: 0, vd: 0 },
          part2: { biet: 0, hieu: 0, vd: 0 },
          part3: { biet: 0, hieu: 0, vd: 0 },
        },
        total: 0,
      },
    ]);
  };

  const removeMatrixRow = (idx: number) => {
    setMatrix(matrix.filter((_, i) => i !== idx));
  };

  // Helper function để tính tổng số câu hỏi của 1 hàng
  const calculateRowTotal = (row: MatrixRow) => {
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
  const calculateColumnTotals = () => {
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

  // Map ra JSON đúng format
  function mapToBackend() {
    return {
      school: school || "Trường THPT Nguyễn Huệ",
      // grade: selectedGrade ? parseInt(selectedGrade) : null,
      grade: 12,
      subject: selectedSubject || "Hoa_hoc",
      examTitle,
      duration: Number(duration),
      outputFormat: "docx",
      outputLink: "online",
      matrix: matrix.map((row) => ({
        lessonId: row.lessonID,
        totalQuestions: calculateRowTotal(row),
        parts: [
          {
            part: 1,
            objectives: {
              Biết: row.distribution.part1.biet,
              Hiểu: row.distribution.part1.hieu,
              Vận_dụng: row.distribution.part1.vd,
            },
          },
          {
            part: 2,
            objectives: {
              Biết: row.distribution.part2.biet,
              Hiểu: row.distribution.part2.hieu,
              Vận_dụng: row.distribution.part2.vd,
            },
          },
          {
            part: 3,
            objectives: {
              Biết: row.distribution.part3.biet,
              Hiểu: row.distribution.part3.hieu,
              Vận_dụng: row.distribution.part3.vd,
            },
          },
        ],
      })),
    };
  }

  // Validation function
  const validateForm = () => {
    const validationErrors: string[] = [];
    const fieldErrors: { [key: string]: string } = {};

    // Clear previous errors
    setErrors({});

    // Validate school name
    if (!school.trim()) {
      validationErrors.push("Tên trường không được để trống");
      fieldErrors.school = "Tên trường không được để trống";
    }

    // Validate exam title
    if (!examTitle.trim()) {
      validationErrors.push("Tên đề kiểm tra không được để trống");
      fieldErrors.examTitle = "Tên đề kiểm tra không được để trống";
    }

    // Validate duration
    if (!duration || duration < 15) {
      validationErrors.push("Thời gian làm bài phải ít nhất 15 phút");
      fieldErrors.duration = "Thời gian làm bài phải ít nhất 15 phút";
    }

    // Validate grade and subject selection
    // if (!selectedGrade) {
    //   validationErrors.push("Vui lòng chọn khối lớp");
    //   fieldErrors.grade = "Vui lòng chọn khối lớp";
    // }

    // if (!selectedSubject) {
    //   validationErrors.push("Vui lòng chọn môn học");
    //   fieldErrors.subject = "Vui lòng chọn môn học";
    // }

    // // Validate matrix rows
    // if (matrix.length === 0) {
    //   validationErrors.push("Phải có ít nhất một dòng trong ma trận đề thi");
    //   fieldErrors.matrix = "Phải có ít nhất một dòng trong ma trận đề thi";
    // }

    matrix.forEach((row, index) => {
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
    const columnTotals = calculateColumnTotals();

    // Phần 1: không được quá 40 câu
    if (columnTotals.part1Total > 40) {
      validationErrors.push("Tổng số câu phần 1 không được vượt quá 40 câu");
      fieldErrors.part1Total = "Không được vượt quá 40 câu";
    }

    // Phần 2: không được quá 64 câu
    if (columnTotals.part2Total > 64) {
      validationErrors.push("Tổng số câu phần 2 không được vượt quá 64 câu");
      fieldErrors.part2Total = "Không được vượt quá 64 câu";
    }

    // Phần 3: không được quá 6 câu
    if (columnTotals.part3Total > 6) {
      validationErrors.push("Tổng số câu phần 3 không được vượt quá 6 câu");
      fieldErrors.part3Total = "Không được vượt quá 6 câu";
    }

    // Set field errors for UI feedback
    setErrors(fieldErrors);

    return validationErrors;
  };

  // Handle create exam
  const handleCreateExam = () => {
    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      // Show first error as toast
      toast.error(validationErrors[0]);
      return;
    }

    // If validation passes, proceed with exam creation
    const examData = mapToBackend();

    mutate(examData, {
      onSuccess: () => {
        toast.success("Tạo đề thi thành công");
      },
      onError: (error) => {
        toast.error("Tạo đề thi thất bại");
        console.error(error);
      },
    });

    // console.log("Creating exam with data:", examData);
    // toast.success("Đề thi đã được tạo thành công!");

    // Here you would typically call an API to create the exam
    // Example: createExamAPI(examData);
  };

  return (
    <div className="max-w-full mx-auto px-12">
      <div className="mb-4">
        <BookSelector
          title="Vui lòng chọn sách"
          gradeOptions={grades?.data?.content || []}
          subjectOptions={subjects?.data?.content || []}
          bookOptions={[]} // Không cần chọn sách ở đây
          selectedGrade={selectedGrade}
          selectedSubject={selectedSubject}
          selectedBook={""}
          onGradeChange={setSelectedGrade}
          onSubjectChange={setSelectedSubject}
          onBookChange={() => {}}
        />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6 font-questrial">
        <div className="flex flex-col">
          <FormField label="Tên trường" htmlFor="school-input">
            <Input
              id="school-input"
              value={school}
              onChange={(e: any) => {
                setSchool(e.target.value);
                // Clear error when user starts typing
                if (errors.school) {
                  setErrors((prev) => ({ ...prev, school: "" }));
                }
              }}
              placeholder="Trường ABC"
              className={
                errors.school ? "border-red-500 focus:border-red-500" : ""
              }
            />
          </FormField>
          {/* Fixed height container for error message */}
          <div className="h-6 mt-1">
            {errors.school && (
              <p className="text-red-500 text-sm">{errors.school}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <FormField label="Tên đề kiểm tra" htmlFor="exam-title-input">
            <Input
              id="exam-title-input"
              value={examTitle}
              onChange={(e: any) => {
                setExamTitle(e.target.value);
                // Clear error when user starts typing
                if (errors.examTitle) {
                  setErrors((prev) => ({ ...prev, examTitle: "" }));
                }
              }}
              placeholder="Kiểm tra giữa kỳ 1"
              className={
                errors.examTitle ? "border-red-500 focus:border-red-500" : ""
              }
            />
          </FormField>
          {/* Fixed height container for error message */}
          <div className="h-6 mt-1">
            {errors.examTitle && (
              <p className="text-red-500 text-sm">{errors.examTitle}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <FormField label="Thời gian (phút)" htmlFor="duration-input">
            <Input
              id="duration-input"
              type="number"
              value={duration}
              min={15}
              onChange={(e: any) => {
                setDuration(Number(e.target.value));
                // Clear error when user starts typing
                if (errors.duration && Number(e.target.value) >= 15) {
                  setErrors((prev) => ({ ...prev, duration: "" }));
                }
              }}
              className={
                errors.duration ? "border-red-500 focus:border-red-500" : ""
              }
              placeholder="Tối thiểu 15 phút"
            />
          </FormField>
          {/* Fixed height container for error message */}
          <div className="h-6 mt-1">
            {errors.duration && (
              <p className="text-red-500 text-sm">{errors.duration}</p>
            )}
          </div>
        </div>
      </div>
      <div className="mb-4 mt-6">
        <h2 className="text-lg font-calsans">Ma trận đề thi</h2>
        <h3 className="text-base font-questrial text-neutral-500">
          Ma trận phân bổ đề thi dựa trên số lượng câu nhận biết, thông hiểu,
          vận dụng
        </h3>
      </div>
      <table className="w-full text-center rounded-md border mb-4">
        <thead className="font-calsans text-base">
          <tr>
            <th className="border px-2 py-4 align-middle" rowSpan={2}>
              <span className="font-normal">Bài học</span>
            </th>
            <th
              className="border px-2 py-4 align-middle bg-amber-50"
              colSpan={3}
            >
              <span className="font-normal">Phần 1</span>
            </th>
            <th
              className="border px-2 py-4 align-middle bg-green-50"
              colSpan={3}
            >
              <span className="font-normal">Phần 2</span>
            </th>
            <th className="border px-2 py-4 align-middle bg-sky-50" colSpan={3}>
              <span className="font-normal">Phần 3</span>
            </th>
            <th className="border px-2 py-4 align-middle" rowSpan={2}>
              <span className="font-normal">Tổng số câu</span>
            </th>
            <th className="border px-2 py-4 align-middle" rowSpan={2}>
              <span className="font-normal">Thao tác</span>
            </th>
          </tr>
          <tr>
            {[1, 2, 3].map(() => (
              <React.Fragment key={Math.random()}>
                <th className="border px-2 py-2">
                  <span className="font-normal">NB</span>
                </th>
                <th className="border px-2 py-2">
                  <span className="font-normal">TH</span>
                </th>
                <th className="border px-2 py-2">
                  <span className="font-normal">VD</span>
                </th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, rowIdx) => (
            <tr key={rowIdx} className="font-questrial">
              <td className="border px-2 py-1 min-w-[180px]">
                <div className="flex flex-col">
                  <Select
                    key={`lesson-select-${rowIdx}`}
                    value={row.lessonID || "CLEAR_SELECTION"}
                    onValueChange={(val) => {
                      console.log(`Changing lesson for row ${rowIdx} to:`, val);
                      // Handle clear selection
                      const actualValue = val === "CLEAR_SELECTION" ? "" : val;
                      handleMatrixChange(rowIdx, "lessonID", actualValue);
                      // Clear error when user selects a lesson
                      if (errors[`matrix_${rowIdx}_lesson`]) {
                        setErrors((prev) => ({
                          ...prev,
                          [`matrix_${rowIdx}_lesson`]: "",
                        }));
                      }
                    }}
                  >
                    <SelectTrigger
                      className={`w-full min-h-[40px] bg-transparent focus:ring-0 focus:outline-none ${
                        errors[`matrix_${rowIdx}_lesson`]
                          ? "border-red-500"
                          : ""
                      }`}
                    >
                      <SelectValue placeholder="Chọn bài học" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLEAR_SELECTION">
                        <span className="text-gray-500 italic">
                          -- Chọn bài học --
                        </span>
                      </SelectItem>
                      {LESSON_OPTIONS.filter((item) => {
                        // Lọc ra các bài học đã được chọn ở các hàng khác
                        const selectedLessons = matrix
                          .map((row, index) =>
                            index !== rowIdx ? row.lessonID : null
                          )
                          .filter(Boolean);
                        return !selectedLessons.includes(item.id);
                      }).map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors[`matrix_${rowIdx}_lesson`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`matrix_${rowIdx}_lesson`]}
                    </p>
                  )}
                </div>
              </td>
              {(["part1", "part2", "part3"] as const).map((part) =>
                (["biet", "hieu", "vd"] as const).map((level) => {
                  const fieldKey = `matrix_${rowIdx}_${part}_${level}`;
                  return (
                    <td className="border px-2 py-1" key={part + level}>
                      <div className="flex flex-col">
                        <Input
                          type="number"
                          min={0}
                          value={row.distribution[part][level]}
                          onChange={(e: any) => {
                            const value = Number(e.target.value);
                            handleDistributionChange(
                              rowIdx,
                              part,
                              level,
                              value
                            );
                            // Clear error when user enters a non-negative value
                            if (errors[fieldKey] && value >= 0) {
                              setErrors((prev) => ({
                                ...prev,
                                [fieldKey]: "",
                              }));
                            }
                          }}
                          placeholder={level.toUpperCase()}
                          className={
                            errors[fieldKey]
                              ? "border-red-500 focus:border-red-500"
                              : ""
                          }
                        />
                        {errors[fieldKey] && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors[fieldKey]}
                          </p>
                        )}
                      </div>
                    </td>
                  );
                })
              )}
              <td className="border px-2 py-1">
                <div className="flex flex-col">
                  <Input
                    type="number"
                    value={calculateRowTotal(row)}
                    readOnly
                    className={`bg-gray-100 cursor-not-allowed text-center font-medium ${
                      errors[`matrix_${rowIdx}_total`] ? "border-red-500" : ""
                    }`}
                    placeholder="Tổng số câu"
                  />
                  {errors[`matrix_${rowIdx}_total`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`matrix_${rowIdx}_total`]}
                    </p>
                  )}
                </div>
              </td>
              {/* Thao tác */}
              <td className="border px-2 py-1">
                <Button
                  size="sm"
                  type="button"
                  className={`px-0 py-5 bg-transparent shadow-none hover:bg-transparent hover:shadow-none group transition-colors duration-200 ${
                    matrix.length <= 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => {
                    if (matrix.length > 1) {
                      removeMatrixRow(rowIdx);
                    }
                  }}
                  disabled={matrix.length <= 1}
                >
                  <TrashIcon
                    className={`${
                      matrix.length <= 1
                        ? "text-neutral-400"
                        : "text-neutral-600 group-hover:text-red-500"
                    } transition-colors duration-200`}
                  />
                </Button>
              </td>
            </tr>
          ))}

          {/* Hàng tổng */}
          <tr className="font-bold">
            <td className="border px-2 py-3 text-center bg-red-100 ">
              <span className="font-calsans ">TỔNG</span>
            </td>
            {/* Tổng phần 1 (NB+TH+VD) */}
            <td
              className={`border px-2 py-3 text-center ${
                errors.part1Total ? "bg-red-100" : ""
              }`}
              colSpan={3}
            >
              <div className="flex flex-col">
                <span
                  className={`font-medium font-questrial ${
                    errors.part1Total ? "text-red-700" : ""
                  }`}
                >
                  {calculateColumnTotals().part1Total}/40
                </span>
                {errors.part1Total && (
                  <span className="text-red-500 font-questrial text-xs mt-1">
                    {errors.part1Total}
                  </span>
                )}
              </div>
            </td>
            {/* Tổng phần 2 (NB+TH+VD) */}
            <td
              className={`border px-2 py-3 text-center ${
                errors.part2Total ? "bg-red-100" : ""
              }`}
              colSpan={3}
            >
              <div className="flex flex-col">
                <span
                  className={`font-medium font-questrial ${
                    errors.part2Total ? "text-red-700" : ""
                  }`}
                >
                  {calculateColumnTotals().part2Total}/64
                </span>
                {errors.part2Total && (
                  <span className="text-red-500 font-questrial text-xs mt-1">
                    {errors.part2Total}
                  </span>
                )}
              </div>
            </td>
            {/* Tổng phần 3 (NB+TH+VD) */}
            <td
              className={`border px-2 py-3 text-center ${
                errors.part3Total ? "bg-red-100" : ""
              }`}
              colSpan={3}
            >
              <div className="flex flex-col">
                <span
                  className={`font-medium font-questrial ${
                    errors.part3Total ? "text-red-700" : ""
                  }`}
                >
                  {calculateColumnTotals().part3Total}/6
                </span>
                {errors.part3Total && (
                  <span className="text-red-500 font-questrial text-xs mt-1">
                    {errors.part3Total}
                  </span>
                )}
              </div>
            </td>
            {/* Tổng tổng */}
            <td className="border px-2 py-3 text-center">
              <span className=" font-bold font-questrial">
                {calculateColumnTotals().grandTotal}
              </span>
            </td>
            {/* Cột thao tác trống */}
            <td className="border px-2 py-3"></td>
          </tr>
        </tbody>
      </table>
      <Button
        variant="dash"
        type="button"
        className="mt-4 rounded-md w-full"
        onClick={addMatrixRow}
      >
        Thêm dòng mới +
      </Button>

      {/* Create Exam Button */}
      <div className="mt-6 flex justify-end">
        <Button
          type="button"
          className="px-8 py-3  text-white font-medium rounded-md"
          onClick={handleCreateExam}
          disabled={isPending}
        >
          Tạo đề thi
        </Button>
      </div>

      <hr className="my-6" />
      <h3 className="font-bold mb-2">Matrix JSON</h3>
      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
        {JSON.stringify(mapToBackend(), null, 2)}
      </pre>
    </div>
  );
}
