import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useExecuteToolService } from "@/services/executeToolServices";
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
  getAllFinalData: () => DemoNode[];
  convertLessonPlanToDemoNode: (lessonPlanData: any) => DemoNode[];
  mergeAIDataToFinalData: (aiData: DemoNode[]) => DemoNode[] | undefined;
}

export const useLessonPlanGeneration = ({
  demoData,
  lessonId,
  lessonById,
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
  const { mutate } = useExecuteToolService();
  const { data, isConnected, error, sendMessage, reconnect } =
    useSimpleWebSocket({
      url: wsUrl,
      topic: topic,
      enabled: enabled,
    });

  // Handle WebSocket data
  useEffect(() => {
    console.log("🔍 WebSocket data received: TRAN", data);

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
      console.log(
        "📊 Found children data in data.partial_result.output.children:",
        childrenData
      );
    }

    if (childrenData && data?.tool_code === bookType?.data?.code) {
      // Create a unique key for this data to prevent duplicate processing
      const dataKey = JSON.stringify(childrenData);

      // Only process if this is new data
      if (processedDataRef.current !== dataKey) {
        console.log("✨ New data detected, processing...");
        processedDataRef.current = dataKey;

        const convertedData =
          convertLessonPlanToDemoNodeRef.current(childrenData);
        console.log("🔄 Converted data:", convertedData);

        if (convertedData.length > 0) {
          // Merge into finalData instead of replace
          const mergedResult = mergeAIDataToFinalDataRef.current(convertedData);
          console.log("✅ Merged result:", mergedResult);
          toast.success("Đã tạo thành công giáo án");
        } else {
          console.log("⚠️ No converted data to merge");
        }
      } else {
        console.log("🔄 Data already processed, skipping...");
      }
    } else {
      console.log("❌ No children data found in WebSocket response");
      console.log("🔍 Data structure:", {
        hasChildren: !!data?.children,
        childrenLength: data?.children?.length || 0,
        hasPartialResult: !!data?.partial_result,
        hasOutput: !!data?.partial_result?.output,
        hasPartialChildren: !!data?.partial_result?.output?.children,
        partialChildrenLength:
          data?.partial_result?.output?.children?.length || 0,
        toolCode: data?.tool_code,
        expectedToolCode: bookType?.data?.code,
      });
    }
  }, [data, resultId]); // Add resultId to dependencies

  // Handle lesson plan generation
  const handleGenerationLessonPlan = useCallback(() => {
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
      ...(resultId && { result_id: resultId }), // Add result_id if available
    };

    mutate(payload, {
      onSuccess: (e: any) => {
        toast.success("Gửi dữ liệu thành công!");
        console.log(e.data.task_id);
        setEnabled(true);
      },
      onError: (error) => {
        toast.error(
          `${error?.response?.data || "Có lỗi xảy ra khi gửi dữ liệu"}`
        );
        console.error(error);
      },
    });
  }, [
    getAllFinalData,
    demoData,
    lessonId,
    mutate,
    bookType?.data?.id,
    resultId,
  ]);

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
        `Giao_an_${lessonById?.data?.name}.docx`,
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

    // Actions
    handleGenerationLessonPlan,
    handleDownloadDocx,
    sendMessage,
    reconnect,
  };
};
