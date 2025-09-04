import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  useExecuteToolService,
  useEstimateTokenService,
} from "@/services/executeToolServices";
import { useSimpleWebSocket } from "@/hooks/useSimpleWebSocket";
import { generateDocx } from "@/utils/docxGenerator";
import { DemoNode, WebSocketData } from "../types";
import { useSearchParams } from "next/navigation";
import { useBookTypeByIdService } from "@/services/bookTypeServices";
import { WEBSOCKET_CONFIG } from "@/config/websocket";

interface UseLessonPlanGenerationProps {
  demoData: DemoNode[];
  lessonId: string | null;
  lessonById: any;
  items: any[];
  getAllFinalData: () => DemoNode[];
  convertLessonPlanToDemoNode: (lessonPlanData: any) => DemoNode[];
  mergeAIDataToFinalData: (
    aiData: DemoNode[],
    targetStep?: number
  ) => DemoNode[] | undefined;
}

export const useLessonPlanGeneration = ({
  demoData,
  lessonId,
  lessonById,
  items,
  getAllFinalData,
  convertLessonPlanToDemoNode,
  mergeAIDataToFinalData,
}: UseLessonPlanGenerationProps) => {
  const [wsUrl] = useState(WEBSOCKET_CONFIG.url);
  const [topic] = useState(WEBSOCKET_CONFIG.topic);
  const [enabled, setEnabled] = useState(false);

  // Store result_id from first WebSocket response
  const [resultId, setResultId] = useState<string | null>(null);

  // Track processed data to prevent duplicate toasts
  const processedDataRef = useRef<string>("");

  // Store functions in refs to avoid dependency issues
  const convertLessonPlanToDemoNodeRef = useRef(convertLessonPlanToDemoNode);
  const mergeAIDataToFinalDataRef = useRef(mergeAIDataToFinalData);

  // Update refs when functions change
  useEffect(() => {
    convertLessonPlanToDemoNodeRef.current = convertLessonPlanToDemoNode;
  }, [convertLessonPlanToDemoNode]);

  useEffect(() => {
    mergeAIDataToFinalDataRef.current = mergeAIDataToFinalData;
  }, [mergeAIDataToFinalData]);
  const searchParams = useSearchParams();

  const query = searchParams.get("bookTypeId");

  const { data: bookType } = useBookTypeByIdService(query || "");
  const { mutate, isPending: isGenerating } = useExecuteToolService();
  const { mutate: estimateToken, isPending: isEstimating } =
    useEstimateTokenService();

  // Token estimation state
  const [showTokenConfirmModal, setShowTokenConfirmModal] = useState(false);
  const [estimatedTokens, setEstimatedTokens] = useState<number | null>(null);
  const [pendingPayload, setPendingPayload] = useState<any>(null);

  const { data, isConnected, error, sendMessage, reconnect } =
    useSimpleWebSocket({
      url: wsUrl,
      topic: topic,
      enabled: enabled,
    });

  // Handle WebSocket data
  useEffect(() => {
    // Save result_id if it exists and we haven't saved it yet
    if (
      data?.result_id &&
      !resultId &&
      data?.tool_code === bookType?.data?.code
    ) {
      console.log("💾 Saving result_id:", data.result_id);
      setResultId(data.result_id);
    }

    // Check for children data in multiple possible locations
    let childrenData = null;

    // Check direct children property
    if (data?.children && data.children.length > 0) {
      childrenData = data.children;
      console.log("📊 Found children data in data.children:", childrenData);
    }
    // Check partial_result.output.children
    else if (
      data?.partial_result?.output?.children &&
      data.partial_result.output.children.length > 0
    ) {
      childrenData = data.partial_result.output.children;
    }

    if (childrenData && data?.tool_code === bookType?.data?.code) {
      // Create a unique key for this data to prevent duplicate processing
      const dataKey = JSON.stringify(childrenData);

      // Only process if this is new data
      if (processedDataRef.current !== dataKey) {
        processedDataRef.current = dataKey;

        const convertedData =
          convertLessonPlanToDemoNodeRef.current(childrenData);
        console.log("🔄 Converted data:", convertedData);

        if (convertedData.length > 0) {
          // Find target step based on parentId of first node
          let targetStep: number | undefined = undefined;
          if (convertedData.length > 0 && convertedData[0].parentId) {
            const parentId = convertedData[0].parentId;
            const stepIndex = items.findIndex(
              (item) => item.id.toString() === parentId
            );
            if (stepIndex !== -1) {
              targetStep = stepIndex;
              console.log(
                "🎯 Found target step based on parentId:",
                parentId,
                "-> step:",
                targetStep
              );
            }
          }

          const mergedResult = mergeAIDataToFinalDataRef.current(
            convertedData,
            targetStep
          );
          console.log(
            "✅ Merged result:",
            mergedResult,
            "Target step:",
            targetStep
          );
          toast.success(`Đã tạo thành công 1 mục nội dung.`);
        } else {
          console.log("⚠️ No converted data to merge");
        }
      } else {
        console.log("🔄 Data already processed, skipping...");
      }
    } else {
      console.log("❌ No children data found in WebSocket response");
    }
  }, [data, resultId]); // Add resultId to dependencies

  // Handle token estimation
  const handleEstimateToken = useCallback(() => {
    // Use total data from all steps
    const allData = getAllFinalData();

    const mergedNode = {
      id: "merged",
      lessonPlanId: 4,
      parentId: null,
      title: "Merged Section",
      content: "",
      fieldType: null,
      type: "SUBSECTION",
      orderIndex: 0,
      metadata: null,
      status: "ACTIVE",
      children: demoData.flatMap((node) => node || []),
    };

    const payload = {
      toolId: bookType?.data?.id,
      toolType: "INTERNAL",
      lesson_id: lessonId?.toString(),
      book_id: lessonById?.data?.chapter?.book?.id,
      input: mergedNode,
      academicYearId: 1,
      // Note: No result_id for estimation
    };

    // Store payload for later use
    setPendingPayload({
      ...payload,
      ...(resultId && { result_id: resultId }), // Add result_id for actual execution
    });

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
  }, [
    getAllFinalData,
    demoData,
    lessonId,
    estimateToken,
    bookType?.data?.id,
    resultId,
    setPendingPayload,
    setEstimatedTokens,
    setShowTokenConfirmModal,
  ]);

  // Handle lesson plan generation after token confirmation
  const handleGenerationLessonPlan = useCallback(() => {
    if (!pendingPayload) {
      toast.error("Không có dữ liệu để thực hiện");
      return;
    }

    mutate(pendingPayload, {
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
        console.error(error);
      },
    });
  }, [
    pendingPayload,
    mutate,
    setEnabled,
    setShowTokenConfirmModal,
    setPendingPayload,
    setEstimatedTokens,
  ]);

  // Handle token confirmation modal close
  const handleCloseTokenModal = useCallback(() => {
    setShowTokenConfirmModal(false);
    setPendingPayload(null);
    setEstimatedTokens(null);
  }, [setShowTokenConfirmModal, setPendingPayload, setEstimatedTokens]);

  // Handle download DOCX
  const handleDownloadDocx = useCallback(async () => {
    try {
      const headerInfo = {
        school: "Trường:.....................",
        department: "Tổ:..............................",
        subject: "Môn học/Hoạt động giáo dục: ..........;",
        grade: "lớp:........",
        lessonTitle: `TÊN BÀI DẠY: ${
          " " + lessonById?.data?.name?.toUpperCase() ||
          "................................................"
        }`,
        duration: "Thời gian thực hiện: (số tiết)",
        teacherName: "Họ và tên giáo viên:\n................................",
      };

      // Use total data from all steps
      const allData = getAllFinalData();
      await generateDocx(
        allData,
        `Giao_an_${lessonById?.data?.name || ""}.docx`,
        headerInfo
      );
    } catch (error) {
      console.error("Error generating DOCX:", error);
      alert("Có lỗi xảy ra khi tạo file DOCX");
    }
  }, [getAllFinalData, lessonById]);

  return {
    // WebSocket state
    data: data as WebSocketData,
    isConnected,
    error,
    enabled,
    setEnabled,

    // Data
    bookType: bookType?.data,
    resultId,

    // Loading states
    isGenerating,
    isEstimating,

    // Token estimation state
    showTokenConfirmModal,
    estimatedTokens,

    // Actions
    handleEstimateToken,
    handleGenerationLessonPlan,
    handleCloseTokenModal,
    handleDownloadDocx,
    sendMessage,
    reconnect,
  };
};
