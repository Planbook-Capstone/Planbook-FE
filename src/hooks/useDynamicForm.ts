"use client";

import { useState, useCallback } from "react";
import { generateComponentId, generateStableId } from "./useStableId";

export interface DynamicComponent {
  id: string;
  type: "INPUT" | "CONTENT" | "REFERENCES" | "SUBSECTION" | "TABLE";
  title: string;
  content?: string;
  placeholder?: string;
  order: number;
  stepId: string;
  children?: DynamicComponent[];
  parentId?: string; // Add parentId for dynamic tree
  nodeType?: string;
}

export interface TrashedItem {
  id: string;
  component: DynamicComponent | any; // Allow both dynamic and static components
  deletedAt: string;
  originalStepId: string;
  originalOrder: number;
  isStatic?: boolean; // Flag to identify static components
}

export function useDynamicForm() {
  const [dynamicComponents, setDynamicComponents] = useState<
    DynamicComponent[]
  >([]);
  const [trashedItems, setTrashedItems] = useState<TrashedItem[]>([]);
  const [hiddenStaticComponents, setHiddenStaticComponents] = useState<
    string[]
  >([]);

  // Add new component to a step
  const addComponent = useCallback(
    (
      config: any,
      position: { stepId: string; index: number; parentId?: string }
    ) => {
      setDynamicComponents((prev) => {
        // Get existing components for this step and parent
        const stepComponents = prev
          .filter(
            (comp) =>
              comp.stepId === position.stepId &&
              comp.parentId === (position.parentId || null)
          )
          .sort((a, b) => a.order - b.order);
        const otherComponents = prev.filter(
          (comp) =>
            comp.stepId !== position.stepId ||
            comp.parentId !== (position.parentId || null)
        );

        // Tạo component mới
        const newComponent: DynamicComponent = {
          id: generateComponentId(
            config.type,
            config.title || "component",
            Date.now() // unique enough for new
          ),
          type: config.type,
          title: config.title,
          content: config.content,
          placeholder: config.placeholder,
          order: position.index, // sẽ cập nhật lại order bên dưới
          stepId: position.stepId,
          nodeType: config.type,
          parentId: position.parentId || null,
        };

        // Force add to end if index is too large (from palette drag)
        const targetIndex =
          position.index >= stepComponents.length
            ? stepComponents.length
            : position.index;

        console.log("🎯 addComponent:", {
          stepId: position.stepId,
          originalIndex: position.index,
          targetIndex: targetIndex,
          existingCount: stepComponents.length,
          newComponentTitle: config.title,
        });

        // Thêm vào đúng vị trí index
        const newStepComponents = [
          ...stepComponents.slice(0, targetIndex),
          newComponent,
          ...stepComponents.slice(targetIndex),
        ];

        // Cập nhật lại order cho toàn bộ stepComponents
        const reordered = newStepComponents.map((comp, idx) => ({
          ...comp,
          order: idx,
        }));

        return [...otherComponents, ...reordered];
      });
    },
    [dynamicComponents]
  );

  // Move component to trash (handles both dynamic and static components)
  const moveToTrash = useCallback(
    (componentId: string, staticComponent?: any) => {
      // Handle dynamic components
      const componentToTrash = dynamicComponents.find(
        (comp) => comp.id === componentId
      );

      if (componentToTrash) {
        // Add dynamic component to trash
        const trashedItem: TrashedItem = {
          id: generateStableId(
            "trash",
            componentToTrash.title || "item",
            componentToTrash.order
          ),
          component: componentToTrash,
          deletedAt: new Date().toISOString(),
          originalStepId: componentToTrash.stepId,
          originalOrder: componentToTrash.order,
          isStatic: false,
        };

        setTrashedItems((prevTrash) => [...prevTrash, trashedItem]);

        // Remove from components and update orders
        setDynamicComponents((prev) => {
          const remaining = prev.filter((comp) => comp.id !== componentId);
          return remaining.map((comp) => {
            if (
              comp.stepId === componentToTrash.stepId &&
              comp.order > componentToTrash.order
            ) {
              return { ...comp, order: comp.order - 1 };
            }
            return comp;
          });
        });
      } else if (staticComponent) {
        // Handle static components - add to hidden list and trash
        setHiddenStaticComponents((prev) => [...prev, componentId]);

        const trashedItem: TrashedItem = {
          id: generateStableId(
            "trash",
            staticComponent.title || "item",
            Date.now()
          ),
          component: staticComponent,
          deletedAt: new Date().toISOString(),
          originalStepId: staticComponent.stepId || "unknown",
          originalOrder: staticComponent.originalOrder || 0,
          isStatic: true,
        };

        setTrashedItems((prevTrash) => [...prevTrash, trashedItem]);
      }
    },
    [dynamicComponents]
  );

  // Restore component from trash (handles both dynamic and static components)
  const restoreFromTrash = useCallback(
    (trashedItemId: string) => {
      const itemToRestore = trashedItems.find(
        (item) => item.id === trashedItemId
      );
      if (!itemToRestore) return;

      // Remove from trash first
      setTrashedItems((prev) =>
        prev.filter((item) => item.id !== trashedItemId)
      );

      if (itemToRestore.isStatic) {
        // Restore static component by removing from hidden list
        setHiddenStaticComponents((prev) =>
          prev.filter((id) => id !== itemToRestore.component.id)
        );
      } else {
        // Add back dynamic component
        setDynamicComponents((prevComps) => {
          // Check if component already exists (prevent duplicates)
          const exists = prevComps.some(
            (comp) => comp.id === itemToRestore.component.id
          );
          if (exists) return prevComps;

          // Get existing components for this step
          const stepComponents = prevComps.filter(
            (comp) => comp.stepId === itemToRestore.originalStepId
          );
          const otherComponents = prevComps.filter(
            (comp) => comp.stepId !== itemToRestore.originalStepId
          );

          // Restore at the end (highest order + 1)
          const maxOrder =
            stepComponents.length > 0
              ? Math.max(...stepComponents.map((comp) => comp.order))
              : -1;

          const restoredComponent = {
            ...itemToRestore.component,
            order: maxOrder + 1, // Always add at the end
          };

          return [...otherComponents, ...stepComponents, restoredComponent];
        });
      }
    },
    [trashedItems]
  );

  // Get components for a specific step (dynamic only)
  // Get dynamic components for a step and parent (tree)
  const getDynamicComponentsForStep = useCallback(
    (stepId: string, parentId: string | null = null) => {
      const stepIdStr = String(stepId);
      return dynamicComponents
        .filter(
          (comp) =>
            String(comp.stepId) === stepIdStr &&
            (comp.parentId ?? null) === parentId
        )
        .sort((a, b) => a.order - b.order);
    },
    [dynamicComponents]
  );

  // Merge static children (tree structure) with dynamic components for a step
  const getMergedComponentsForStep = useCallback(
    (stepId: string, staticChildren: any[] = []) => {
      const stepIdStr = String(stepId);

      // Helper: merge children recursively
      function mergeChildren(
        staticNodes: any[],
        parentStepId: string,
        parentId: string | null = null
      ) {
        // Lấy danh sách id của tất cả children lồng bên trong
        const allNestedIds = new Set<string>();
        staticNodes.forEach((child) => {
          if (Array.isArray(child.children)) {
            child.children.forEach((desc) => {
              if (desc && desc.id) allNestedIds.add(desc.id);
            });
          }
        });

        // Static children (not hidden, không phải là con của node khác trong staticNodes)
        const staticComps = staticNodes
          .filter(
            (child) =>
              !hiddenStaticComponents.includes(child.id) &&
              !allNestedIds.has(child.id)
          )
          .map((child, index) => {
            // Merge children recursively
            const mergedChild = {
              ...child,
              isDynamic: false,
              originalOrder: index,
              stepId: parentStepId,
              children: child.children
                ? mergeChildren(child.children, parentStepId, child.id)
                : [],
            };
            return mergedChild;
          });

        // Dynamic components for this parent (tree)
        const dynamicComps = getDynamicComponentsForStep(
          parentStepId,
          parentId
        ).map((comp) => ({
          id: comp.id,
          title: comp.title,
          content: comp.content || comp.placeholder,
          nodeType: comp.type,
          children: mergeChildren([], parentStepId, comp.id), // allow dynamic children in the future
          isDynamic: true,
          order: comp.order,
          type: comp.type,
          value: comp.value,
          stepId: parentStepId,
          parentId: comp.parentId ?? null,
        }));

        // Merge: static first, then dynamic
        return [...staticComps, ...dynamicComps].sort((a, b) => {
          if (!a.isDynamic && b.isDynamic) return -1;
          if (a.isDynamic && !b.isDynamic) return 1;
          if (a.isDynamic && b.isDynamic) return a.order - b.order;
          if (!a.isDynamic && !b.isDynamic)
            return a.originalOrder - b.originalOrder;
          return 0;
        });
      }

      // Start merge from root staticChildren
      return mergeChildren(staticChildren, stepIdStr, null);
    },
    [getDynamicComponentsForStep, hiddenStaticComponents]
  );

  // Update component
  const updateComponent = useCallback(
    (componentId: string, updates: Partial<DynamicComponent>) => {
      setDynamicComponents((prev) =>
        prev.map((comp) =>
          comp.id === componentId ? { ...comp, ...updates } : comp
        )
      );
    },
    []
  );

  // Reorder components within a step
  const reorderComponents = useCallback(
    (stepId: string, startIndex: number, endIndex: number) => {
      setDynamicComponents((prev) => {
        const stepComponents = prev.filter((comp) => comp.stepId === stepId);
        const otherComponents = prev.filter((comp) => comp.stepId !== stepId);

        // Reorder within step
        const [removed] = stepComponents.splice(startIndex, 1);
        stepComponents.splice(endIndex, 0, removed);

        // Update orders
        const reordered = stepComponents.map((comp, index) => ({
          ...comp,
          order: index,
        }));

        return [...otherComponents, ...reordered].sort(
          (a, b) => a.order - b.order
        );
      });
    },
    []
  );

  // Clear all trash
  const clearTrash = useCallback(() => {
    setTrashedItems([]);
  }, []);

  // Get form data including dynamic components
  const getFormDataWithDynamic = useCallback(
    (stepId: string, staticFormData: Record<string, string>) => {
      const stepComponents = getDynamicComponentsForStep(stepId);
      const dynamicData: Record<string, string> = {};

      stepComponents.forEach((comp) => {
        dynamicData[comp.id] = staticFormData[comp.id] || "";
      });

      return {
        static: staticFormData,
        dynamic: dynamicData,
        components: stepComponents,
      };
    },
    [getDynamicComponentsForStep]
  );

  return {
    // State
    dynamicComponents,
    trashedItems,
    hiddenStaticComponents,

    // Actions
    addComponent,
    moveToTrash,
    restoreFromTrash,
    updateComponent,
    reorderComponents,
    clearTrash,

    // Getters
    getDynamicComponentsForStep,
    getMergedComponentsForStep,
    getFormDataWithDynamic,
  };
}
