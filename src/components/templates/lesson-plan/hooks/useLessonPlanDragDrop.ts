import { useCallback } from "react";
import { DropResult } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { DemoNode } from "../types";
import { getComponentPalette, DEFAULT_TABLE_DATA } from "../constants";

interface UseLessonPlanDragDropProps {
  demoData: DemoNode[];
  setDemoData: React.Dispatch<React.SetStateAction<DemoNode[]>>;
  updateFinalData: (newDemoData: DemoNode[]) => void;
  addChildToNode: (
    parentId: string,
    newChild: DemoNode,
    preserveOrderIndex?: boolean
  ) => void;
  findNodeById: (nodeList: DemoNode[], nodeId: string) => DemoNode | null;
  removeNodeById: (nodeList: DemoNode[], nodeId: string) => DemoNode[];
  setTrashData: React.Dispatch<React.SetStateAction<DemoNode[]>>;
}

export const useLessonPlanDragDrop = ({
  demoData,
  setDemoData,
  updateFinalData,
  addChildToNode,
  findNodeById,
  removeNodeById,
  setTrashData,
}: UseLessonPlanDragDropProps) => {
  // Function to count total nodes recursively
  const countTotalNodes = useCallback((nodes: DemoNode[]): number => {
    let count = 0;
    nodes.forEach((node) => {
      count += 1; // Count the current node
      if (node.children && node.children.length > 0) {
        count += countTotalNodes(node.children); // Count children recursively
      }
    });
    return count;
  }, []);
  // Create new node from component palette
  const createNewNode = useCallback((componentType: any): DemoNode => {
    // Create default content for specific types
    let nodeContent = "";
    if (componentType.type === "TABLE") {
      nodeContent = JSON.stringify(DEFAULT_TABLE_DATA);
    } else if (componentType.type === "QUESTION_BANK") {
      nodeContent = "Nhập câu hỏi của bạn ở đây...";
    }

    return {
      id: uuidv4(),
      lessonPlanId: 1,
      parentId: null,
      title: `Mới: ${componentType.title}`,
      content: nodeContent,
      description: null, // Default description is null
      fieldType: componentType.fieldType,
      type: componentType.type,
      orderIndex: 0,
      metadata: { isNew: true },
      status: "ACTIVE",
      children: [],
    };
  }, []);

  // Handle dragging from palette to canvas
  const handlePaletteToCanvas = useCallback(
    (draggableId: string, destination: any) => {
      // Check node limit before adding
      const currentNodeCount = countTotalNodes(demoData);
      if (currentNodeCount >= 30) {
        toast.error("Không thể thêm node mới. Giới hạn tối đa 30 node.");
        return;
      }

      const componentPalette = getComponentPalette();
      const componentType = componentPalette.find(
        (item: any) => item.id === draggableId
      );
      if (!componentType) return;

      const newNode = createNewNode(componentType);

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
    },
    [createNewNode, setDemoData, updateFinalData, addChildToNode, countTotalNodes, demoData]
  );

  // Check if a node is a descendant of another node
  const isDescendantOf = useCallback(
    (
      nodeId: string,
      potentialAncestorId: string,
      nodeList: DemoNode[]
    ): boolean => {
      const node = findNodeById(nodeList, nodeId);
      if (!node) return false;

      // Check all children recursively
      const checkChildren = (children: DemoNode[]): boolean => {
        for (const child of children) {
          if (child.id.toString() === potentialAncestorId) {
            return true;
          }
          if (child.children && child.children.length > 0) {
            if (checkChildren(child.children)) {
              return true;
            }
          }
        }
        return false;
      };

      return checkChildren(node.children || []);
    },
    [findNodeById]
  );

  // Handle dragging existing nodes to create children relationships
  const handleNodeToNode = useCallback(
    (draggableId: string, destination: any) => {
      const parentId = destination.droppableId.replace("node-", "");
      const draggedNode = findNodeById(demoData, draggableId);

      // Prevent invalid operations
      if (!draggedNode || draggedNode.id.toString() === parentId) {
        return; // Can't drop node on itself
      }

      // Prevent creating circular relationships (node becoming child of its own descendant)
      if (isDescendantOf(draggableId, parentId, demoData)) {
        console.warn("Cannot create circular parent-child relationship");
        return;
      }

      // Create a function to recursively find and update nodes
      const moveNodeToParent = (nodes: DemoNode[]): DemoNode[] => {
        return nodes.map((node) => {
          // If this is the target parent node, add the dragged node as a child
          if (node.id.toString() === parentId) {
            const updatedDraggedNode = {
              ...draggedNode,
              parentId: parentId,
              orderIndex: node.children.length, // Add to end of children
            };
            return {
              ...node,
              children: [...node.children, updatedDraggedNode],
            };
          }

          // If this node has children, recursively process them
          if (node.children && node.children.length > 0) {
            return {
              ...node,
              children: moveNodeToParent(node.children),
            };
          }

          return node;
        });
      };

      // Remove the node from its current position and add it to the new parent in one operation
      const dataWithoutDraggedNode = removeNodeById(demoData, draggableId);
      const finalData = moveNodeToParent(dataWithoutDraggedNode);

      setDemoData(finalData);
      updateFinalData(finalData);
    },
    [
      demoData,
      findNodeById,
      removeNodeById,
      setDemoData,
      updateFinalData,
      isDescendantOf,
    ]
  );

  // Handle dragging child nodes back to main canvas (make them independent)
  const handleChildToCanvas = useCallback(
    (draggableId: string, destination: any) => {
      const draggedNode = findNodeById(demoData, draggableId);

      if (draggedNode) {
        // Remove the node from its current position (including from children)
        const updatedData = removeNodeById(demoData, draggableId);

        // Create independent node (reset parentId and set proper orderIndex)
        const maxOrderIndex =
          updatedData.length > 0
            ? Math.max(...updatedData.map((n) => n.orderIndex))
            : -1;
        const independentNode = {
          ...draggedNode,
          parentId: null,
          orderIndex:
            destination.index !== undefined
              ? destination.index
              : maxOrderIndex + 1,
        };

        // Insert at the specified position or at the end
        const newData = [...updatedData];
        if (destination.index !== undefined) {
          newData.splice(destination.index, 0, independentNode);
          // Update order indices for all nodes
          const reorderedData = newData.map((item, index) => ({
            ...item,
            orderIndex: index,
          }));
          setDemoData(reorderedData);
          updateFinalData(reorderedData);
        } else {
          const finalData = [...newData, independentNode].sort(
            (a, b) => a.orderIndex - b.orderIndex
          );
          setDemoData(finalData);
          updateFinalData(finalData);
        }
      }
    },
    [demoData, findNodeById, removeNodeById, setDemoData, updateFinalData]
  );

  // Handle dragging to trash
  const handleDragToTrash = useCallback(
    (draggableId: string) => {
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
    },
    [
      demoData,
      findNodeById,
      setTrashData,
      removeNodeById,
      setDemoData,
      updateFinalData,
    ]
  );

  // Handle reordering within canvas
  const handleCanvasReorder = useCallback(
    (source: any, destination: any) => {
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
    },
    [demoData, setDemoData, updateFinalData]
  );

  // Main drag end handler
  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination, draggableId } = result;

      if (!destination) return;

      // Dragging from palette to canvas or to a node
      if (source.droppableId === "component-palette") {
        handlePaletteToCanvas(draggableId, destination);
      }
      // Dragging existing nodes to create children relationships
      else if (destination.droppableId.startsWith("node-")) {
        handleNodeToNode(draggableId, destination);
      }
      // Dragging to trash
      else if (destination.droppableId === "trash") {
        handleDragToTrash(draggableId);
      }
      // Dragging child nodes back to main canvas (make them independent)
      else if (
        source.droppableId.startsWith("node-") &&
        destination.droppableId === "demo-canvas"
      ) {
        handleChildToCanvas(draggableId, destination);
      }
      // Reordering within canvas
      else if (
        source.droppableId === "demo-canvas" &&
        destination.droppableId === "demo-canvas"
      ) {
        handleCanvasReorder(source, destination);
      }
    },
    [
      handlePaletteToCanvas,
      handleNodeToNode,
      handleDragToTrash,
      handleChildToCanvas,
      handleCanvasReorder,
    ]
  );

  return {
    handleDragEnd,
    createNewNode,
  };
};
