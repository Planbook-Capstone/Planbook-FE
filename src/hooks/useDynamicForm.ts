"use client";

import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

export interface DynamicComponent {
  id: string;
  type: "INPUT" | "CONTENT" | "REFERENCES" | "SUBSECTION";
  title: string;
  content?: string;
  placeholder?: string;
  order: number;
  stepId: string;
  children?: DynamicComponent[];
  nodeType?: string;
}

export interface TrashedItem {
  id: string;
  component: DynamicComponent;
  deletedAt: string;
  originalStepId: string;
  originalOrder: number;
}

export function useDynamicForm() {
  const [dynamicComponents, setDynamicComponents] = useState<
    DynamicComponent[]
  >([]);
  const [trashedItems, setTrashedItems] = useState<TrashedItem[]>([]);

  // Add new component to a step
  const addComponent = useCallback(
    (config: any, position: { stepId: string; index: number }) => {
      setDynamicComponents((prev) => {
        // Get existing components for this step
        const stepComponents = prev.filter(
          (comp) => comp.stepId === position.stepId
        );
        const otherComponents = prev.filter(
          (comp) => comp.stepId !== position.stepId
        );

        // New component goes at the end (highest order + 1)
        const maxOrder =
          stepComponents.length > 0
            ? Math.max(...stepComponents.map((comp) => comp.order))
            : -1;

        const newComponent: DynamicComponent = {
          id: uuidv4(),
          type: config.type,
          title: config.title,
          content: config.content,
          placeholder: config.placeholder,
          order: maxOrder + 1,
          stepId: position.stepId,
          nodeType: config.type,
        };

        return [...otherComponents, ...stepComponents, newComponent];
      });
    },
    []
  );

  // Move component to trash
  const moveToTrash = useCallback(
    (componentId: string) => {
      // Find component to trash
      const componentToTrash = dynamicComponents.find(
        (comp) => comp.id === componentId
      );
      if (!componentToTrash) return;

      // Add to trash
      const trashedItem: TrashedItem = {
        id: uuidv4(),
        component: componentToTrash,
        deletedAt: new Date().toISOString(),
        originalStepId: componentToTrash.stepId,
        originalOrder: componentToTrash.order,
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
    },
    [dynamicComponents]
  );

  // Restore component from trash
  const restoreFromTrash = useCallback(
    (trashedItemId: string) => {
      const itemToRestore = trashedItems.find(
        (item) => item.id === trashedItemId
      );
      if (!itemToRestore) return;

      // Add back to components
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

      // Remove from trash
      setTrashedItems((prev) =>
        prev.filter((item) => item.id !== trashedItemId)
      );
    },
    [trashedItems]
  );

  // Get components for a specific step (dynamic only)
  const getDynamicComponentsForStep = useCallback(
    (stepId: string) => {
      return dynamicComponents
        .filter((comp) => comp.stepId === stepId)
        .sort((a, b) => a.order - b.order);
    },
    [dynamicComponents]
  );

  // Merge static children with dynamic components for a step
  const getMergedComponentsForStep = useCallback(
    (stepId: string, staticChildren: any[] = []) => {
      const dynamicComps = getDynamicComponentsForStep(stepId);

      // Convert static children to the same format
      const staticComps = staticChildren.map((child, index) => ({
        ...child,
        isDynamic: false,
        originalOrder: index,
      }));

      // Convert dynamic components
      const dynamicCompsFormatted = dynamicComps.map((comp) => ({
        id: comp.id,
        title: comp.title,
        content: comp.content || comp.placeholder,
        nodeType: comp.type,
        children: comp.children,
        isDynamic: true,
        order: comp.order,
        type: comp.type, // Keep original type for identification
      }));

      // Merge and sort by order
      const allComponents = [...staticComps, ...dynamicCompsFormatted];

      // Static components first, then dynamic components
      return allComponents.sort((a, b) => {
        // Static components always come first
        if (!a.isDynamic && b.isDynamic) return -1;
        if (a.isDynamic && !b.isDynamic) return 1;

        // Within same type, sort by order
        if (a.isDynamic && b.isDynamic) return a.order - b.order;
        if (!a.isDynamic && !b.isDynamic)
          return a.originalOrder - b.originalOrder;

        return 0;
      });
    },
    [getDynamicComponentsForStep]
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
