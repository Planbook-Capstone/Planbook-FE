"use client";

import React, { useState, useCallback, useEffect } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import {
  useLessonPlanNodeChildrenService,
  useLessonPlanNodeTreeService,
} from "@/services/lessonPlanNodeServices";
import PreviewModal from "@/components/PreviewModal";
import { generateDocx } from "@/utils/docxGenerator";
import Sidebar from "@/components/demo/Sidebar";
import Toolbar from "@/components/demo/Toolbar";
import Canvas from "@/components/demo/Canvas";
import { Heading1, Heading2, Images, List, Table, Type } from "lucide-react";
import { useLessonPlanGenerationService } from "@/services/lessonPlanGenerationServices";
import { useTaskResultService } from "@/services/textbookServices";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { StepFloatingPanel } from "@/components/molecules/step-floating-panel";
import { useExecuteToolService } from "@/services/executeToolServices";
import { useSimpleWebSocket } from "@/hooks/useSimpleWebSocket";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingAI from "@/components/molecules/loading";
import { useSearchParams } from "next/navigation";
import { useLessonByIdService } from "@/services/lessonServices";

interface CellContent {
  text?: string;
  image?: {
    url: string;
    name?: string;
  };
}

interface TableData {
  headers: string[];
  rows: (string | CellContent)[][];
}

interface DemoNode {
  id: string;
  lessonPlanId?: number;
  parentId?: string | null;
  title: string;
  content: string;
  fieldType: "INPUT" | "TABLE" | "IMAGE";
  type:
    | "PARAGRAPH"
    | "LIST_ITEM"
    | "TABLE"
    | "IMAGE"
    | "SECTION"
    | "SUBSECTION";
  orderIndex: number;
  metadata?: any;
  status: "ACTIVE" | "DELETED";
  children: DemoNode[];
}

interface ComponentPaletteItem {
  id: string;
  type:
    | "PARAGRAPH"
    | "LIST_ITEM"
    | "TABLE"
    | "IMAGE"
    | "SECTION"
    | "SUBSECTION";
  fieldType: "INPUT" | "TABLE" | "IMAGE";
  title: string;
  icon: React.ReactNode;
  description: string;
}

const COMPONENT_PALETTE: ComponentPaletteItem[] = [
  {
    id: "section",
    type: "SECTION",
    fieldType: "INPUT",
    title: "Section",
    icon: <Heading1 />,
    description: "Thêm tiêu đề chính",
  },
  {
    id: "subsection",
    type: "SUBSECTION",
    fieldType: "INPUT",
    title: "Subsection",
    icon: <Heading2 />,
    description: "Thêm tiêu đề phụ",
  },
  {
    id: "paragraph",
    type: "PARAGRAPH",
    fieldType: "INPUT",
    title: "Text/Paragraph",
    icon: <Type />,
    description: "Thêm đoạn văn bản",
  },
  {
    id: "table",
    type: "TABLE",
    fieldType: "TABLE",
    title: "Table",
    icon: <Table />,
    description: "Thêm bảng dữ liệu",
  },
  {
    id: "list-item",
    type: "LIST_ITEM",
    fieldType: "INPUT",
    title: "List Item",
    icon: <List />,
    description: "Thêm mục danh sách",
  },
  {
    id: "image",
    type: "IMAGE",
    fieldType: "IMAGE",
    title: "Image",
    icon: <Images />,
    description: "Thêm hình ảnh",
  },
];

