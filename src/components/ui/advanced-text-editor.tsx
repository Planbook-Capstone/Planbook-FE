"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { Extension } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import TextStyle from "@tiptap/extension-text-style";
import { cn } from "@/lib/utils";
import "./advanced-text-editor.css";

interface AdvancedTextEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
}

// Custom extension for keyboard shortcuts
const KeyboardShortcuts = Extension.create({
  name: "keyboardShortcuts",

  onCreate() {
    console.log("KeyboardShortcuts extension created");
  },

  addKeyboardShortcuts() {
    return {
      // Basic formatting
      "Mod-b": () => {
        console.log("Bold shortcut triggered");
        return this.editor.chain().focus().toggleBold().run();
      },
      "Mod-i": () => {
        console.log("Italic shortcut triggered");
        return this.editor.chain().focus().toggleItalic().run();
      },
      "Mod-u": () => {
        console.log("Underline shortcut triggered");
        return this.editor.chain().focus().toggleUnderline().run();
      },
      // Try different key combinations for superscript
      "Mod-Shift-=": () => {
        console.log("Superscript shortcut triggered (=)");
        return this.editor.chain().focus().toggleSuperscript().run();
      },
      "Mod-=": () => {
        console.log("Superscript shortcut triggered (Mod+=)");
        return this.editor.chain().focus().toggleSuperscript().run();
      },
      // Try different key combinations for subscript
      "Mod-Shift--": () => {
        console.log("Subscript shortcut triggered (-)");
        return this.editor.chain().focus().toggleSubscript().run();
      },
      "Mod--": () => {
        console.log("Subscript shortcut triggered (Mod+-)");
        return this.editor.chain().focus().toggleSubscript().run();
      },
    };
  },
});

export function AdvancedTextEditor({
  content = "",
  onChange,
  placeholder = "Nhập nội dung...",
  className,
  editable = true,
}: AdvancedTextEditorProps) {
  // Memoize extensions to prevent recreation on every render
  const extensions = useMemo(
    () => [
      StarterKit.configure({
        // Keep default keyboard shortcuts enabled
        history: {
          depth: 100,
        },
        // Ensure bold and italic shortcuts work
        bold: {
          HTMLAttributes: {
            class: "font-bold",
          },
        },
        italic: {
          HTMLAttributes: {
            class: "italic",
          },
        },
      }),
      Underline.configure({
        HTMLAttributes: {
          class: "underline",
        },
      }),
      Superscript.configure({
        HTMLAttributes: {
          class: "superscript",
        },
      }),
      Subscript.configure({
        HTMLAttributes: {
          class: "subscript",
        },
      }),
      TextStyle,
      KeyboardShortcuts,
    ],
    []
  );

  // Memoize editor props to prevent recreation
  const editorProps = useMemo(
    () => ({
      attributes: {
        class: "advanced-text-editor-content",
        "data-placeholder": placeholder,
      },
      // Remove handleKeyDown from editorProps to avoid conflicts
    }),
    [placeholder]
  );

  // Debounced onChange to reduce lag
  const debouncedOnChange = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (content: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          onChange?.(content);
        }, 100); // 100ms debounce
      };
    })(),
    [onChange]
  );

  const editor = useEditor({
    extensions,
    content,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      debouncedOnChange(editor.getHTML());
    },
    editorProps,
    // Enable keyboard shortcuts
    enableInputRules: true,
    enablePasteRules: true,
  });

  // Auto-resize functionality with throttling
  useEffect(() => {
    if (!editor) return;

    let resizeTimeout: NodeJS.Timeout;

    const updateHeight = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const element = editor.view.dom as HTMLElement;
        if (element) {
          // Reset height to auto to get the natural height
          element.style.height = "auto";
          const scrollHeight = element.scrollHeight;
          const newHeight = Math.max(24, scrollHeight);
          element.style.height = `${newHeight}px`;
        }
      }, 50); // Throttle to 50ms
    };

    // Update height on content change
    editor.on("update", updateHeight);
    editor.on("focus", updateHeight);

    // Initial height update
    requestAnimationFrame(updateHeight);

    return () => {
      clearTimeout(resizeTimeout);
      editor.off("update", updateHeight);
      editor.off("focus", updateHeight);
    };
  }, [editor]);

  // Backup keyboard shortcut handler
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle if editor is focused
      if (!editor.isFocused) return;

      const isCtrlOrCmd = event.ctrlKey || event.metaKey;

      // Handle Ctrl+Shift+= for superscript
      if (isCtrlOrCmd && event.shiftKey && event.key === "=") {
        event.preventDefault();
        event.stopPropagation();
        console.log("Backup: Superscript triggered (Ctrl+Shift+=)");
        editor.chain().focus().toggleSuperscript().run();
        return;
      }

      // Handle Ctrl+Shift+- for subscript
      if (isCtrlOrCmd && event.shiftKey && event.key === "-") {
        event.preventDefault();
        event.stopPropagation();
        console.log("Backup: Subscript triggered (Ctrl+Shift+-)");
        editor.chain().focus().toggleSubscript().run();
        return;
      }

      // Alternative: Handle by event.code for more reliable detection
      if (isCtrlOrCmd && event.shiftKey) {
        // Equal key for superscript
        if (event.code === "Equal") {
          event.preventDefault();
          event.stopPropagation();
          console.log("Backup: Superscript triggered (Equal key)");
          editor.chain().focus().toggleSuperscript().run();
          return;
        }
        // Minus key for subscript
        if (event.code === "Minus") {
          event.preventDefault();
          event.stopPropagation();
          console.log("Backup: Subscript triggered (Minus key)");
          editor.chain().focus().toggleSubscript().run();
          return;
        }
      }
    };

    // Add to document to catch all events
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [editor]);

  if (!editor) {
    return (
      <div className={cn("w-full min-h-[1.5rem] text-gray-400", className)}>
        {placeholder}
      </div>
    );
  }

  return (
    <div className={cn("w-full advanced-text-editor", className)}>
      <EditorContent
        editor={editor}
        className="w-full focus-within:outline-none"
      />
    </div>
  );
}
