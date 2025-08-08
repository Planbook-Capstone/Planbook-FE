import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { DemoNode } from "../types";

interface UseLessonPlanSelectionProps {
  demoData: DemoNode[];
  setDemoData: React.Dispatch<React.SetStateAction<DemoNode[]>>;
  updateFinalData: (newDemoData: DemoNode[]) => void;
  isEditMode: boolean;
  onDeleteNode?: (nodeId: string) => void; // Add delete function prop
}

export const useLessonPlanSelection = ({
  demoData,
  setDemoData,
  updateFinalData,
  isEditMode,
  onDeleteNode,
}: UseLessonPlanSelectionProps) => {
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(
    new Set()
  );
  const [clipboard, setClipboard] = useState<{
    nodes: DemoNode[];
    operation: "copy" | "cut";
  } | null>(null);

  // Clear selection when exiting edit mode
  useEffect(() => {
    if (!isEditMode) {
      setSelectedNodeIds(new Set());
    }
  }, [isEditMode]);

  // Helper function to get all child node IDs recursively
  const getAllChildIds = useCallback((node: DemoNode): string[] => {
    const childIds = [node.id];
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        childIds.push(...getAllChildIds(child));
      });
    }
    return childIds;
  }, []);

  // Helper function to find node by ID recursively
  const findNodeById = useCallback(
    (nodes: DemoNode[], nodeId: string): DemoNode | null => {
      for (const node of nodes) {
        if (node.id === nodeId) {
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

  // Helper function to remove nodes by IDs
  const removeNodesByIds = useCallback(
    (nodes: DemoNode[], idsToRemove: Set<string>): DemoNode[] => {
      return nodes
        .filter((node) => !idsToRemove.has(node.id))
        .map((node) => ({
          ...node,
          children: node.children
            ? removeNodesByIds(node.children, idsToRemove)
            : [],
        }));
    },
    []
  );

  // Helper function to add nodes to a parent
  const addNodesToParent = useCallback(
    (
      nodes: DemoNode[],
      parentId: string,
      nodesToAdd: DemoNode[]
    ): DemoNode[] => {
      return nodes.map((node) => {
        if (node.id === parentId) {
          // Fix: Handle empty children array properly
          const childOrderIndexes =
            node.children?.map((child) => child.orderIndex) || [];
          const maxOrderIndex =
            childOrderIndexes.length > 0 ? Math.max(...childOrderIndexes) : -1;

          const newChildren = nodesToAdd.map((nodeToAdd, index) => ({
            ...nodeToAdd,
            parentId: parentId,
            orderIndex: maxOrderIndex + 1 + index,
            id: `${nodeToAdd.id}_${Date.now()}_${index}`, // Generate new ID to avoid conflicts
          }));
          return {
            ...node,
            children: [...(node.children || []), ...newChildren],
          };
        }
        if (node.children && node.children.length > 0) {
          return {
            ...node,
            children: addNodesToParent(node.children, parentId, nodesToAdd),
          };
        }
        return node;
      });
    },
    []
  );

  // Handle node selection
  const handleNodeSelect = useCallback(
    (nodeId: string, isCtrlPressed: boolean) => {
      if (!isEditMode) return;

      const node = findNodeById(demoData, nodeId);
      if (!node) return;

      setSelectedNodeIds((prev) => {
        const newSelection = new Set(prev);

        if (isCtrlPressed) {
          // Multi-select mode
          if (newSelection.has(nodeId)) {
            // Deselect node and its children
            const allChildIds = getAllChildIds(node);
            allChildIds.forEach((id) => newSelection.delete(id));
          } else {
            // Select node and its children
            const allChildIds = getAllChildIds(node);
            allChildIds.forEach((id) => newSelection.add(id));
          }
        } else {
          // Single select mode
          newSelection.clear();
          const allChildIds = getAllChildIds(node);
          allChildIds.forEach((id) => newSelection.add(id));
        }

        return newSelection;
      });
    },
    [isEditMode, demoData, findNodeById, getAllChildIds]
  );

  // Helper function to check if a node has a selected parent
  const hasSelectedParent = useCallback(
    (nodeId: string, allNodes: DemoNode[]): boolean => {
      const findParentInNodes = (
        nodes: DemoNode[],
        targetId: string
      ): string | null => {
        for (const node of nodes) {
          if (node.children.some((child) => child.id === targetId)) {
            return node.id;
          }
          if (node.children.length > 0) {
            const parentId = findParentInNodes(node.children, targetId);
            if (parentId) return parentId;
          }
        }
        return null;
      };

      const parentId = findParentInNodes(allNodes, nodeId);
      return parentId ? selectedNodeIds.has(parentId) : false;
    },
    [selectedNodeIds]
  );

  // Handle copy operation
  const handleCopy = useCallback(() => {
    if (!isEditMode || selectedNodeIds.size === 0) return;

    const nodesToCopy: DemoNode[] = [];
    selectedNodeIds.forEach((nodeId) => {
      const node = findNodeById(demoData, nodeId);
      if (node && !hasSelectedParent(nodeId, demoData)) {
        nodesToCopy.push(node);
      }
    });

    setClipboard({
      nodes: nodesToCopy,
      operation: "copy",
    });

    // Show success message
    toast.success(
      `Đã copy ${nodesToCopy.length} node${nodesToCopy.length > 1 ? "s" : ""}`
    );

    // Clear selection after copy
    setSelectedNodeIds(new Set());
  }, [isEditMode, selectedNodeIds, demoData, findNodeById, hasSelectedParent]);

  // Handle cut operation
  const handleCut = useCallback(() => {
    if (!isEditMode || selectedNodeIds.size === 0) return;

    const nodesToCut: DemoNode[] = [];
    selectedNodeIds.forEach((nodeId) => {
      const node = findNodeById(demoData, nodeId);
      if (node && !hasSelectedParent(nodeId, demoData)) {
        nodesToCut.push(node);
      }
    });

    setClipboard({
      nodes: nodesToCut,
      operation: "cut",
    });

    // Show success message
    toast.success(
      `Đã cut ${nodesToCut.length} node${nodesToCut.length > 1 ? "s" : ""}`
    );

    // Remove cut nodes from demoData
    const newDemoData = removeNodesByIds(demoData, selectedNodeIds);
    setDemoData(newDemoData);
    updateFinalData(newDemoData);

    // Clear selection after cut
    setSelectedNodeIds(new Set());
  }, [
    isEditMode,
    selectedNodeIds,
    demoData,
    findNodeById,
    hasSelectedParent,
    removeNodesByIds,
    setDemoData,
    updateFinalData,
  ]);

  // Handle paste operation
  const handlePaste = useCallback(
    (targetNodeId: string) => {
      console.log("🔄 handlePaste called with targetNodeId:", targetNodeId);
      console.log("📋 Clipboard:", clipboard);
      console.log("✏️ Edit mode:", isEditMode);

      if (!isEditMode || !clipboard || clipboard.nodes.length === 0) {
        console.log("❌ Paste failed - conditions not met");
        return;
      }

      // Find target node to verify it exists
      const targetNode = findNodeById(demoData, targetNodeId);
      console.log("🎯 Target node:", targetNode);

      if (!targetNode) {
        console.log("❌ Target node not found");
        toast.error("Không tìm thấy node đích để paste");
        return;
      }

      const newDemoData = addNodesToParent(
        demoData,
        targetNodeId,
        clipboard.nodes
      );

      console.log("✅ New demo data after paste:", newDemoData);

      setDemoData(newDemoData);
      updateFinalData(newDemoData);

      // Show success message
      toast.success(
        `Đã paste ${clipboard.nodes.length} node${
          clipboard.nodes.length > 1 ? "s" : ""
        }`
      );

      // Clear clipboard if it was a cut operation
      if (clipboard.operation === "cut") {
        setClipboard(null);
      }
    },
    [
      isEditMode,
      clipboard,
      demoData,
      addNodesToParent,
      setDemoData,
      updateFinalData,
      findNodeById,
    ]
  );

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isEditMode) return;

      const isCtrlOrCmd = event.ctrlKey || event.metaKey;

      if (isCtrlOrCmd && event.key.toLowerCase() === "c") {
        event.preventDefault();
        handleCopy();
      } else if (isCtrlOrCmd && event.key.toLowerCase() === "x") {
        event.preventDefault();
        handleCut();
      } else if (isCtrlOrCmd && event.key.toLowerCase() === "v") {
        event.preventDefault();
        // For paste, find the main selected node (not its children)
        if (selectedNodeIds.size > 0) {
          // Find the parent node among selected nodes (the one that doesn't have a selected parent)
          let targetNodeId: string | null = null;

          for (const nodeId of selectedNodeIds) {
            const node = findNodeById(demoData, nodeId);
            if (node && !hasSelectedParent(nodeId, demoData)) {
              // Any node can be a paste target now
              targetNodeId = nodeId;
              break;
            }
          }

          if (targetNodeId) {
            handlePaste(targetNodeId);
          } else {
            toast.error("Không tìm thấy node phù hợp để paste");
          }
        } else {
          toast.error("Vui lòng chọn một node để paste");
        }
      } else if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        // Delete selected nodes
        if (selectedNodeIds.size > 0 && onDeleteNode) {
          // Find parent nodes (nodes that don't have selected parents)
          const nodesToDelete: string[] = [];

          selectedNodeIds.forEach((nodeId) => {
            if (!hasSelectedParent(nodeId, demoData)) {
              nodesToDelete.push(nodeId);
            }
          });

          if (nodesToDelete.length > 0) {
            // Delete each parent node (this will also delete their children)
            nodesToDelete.forEach((nodeId) => {
              onDeleteNode(nodeId);
            });

            // Clear selection after deletion
            setSelectedNodeIds(new Set());

            toast.success(
              `Đã xóa ${nodesToDelete.length} node${
                nodesToDelete.length > 1 ? "s" : ""
              }`
            );
          }
        } else if (selectedNodeIds.size === 0) {
          toast.error("Vui lòng chọn node để xóa");
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isEditMode,
    handleCopy,
    handleCut,
    handlePaste,
    selectedNodeIds,
    findNodeById,
    demoData,
    hasSelectedParent,
    onDeleteNode,
  ]);

  return {
    selectedNodeIds,
    clipboard,
    handleNodeSelect,
    handleCopy,
    handleCut,
    handlePaste,
    clearSelection: () => setSelectedNodeIds(new Set()),
  };
};