function LessonPlanTemplate() {
  const [demoData, setDemoData] = useState<DemoNode[]>([]);
  const [trashData, setTrashData] = useState<DemoNode[]>([]);
  const [showDeleteButtons, setShowDeleteButtons] = useState(false);
  const [activeTab, setActiveTab] = useState<"components" | "images" | "trash">(
    "components"
  );
  const [showPreview, setShowPreview] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);

  // Final data để lưu tổng data của tất cả các step
  const [finalData, setFinalData] = useState<Record<string, DemoNode[]>>({});

  //get node root of lesson plan id
  const { data: treeData } = useLessonPlanNodeTreeService("9")();

  const items = treeData?.data?.map((item: any) => ({
    id: item?.id,
    title: item?.title,
    description: item?.content || "",
  }));

  const searchParams = useSearchParams();
  const lessonId = searchParams.get("lessonId");
  const { data: lessonById } = useLessonByIdService(lessonId || "");

  // Helper function để update finalData khi demoData thay đổi
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

  const handleChangeStep = (newStep: number) => {
    // Lưu demoData hiện tại vào finalData trước khi chuyển step
    if (items && items.length > currentStep) {
      const currentStepId = items[currentStep].id.toString();
      setFinalData((prev) => ({
        ...prev,
        [currentStepId]: demoData,
      }));
    }

    setCurrentStep(newStep);
  };

  // Load data from API
  const childrenQuery = useLessonPlanNodeChildrenService(
    items && items.length > currentStep ? items[currentStep].id.toString() : ""
  )();

  const apiData = childrenQuery?.data?.data;

  // Convert lesson plan data to DemoNode format
  const convertLessonPlanToDemoNode = useCallback(
    (lessonPlanData: any): DemoNode[] => {
      if (!lessonPlanData) {
        return [];
      }

      const convertNode = (node: any, index: number = 0): DemoNode => {
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
        ];
        const nodeType = validTypes.includes(node.type)
          ? node.type
          : "PARAGRAPH";

        return {
          id: node.id?.toString() || uuidv4(),
          lessonPlanId: node.lessonPlanId || 1,
          parentId: node.parentId?.toString() || null,
          title: node.title || `Untitled ${nodeType}`,
          content: node.content || "",
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
          // For TABLE nodes, ensure content is properly formatted as JSON string
          ...(nodeType === "TABLE" &&
            node.content &&
            {
              // Content is already in correct JSON format from API
            }),
        };
      };

      // Handle both array and object with children
      if (Array.isArray(lessonPlanData)) {
        return lessonPlanData.map((node, index) => convertNode(node, index));
      } else if (
        lessonPlanData.children &&
        Array.isArray(lessonPlanData.children)
      ) {
        return lessonPlanData.children.map((node: any, index: number) =>
          convertNode(node, index)
        );
      } else {
        // Single node case
        return [convertNode(lessonPlanData, 0)];
      }
    },
    []
  );

  // Initialize demo data from API when it loads
  useEffect(() => {
    if (items && items.length > currentStep) {
      const currentStepId = items[currentStep].id.toString();

      // Kiểm tra xem đã có data trong finalData chưa
      if (finalData[currentStepId]) {
        // Nếu có thì load từ finalData
        setDemoData(finalData[currentStepId]);
      } else if (apiData && apiData.length > 0) {
        // Nếu chưa có thì convert từ API data
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

        // Lưu vào finalData
        setFinalData((prev) => ({
          ...prev,
          [currentStepId]: convertedData,
        }));
      } else {
        // Nếu không có data từ API thì set empty array
        setDemoData([]);
      }
    }
  }, [apiData, currentStep, items, finalData]);

  // Handle content changes
  const handleInputChange = useCallback(
    (nodeId: string, value: string) => {
      const updateNodeContent = (nodeList: DemoNode[]): DemoNode[] => {
        return nodeList.map((node) => {
          if (node.id.toString() === nodeId) {
            return { ...node, content: value };
          }
          if (node.children && node.children.length > 0) {
            return { ...node, children: updateNodeContent(node.children) };
          }
          return node;
        });
      };

      setDemoData((prev) => {
        const newData = updateNodeContent(prev);
        updateFinalData(newData);
        return newData;
      });
    },
    [updateFinalData]
  );

  // Handle title changes
  const handleTitleChange = useCallback(
    (nodeId: string, title: string) => {
      const updateNodeTitle = (nodeList: DemoNode[]): DemoNode[] => {
        return nodeList.map((node) => {
          if (node.id.toString() === nodeId) {
            return { ...node, title };
          }
          if (node.children && node.children.length > 0) {
            return { ...node, children: updateNodeTitle(node.children) };
          }
          return node;
        });
      };

      setDemoData((prev) => {
        const newData = updateNodeTitle(prev);
        updateFinalData(newData);
        return newData;
      });
    },
    [updateFinalData]
  );

  // Add child to node with proper orderIndex
  const addChildToNode = useCallback(
    (
      parentId: string,
      newChild: DemoNode,
      preserveOrderIndex: boolean = false
    ) => {
      const updateNodeWithChild = (nodeList: DemoNode[]): DemoNode[] => {
        return nodeList.map((node) => {
          if (node.id.toString() === parentId) {
            let childWithOrder = { ...newChild, parentId: parentId };

            if (preserveOrderIndex) {
              // Check if orderIndex conflicts with existing children
              const existingChildOrderIndices = node.children.map(
                (child) => child.orderIndex
              );
              if (existingChildOrderIndices.includes(newChild.orderIndex)) {
                // If conflict, assign new orderIndex at the end
                const maxChildOrderIndex =
                  node.children.length > 0
                    ? Math.max(...existingChildOrderIndices)
                    : -1;
                childWithOrder.orderIndex = maxChildOrderIndex + 1;
              }
              // else keep original orderIndex
            } else {
              // Calculate next orderIndex for new children
              const maxChildOrderIndex =
                node.children.length > 0
                  ? Math.max(...node.children.map((child) => child.orderIndex))
                  : -1;
              childWithOrder.orderIndex = maxChildOrderIndex + 1;
            }

            return {
              ...node,
              children: [...node.children, childWithOrder].sort(
                (a, b) => a.orderIndex - b.orderIndex
              ),
            };
          }
          if (node.children && node.children.length > 0) {
            return { ...node, children: updateNodeWithChild(node.children) };
          }
          return node;
        });
      };

      setDemoData((prev) => {
        const newData = updateNodeWithChild(prev);
        updateFinalData(newData);
        return newData;
      });
    },
    [updateFinalData]
  );

  // Find node by ID in nested structure
  const findNodeById = useCallback(
    (nodeList: DemoNode[], nodeId: string): DemoNode | null => {
      for (const node of nodeList) {
        if (node.id.toString() === nodeId) {
          return node;
        }
        if (node.children && node.children.length > 0) {
          const found = findNodeById(node.children, nodeId);
          if (found) return found;
        }
      }
      return null;
    },
    []
  );

  // Remove node from nested structure
  const removeNodeById = useCallback(
    (nodeList: DemoNode[], nodeId: string): DemoNode[] => {
      return nodeList.reduce((acc: DemoNode[], node) => {
        if (node.id.toString() === nodeId) {
          // Skip this node (remove it)
          return acc;
        }

        // Keep the node but update its children
        const updatedNode = {
          ...node,
          children: node.children ? removeNodeById(node.children, nodeId) : [],
        };

        return [...acc, updatedNode];
      }, []);
    },
    []
  );

  // Handle drag end
  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination, draggableId } = result;

      if (!destination) return;

      // Dragging from palette to canvas or to a node
      if (source.droppableId === "component-palette") {
        const componentType = COMPONENT_PALETTE.find(
          (item) => item.id === draggableId
        );
        if (!componentType) return;

        // Create default table content for TABLE type
        let nodeContent = "";
        if (componentType.type === "TABLE") {
          const defaultTableData = {
            rows: [
              {
                id: "header-row",
                cells: [
                  {
                    id: "h1",
                    title: "HOẠT ĐỘNG CỦA GIÁO VIÊN",
                    content:
                      "<p>Mô tả các hoạt động của giáo viên trong tiết học</p>",
                    isHeader: true,
                  },
                  {
                    id: "h2",
                    title: "HOẠT ĐỘNG CỦA HỌC SINH",
                    content:
                      "<p>Mô tả các hoạt động của học sinh trong tiết học</p>",
                    isHeader: true,
                  },
                ],
              },
              {
                id: "row-1",
                cells: [
                  {
                    id: "r1c1",
                    title: "Bước 1: Chuyển giao nhiệm vụ học tập",
                    content: "",
                  },
                  {
                    id: "r1c2",
                    title: "Học sinh thực hiện các hoạt động được giao",
                    content: "",
                  },
                ],
              },
              {
                id: "row-2",
                cells: [
                  {
                    id: "r2c1",
                    title: "Bước 2: Thực hiện nhiệm vụ",
                    content: "",
                  },
                  {
                    id: "r2c2",
                    title: "Học sinh phản hồi và thảo luận",
                    content: "",
                  },
                ],
              },
            ],
            columns: 2,
          };
          nodeContent = JSON.stringify(defaultTableData);
        }

        const newNode: DemoNode = {
          id: uuidv4(),
          lessonPlanId: 1,
          parentId: null,
          title: `Mới: ${componentType.title}`,
          content: nodeContent,
          fieldType: componentType.fieldType,
          type: componentType.type,
          orderIndex: 0,
          metadata: { isNew: true },
          status: "ACTIVE",
          children: [],
        };

        // Dropping to main canvas
        if (destination.droppableId === "demo-canvas") {
          setDemoData((prev) => {
            const maxOrderIndex =
              prev.length > 0 ? Math.max(...prev.map((n) => n.orderIndex)) : -1;
            const nodeWithOrder = { ...newNode, orderIndex: maxOrderIndex + 1 };
            const newData = [...prev, nodeWithOrder].sort(
              (a, b) => a.orderIndex - b.orderIndex
            );
            updateFinalData(newData);
            return newData;
          });
        }
        // Dropping to a specific node (as child)
        else if (destination.droppableId.startsWith("node-")) {
          const parentId = destination.droppableId.replace("node-", "");
          addChildToNode(parentId, newNode);
        }
      }

      // Dragging existing nodes to create children relationships
      else if (destination.droppableId.startsWith("node-")) {
        const parentId = destination.droppableId.replace("node-", "");
        const draggedNode = findNodeById(demoData, draggableId);

        if (draggedNode && draggedNode.id.toString() !== parentId) {
          // Remove the node from its current position
          const updatedData = removeNodeById(demoData, draggableId);
          setDemoData(updatedData);
          updateFinalData(updatedData);

          // Add it as a child to the target node
          setTimeout(() => {
            addChildToNode(parentId, { ...draggedNode, parentId });
          }, 0);
        }
      }

      // Dragging to trash
      else if (destination.droppableId === "trash") {
        const nodeToDelete = findNodeById(demoData, draggableId);
        if (nodeToDelete) {
          setTrashData((prev) => [
            ...prev,
            { ...nodeToDelete, status: "DELETED" },
          ]);
          const updatedData = removeNodeById(demoData, draggableId);
          setDemoData(updatedData);
          updateFinalData(updatedData);
        }
      }

      // Reordering within canvas
      else if (
        source.droppableId === "demo-canvas" &&
        destination.droppableId === "demo-canvas"
      ) {
        const newDemoData = Array.from(demoData);
        const [reorderedItem] = newDemoData.splice(source.index, 1);
        newDemoData.splice(destination.index, 0, reorderedItem);

        // Update order indices
        const updatedData = newDemoData.map((item, index) => ({
          ...item,
          orderIndex: index,
        }));

        setDemoData(updatedData);
        updateFinalData(updatedData);
      }
    },
    [demoData, addChildToNode, findNodeById, removeNodeById]
  );

  // Find and delete node (including nested nodes)
  const findAndDeleteNode = useCallback(
    (
      nodeList: DemoNode[],
      nodeId: string
    ): { updatedList: DemoNode[]; deletedNode: DemoNode | null } => {
      for (let i = 0; i < nodeList.length; i++) {
        const node = nodeList[i];

        // Found the node to delete
        if (node.id.toString() === nodeId) {
          const updatedList = nodeList.filter((_, index) => index !== i);
          return { updatedList, deletedNode: node };
        }

        // Search in children
        if (node.children && node.children.length > 0) {
          const result = findAndDeleteNode(node.children, nodeId);
          if (result.deletedNode) {
            const updatedNode = { ...node, children: result.updatedList };
            const updatedList = nodeList.map((n, index) =>
              index === i ? updatedNode : n
            );
            return { updatedList, deletedNode: result.deletedNode };
          }
        }
      }

      return { updatedList: nodeList, deletedNode: null };
    },
    []
  );

  // Delete node
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      const result = findAndDeleteNode(demoData, nodeId);
      if (result.deletedNode) {
        const deletedNodeWithStatus: DemoNode = {
          ...result.deletedNode,
          status: "DELETED" as const,
        };
        setTrashData((prev) => [...prev, deletedNodeWithStatus]);
        setDemoData(result.updatedList);
        updateFinalData(result.updatedList);
      }
    },
    [demoData, findAndDeleteNode, updateFinalData]
  );

  // Check if parent exists in current data
  const findParentExists = useCallback(
    (parentId: string, nodeList: DemoNode[]): boolean => {
      for (const node of nodeList) {
        if (node.id.toString() === parentId) {
          return true;
        }
        if (node.children && node.children.length > 0) {
          if (findParentExists(parentId, node.children)) {
            return true;
          }
        }
      }
      return false;
    },
    []
  );

  // Restore from trash
  const handleRestoreNode = useCallback(
    (nodeId: string) => {
      const nodeToRestore = trashData.find(
        (node) => node.id.toString() === nodeId
      );
      if (nodeToRestore) {
        // Check if parent still exists, if not restore to root level
        const shouldRestoreToRoot =
          !nodeToRestore.parentId ||
          !findParentExists(nodeToRestore.parentId, demoData);

        if (shouldRestoreToRoot) {
          // Restore to root level with original orderIndex
          setDemoData((prev) => {
            const restoredNode = {
              ...nodeToRestore,
              status: "ACTIVE" as const,
              parentId: null, // Clear parentId when restoring to root
            };

            // Check if orderIndex conflicts with existing nodes
            const existingOrderIndices = prev.map((n) => n.orderIndex);
            if (existingOrderIndices.includes(restoredNode.orderIndex)) {
              // If conflict, assign new orderIndex at the end
              const maxOrderIndex =
                prev.length > 0 ? Math.max(...existingOrderIndices) : -1;
              restoredNode.orderIndex = maxOrderIndex + 1;
            }

            const newData = [...prev, restoredNode].sort(
              (a, b) => a.orderIndex - b.orderIndex
            );
            updateFinalData(newData);
            return newData;
          });
        } else {
          // Restore as child to existing parent with original orderIndex
          const nodeWithOriginalOrder = {
            ...nodeToRestore,
            status: "ACTIVE" as const,
          };
          addChildToNode(nodeToRestore.parentId!, nodeWithOriginalOrder, true); // preserveOrderIndex = true
        }

        setTrashData((prev) =>
          prev.filter((node) => node.id.toString() !== nodeId)
        );
      }
    },
    [trashData, addChildToNode, findParentExists, demoData]
  );

  // Hàm lấy tổng data từ finalData với cấu trúc cha-con đúng
  const getAllFinalData = useCallback(() => {
    // Lưu demoData hiện tại vào finalData trước
    if (items && items.length > currentStep) {
      const currentStepId = items[currentStep].id.toString();
      const updatedFinalData = {
        ...finalData,
        [currentStepId]: demoData,
      };

      // Tạo cấu trúc cha-con đúng từ tree data và children data
      const allData: DemoNode[] = [];

      items.forEach((item: any) => {
        const stepId = item.id.toString();
        const stepChildrenData =
          (updatedFinalData as Record<string, DemoNode[]>)[stepId] || [];

        // Tạo node cha từ tree data
        const parentNode: DemoNode = {
          id: item.id.toString(),
          lessonPlanId: 7, // Lesson plan ID hiện tại
          parentId: null,
          title: item.title || "",
          content: item.description || "",
          fieldType: "INPUT", // fieldType chỉ có INPUT, TABLE, IMAGE
          type: "SECTION",
          orderIndex: items.indexOf(item),
          metadata: null,
          status: "ACTIVE",
          children: stepChildrenData, // Gán các node con từ finalData
        };

        allData.push(parentNode);
      });

      return allData;
    }
    return demoData;
  }, [finalData, demoData, items, currentStep]);

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
      // Sử dụng tổng data từ tất cả các step
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
  }, [getAllFinalData]);

  const { mutate } = useExecuteToolService();
  const [wsUrl, setWsUrl] = useState("http://localhost:8085/websocket");
  const [topic, setTopic] = useState("/user/queue/notifications");
  const [enabled, setEnabled] = useState(false);
  const { data, isConnected, error, sendMessage, reconnect } =
    useSimpleWebSocket({
      url: wsUrl,
      topic: topic,
      enabled: enabled,
    });

  useEffect(() => {
    const convertedData = convertLessonPlanToDemoNode(data?.children);
    if (convertedData.length > 0) {
      // Merge vào finalData thay vì replace
      const mergedData = mergeAIDataToFinalData(convertedData);

      toast.success("Đã tạo thành công giáo án");
    } else {
    }
  }, [data]);

  const handleGenerationLessonPlan = () => {
    // Sử dụng tổng data từ tất cả các step
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
      toolId: "6ef43906-1899-4cec-b969-48957ba574ba",
      toolType: "INTERNAL",
      lesson_id: lessonId?.toString(),
      lesson_plan_json: mergedNode,
    };
    mutate(payload, {
      onSuccess: (e: any) => {
        toast.success("Gửi dữ liệu thành công!");
        console.log(e.data.task_id);
        setEnabled(true);
      },
      onError: (error) => {
        toast.error("Tạo giáo án thất bại");
        console.error(error);
      },
    });
  };

  // Hàm merge data từ AI vào finalData
  const mergeAIDataToFinalData = useCallback(
    (aiData: DemoNode[]) => {
      if (!items || items.length <= currentStep) return;

      const currentStepId = items[currentStep].id.toString();

      // Lấy data hiện tại của step
      const currentStepData = finalData[currentStepId] || demoData;

      // Merge logic: nếu trùng id thì update, không thì thêm mới
      const mergedData = [...currentStepData];

      aiData.forEach((aiNode) => {
        const existingIndex = mergedData.findIndex(
          (node) => node.id === aiNode.id
        );
        if (existingIndex !== -1) {
          // Update existing node
          mergedData[existingIndex] = aiNode;
        } else {
          // Add new node
          mergedData.push(aiNode);
        }
      });

      // Update finalData và demoData
      setFinalData((prev) => ({
        ...prev,
        [currentStepId]: mergedData,
      }));
      setDemoData(mergedData);

      return mergedData;
    },
    [currentStep, items, finalData, demoData]
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div
          className={`transition-all duration-300 ${
            sidebarCollapsed ? "w-0" : "w-80"
          } overflow-hidden`}
        >
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            trashData={trashData}
            onRestoreNode={handleRestoreNode}
            componentPalette={COMPONENT_PALETTE}
          />
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="absolute right-0 -top-16">
            <Toolbar
              showDeleteButtons={showDeleteButtons}
              onToggleDeleteButtons={() =>
                setShowDeleteButtons(!showDeleteButtons)
              }
              onShowPreview={() => setShowPreview(true)}
              onExportJSON={handleGenerationLessonPlan}
              sidebarCollapsed={sidebarCollapsed}
              onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
          </div>
          {data?.status === "processing" ? (
            <div className="w-full px-10 flex flex-col items-center h-50 space-y-4">
              <LoadingAI message={data?.message} progress={data?.progress} />
            </div>
          ) : (
            <>
              <StepFloatingPanel
                items={items}
                current={currentStep}
                layout="horizontal"
                visible={true}
                onStepChange={handleChangeStep}
                style={{ width: 300 }}
                initialPosition={{ x: 500, y: 100 }}
              />
              {/* Canvas */}
              <h1 className="font-calsans my-1 px-5 text-xl">
                {items?.length > 0 && items[currentStep]?.title}
              </h1>
              <Canvas
                demoData={demoData}
                showDeleteButtons={showDeleteButtons}
                onDeleteNode={handleDeleteNode}
                onUpdateNodeTitle={handleTitleChange}
                onUpdateNodeContent={handleInputChange}
              />
            </>
          )}
        </div>

        {/* Preview Modal */}
        <PreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          data={getAllFinalData()}
          onDownload={handleDownloadDocx}
          lesson={lessonById?.data}
        />
      </div>
    </DragDropContext>
  );
}

export default LessonPlanTemplate;
