import { useCallback } from "react";
import { DropResult } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import { DemoNode } from "../types";
import { getComponentPalette, DEFAULT_TABLE_DATA } from "../constants";

interface UseLessonPlanDragDropProps {
  demoData: DemoNode[];
  setDemoData: React.Dispatch<React.SetStateAction<DemoNode[]>>;
  updateFinalData: (newDemoData: DemoNode[]) => void;
  addChildToNode: (parentId: string, newChild: DemoNode, preserveOrderIndex?: boolean) => void;
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

  // Create new node from component palette
  const createNewNode = useCallback((componentType: any): DemoNode => {
    // Create default table content for TABLE type
    let nodeContent = "";
    if (componentType.type === "TABLE") {
      nodeContent = JSON.stringify(DEFAULT_TABLE_DATA);
    }

    return {
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
  }, []);

  // Handle dragging from palette to canvas
  const handlePaletteToCanvas = useCallback((draggableId: string, destination: any) => {
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
  }, [createNewNode, setDemoData, updateFinalData, addChildToNode]);

  // Handle dragging existing nodes to create children relationships
  const handleNodeToNode = useCallback((draggableId: string, destination: any) => {
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
  }, [demoData, findNodeById, removeNodeById, setDemoData, updateFinalData, addChildToNode]);

  // Handle dragging to trash
  const handleDragToTrash = useCallback((draggableId: string) => {
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
  }, [demoData, findNodeById, setTrashData, removeNodeById, setDemoData, updateFinalData]);

  // Handle reordering within canvas
  const handleCanvasReorder = useCallback((source: any, destination: any) => {
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
  }, [demoData, setDemoData, updateFinalData]);

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
      // Reordering within canvas
      else if (
        source.droppableId === "demo-canvas" &&
        destination.droppableId === "demo-canvas"
      ) {
        handleCanvasReorder(source, destination);
      }
    },
    [handlePaletteToCanvas, handleNodeToNode, handleDragToTrash, handleCanvasReorder]
  );

  return {
    handleDragEnd,
    createNewNode,
  };
};
