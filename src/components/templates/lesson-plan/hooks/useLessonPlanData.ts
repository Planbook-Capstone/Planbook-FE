import { useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSearchParams } from "next/navigation";
import {
  useLessonPlanNodeChildrenService,
  useLessonPlanNodeTreeService,
} from "@/services/lessonPlanNodeServices";
import { useLessonByIdService } from "@/services/lessonServices";
import { DemoNode, LessonPlanState } from "../types";
import { LESSON_PLAN_CONFIG } from "../constants";

interface UseLessonPlanDataProps {
  mode?: "create" | "edit";
  existingData?: any;
}

export const useLessonPlanData = ({
  mode = "create",
  existingData,
}: UseLessonPlanDataProps = {}) => {
  const [demoData, setDemoData] = useState<DemoNode[]>([]);
  const [trashData, setTrashData] = useState<DemoNode[]>([]);
  const [showDeleteButtons, setShowDeleteButtons] = useState(false);
  const [activeTab, setActiveTab] = useState<"components" | "images" | "upload" | "trash">(
    "components"
  );
  const [showPreview, setShowPreview] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [finalData, setFinalData] = useState<Record<string, DemoNode[]>>({});

  const searchParams = useSearchParams();
  const lessonId = searchParams.get("lessonId");

  // Helper function to convert existing data to DemoNode format
  const convertExistingDataToDemoNode = useCallback(
    (data: any[]): DemoNode[] => {
      if (!data || !Array.isArray(data)) return [];

      return data.map((item: any) => ({
        id: item.id || uuidv4(),
        lessonPlanId: item.lessonPlanId,
        parentId: item.parentId,
        title: item.title || "",
        content: item.content || "",
        description: item.description,
        fieldType: item.fieldType || "INPUT",
        type: item.type || "PARAGRAPH",
        orderIndex: item.orderIndex || 0,
        metadata: item.metadata,
        status: item.status || "ACTIVE",
        children: item.children
          ? convertExistingDataToDemoNode(item.children)
          : [],
      }));
    },
    []
  );

  // API hooks
  const { data: treeData } = useLessonPlanNodeTreeService(
    LESSON_PLAN_CONFIG.defaultLessonPlanId
  )();
  const { data: lessonById } = useLessonByIdService(lessonId || "");

  // Debug raw treeData first
  console.log("🔍 Raw treeData:", treeData);
  console.log("🔍 Raw treeData.data:", treeData?.data);

  const items = treeData?.data?.map((item: any) => {
    console.log("🔍 Mapping item:", item);
    return {
      id: item?.id,
      title: item?.title,
      description: item?.content || item?.description || "",
    };
  });

  // Debug final items
  console.log("🔍 Final items:", items);

  // Load existing data when in edit mode
  useEffect(() => {
    if (mode === "edit" && existingData?.data) {
      console.log("🔄 Loading existing data for edit mode:", existingData.data);

      // Convert existing data to DemoNode format
      const convertedData = convertExistingDataToDemoNode(existingData.data);
      console.log("✅ Converted existing data:", convertedData);

      // Set the data
      setDemoData(convertedData);

      // In edit mode, don't set finalData to avoid conflicts with getAllFinalData
      // The getAllFinalData function will use demoData directly
      console.log("🔄 Edit mode: Using demoData directly, not setting finalData");
      console.log("🔍 Edit mode demoData count:", convertedData.length);
    }
  }, [mode, existingData?.data]); // ✅ Watch for changes in existingData.data specifically

  // Clear data when switching from edit to create mode or when existingData is removed
  useEffect(() => {
    if (mode === "create" || (mode === "edit" && !existingData?.data)) {
      console.log("🔄 Clearing data for create mode or missing existingData");
      setDemoData([]);
      setFinalData({});
    }
  }, [mode, existingData?.data]);

  const childrenQuery = useLessonPlanNodeChildrenService(
    items && items.length > currentStep ? items[currentStep].id.toString() : ""
  )();

  const apiData = childrenQuery?.data?.data;

  // Helper function to update finalData when demoData changes
  const updateFinalData = useCallback(
    (newDemoData: DemoNode[]) => {
      if (items && items.length > currentStep) {
        const currentStepId = items[currentStep].id.toString();
        setFinalData((prev) => ({
          ...prev,
          [currentStepId]: newDemoData,
        }));
      }
    },
    [items, currentStep]
  );

  // Convert lesson plan data to DemoNode format
  const convertLessonPlanToDemoNode = useCallback(
    (lessonPlanData: any): DemoNode[] => {
      console.log(
        "🔄 convertLessonPlanToDemoNode called with:",
        lessonPlanData
      );

      if (!lessonPlanData) {
        console.log("❌ No lesson plan data provided");
        return [];
      }

      const convertNode = (node: any, index: number = 0): DemoNode => {
        console.log("🔍 Processing node:", {
          id: node.id,
          type: node.type,
          title: node.title,
        });

        // Determine fieldType based on type
        let fieldType: "INPUT" | "TABLE" | "IMAGE" = "INPUT";
        if (node.fieldType === "TABLE") {
          fieldType = "TABLE";
        } else if (node.type === "IMAGE") {
          fieldType = "IMAGE";
        }

        // Ensure valid type
        const validTypes = [
          "PARAGRAPH",
          "LIST_ITEM",
          "TABLE",
          "IMAGE",
          "SECTION",
          "SUBSECTION",
          "QUESTION_BANK",
        ];
        const nodeType = validTypes.includes(node.type)
          ? node.type
          : "PARAGRAPH";

        // Use original content
        let nodeContent = node.content || "";

        return {
          id: node.id?.toString() || uuidv4(),
          lessonPlanId: node.lessonPlanId || 1,
          parentId: node.parentId?.toString() || null,
          title: node.title || `Untitled ${nodeType}`,
          content: nodeContent,
          fieldType: fieldType,
          type: nodeType as any,
          orderIndex: node.orderIndex !== undefined ? node.orderIndex : index,
          metadata: node.metadata || {},
          status: (node.status === "DELETED" ? "DELETED" : "ACTIVE") as
            | "ACTIVE"
            | "DELETED",
          children: node.children
            ? node.children.map((child: any, childIndex: number) =>
                convertNode(child, childIndex)
              )
            : [],
        };
      };

      // Handle both array and object with children
      let result: DemoNode[] = [];

      if (Array.isArray(lessonPlanData)) {
        console.log("📋 Processing array data, length:", lessonPlanData.length);
        result = lessonPlanData.map((node, index) => convertNode(node, index));
      } else if (
        lessonPlanData.children &&
        Array.isArray(lessonPlanData.children)
      ) {
        console.log(
          "📋 Processing children data, length:",
          lessonPlanData.children.length
        );
        result = lessonPlanData.children.map((node: any, index: number) =>
          convertNode(node, index)
        );
      } else {
        console.log("📋 Processing single node");
        result = [convertNode(lessonPlanData, 0)];
      }

      console.log("✅ Converted result:", result);
      return result;
    },
    []
  );

  // Initialize demo data from API when it loads
  useEffect(() => {
    // Skip this effect when in edit mode and existing data is already loaded
    if (mode === "edit" && existingData?.data) {
      console.log("🔄 Skipping API data load in edit mode - using existing data");
      return;
    }

    if (items && items.length > currentStep) {
      const currentStepId = items[currentStep].id.toString();

      // Check if data already exists in finalData
      if (finalData[currentStepId]) {
        // Load from finalData if exists
        setDemoData(finalData[currentStepId]);
      } else if (apiData && apiData.length > 0) {
        // Convert from API data if not exists
        const convertApiToDemoNode = (apiNode: any): DemoNode => {
          return {
            id: apiNode.id?.toString() || uuidv4(),
            lessonPlanId: apiNode.lessonPlanId || 1,
            parentId: apiNode.parentId?.toString() || null,
            title: apiNode.title || "",
            content: apiNode.content || "",
            fieldType: apiNode.fieldType || "INPUT",
            type: apiNode.type || "PARAGRAPH",
            orderIndex: apiNode.orderIndex || 0,
            metadata: apiNode.metadata,
            status: apiNode.status || "ACTIVE",
            children: apiNode.children
              ? apiNode.children.map(convertApiToDemoNode)
              : [],
          };
        };

        const convertedData = apiData.map(convertApiToDemoNode);
        setDemoData(convertedData);

        // Save to finalData
        setFinalData((prev) => ({
          ...prev,
          [currentStepId]: convertedData,
        }));
      } else {
        // Set empty array if no API data
        setDemoData([]);
      }
    }
  }, [apiData, currentStep, items, finalData, mode, existingData?.data]);

  return {
    // State
    demoData,
    setDemoData,
    trashData,
    setTrashData,
    showDeleteButtons,
    setShowDeleteButtons,
    activeTab,
    setActiveTab,
    showPreview,
    setShowPreview,
    sidebarCollapsed,
    setSidebarCollapsed,
    currentStep,
    setCurrentStep,
    finalData,
    setFinalData,

    // API data
    items,
    lessonById,
    lessonId,

    // Utilities
    updateFinalData,
    convertLessonPlanToDemoNode,
  };
};
