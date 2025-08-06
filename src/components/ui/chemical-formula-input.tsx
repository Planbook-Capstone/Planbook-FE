"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Subscript, Superscript, Type, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChemicalFormulaInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function ChemicalFormulaInput({
  value,
  onChange,
  placeholder = "Nhập công thức hóa học (VD: C<sub>n</sub>(H<sub>2</sub>O)<sub>m</sub>)...",
  className = "",
}: ChemicalFormulaInputProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Convert the value to display format (with proper HTML rendering)
  const displayValue = React.useMemo(() => {
    if (!value) return "";
    return value
      .replace(/<br\s*\/?>/gi, "<br/>")
      .replace(/&nbsp;/gi, "&nbsp;");
  }, [value]);

  // Initialize editor content
  useEffect(() => {
    const editor = editorRef.current;
    if (editor && !isInitialized) {
      editor.innerHTML = displayValue;
      setIsInitialized(true);
    }
  }, [displayValue, isInitialized]);

  // Update editor when value changes externally
  useEffect(() => {
    const editor = editorRef.current;
    if (editor && isInitialized && editor.innerHTML !== displayValue) {
      const selection = window.getSelection();
      const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
      const startOffset = range?.startOffset || 0;
      const endOffset = range?.endOffset || 0;

      editor.innerHTML = displayValue;

      // Restore cursor position
      if (range && editor.firstChild) {
        try {
          const newRange = document.createRange();
          const textNode = editor.firstChild;
          newRange.setStart(textNode, Math.min(startOffset, textNode.textContent?.length || 0));
          newRange.setEnd(textNode, Math.min(endOffset, textNode.textContent?.length || 0));
          selection?.removeAllRanges();
          selection?.addRange(newRange);
        } catch (e) {
          // Ignore cursor positioning errors
        }
      }
    }
  }, [displayValue, isInitialized]);

  const handleInput = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;

    // Get the HTML content
    let htmlContent = editor.innerHTML;

    // Clean up the HTML
    htmlContent = htmlContent
      .replace(/<div><br><\/div>/gi, "<br/>")
      .replace(/<div>/gi, "<br/>")
      .replace(/<\/div>/gi, "")
      .replace(/<br>/gi, "<br/>")
      .replace(/&nbsp;/gi, "&nbsp;");

    onChange(htmlContent);
  }, [onChange]);

  const insertSubscript = useCallback(() => {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    if (range) {
      const selectedText = range.toString();
      range.deleteContents();

      const sub = document.createElement("sub");
      sub.textContent = selectedText || "n";
      range.insertNode(sub);

      // Position cursor after the subscript
      range.setStartAfter(sub);
      range.setEndAfter(sub);
      selection?.removeAllRanges();
      selection?.addRange(range);

      handleInput();
      editorRef.current?.focus();
    }
  }, [handleInput]);

  const insertSuperscript = useCallback(() => {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    if (range) {
      const selectedText = range.toString();
      range.deleteContents();

      const sup = document.createElement("sup");
      sup.textContent = selectedText || "+";
      range.insertNode(sup);

      // Position cursor after the superscript
      range.setStartAfter(sup);
      range.setEndAfter(sup);
      selection?.removeAllRanges();
      selection?.addRange(range);

      handleInput();
      editorRef.current?.focus();
    }
  }, [handleInput]);

  const insertCommonFormula = useCallback((formula: string) => {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    if (range) {
      range.deleteContents();
      
      // Create a temporary div to parse the HTML
      const temp = document.createElement("div");
      temp.innerHTML = formula;
      
      // Insert each child node
      while (temp.firstChild) {
        range.insertNode(temp.firstChild);
      }

      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);

      handleInput();
      editorRef.current?.focus();
    }
  }, [handleInput]);

  const clearContent = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
      onChange("");
      editorRef.current.focus();
    }
  }, [onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Ctrl/Cmd + Shift + - for subscript
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "_") {
        e.preventDefault();
        insertSubscript();
      }
      // Ctrl/Cmd + Shift + + for superscript
      else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "+") {
        e.preventDefault();
        insertSuperscript();
      }
      // Handle Enter key to insert <br/> tags
      else if (e.key === "Enter") {
        e.preventDefault();
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);

        if (range) {
          range.deleteContents();
          const br = document.createElement("br");
          range.insertNode(br);
          range.setStartAfter(br);
          range.setEndAfter(br);
          selection?.removeAllRanges();
          selection?.addRange(range);

          handleInput();
        }
      }
    },
    [insertSubscript, insertSuperscript, handleInput]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");

      // Insert plain text and convert line breaks
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);

      if (range) {
        range.deleteContents();
        const lines = text.split("\n");

        lines.forEach((line, index) => {
          if (index > 0) {
            const br = document.createElement("br");
            range.insertNode(br);
            range.setStartAfter(br);
          }

          if (line) {
            const textNode = document.createTextNode(line);
            range.insertNode(textNode);
            range.setStartAfter(textNode);
          }
        });

        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);

        setTimeout(handleInput, 0);
      }
    },
    [handleInput]
  );

  const commonFormulas = [
    { label: "H₂O", html: "H<sub>2</sub>O" },
    { label: "CO₂", html: "CO<sub>2</sub>" },
    { label: "NaCl", html: "NaCl" },
    { label: "CₙH₂ₙ₊₂", html: "C<sub>n</sub>H<sub>2n+2</sub>" },
    { label: "CₙH₂ₙ", html: "C<sub>n</sub>H<sub>2n</sub>" },
    { label: "Ca²⁺", html: "Ca<sup>2+</sup>" },
    { label: "SO₄²⁻", html: "SO<sub>4</sub><sup>2-</sup>" },
  ];

  return (
    <div className={cn("border border-gray-200 rounded-lg chemical-formula-input", className)}>
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1 items-center">
        {/* Formatting buttons */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertSubscript}
          className="h-8 px-2 text-xs"
          title="Chỉ số dưới (Ctrl+Shift+_)"
        >
          <Subscript className="h-4 w-4 mr-1" />
          X₂
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertSuperscript}
          className="h-8 px-2 text-xs"
          title="Chỉ số trên (Ctrl+Shift++)"
        >
          <Superscript className="h-4 w-4 mr-1" />
          X²
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Common formulas */}
        <span className="text-xs text-gray-500 mr-2">Công thức thông dụng:</span>
        {commonFormulas.map((formula, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertCommonFormula(formula.html)}
            className="h-8 px-2 text-xs"
            title={`Chèn ${formula.label}`}
          >
            <span dangerouslySetInnerHTML={{ __html: formula.label }} />
          </Button>
        ))}

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clearContent}
          className="h-8 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
          title="Xóa tất cả"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div className="p-4">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          className={cn(
            "min-h-[60px]",
            "border-none",
            "outline-none",
            "bg-transparent",
            "leading-relaxed",
            "whitespace-pre-wrap",
            "text-base",
            !value && "text-gray-400"
          )}
          style={{
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
          data-placeholder={placeholder}
        />
      </div>

      {/* Help text */}
      <div className="px-4 pb-3 text-xs text-gray-500">
        <div className="flex flex-wrap gap-4">
          <span>• <kbd>Ctrl+Shift+_</kbd>: Chỉ số dưới</span>
          <span>• <kbd>Ctrl+Shift++</kbd>: Chỉ số trên</span>
          <span>• Chọn text rồi nhấn nút để format</span>
        </div>
      </div>
    </div>
  );
}
