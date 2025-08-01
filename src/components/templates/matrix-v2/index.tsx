"use client";

import React, { use, useEffect, useState } from "react";
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
import { useChaptersByBookService } from "@/services/chapterServices";
import { useLessonsByChaptersService } from "@/services/lessonServices";
import { FormField } from "@/components/ui/FormField";
import { toast } from "sonner";
import {
  validateMatrixForm,
  calculateRowTotal,
  calculateColumnTotals,
  type MatrixRow,
  type DistributionLevel,
  type FormData,
} from "./validation";
import LoadingAI from "@/components/molecules/loading";
import { useTaskStatusService } from "@/services/progressTaskServices";
import DocumentItem from "@/components/molecules/document-item";
import { useExecuteToolService } from "@/services/executeToolServices";
import { useSimpleWebSocket } from "@/hooks/useSimpleWebSocket";
import { useRouter, useSearchParams } from "next/navigation";
import { useBookTypeByIdService } from "@/services/bookTypeServices";
import { WEBSOCKET_CONFIG } from "@/config/websocket";

export default function MatrixTemplate2() {
  const router = useRouter();
  // State cho chọn trường, lớp, môn
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedBook, setSelectedBook] = useState("");
  const [school, setSchool] = useState("");
  const [examTitle, setExamTitle] = useState("");
  const [duration, setDuration] = useState(45);
  const [response, setResponse] = useState<any>(null);
  const searchParams = useSearchParams();
  const [resultId, setResultId] = useState<string | null>(null);
  const query = searchParams.get("bookTypeId");

  const { data: bookType } = useBookTypeByIdService(query || "");

  const { mutate: executeTool } = useExecuteToolService();
  const [wsUrl] = useState(WEBSOCKET_CONFIG.url);
  const [topic] = useState(WEBSOCKET_CONFIG.topic);
  const [enabled, setEnabled] = useState(false);
  const [finalData, setFinalData] = useState<any>(null);

  const { data, isConnected, error, sendMessage, reconnect } =
    useSimpleWebSocket({
      url: wsUrl,
      topic: topic,
      enabled: enabled,
    });

  useEffect(() => {
    if (data?.tool_code === bookType?.data?.code) {
      setFinalData(data);
      console.log("🔍 WebSocket data received:", data);
      setResultId(data?.result_id);
    }
  }, [data, enabled]);

  console.log(resultId, "ran");
  // State for validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Lấy data động từ API
  const { data: grades } = useGradesService();
  const { data: subjects } = useSubjectsByGradeService(selectedGrade, {
    enabled: !!selectedGrade,
  });
  const { data: books } = useBooksBySubjectService(selectedSubject, {
    enabled: !!selectedSubject,
  });

  // Get chapters by selected book
  const { data: chaptersResponse } = useChaptersByBookService(selectedBook, {
    enabled: !!selectedBook,
  });
  const chapters = chaptersResponse?.data?.content || [];

  // Get lessons by all chapter IDs
  const lessonQueries = useLessonsByChaptersService(
    chapters.map((ch: any) => ch.id)
  );

  // Flatten all lessons from all chapters
  const allLessons = lessonQueries
    .filter((query) => query.data?.data?.content)
    .flatMap((query) => query.data.data.content)
    .filter((lesson: any) => lesson && lesson.id && lesson.name);

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
    const newColumnTotals = calculateColumnTotals(updatedMatrix);

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

  // Map ra JSON đúng format
  function mapToBackend() {
    return {
      school: school || "Trường THPT Nguyễn Huệ",
      // grade: selectedGrade ? parseInt(selectedGrade) : null,
      grade: 12,
      subject: selectedSubject || "Hoa_hoc",
      examTitle,
      examCode: "1234",
      duration: Number(duration),
      outputFormat: "docx",
      outputLink: "online",
      matrix: matrix.map((row) => ({
        lessonId: row.lessonID.toString(),
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

  // Validation function using the extracted validation module
  const validateForm = () => {
    // Clear previous errors
    setErrors({});

    const formData: FormData = {
      school,
      examTitle,
      duration,
      matrix,
    };

    const validationResult = validateMatrixForm(formData);

    // Set field errors for UI feedback
    setErrors(validationResult.fieldErrors);

    return validationResult.errors;
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

    const payload = {
      toolId: bookType?.data?.id,
      toolType: "INTERNAL",
      book_id: 1,
      lesson_id: "4",
      input: examData,
      workspaceId: 1,
    };
    executeTool(payload, {
      onSuccess: (e: any) => {
        toast.success("Gửi dữ liệu thành công!");
        console.log(e.data.task_id);

        setEnabled(true);
      },
      onError: (error) => {
        toast.error(
          `${error?.response?.data || "Có lỗi xảy ra khi gửi dữ liệu"}`
        );
      },
    });
  };

  // Task status tracking
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);

  const { data: taskStatus } = useTaskStatusService(response || "", {
    enabled: !!response && !isTaskCompleted, // Chỉ fetch khi có response và chưa hoàn thành
    refetchInterval: 2000, // Fetch mỗi 2 giây
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (taskStatus) {
      console.log("Task Status:", taskStatus);

      // Kiểm tra nếu progress = 100% hoặc status = completed
      if (taskStatus.progress === 100 || taskStatus.status === "completed") {
        setIsTaskCompleted(true);
        toast.success("Đề thi đã được tạo xong!");
      } else if (taskStatus.status === "failed") {
        setIsTaskCompleted(true);
        toast.error("Tạo đề thi thất bại!");
      }
    }
  }, [taskStatus]);

  // Hiển thị LoadingAI khi đang có task và chưa hoàn thành
  // if (response && !isTaskCompleted) {
  //   return (
  //     <div className="px-10">
  //       <LoadingAI
  //         message={taskStatus?.current_message || "Đang tạo đề thi..."}
  //         progress={taskStatus?.current_progress || 0}
  //       />
  //     </div>
  //   );
  // }

  if (
    data?.status === "processing" &&
    data?.tool_code === bookType?.data?.code
  ) {
    return (
      <div className="w-full px-10 flex flex-col items-center h-50 space-y-4">
        <LoadingAI
          message={data?.message || ""}
          progress={data?.progress || 0}
        />
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto px-12">
      {finalData ? null : (
        <>
          <div className="mb-4">
            <BookSelector
              title="Vui lòng chọn sách"
              gradeOptions={grades?.data?.content || []}
              subjectOptions={subjects?.data?.content || []}
              bookOptions={books?.data?.content || []} // Không cần chọn sách ở đây
              selectedGrade={selectedGrade}
              selectedSubject={selectedSubject}
              selectedBook={selectedBook}
              onGradeChange={setSelectedGrade}
              onSubjectChange={setSelectedSubject}
              onBookChange={setSelectedBook}
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
                    errors.examTitle
                      ? "border-red-500 focus:border-red-500"
                      : ""
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
        </>
      )}

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
                  {resultId ? (
                    <Input
                      value={
                        allLessons.find((lesson: any) => lesson.id === row.lessonID)?.name ||
                        "Chọn bài học"
                      }
                      readOnly
                      className="w-full min-h-[40px] bg-gray-100 cursor-not-allowed"
                    />
                  ) : (
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
                        {allLessons
                          .filter((item: any) => {
                            // Lọc ra các bài học đã được chọn ở các hàng khác
                            const selectedLessons = matrix
                              .map((row, index) =>
                                index !== rowIdx ? row.lessonID : null
                              )
                              .filter(Boolean);
                            return !selectedLessons.includes(item.id);
                          })
                          .map((item: any) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
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
                          onChange={resultId ? undefined : (e: any) => {
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
                          readOnly={!!resultId}
                          placeholder={level.toUpperCase()}
                          className={`${
                            resultId ? "bg-gray-100 cursor-not-allowed" : ""
                          } ${
                            errors[fieldKey]
                              ? "border-red-500 focus:border-red-500"
                              : ""
                          }`}
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
                    matrix.length <= 1 || resultId ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => {
                    if (matrix.length > 1 && !resultId) {
                      removeMatrixRow(rowIdx);
                    }
                  }}
                  disabled={matrix.length <= 1 || !!resultId}
                >
                  <TrashIcon
                    className={`${
                      matrix.length <= 1 || resultId
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
                  {calculateColumnTotals(matrix).part1Total}/40
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
                  {calculateColumnTotals(matrix).part2Total}/8
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
                  {calculateColumnTotals(matrix).part3Total}/6
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
                {calculateColumnTotals(matrix).grandTotal}
              </span>
            </td>
            {/* Cột thao tác trống */}
            <td className="border px-2 py-3"></td>
          </tr>
        </tbody>
      </table>

      {finalData ? null : (
        <Button
          variant="dash"
          type="button"
          className={`mt-4 rounded-md w-full ${
            resultId ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={resultId ? undefined : addMatrixRow}
          disabled={!!resultId}
        >
          Thêm dòng mới +
        </Button>
      )}

      {/* Create Exam Button */}

      {finalData ? (
        <div className="flex justify-between items-center mb-10 mt-5">
          <div className="space-y-3">
            <h1 className="font-calsans text-base">
              Đã tạo thành công đề theo ma trận trên
            </h1>
            <div
              onClick={() => router.push(`${finalData?.online_links?.edit}`)}
              className="grid grid-cols-3 cursor-pointer"
            >
              <DocumentItem
                type="DOCX"
                name={finalData?.message || "Không xác định"}
                description="Đề thi thông minh"
                onRemove={() => {
                  console.log("remove");
                }}
              />
            </div>
          </div>
          <Button
            type="button"
            className="px-8 py-3  text-white font-medium rounded-md"
            // disabled={isPending}
          >
            Tạo lại
          </Button>
        </div>
      ) : (
        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            className={`px-8 py-3 text-white font-medium rounded-md ${
              resultId ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={resultId ? undefined : handleCreateExam}
            disabled={!!resultId}
          >
            Tạo đề thi
          </Button>
        </div>
      )}

      {/* <hr className="my-6" />
      <h3 className="font-bold mb-2">Matrix JSON</h3>
      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
        {JSON.stringify(mapToBackend(), null, 2)}
      </pre> */}
    </div>
  );
}
