import { useCallback } from "react";
import { DemoNode } from "../types";

interface UseLessonPlanActionsProps {
  demoData: DemoNode[];
  setDemoData: React.Dispatch<React.SetStateAction<DemoNode[]>>;
  trashData: DemoNode[];
  setTrashData: React.Dispatch<React.SetStateAction<DemoNode[]>>;
  updateFinalData: (newDemoData: DemoNode[]) => void;
}

export const useLessonPlanActions = ({
  demoData,
  setDemoData,
  trashData,
  setTrashData,
  updateFinalData,
}: UseLessonPlanActionsProps) => {
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
    [setDemoData, updateFinalData]
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
    [setDemoData, updateFinalData]
  );

  // Handle description changes
  const handleDescriptionChange = useCallback(
    (nodeId: string, description: string) => {
      const updateNodeDescription = (nodeList: DemoNode[]): DemoNode[] => {
        return nodeList.map((node) => {
          if (node.id.toString() === nodeId) {
            return { ...node, description };
          }
          if (node.children && node.children.length > 0) {
            return { ...node, children: updateNodeDescription(node.children) };
          }
          return node;
        });
      };

      setDemoData((prev) => {
        const newData = updateNodeDescription(prev);
        updateFinalData(newData);
        return newData;
      });
    },
    [setDemoData, updateFinalData]
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
    [setDemoData, updateFinalData]
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
    [demoData, findAndDeleteNode, setTrashData, setDemoData, updateFinalData]
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
    [
      trashData,
      addChildToNode,
      findParentExists,
      demoData,
      setDemoData,
      setTrashData,
      updateFinalData,
    ]
  );

  // Move child node up in parent's children list
  const moveChildUp = useCallback(
    (nodeId: string) => {
      const updateNodeOrder = (nodeList: DemoNode[]): DemoNode[] => {
        return nodeList.map((node) => {
          if (node.children && node.children.length > 0) {
            const childIndex = node.children.findIndex(
              (child) => child.id.toString() === nodeId
            );

            if (childIndex > 0) {
              // Found the child and it's not the first one
              const updatedChildren = [...node.children];
              // Swap with previous sibling
              [updatedChildren[childIndex - 1], updatedChildren[childIndex]] = [
                updatedChildren[childIndex],
                updatedChildren[childIndex - 1],
              ];

              // Update orderIndex for both nodes
              updatedChildren[childIndex - 1].orderIndex = childIndex - 1;
              updatedChildren[childIndex].orderIndex = childIndex;

              return {
                ...node,
                children: updatedChildren,
              };
            }

            // Recursively check children
            return {
              ...node,
              children: updateNodeOrder(node.children),
            };
          }
          return node;
        });
      };

      const updatedData = updateNodeOrder(demoData);
      setDemoData(updatedData);
      updateFinalData(updatedData);
    },
    [demoData, setDemoData, updateFinalData]
  );

  // Move child node down in parent's children list
  const moveChildDown = useCallback(
    (nodeId: string) => {
      const updateNodeOrder = (nodeList: DemoNode[]): DemoNode[] => {
        return nodeList.map((node) => {
          if (node.children && node.children.length > 0) {
            const childIndex = node.children.findIndex(
              (child) => child.id.toString() === nodeId
            );

            if (childIndex >= 0 && childIndex < node.children.length - 1) {
              // Found the child and it's not the last one
              const updatedChildren = [...node.children];
              // Swap with next sibling
              [updatedChildren[childIndex], updatedChildren[childIndex + 1]] = [
                updatedChildren[childIndex + 1],
                updatedChildren[childIndex],
              ];

              // Update orderIndex for both nodes
              updatedChildren[childIndex].orderIndex = childIndex;
              updatedChildren[childIndex + 1].orderIndex = childIndex + 1;

              return {
                ...node,
                children: updatedChildren,
              };
            }

            // Recursively check children
            return {
              ...node,
              children: updateNodeOrder(node.children),
            };
          }
          return node;
        });
      };

      const updatedData = updateNodeOrder(demoData);
      setDemoData(updatedData);
      updateFinalData(updatedData);
    },
    [demoData, setDemoData, updateFinalData]
  );

  return {
    handleInputChange,
    handleTitleChange,
    handleDescriptionChange,
    addChildToNode,
    findNodeById,
    removeNodeById,
    findAndDeleteNode,
    handleDeleteNode,
    findParentExists,
    handleRestoreNode,
    moveChildUp,
    moveChildDown,
  };
};
