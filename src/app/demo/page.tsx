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
  tableData?: TableData;
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

function DemoPage() {
  const [demoData, setDemoData] = useState<DemoNode[]>([]);
  const [trashData, setTrashData] = useState<DemoNode[]>([]);
  const [showDeleteButtons, setShowDeleteButtons] = useState(false);
  const [activeTab, setActiveTab] = useState<"components" | "images" | "trash">(
    "components"
  );
  const [showPreview, setShowPreview] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [taskId, setTaskId] = useState<string>(
    "82312bab-6f4b-42d4-8018-6770917a4347"
  );
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);

  // Final data để lưu tổng data của tất cả các step
  const [finalData, setFinalData] = useState<Record<string, DemoNode[]>>({});

  console.log(currentStep, "current");

  //get node root of lesson plan id
  const { data: treeData } = useLessonPlanNodeTreeService("7")();

  console.log(treeData?.data, "tree");

  const items = treeData?.data?.map((item: any) => ({
    id: item?.id,
    title: item?.title,
    description: item?.content || "",
  }));

  // Helper function để update finalData khi demoData thay đổi
  const updateFinalData = useCallback((newDemoData: DemoNode[]) => {
    if (items && items.length > currentStep) {
      const currentStepId = items[currentStep].id.toString();
      setFinalData(prev => ({
        ...prev,
        [currentStepId]: newDemoData
      }));
    }
  }, [items, currentStep]);

  const handleChangeStep = (newStep: number) => {
    // Lưu demoData hiện tại vào finalData trước khi chuyển step
    if (items && items.length > currentStep) {
      const currentStepId = items[currentStep].id.toString();
      setFinalData(prev => ({
        ...prev,
        [currentStepId]: demoData
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
          ...(nodeType === "TABLE" && {
            tableData: node.tableData || {
              headers: ["Cột 1", "Cột 2"],
              rows: [
                ["", ""],
                ["", ""],
              ],
            },
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
        setFinalData(prev => ({
          ...prev,
          [currentStepId]: convertedData
        }));
      } else {
        // Nếu không có data từ API thì set empty array
        setDemoData([]);
      }
    }
  }, [apiData, currentStep, items, finalData]);

  // Handle content changes
  const handleInputChange = useCallback((nodeId: string, value: string) => {
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
  }, [updateFinalData]);

  // Handle title changes
  const handleTitleChange = useCallback((nodeId: string, title: string) => {
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
  }, [updateFinalData]);

  // Handle table data changes
  const handleTableDataChange = useCallback(
    (nodeId: string, tableData: TableData) => {
      const updateNodeTableData = (nodeList: DemoNode[]): DemoNode[] => {
        return nodeList.map((node) => {
          if (node.id.toString() === nodeId) {
            return { ...node, tableData };
          }
          if (node.children && node.children.length > 0) {
            return { ...node, children: updateNodeTableData(node.children) };
          }
          return node;
        });
      };

      setDemoData((prev) => {
        const newData = updateNodeTableData(prev);
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

        const newNode: DemoNode = {
          id: uuidv4(),
          lessonPlanId: 1,
          parentId: null,
          title: `Mới: ${componentType.title}`,
          content: "",
          fieldType: componentType.fieldType,
          type: componentType.type,
          orderIndex: 0,
          metadata: { isNew: true },
          status: "ACTIVE",
          children: [],
          ...(componentType.type === "TABLE" && {
            tableData: {
              headers: ["Cột 1", "Cột 2"],
              rows: [
                ["", ""],
                ["", ""],
              ],
            },
          }),
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
        [currentStepId]: demoData
      };

      // Tạo cấu trúc cha-con đúng từ tree data và children data
      const allData: DemoNode[] = [];

      items.forEach((item: any) => {
        const stepId = item.id.toString();
        const stepChildrenData = (updatedFinalData as Record<string, DemoNode[]>)[stepId] || [];

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
          children: stepChildrenData // Gán các node con từ finalData
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
        subject: "Môn học/Hoạt động giáo dục: ..........",
        grade: "lớp:........",
        lessonTitle:
          "TÊN BÀI DẠY: ................................................",
        duration: "Thời gian thực hiện: (số tiết)",
        teacherName: "Họ và tên giáo viên:\n................................",
      };
      // Sử dụng tổng data từ tất cả các step
      const allData = getAllFinalData();
      await generateDocx(allData, "lesson-plan.docx", headerInfo);
    } catch (error) {
      console.error("Error generating DOCX:", error);
      alert("Có lỗi xảy ra khi tạo file DOCX");
    }
  }, [getAllFinalData]);

  const { mutate } = useLessonPlanGenerationService();
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
      lesson_id: "5",
      lesson_plan_json: mergedNode,
    };
    mutate(payload, {
      onSuccess: (e: any) => {
        toast.success("Tạo giáo án thành công");
        console.log(e.data.task_id);
        setTaskId(e.data.task_id);
      },
      onError: (error) => {
        toast.error("Tạo giáo án thất bại");
        console.error(error);
      },
    });
  };

  // Fetch task result data using React Query
  const taskResultQuery = useTaskResultService(taskId);

  // Hàm merge data từ AI vào finalData
  const mergeAIDataToFinalData = useCallback((aiData: DemoNode[]) => {
    if (!items || items.length <= currentStep) return;

    const currentStepId = items[currentStep].id.toString();

    // Lấy data hiện tại của step
    const currentStepData = finalData[currentStepId] || demoData;

    // Merge logic: nếu trùng id thì update, không thì thêm mới
    const mergedData = [...currentStepData];

    aiData.forEach(aiNode => {
      const existingIndex = mergedData.findIndex(node => node.id === aiNode.id);
      if (existingIndex !== -1) {
        // Update existing node
        mergedData[existingIndex] = aiNode;
      } else {
        // Add new node
        mergedData.push(aiNode);
      }
    });

    // Update finalData và demoData
    setFinalData(prev => ({
      ...prev,
      [currentStepId]: mergedData
    }));
    setDemoData(mergedData);

    return mergedData;
  }, [currentStep, items, finalData, demoData]);

  // Handle fetch task result data
  const handleFetchTaskResult = useCallback(() => {
    setIsLoadingData(true);
    console.log("🔄 Fetching task result for ID:", taskId);

    // Trigger refetch
    taskResultQuery
      .refetch()
      .then((result) => {
        console.log("📥 Raw API response:", result);

        if (result?.data) {
          console.log("✅ API response data:", result.data);

          // Check if result has the expected structure
          if (result.data.result && result.data.result.lesson_plan) {
            const lessonPlanData = result.data.result.lesson_plan;
            console.log("📋 Lesson plan data:", lessonPlanData);

            // Convert lesson plan data to DemoNode format
            const convertedData = convertLessonPlanToDemoNode(lessonPlanData);
            console.log("🔄 Converted data:", convertedData);

            if (convertedData.length > 0) {
              // Merge vào finalData thay vì replace
              const mergedData = mergeAIDataToFinalData(convertedData);
              toast.success(
                `Lấy dữ liệu thành công! Đã merge ${convertedData.length} node(s), tổng ${mergedData?.length || 0} node(s)`
              );
            } else {
              toast.warning("Dữ liệu lesson plan trống");
            }
          } else {
            console.log("⚠️ Unexpected data structure:", result.data);
            toast.warning("Cấu trúc dữ liệu không đúng định dạng");
          }
        } else {
          console.log("❌ No data in response");
          toast.warning("Không có dữ liệu trong response");
        }
        setIsLoadingData(false);
      })
      .catch((error) => {
        console.error("❌ Error fetching task result:", error);
        toast.error(`Lỗi khi lấy dữ liệu: ${error.message || "Unknown error"}`);
        setIsLoadingData(false);
      });
  }, [taskResultQuery, convertLessonPlanToDemoNode, taskId, mergeAIDataToFinalData]);

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
          <StepFloatingPanel
            items={items}
            current={currentStep}
            layout="horizontal"
            visible={true}
            onStepChange={handleChangeStep}
            style={{ width: 300 }}
          />
          {/* Canvas */}
          <Canvas
            demoData={demoData}
            showDeleteButtons={showDeleteButtons}
            onDeleteNode={handleDeleteNode}
            onUpdateNodeTitle={handleTitleChange}
            onUpdateNodeContent={handleInputChange}
            onUpdateTableData={handleTableDataChange}
          />
        </div>

        {/* Fetch Data Button */}
        <div className="p-4 space-y-2">
          <Button
            onClick={handleFetchTaskResult}
            disabled={isLoadingData}
            className="w-full"
          >
            {isLoadingData ? "Đang tải..." : "Lấy data từ API"}
          </Button>

          {/* Clear Data Button */}
          <Button
            onClick={() => {
              setDemoData([]);
              // Xóa data của step hiện tại trong finalData
              if (items && items.length > currentStep) {
                const currentStepId = items[currentStep].id.toString();
                setFinalData(prev => ({
                  ...prev,
                  [currentStepId]: []
                }));
              }
              toast.success("Đã xóa dữ liệu hiện tại");
            }}
            disabled={isLoadingData}
            className="w-full"
            variant="outline"
          >
            Xóa dữ liệu hiện tại
          </Button>

          {/* Clear All Final Data Button */}
          <Button
            onClick={() => {
              setFinalData({});
              setDemoData([]);
              toast.success("Đã xóa tất cả dữ liệu final data");
            }}
            disabled={isLoadingData}
            className="w-full"
            variant="destructive"
          >
            Xóa tất cả Final Data
          </Button>

          {/* Debug Final Data */}
          <div className="text-xs text-gray-500 mt-2">
            <div>Task ID: {taskId}</div>
            <div>Current Step: {currentStep}</div>
            <div>Final Data Keys: {Object.keys(finalData).join(", ")}</div>
            <div>Demo Data Count: {demoData.length}</div>
          </div>
        </div>

        {/* Preview Modal */}
        <PreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          data={getAllFinalData()}
          onDownload={handleDownloadDocx}
        />
      </div>
    </DragDropContext>
  );
}

export default DemoPage;
