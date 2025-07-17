"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Button } from "@/components/ui/Button";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TableCellEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  autoFocus?: boolean;
  disabled?: boolean;
}

export function TableCellEditor({
  content = "",
  onChange,
  placeholder = "Nhập nội dung...",
  className,
  onBlur,
  onFocus,
  onSave,
  onCancel,
  autoFocus = false,
  disabled = false,
}: TableCellEditorProps) {
  const [isToolbarFocused, setIsToolbarFocused] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable some features for table cells
        heading: {
          levels: [1, 2, 3],
        },
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
    ],
    content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    onFocus: () => {
      onFocus?.();
    },
    onBlur: () => {
      // Only trigger onBlur if toolbar is not focused
      setTimeout(() => {
        if (!isToolbarFocused) {
          onBlur?.();
        }
      }, 100);
    },
    editorProps: {
      handleKeyDown: (view, event) => {
        // Handle keyboard shortcuts
        if (event.key === 'Escape') {
          onCancel?.();
          return true;
        }
        if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
          onSave?.();
          return true;
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  useEffect(() => {
    if (editor && autoFocus) {
      editor.commands.focus();
    }
  }, [editor, autoFocus]);

  const addImage = useCallback(() => {
    const url = window.prompt("Nhập URL hình ảnh:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addLink = useCallback(() => {
    const url = window.prompt("Nhập URL:");
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn("border border-gray-200 rounded", className)}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Compact Toolbar */}
      {!disabled && (
        <div
          className="border-b border-gray-200 p-1 flex gap-1"
          onMouseEnter={() => setIsToolbarFocused(true)}
          onMouseLeave={() => setIsToolbarFocused(false)}
        >
          <Button
            variant="ghost"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault(); // Prevent losing focus
              editor.chain().focus().toggleBold().run();
            }}
            className={cn(
              "h-6 w-6 p-0",
              editor.isActive("bold") && "bg-gray-100"
            )}
          >
            <Bold className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault(); // Prevent losing focus
              editor.chain().focus().toggleItalic().run();
            }}
            className={cn(
              "h-6 w-6 p-0",
              editor.isActive("italic") && "bg-gray-100"
            )}
          >
            <Italic className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault(); // Prevent losing focus
              editor.chain().focus().toggleBulletList().run();
            }}
            className={cn(
              "h-6 w-6 p-0",
              editor.isActive("bulletList") && "bg-gray-100"
            )}
          >
            <List className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault(); // Prevent losing focus
              editor.chain().focus().toggleOrderedList().run();
            }}
            className={cn(
              "h-6 w-6 p-0",
              editor.isActive("orderedList") && "bg-gray-100"
            )}
          >
            <ListOrdered className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault(); // Prevent losing focus
              addLink();
            }}
            className={cn(
              "h-6 w-6 p-0",
              editor.isActive("link") && "bg-gray-100"
            )}
          >
            <LinkIcon className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault(); // Prevent losing focus
              addImage();
            }}
            className="h-6 w-6 p-0"
          >
            <ImageIcon className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Editor Content */}
      <div className="p-2">
        <EditorContent
          editor={editor}
          className={cn(
            "prose prose-sm max-w-none",
            "focus-within:outline-none",
            "[&_.ProseMirror]:outline-none",
            "[&_.ProseMirror]:min-h-[40px]",
            "[&_.ProseMirror]:p-1",
            "[&_.ProseMirror]:border-none",
            "[&_.ProseMirror]:resize-none",
            "[&_.ProseMirror>p]:m-0",
            "[&_.ProseMirror>p]:leading-tight",
            "[&_.ProseMirror>p+p]:mt-1",
            !content && `[&_.ProseMirror]:before:content-['${placeholder}']`,
            !content && "[&_.ProseMirror]:before:text-gray-400",
            !content && "[&_.ProseMirror]:before:pointer-events-none",
            !content && "[&_.ProseMirror]:before:absolute"
          )}
        />
      </div>

      {/* Keyboard shortcuts hint */}
      {!disabled && (
        <div className="px-2 pb-1 text-xs text-gray-500 border-t border-gray-100 bg-gray-50">
          💡 <kbd className="bg-white px-1 rounded text-xs border">Ctrl+Enter</kbd> lưu • <kbd className="bg-white px-1 rounded text-xs border">Esc</kbd> hủy • Click ra ngoài để tự động lưu
        </div>
      )}
    </div>
  );
}
