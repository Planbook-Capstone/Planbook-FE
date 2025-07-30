import { useState, useCallback, useRef } from 'react';

interface UndoRedoState<T> {
  history: T[];
  currentIndex: number;
}

interface UndoRedoActions<T> {
  state: T;
  canUndo: boolean;
  canRedo: boolean;
  pushState: (newState: T) => void;
  undo: () => T | undefined;
  redo: () => T | undefined;
  clear: () => void;
  replaceState: (newState: T) => void;
}

export function useUndoRedo<T>(
  initialState: T,
  maxHistorySize: number = 50
): UndoRedoActions<T> {
  const [undoRedoState, setUndoRedoState] = useState<UndoRedoState<T>>({
    history: [initialState],
    currentIndex: 0,
  });

  // Use ref to track if we should skip the next state push (for undo/redo operations)
  const skipNextPush = useRef(false);

  const pushState = useCallback(
    (newState: T) => {
      // Skip if this is an undo/redo operation
      if (skipNextPush.current) {
        skipNextPush.current = false;
        return;
      }

      setUndoRedoState((prev) => {
        // Remove any future history if we're not at the end
        const newHistory = prev.history.slice(0, prev.currentIndex + 1);
        
        // Add the new state
        newHistory.push(newState);
        
        // Limit history size
        if (newHistory.length > maxHistorySize) {
          newHistory.shift();
          return {
            history: newHistory,
            currentIndex: newHistory.length - 1,
          };
        }
        
        return {
          history: newHistory,
          currentIndex: newHistory.length - 1,
        };
      });
    },
    [maxHistorySize]
  );

  const undo = useCallback(() => {
    let result: T | undefined;
    
    setUndoRedoState((prev) => {
      if (prev.currentIndex > 0) {
        const newIndex = prev.currentIndex - 1;
        result = prev.history[newIndex];
        skipNextPush.current = true;
        return {
          ...prev,
          currentIndex: newIndex,
        };
      }
      return prev;
    });
    
    return result;
  }, []);

  const redo = useCallback(() => {
    let result: T | undefined;
    
    setUndoRedoState((prev) => {
      if (prev.currentIndex < prev.history.length - 1) {
        const newIndex = prev.currentIndex + 1;
        result = prev.history[newIndex];
        skipNextPush.current = true;
        return {
          ...prev,
          currentIndex: newIndex,
        };
      }
      return prev;
    });
    
    return result;
  }, []);

  const clear = useCallback(() => {
    setUndoRedoState({
      history: [undoRedoState.history[undoRedoState.currentIndex]],
      currentIndex: 0,
    });
  }, [undoRedoState.history, undoRedoState.currentIndex]);

  const replaceState = useCallback((newState: T) => {
    setUndoRedoState({
      history: [newState],
      currentIndex: 0,
    });
  }, []);

  return {
    state: undoRedoState.history[undoRedoState.currentIndex],
    canUndo: undoRedoState.currentIndex > 0,
    canRedo: undoRedoState.currentIndex < undoRedoState.history.length - 1,
    pushState,
    undo,
    redo,
    clear,
    replaceState,
  };
}
