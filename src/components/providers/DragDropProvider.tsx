"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";

interface DragDropContextType {
  onDragEnd: (result: DropResult) => void;
  openConfigModal: (item: any, position: any) => void;
  configModal: {
    isOpen: boolean;
    item: any;
    position: any;
  };
  closeConfigModal: () => void;
}

const DragDropContextProvider = createContext<DragDropContextType | null>(null);

export function useDragDrop() {
  const context = useContext(DragDropContextProvider);
  if (!context) {
    throw new Error("useDragDrop must be used within DragDropProvider");
  }
  return context;
}

interface DragDropProviderProps {
  children: React.ReactNode;
  onAddItem: (item: any, position: any) => void;
  onMoveToTrash: (itemId: string) => void;
}

export function DragDropProvider({
  children,
  onAddItem,
  onMoveToTrash,
}: DragDropProviderProps) {
  const [configModal, setConfigModal] = useState({
    isOpen: false,
    item: null,
    position: null,
  });

  const openConfigModal = useCallback((item: any, position: any) => {
    setConfigModal({
      isOpen: true,
      item,
      position,
    });
  }, []);

  const closeConfigModal = useCallback(() => {
    setConfigModal({
      isOpen: false,
      item: null,
      position: null,
    });
  }, []);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      console.log("🎯 DragDropProvider onDragEnd:", result);
      const { destination, source, draggableId } = result;

      // No destination
      if (!destination) {
        console.log("⚠️ No destination");
        return;
      }

      // Same position
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      // Dragging from palette to form
      if (
        source.droppableId === "component-palette" &&
        destination.droppableId.startsWith("form-")
      ) {
        const componentType = draggableId;
        const position = {
          stepId: destination.droppableId.replace("form-", ""),
          index: destination.index,
        };

        console.log("🎯 Opening config modal:", {
          componentType,
          position,
          sourceId: source.droppableId,
          destId: destination.droppableId
        });

        // Open config modal for the dropped item
        openConfigModal({ type: componentType }, position);
        return;
      }

      // Dragging to trash
      if (destination.droppableId === "trash") {
        onMoveToTrash(draggableId);
        return;
      }

      // Other drag operations (reordering, etc.)
      console.log("Other drag operation:", result);
    },
    [openConfigModal, onMoveToTrash]
  );

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      onDragEnd,
      openConfigModal,
      configModal,
      closeConfigModal,
    }),
    [onDragEnd, openConfigModal, configModal, closeConfigModal]
  );

  return (
    <DragDropContextProvider.Provider value={contextValue}>
      <DragDropContext onDragEnd={onDragEnd}>{children}</DragDropContext>
    </DragDropContextProvider.Provider>
  );
}
