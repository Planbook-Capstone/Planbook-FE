"use client";

import React, { useEffect, useState, useRef } from "react";
import { useDistributeMaximumAcrossDifficulties } from "./useDistributeMaximumAcrossDifficulties";
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
import { Eye, Save, TrashIcon } from "lucide-react";
import { useGradesService } from "@/services/gradeServices";
import { useSubjectsByGradeService } from "@/services/subjectServices";
import { useBookActiveBySubjectService } from "@/services/bookServices";
import { useChaptersByBookService } from "@/services/chapterServices";
import { useLessonsByChaptersService } from "@/services/lessonServices";
import { FormField } from "@/components/ui/FormField";
import { toast } from "sonner";
// Local types for dynamic matrix
type MatrixRow = {
  lessonID: string;
  distribution: any; // Dynamic structure based on template
  total: number;
};

import { useTaskStatusService } from "@/services/progressTaskServices";
import {
  useExecuteToolService,
  useEstimateTokenService,
} from "@/services/executeToolServices";
import { useSimpleWebSocket } from "@/hooks/useSimpleWebSocket";
import { useRouter, useSearchParams } from "next/navigation";
import { useBookTypeByIdService } from "@/services/bookTypeServices";
import { WEBSOCKET_CONFIG } from "@/config/websocket";
import {
  useUpdateToolResultService,
  useToolResultByIdService,
} from "@/services/toolResultService";
import ConfirmSaveResult from "@/components/modals/ConfirmSaveResult";
import TokenConfirmModal from "@/components/modals/TokenConfirmModal";
import FileIcon from "@/components/ui/FileIcon";
import { DowloadIcon } from "@/constants/icon";
import { generateExamDocx } from "@/utils/docxGeneratorExam";
import LoadingRealtimeExamMatrix from "./LoadingRealtimeExamMatrix";
import { DIFFICULTY_LEVEL } from "@/constants/enum";
import { useMatrixTemplateActiveService } from "@/services/matrixTemplateServices";

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
  const { data: matrixTemplates } = useMatrixTemplateActiveService();

  // Get the first active template (assuming we use the first one)
  const activeTemplate = matrixTemplates?.data?.[0];
  const templateParts = activeTemplate?.matrixJson?.parts || [];

  // Utility: Merge API distribution with template structure to ensure all parts/levels exist
  const mergeDistribution = (apiDistribution: any) => {
    const base = createInitialDistribution();
    if (apiDistribution) {
      Object.keys(apiDistribution).forEach((partKey) => {
        if (base[partKey]) {
          Object.assign(base[partKey], apiDistribution[partKey]);
        }
      });
    }
    return base;
  };

  // Function to calculate row total dynamically (safe access)
  const calculateDynamicRowTotal = (row: any): number => {
    let total = 0;
    templateParts.forEach((part: any, index: number) => {
      const partKey = `part${index + 1}`;
      if (row.distribution && row.distribution[partKey]) {
        part.difficultyLevels?.forEach((level: any) => {
          const value = row.distribution?.[partKey]?.[level.id] ?? 0;
          total += typeof value === "number" && !isNaN(value) ? value : 0;
        });
      }
    });
    return total;
  };

  // Function to calculate column totals dynamically
  const calculateDynamicColumnTotals = (matrix: any[]) => {
    const totals: any = {};
    let grandTotal = 0;

    templateParts.forEach((part: any, index: number) => {
      const partKey = `part${index + 1}`;
      totals[partKey] = 0;

      matrix.forEach((row) => {
        if (row.distribution && row.distribution[partKey]) {
          part.difficultyLevels?.forEach((level: any) => {
            const value = row.distribution[partKey][level.id];
            totals[partKey] +=
              typeof value === "number" && !isNaN(value) ? value : 0;
          });
        }
      });

      grandTotal += totals[partKey];
    });

    totals.grandTotal = grandTotal;
    return totals;
  };
  const { data: bookType } = useBookTypeByIdService(query || "");

  const { mutate: executeTool, isPending: isGenerating } =
    useExecuteToolService();
  const { mutate: estimateToken, isPending: isEstimating } =
    useEstimateTokenService();

  // Token estimation state
  const [showTokenConfirmModal, setShowTokenConfirmModal] = useState(false);
  const [estimatedTokens, setEstimatedTokens] = useState<number | null>(null);
  const [pendingPayload, setPendingPayload] = useState<any>(null);

  // Tool result services for saving
  const { mutate: updateToolResult, isPending: isSavingResult } =
    useUpdateToolResultService();
  const { data: currentToolResult } = useToolResultByIdService(resultId || "", {
    enabled: !!resultId,
  });
  const [wsUrl] = useState(WEBSOCKET_CONFIG.url);
  const [topic] = useState(WEBSOCKET_CONFIG.topic);
  const [enabled, setEnabled] = useState(false);
  const [finalData, setFinalData] = useState<any>(null);

  // States for modals
  const [showIframe, setShowIframe] = useState(false);

  const [showConfirmSaveResult, setShowConfirmSaveResult] = useState(false);

  // Ref for questions container and tracking
  const questionsContainerRef = useRef<HTMLDivElement>(null);
  const [previousQuestionCount, setPreviousQuestionCount] = useState(0);

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

  // Handler functions for document actions
  const handleViewDocument = () => {
    setShowIframe(true);
  };

  const handleDownloadDocument = async () => {
    try {
      if (finalData?.exam_data) {
        // Chuyển đổi dữ liệu từ format parts sang format ExamData
        const convertedData = convertToExamData(finalData.exam_data);
        // Gọi hàm generator docx để tạo và download file
        await generateExamDocx(convertedData);
      } else {
        toast.error("Không có dữ liệu đề thi để tải xuống");
      }
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Có lỗi xảy ra khi tải xuống. Vui lòng thử lại.");
    }
  };

  // Hàm chuyển đổi dữ liệu từ format parts sang ExamData
  const convertToExamData = (data: any) => {
    const questions: any[] = [];
    const yesNoQuestions: any[] = [];
    const shortQuestions: any[] = [];

    if (data.parts) {
      data.parts.forEach((part: any) => {
        if (part.questions) {
          part.questions.forEach((q: any) => {
            if (
              part.title?.includes("trắc nghiệm") ||
              part.title?.includes("nhiều phương án")
            ) {
              // Câu trắc nghiệm
              questions.push({
                question: q.question,
                options: q.options || {},
                illustrationImage: q.illustrationImage,
              });
            } else if (part.title?.includes("Đúng/Sai") || q.statements) {
              // Câu Đúng/Sai
              yesNoQuestions.push({
                question: q.question,
                statements: q.statements || {},
                illustrationImage: q.illustrationImage,
              });
            } else {
              // Câu tự luận
              shortQuestions.push({
                question: q.question,
                illustrationImage: q.illustrationImage,
              });
            }
          });
        }
      });
    }

    return {
      examTitle: "Đề thi",
      examSubject: "Hóa học",
      examTime: "45 phút",
      examDate: new Date().toLocaleDateString("vi-VN"),
      examCode: "001",
      atomic_masses: null,
      questions,
      yesNoQuestions,
      shortQuestions,
    };
  };

  const handleSaveResult = (formData: {
    name: string;
    description?: string;
  }) => {
    if (!resultId) {
      toast.error("Không tìm thấy result ID để lưu kết quả");
      return;
    }

    const saveData = {
      name: formData.name,
      description: formData.description || "",
      data: finalData?.exam_data,
      status: "ARCHIVED",
    };

    updateToolResult(
      {
        id: resultId,
        data: saveData,
      },
      {
        onSuccess: () => {
          toast.success("Lưu kết quả thành công!");

          setShowConfirmSaveResult(false);
          router.push("/my-library/EXAM");
        },
        onError: (error: any) => {
          console.error("Error saving result:", error?.response?.data);
          toast.error(error?.response?.data || "Có lỗi xảy ra khi lưu kết quả");
        },
      }
    );
  };

  const handleSaveDraft = (callback?: () => void) => {
    if (!resultId) {
      toast.error("Không tìm thấy result ID để lưu bản nháp");
      return;
    }

    const saveData = {
      name: currentToolResult?.data?.name || "Đề thi chưa đặt tên",
      description: currentToolResult?.data?.description || "",
      data: finalData?.exam_data,
      status: "DRAFT",
    };

    updateToolResult(
      {
        id: resultId,
        data: saveData,
      },
      {
        onSuccess: () => {
          toast.success("Đang di chuyển đến trang chỉnh sửa!");
          // Execute callback after successful save
          if (callback) {
            callback();
          }
        },
        onError: (error: any) => {
          console.error("Error saving draft:", error);
          toast.error(
            error?.response?.data?.message || "Có lỗi xảy ra khi lưu bản nháp"
          );
        },
      }
    );
  };

  // State for validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Lấy data động từ API
  const { data: grades } = useGradesService();
  const { data: subjects } = useSubjectsByGradeService(selectedGrade, {
    enabled: !!selectedGrade,
  });

  const { data: books } = useBookActiveBySubjectService(
    selectedSubject,
    "ACTIVE",
    {
      enabled: !!selectedSubject, // Only call when subject is selected
    }
  );

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

  // Hook phân bổ tự động
  const distributeMaximumAcrossDifficulties =
    useDistributeMaximumAcrossDifficulties();

  // Function to create initial distribution based on template and rowCount
  const createInitialDistribution = (rowCount = 1) => {
    const distribution: any = {};
    templateParts?.forEach((part: any, index: number) => {
      const partKey = `part${index + 1}`;
      const maximum = Number(part.maximum || part.maxQuestions) || 0;
      const numLevels = part.difficultyLevels?.length || 1;
      // Chia đều tổng max cho số hàng, rồi chia đều cho số level
      const perRow = rowCount > 0 ? Math.floor(maximum / rowCount) : 0;
      const remainderRow = rowCount > 0 ? maximum % rowCount : 0;
      // Tính số câu cho hàng này (ưu tiên các hàng đầu nhận thêm 1 nếu dư)
      // (Chỉ dùng khi tạo lại toàn bộ matrix)
      distribution[partKey] = {};
      part.difficultyLevels?.forEach((level: any) => {
        distribution[partKey][level.id] = 0;
      });
    });
    return distribution;
  };

  // State cho bảng matrix
  const [matrix, setMatrix] = useState<MatrixRow[]>([]);

  // Initialize matrix when template data is available
  useEffect(() => {
    if (templateParts.length > 0 && matrix.length === 0) {
      setMatrix([
        {
          lessonID: "",
          distribution: createInitialDistribution(),
          total: 0,
        },
      ]);
    }
  }, [templateParts, matrix.length]);

  // If you load matrix data from API, merge distribution for each row to ensure all parts/levels exist
  // Example: (Uncomment and use this logic where you set matrix from API)
  // useEffect(() => {
  //   if (apiMatrixData) {
  //     setMatrix(apiMatrixData.map(row => ({
  //       ...row,
  //       distribution: mergeDistribution(row.distribution)
  //     })));
  //   }
  // }, [apiMatrixData, templateParts]);

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
    part: string,
    level: string,
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
                ...row?.distribution[part],
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
      const newTotal = calculateDynamicRowTotal(updatedRow);

      if (newTotal >= 1) {
        newErrors[totalErrorKey] = "";
      }
    }

    // Update errors state
    setErrors(newErrors);
  };

  // Khi thêm hàng (bài học), phân bổ lại đều cho tất cả các hàng
  const addMatrixRow = () => {
    const newRowCount = matrix.length + 1;
    // Tạo lại distribution cho tất cả các hàng dựa trên số hàng mới
    const newMatrix = Array.from({ length: newRowCount }, (_, idx) => {
      const distribution: any = {};
      templateParts?.forEach((part: any, partIdx: number) => {
        const partKey = `part${partIdx + 1}`;
        const maximum = Number(part.maximum || part.maxQuestions) || 0;
        const numLevels = part.difficultyLevels?.length || 1;
        // Chia đều tổng max cho số hàng, rồi chia đều cho số level
        const perRow = newRowCount > 0 ? Math.floor(maximum / newRowCount) : 0;
        const remainderRow = newRowCount > 0 ? maximum % newRowCount : 0;
        // Hàng đầu nhận thêm 1 nếu dư
        const thisRowMax = perRow + (idx < remainderRow ? 1 : 0);
        // Chia đều cho các mức độ khó: nếu dư thì dồn hết cho VD, NB và TH chia đều
        distribution[partKey] = {};
        if (numLevels === 3) {
          // NB: 'nb', TH: 'th', VD: 'vd'
          const nb_th = numLevels > 0 ? Math.floor(thisRowMax / 3) : 0;
          const remainder = numLevels > 0 ? thisRowMax % 3 : 0;
          distribution[partKey]["nb"] = nb_th;
          distribution[partKey]["th"] = nb_th;
          distribution[partKey]["vd"] = nb_th + remainder;
        } else {
          // fallback: chia đều như cũ
          const perLevel =
            numLevels > 0 ? Math.floor(thisRowMax / numLevels) : 0;
          const remainderLevel = numLevels > 0 ? thisRowMax % numLevels : 0;
          const levelOrder = part.difficultyLevels?.map((l: any) => l.id) || [];
          part.difficultyLevels?.forEach((level: any) => {
            distribution[partKey][level.id] = perLevel;
          });
          // Dồn dư cho level cuối cùng
          if (levelOrder.length > 0) {
            distribution[partKey][levelOrder[levelOrder.length - 1]] +=
              remainderLevel;
          }
        }
      });
      return {
        lessonID: matrix[idx]?.lessonID || "",
        distribution,
        total: 0,
      };
    });
    setMatrix(newMatrix);
    toast.info("Đã thêm hàng mới với phân bổ tự động theo maximum!");
  };

  const removeMatrixRow = (idx: number) => {
    setMatrix(matrix.filter((_, i) => i !== idx));
  };

  // Function to calculate how many lessons are selected for each part
  const calculateLessonsPerPart = () => {
    const lessonsPerPart: { [key: string]: number } = {};

    templateParts.forEach((part: any, partIndex: number) => {
      const partKey = `part${partIndex + 1}`;
      // Count how many rows have lessons selected (non-empty lessonID)
      const lessonsCount = matrix.filter(
        (row) => row.lessonID && row.lessonID.trim() !== ""
      ).length;
      lessonsPerPart[partKey] = Math.max(1, lessonsCount); // At least 1 to avoid division by zero
    });

    return lessonsPerPart;
  };

  // Function to auto-distribute maximum values for a specific row
  const autoDistributeRow = (rowIdx: number) => {
    const lessonsPerPart = calculateLessonsPerPart();

    const updatedMatrix = matrix.map((row, i) => {
      if (i === rowIdx) {
        const newDistribution = { ...row.distribution };

        templateParts.forEach((part: any, partIndex: number) => {
          const partKey = `part${partIndex + 1}`;
          const maximum = part.maximum || part.maxQuestions || 0;
          const lessonsCount = lessonsPerPart[partKey];

          if (maximum > 0 && part.difficultyLevels && lessonsCount > 0) {
            // Calculate maximum per lesson (divide total maximum by number of lessons)
            const maximumPerLesson = Math.floor(maximum / lessonsCount);
            const remainder = maximum % lessonsCount;

            // For this specific row, check if it should get extra from remainder
            const currentRowIndex =
              matrix.filter(
                (r, idx) =>
                  idx <= rowIdx && r.lessonID && r.lessonID.trim() !== ""
              ).length - 1;
            const extraForThisRow = currentRowIndex < remainder ? 1 : 0;
            const finalMaximumForThisRow = maximumPerLesson + extraForThisRow;

            // Auto-distribute this lesson's share across difficulty levels
            const distributedValues = distributeMaximumAcrossDifficulties(
              finalMaximumForThisRow,
              part.difficultyLevels
            );
            newDistribution[partKey] = { ...distributedValues };
          }
        });

        return {
          ...row,
          distribution: newDistribution,
        };
      }
      return row;
    });

    setMatrix(updatedMatrix);

    // Clear any validation errors for this row
    const newErrors = { ...errors };
    templateParts.forEach((part: any, partIndex: number) => {
      const partKey = `part${partIndex + 1}`;
      part.difficultyLevels?.forEach((level: any) => {
        const fieldKey = `matrix_${rowIdx}_${partKey}_${level.id}`;
        if (newErrors[fieldKey]) {
          newErrors[fieldKey] = "";
        }
      });
    });

    const totalErrorKey = `matrix_${rowIdx}_total`;
    if (newErrors[totalErrorKey]) {
      newErrors[totalErrorKey] = "";
    }

    setErrors(newErrors);

    // Show success message
    toast.success("Đã phân bổ tự động thành công!");
  };

  // Map ra JSON đúng format
  function mapToBackend() {
    return {
      totalCount: calculateDynamicColumnTotals(matrix).grandTotal,
      school: school || "Trường THPT Nguyễn Huệ",
      // grade: selectedGrade ? parseInt(selectedGrade) : null,
      grade: 12,
      subject: selectedSubject || "Hóa học",
      examTitle,
      examCode: "0001",
      duration: Number(duration),
      outputFormat: "docx",
      outputLink: "online",
      isExportDocx: false,
      matrix: matrix.map((row) => ({
        lessonId: row.lessonID.toString(),
        totalQuestions: calculateDynamicRowTotal(row),
        parts: templateParts.map((part: any, index: number) => {
          const partKey = `part${index + 1}`;
          const objectives: any = {};

          // Map difficulty levels to objectives
          part?.difficultyLevels?.forEach((level: any) => {
            // Map level IDs to DIFFICULTY_LEVEL constants
            if (level.id === "nb") {
              objectives[DIFFICULTY_LEVEL.KNOWLEDGE] =
                row?.distribution[partKey]?.[level.id] || 0;
            } else if (level.id === "th") {
              objectives[DIFFICULTY_LEVEL.COMPREHENSION] =
                row?.distribution[partKey]?.[level.id] || 0;
            } else if (level.id === "vd") {
              objectives[DIFFICULTY_LEVEL.APPLICATION] =
                row?.distribution[partKey]?.[level.id] || 0;
            }
          });

          return {
            part: index + 1,
            objectives,
          };
        }),
      })),
    };
  }

  // Dynamic validation function
  const validateDynamicForm = () => {
    const validationErrors: string[] = [];
    const fieldErrors: { [key: string]: string } = {};

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

    // Validate matrix rows
    matrix.forEach((row, index) => {
      if (!row.lessonID) {
        validationErrors.push(`Dòng ${index + 1}: Chưa chọn bài học`);
        fieldErrors[`matrix_${index}_lesson`] = "Chưa chọn bài học";
      }

      // Validate individual input fields - chỉ kiểm tra số âm
      templateParts.forEach((part: any, partIndex: number) => {
        const partKey = `part${partIndex + 1}`;
        part.difficultyLevels?.forEach((level: any) => {
          const value = row.distribution[partKey]?.[level.id] || 0;
          const fieldKey = `matrix_${index}_${partKey}_${level.id}`;

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
      const rowTotal = calculateDynamicRowTotal(row);
      if (rowTotal < 1) {
        validationErrors.push(
          `Dòng ${index + 1}: Tổng số câu phải ít nhất 1 câu`
        );
        fieldErrors[`matrix_${index}_total`] = "Tổng số câu phải >= 1";
      }
    });

    // Validate tổng số câu của từng part không vượt quá maximum (nếu có)
    templateParts.forEach((part: any, partIdx: number) => {
      const partKey = `part${partIdx + 1}`;
      const max = part.maximum || part.maxQuestions;
      if (max && !isNaN(Number(max))) {
        // Tính tổng số câu của part này trên toàn bộ matrix
        let partTotal = 0;
        matrix.forEach((row) => {
          part.difficultyLevels?.forEach((level: any) => {
            const value = row.distribution?.[partKey]?.[level.id] || 0;
            partTotal += typeof value === "number" && !isNaN(value) ? value : 0;
          });
        });
        if (partTotal > Number(max)) {
          validationErrors.push(
            `Tổng số câu của ${part.name || partKey} vượt quá tối đa (${max})`
          );
          fieldErrors[`${partKey}Total`] = `Tối đa ${max} câu`;
        }
      }
    });

    return {
      isValid: validationErrors.length === 0,
      errors: validationErrors,
      fieldErrors,
    };
  };

  // Validation function using the extracted validation module
  const validateForm = () => {
    // Clear previous errors
    setErrors({});

    const validationResult = validateDynamicForm();

    // Set field errors for UI feedback
    setErrors(validationResult.fieldErrors);

    return validationResult.errors;
  };

  // Handle token estimation
  const handleEstimateToken = () => {
    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      // Show first error as toast
      toast.error(validationErrors[0]);
      return;
    }

    // If validation passes, proceed with token estimation
    const examData = mapToBackend();

    const payload = {
      toolId: bookType?.data?.id,
      toolType: "INTERNAL",
      book_id: 1,
      lesson_id: "4",
      input: examData,
      academicYearId: 1,
      templateId: matrixTemplates?.data[0]?.id,
      // Note: No result_id for estimation
    };

    // Store payload for later use
    setPendingPayload(payload);

    estimateToken(payload, {
      onSuccess: (response: any) => {
        console.log("Token estimation response:", response?.data?.data);
        setEstimatedTokens(
          response?.data?.data || response?.estimatedTokens || 0
        );
        setShowTokenConfirmModal(true);
      },
      onError: (error) => {
        toast.error(
          `${
            error?.response?.data?.message || "Có lỗi xảy ra khi ước tính token"
          }`
        );
        console.error("Token estimation error:", error);
      },
    });
  };

  // Handle create exam after token confirmation
  const handleCreateExam = () => {
    if (!pendingPayload) {
      toast.error("Không có dữ liệu để thực hiện");
      return;
    }

    executeTool(pendingPayload, {
      onSuccess: (e: any) => {
        toast.success("Gửi dữ liệu thành công!");
        console.log(e.data.task_id);
        setEnabled(true);
        // Reset modal state
        setShowTokenConfirmModal(false);
        setPendingPayload(null);
        setEstimatedTokens(null);
      },
      onError: (error) => {
        toast.error(
          `${error?.response?.data || "Có lỗi xảy ra khi gửi dữ liệu"}`
        );
      },
    });
  };

  // Handle token confirmation modal close
  const handleCloseTokenModal = () => {
    setShowTokenConfirmModal(false);
    setPendingPayload(null);
    setEstimatedTokens(null);
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

  // Auto-scroll effect - moved outside of conditional rendering
  useEffect(() => {
    if (
      data?.status === "processing" &&
      data?.tool_code === bookType?.data?.code
    ) {
      const examData = data?.exam_data;
      const parts = examData?.parts || [];
      const multipleChoiceQuestions =
        parts.find((p: any) => p.part === "PHẦN I")?.questions || [];
      const yesNoQuestions =
        parts.find((p: any) => p.part === "PHẦN II")?.questions || [];
      const shortQuestions =
        parts.find((p: any) => p.part === "PHẦN III")?.questions || [];

      const allQuestions = [
        ...multipleChoiceQuestions,
        ...yesNoQuestions,
        ...shortQuestions,
      ];

      if (
        allQuestions.length > previousQuestionCount &&
        questionsContainerRef.current
      ) {
        setTimeout(() => {
          if (questionsContainerRef.current) {
            const container = questionsContainerRef.current;
            container.scrollTo({
              top: container.scrollHeight,
              behavior: "smooth",
            });
          }
        }, 100);
        setPreviousQuestionCount(allQuestions.length);
      }
    }
  }, [data, previousQuestionCount, bookType?.data?.code]);

  if (
    (data?.status === "processing" &&
      data?.tool_code === bookType?.data?.code) ||
    resultId
  ) {
    return (
      <>
        <LoadingRealtimeExamMatrix
          data={data}
          finalData={finalData}
          resultId={resultId}
          matrix={matrix}
          allLessons={allLessons}
          previousQuestionCount={previousQuestionCount}
          setPreviousQuestionCount={setPreviousQuestionCount}
          bookTypeCode={bookType?.data?.code}
          onDownloadDocument={handleDownloadDocument}
          onSaveResult={() => setShowConfirmSaveResult(true)}
          onSaveDraft={handleSaveDraft}
          calculateRowTotal={calculateDynamicRowTotal}
          calculateColumnTotals={calculateDynamicColumnTotals}
          templateParts={templateParts}
        />

        <ConfirmSaveResult
          isOpen={showConfirmSaveResult}
          onClose={() => setShowConfirmSaveResult(false)}
          onConfirm={handleSaveResult}
          resultId={resultId || ""}
          data={mapToBackend()}
          isLoading={isSavingResult}
          initialName={currentToolResult?.data?.name || ""}
          initialDescription={currentToolResult?.data?.description || ""}
        />
      </>
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

      <div className="mb-4 pt-6">
        <h2 className="text-lg font-calsans">Ma trận đề thi</h2>
        <h3 className="text-base font-questrial text-neutral-500">
          Ma trận phân bổ đề thi dựa trên số lượng câu nhận biết, thông hiểu,
          vận dụng
        </h3>
      </div>

      {/* Show loading or table based on template data availability */}
      {templateParts.length === 0 ? (
        <div className="w-full text-center py-8">
          <p className="text-gray-500">Đang tải template...</p>
        </div>
      ) : (
        <>
          <table className="w-full text-center rounded-md border mb-4">
            <thead className="font-calsans text-base">
              <tr>
                <th className="border px-2 py-4 align-middle" rowSpan={2}>
                  <span className="font-normal">Bài học</span>
                </th>
                {templateParts.map((part, index) => (
                  <th
                    key={part.id}
                    className={`border px-2 py-4 align-middle ${part.color}`}
                    colSpan={part.difficultyLevels?.length || 3}
                  >
                    <span className="font-normal">{part.name}</span>
                  </th>
                ))}
                <th className="border px-2 py-4 align-middle" rowSpan={2}>
                  <span className="font-normal">Tổng số câu</span>
                </th>
                <th className="border px-2 py-4 align-middle" rowSpan={2}>
                  <span className="font-normal">Thao tác</span>
                </th>
              </tr>
              <tr>
                {templateParts?.map((part) => (
                  <React.Fragment key={`${part.id}-levels`}>
                    {part?.difficultyLevels?.map((level) => (
                      <th key={level.id} className="border px-2 py-2">
                        <span className={`font-normal ${level.color}`}>
                          {level?.name}
                        </span>
                      </th>
                    ))}
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
                            allLessons.find(
                              (lesson: any) => lesson.id === row.lessonID
                            )?.name || "Chọn bài học"
                          }
                          readOnly
                          className="w-full min-h-[40px] bg-gray-100 cursor-not-allowed"
                        />
                      ) : (
                        <Select
                          key={`lesson-select-${rowIdx}`}
                          value={row.lessonID || "CLEAR_SELECTION"}
                          onValueChange={(val) => {
                            // Handle clear selection
                            const actualValue =
                              val === "CLEAR_SELECTION" ? "" : val;
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
                  {templateParts.map((part: any, partIndex: number) => {
                    const partKey = `part${partIndex + 1}`;
                    return part.difficultyLevels?.map((level: any) => {
                      const fieldKey = `matrix_${rowIdx}_${partKey}_${level.id}`;
                      return (
                        <td
                          className="border px-2 py-1"
                          key={partKey + level.id}
                        >
                          <div className="flex flex-col">
                            <Input
                              type="number"
                              min={0}
                              step="1"
                              value={(() => {
                                // Always safe access
                                const value =
                                  row.distribution?.[partKey]?.[level.id] ?? 0;
                                return typeof value === "number" &&
                                  !isNaN(value)
                                  ? value
                                  : 0;
                              })()}
                              onChange={
                                resultId
                                  ? undefined
                                  : (e: any) => {
                                      const inputValue = e.target.value;
                                      // Only allow empty string or positive integers
                                      if (
                                        inputValue === "" ||
                                        /^[0-9]+$/.test(inputValue)
                                      ) {
                                        const value =
                                          inputValue === ""
                                            ? 0
                                            : parseInt(inputValue, 10);
                                        handleDistributionChange(
                                          rowIdx,
                                          partKey,
                                          level.id,
                                          value
                                        );
                                        // Clear error when user enters a non-negative value
                                        if (errors[fieldKey] && value >= 0) {
                                          setErrors((prev) => ({
                                            ...prev,
                                            [fieldKey]: "",
                                          }));
                                        }
                                      }
                                    }
                              }
                              readOnly={!!resultId}
                              placeholder={level.name}
                              className={`$
                            resultId ? "bg-gray-100 cursor-not-allowed" : ""
                          } $
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
                    });
                  })}
                  <td className="border px-2 py-1">
                    <div className="flex flex-col">
                      <Input
                        type="number"
                        value={calculateDynamicRowTotal(row)}
                        readOnly
                        className={`bg-gray-100 cursor-not-allowed text-center font-medium ${
                          errors[`matrix_${rowIdx}_total`]
                            ? "border-red-500"
                            : ""
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
                    <div className="flex flex-col gap-1">
                      {/* Nút phân bổ tự động */}
                      {(() => {
                        // Kiểm tra nếu hàng đã được phân bổ (tổng value > 0)
                        const isDistributed = calculateDynamicRowTotal(row) > 0;
                        if (isDistributed) {
                          // Nút Reset: set toàn bộ value của hàng về 0
                          return (
                            <Button
                              size="sm"
                              type="button"
                              variant="outline"
                              className={`px-2 py-1 text-xs ${
                                resultId ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                              onClick={() => {
                                if (!resultId) {
                                  // Reset value về 0 cho hàng này
                                  const resetDistribution: any = {};
                                  templateParts.forEach(
                                    (part: any, partIndex: number) => {
                                      const partKey = `part${partIndex + 1}`;
                                      resetDistribution[partKey] = {};
                                      part.difficultyLevels?.forEach(
                                        (level: any) => {
                                          resetDistribution[partKey][
                                            level.id
                                          ] = 0;
                                        }
                                      );
                                    }
                                  );
                                  setMatrix((prev) =>
                                    prev.map((r, i) =>
                                      i === rowIdx
                                        ? {
                                            ...r,
                                            distribution: resetDistribution,
                                          }
                                        : r
                                    )
                                  );
                                  toast.info("Đã reset giá trị hàng này về 0!");
                                }
                              }}
                              disabled={!!resultId}
                              title="Reset tất cả giá trị của hàng này về 0"
                            >
                              Reset
                            </Button>
                          );
                        } else {
                          // Nút Phân bổ
                          return (
                            <Button
                              size="sm"
                              type="button"
                              variant="outline"
                              className={`px-2 py-1 text-xs ${
                                resultId ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                              onClick={() => {
                                if (!resultId) {
                                  autoDistributeRow(rowIdx);
                                }
                              }}
                              disabled={!!resultId}
                              title="Phân bổ tự động theo maximum của từng phần"
                            >
                              Phân bổ
                            </Button>
                          );
                        }
                      })()}

                      {/* Nút xóa */}
                      <Button
                        size="sm"
                        type="button"
                        className={`px-0 py-2 bg-transparent shadow-none hover:bg-transparent hover:shadow-none group transition-colors duration-200 ${
                          matrix.length <= 1 || resultId
                            ? "opacity-50 cursor-not-allowed"
                            : ""
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
                    </div>
                  </td>
                </tr>
              ))}

              {/* Hàng tổng */}
              <tr className="font-bold">
                <td className="border px-2 py-3 text-center bg-violet-50 ">
                  <span className="font-calsans ">TỔNG</span>
                </td>
                {templateParts.map((part: any, index: number) => {
                  const partKey = `part${index + 1}`;
                  const partTotal =
                    calculateDynamicColumnTotals(matrix)[partKey] || 0;
                  const errorKey = `${partKey}Total`;
                  const max = part.maximum || part.maxQuestions;
                  return (
                    <td
                      key={partKey}
                      className={`border px-2 py-3 text-center ${
                        errors[errorKey] ? "bg-red-100" : ""
                      }`}
                      colSpan={part.difficultyLevels?.length || 3}
                    >
                      <div className="flex flex-col">
                        <span
                          className={`font-medium font-questrial ${
                            errors[errorKey] ? "text-red-700" : ""
                          }`}
                        >
                          {partTotal}
                          {typeof max !== "undefined" && max !== null
                            ? ` / ${max}`
                            : ""}
                        </span>
                        {errors[errorKey] && (
                          <span className="text-red-500 font-questrial text-xs mt-1">
                            {errors[errorKey]}
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
                {/* Tổng tổng */}
                <td className="border px-2 py-3 text-center">
                  <span className=" font-bold font-questrial">
                    {calculateDynamicColumnTotals(matrix).grandTotal}
                  </span>
                </td>
                {/* Cột thao tác trống */}
                <td className="border px-2 py-3"></td>
              </tr>
            </tbody>
          </table>

          {/* Chú thích phân bổ tự động */}
          {finalData ? null : (
            <div className="mb-2 text-sm text-gray-600 font-questrial">
              <p>
                <strong>Phân bổ tự động:</strong> Chia đều số câu maximum của
                mỗi phần cho tất cả các bài học đã chọn, sau đó chia đều cho các
                mức độ khó (NB, TH, VD). Khi có số lẻ, mức Nhận biết (NB) và
                Thông hiểu (TH) sẽ được ưu tiên hơn Vận dụng (VD).
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Ví dụ: Phần có maximum 30 câu, 3 bài học → mỗi bài 10 câu → NB:
                4, TH: 3, VD: 3
              </p>
            </div>
          )}

          {finalData ? null : (
            <div className="flex gap-2 mt-4">
              <Button
                variant="dash"
                type="button"
                className={`rounded-md flex-1 ${
                  resultId ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={resultId ? undefined : addMatrixRow}
                disabled={!!resultId}
              >
                Thêm dòng mới +
              </Button>

              <Button
                variant="outline"
                type="button"
                className={`rounded-md px-6 ${
                  resultId ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={
                  resultId
                    ? undefined
                    : () => {
                        // Auto-distribute for all rows at once
                        const lessonsPerPart = calculateLessonsPerPart();

                        const updatedMatrix = matrix.map((row, rowIndex) => {
                          const newDistribution = { ...row.distribution };

                          templateParts.forEach(
                            (part: any, partIndex: number) => {
                              const partKey = `part${partIndex + 1}`;
                              const maximum =
                                part.maximum || part.maxQuestions || 0;
                              const lessonsCount = lessonsPerPart[partKey];

                              if (
                                maximum > 0 &&
                                part.difficultyLevels &&
                                lessonsCount > 0
                              ) {
                                // Calculate maximum per lesson (divide total maximum by number of lessons)
                                const maximumPerLesson = Math.floor(
                                  maximum / lessonsCount
                                );
                                const remainder = maximum % lessonsCount;

                                // For this specific row, check if it should get extra from remainder
                                const currentRowIndex =
                                  matrix.filter(
                                    (r, idx) =>
                                      idx <= rowIndex &&
                                      r.lessonID &&
                                      r.lessonID.trim() !== ""
                                  ).length - 1;
                                const extraForThisRow =
                                  currentRowIndex < remainder ? 1 : 0;
                                const finalMaximumForThisRow =
                                  maximumPerLesson + extraForThisRow;

                                // Auto-distribute this lesson's share across difficulty levels
                                const distributedValues =
                                  distributeMaximumAcrossDifficulties(
                                    finalMaximumForThisRow,
                                    part.difficultyLevels
                                  );
                                newDistribution[partKey] = {
                                  ...distributedValues,
                                };
                              }
                            }
                          );

                          return {
                            ...row,
                            distribution: newDistribution,
                          };
                        });

                        setMatrix(updatedMatrix);

                        // Clear all validation errors
                        setErrors({});

                        // Show success message
                        toast.success(
                          "Đã phân bổ tự động cho tất cả các hàng thành công!"
                        );
                      }
                }
                disabled={!!resultId}
                title="Phân bổ tự động cho tất cả các hàng theo maximum của từng phần"
              >
                Phân bổ tự động tất cả
              </Button>
            </div>
          )}
        </>
      )}

      {/* Create Exam Button */}

      {finalData && resultId ? (
        <div className="flex justify-between items-center mb-10 mt-5">
          <div className="space-y-3">
            <h1 className="font-calsans text-base">
              Đã tạo thành công đề theo ma trận trên
            </h1>
            <div className="grid grid-cols-3 cursor-pointer">
              <div className="flex items-center justify-between border rounded-md px-4 py-4 bg-white relative">
                <div className="flex gap-4">
                  <FileIcon type={"DOCX"} size={"lg"} />
                  <div className="text-sm flex flex-col gap-2">
                    <p className="font-calsans text-base">
                      {finalData?.message || "Không xác định"}
                    </p>
                    <p className=" line-clamp-2 text-sm font-questrial">
                      Đề thi thông minh
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Button variant={"dash"} onClick={handleViewDocument}>
                    <Eye />
                  </Button>
                  <Button onClick={handleDownloadDocument}>
                    {DowloadIcon}
                  </Button>
                  <Button
                    variant={"outline"}
                    onClick={() => setShowConfirmSaveResult(true)}
                  >
                    <Save />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            className={`px-8 py-3 text-white font-medium rounded-md ${
              resultId ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={resultId ? undefined : handleEstimateToken}
            disabled={!!resultId || isEstimating}
          >
            {isEstimating ? "Đang ước tính..." : "Tạo đề thi"}
          </Button>
        </div>
      )}

      {/* Token Confirmation Modal */}
      <TokenConfirmModal
        isOpen={showTokenConfirmModal}
        onClose={handleCloseTokenModal}
        onConfirm={handleCreateExam}
        estimatedTokens={estimatedTokens || 0}
        isLoading={isGenerating}
      />
    </div>
  );
}
