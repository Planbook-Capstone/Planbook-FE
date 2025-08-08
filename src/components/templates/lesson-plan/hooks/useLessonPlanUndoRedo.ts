import { useCallback, useEffect, useRef, useState } from "react";
import { DemoNode } from "../types";

interface UndoRedoState {
  data: DemoNode[];
  timestamp: number;
}

interface UseLessonPlanUndoRedoProps {
  demoData: DemoNode[];
  setDemoData: (data: DemoNode[]) => void;
  updateFinalData: (data: DemoNode[]) => void;
  maxHistorySize?: number;
}

export const useLessonPlanUndoRedo = ({
  demoData,
  setDemoData,
  updateFinalData,
  maxHistorySize = 50,
}: UseLessonPlanUndoRedoProps) => {
  const [history, setHistory] = useState<UndoRedoState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const isUndoRedoAction = useRef(false);
  const lastSavedState = useRef<string>("");

  // Save current state to history
  const saveToHistory = useCallback(
    (data: DemoNode[]) => {
      if (isUndoRedoAction.current) {
        return;
      }

      const stateString = JSON.stringify(data);

      // Don't save if data hasn't changed
      if (stateString === lastSavedState.current) {
        return;
      }

      lastSavedState.current = stateString;

      const newState: UndoRedoState = {
        data: JSON.parse(stateString), // Deep clone
        timestamp: Date.now(),
      };

      setHistory((prev) => {
        // Remove any states after current index (when we're in the middle of history)
        const newHistory = prev.slice(0, currentIndex + 1);

        // Add new state
        newHistory.push(newState);

        // Limit history size
        if (newHistory.length > maxHistorySize) {
          newHistory.shift();
          setCurrentIndex((prevIndex) => Math.max(0, prevIndex));
        } else {
          setCurrentIndex(newHistory.length - 1);
        }

        return newHistory;
      });
    },
    [currentIndex, maxHistorySize]
  );

  // Undo function
  const undo = useCallback(() => {
    if (currentIndex > 0) {
      isUndoRedoAction.current = true;
      const previousState = history[currentIndex - 1];
      setDemoData(previousState.data);
      setCurrentIndex(currentIndex - 1);
      updateFinalData(previousState.data);

      // Reset flag after state update
      setTimeout(() => {
        isUndoRedoAction.current = false;
      }, 0);
    }
  }, [currentIndex, history, setDemoData, updateFinalData]);

  // Redo function
  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      isUndoRedoAction.current = true;
      const nextState = history[currentIndex + 1];
      setDemoData(nextState.data);
      setCurrentIndex(currentIndex + 1);
      updateFinalData(nextState.data);

      // Reset flag after state update
      setTimeout(() => {
        isUndoRedoAction.current = false;
      }, 0);
    }
  }, [currentIndex, history, setDemoData, updateFinalData]);

  // Check if undo/redo is available
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Cmd+Z (Mac) or Ctrl+Z (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === "z") {
        event.preventDefault();

        if (event.shiftKey) {
          // Cmd+Shift+Z or Ctrl+Shift+Z for redo
          redo();
        } else {
          // Cmd+Z or Ctrl+Z for undo
          undo();
        }
      }

      // Alternative redo shortcut: Cmd+Y or Ctrl+Y
      if ((event.metaKey || event.ctrlKey) && event.key === "y") {
        event.preventDefault();
        redo();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo, redo]);

  // Save initial state
  useEffect(() => {
    if (history.length === 0 && demoData.length > 0) {
      saveToHistory(demoData);
    }
  }, [demoData, history.length, saveToHistory]);

  // Auto-save when demoData changes (with debounce)
  useEffect(() => {
    if (!isUndoRedoAction.current) {
      const timeoutId = setTimeout(() => {
        saveToHistory(demoData);
      }, 500); // 500ms debounce

      return () => clearTimeout(timeoutId);
    }
  }, [demoData, saveToHistory]);

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    saveToHistory,
    historyLength: history.length,
    currentIndex,
  };
};
