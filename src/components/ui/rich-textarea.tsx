"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { convertBrTagsToLineBreaks, convertLineBreaksToBrTags } from "@/utils/textUtils";

interface RichTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextarea({
  value,
  onChange,
  placeholder = "Nhập văn bản...",
  className = "",
}: RichTextareaProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Convert the value to display format (with proper HTML rendering)
  const displayValue = React.useMemo(() => {
    if (!value) return "";
    return value
      .replace(/<br\s*\/?>/gi, "<br/>")
      .replace(/&nbsp;/gi, "&nbsp;");
  }, [value]);

  // Update the editor content when value changes
  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.innerHTML !== displayValue) {
      const selection = window.getSelection();
      const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
      const startOffset = range?.startOffset || 0;
      const endOffset = range?.endOffset || 0;
      
      editor.innerHTML = displayValue;
      
      // Restore cursor position
      try {
        if (range && editor.firstChild) {
          const newRange = document.createRange();
          const textNode = editor.firstChild;
          newRange.setStart(textNode, Math.min(startOffset, textNode.textContent?.length || 0));
          newRange.setEnd(textNode, Math.min(endOffset, textNode.textContent?.length || 0));
          selection?.removeAllRanges();
          selection?.addRange(newRange);
        }
      } catch (e) {
        // Ignore cursor positioning errors
      }
    }
  }, [displayValue]);

  const handleInput = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;

    // Get the HTML content and convert it back to storage format
    let htmlContent = editor.innerHTML;
    
    // Clean up the HTML and convert to storage format
    htmlContent = htmlContent
      .replace(/<div><br><\/div>/gi, "<br/>")
      .replace(/<div>/gi, "<br/>")
      .replace(/<\/div>/gi, "")
      .replace(/<br>/gi, "<br/>")
      .replace(/&nbsp;/gi, "&nbsp;");

    // Convert leading spaces in each line to &nbsp; entities
    const lines = htmlContent.split(/<br\s*\/?>/gi);
    const processedLines = lines.map(line => {
      // Handle leading spaces by converting them to &nbsp;
      const leadingSpaces = line.match(/^(\s*)/)?.[1] || "";
      const restOfLine = line.substring(leadingSpaces.length);
      const nbspIndent = leadingSpaces.replace(/ /g, "&nbsp;");
      return nbspIndent + restOfLine;
    });

    const finalContent = processedLines.join("<br/>");
    onChange(finalContent);
  }, [onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Handle Enter key to insert <br/> tags
    if (e.key === "Enter") {
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
        
        // Trigger input event
        handleInput();
      }
    }
  }, [handleInput]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
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
      
      // Trigger input event
      setTimeout(handleInput, 0);
    }
  }, [handleInput]);

  return (
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      className={`
        min-h-[24px] 
        border-none 
        outline-none 
        bg-transparent 
        leading-tight
        whitespace-pre-wrap
        ${className}
      `}
      style={{
        wordWrap: "break-word",
        overflowWrap: "break-word",
      }}
      data-placeholder={placeholder}
      dangerouslySetInnerHTML={{ __html: displayValue || "" }}
    />
  );
}

// CSS for placeholder (add to your global CSS)
const placeholderCSS = `
[contenteditable][data-placeholder]:empty::before {
  content: attr(data-placeholder);
  color: #9ca3af;
  pointer-events: none;
}
`;

// Inject CSS if not already present
if (typeof document !== "undefined" && !document.getElementById("rich-textarea-styles")) {
  const style = document.createElement("style");
  style.id = "rich-textarea-styles";
  style.textContent = placeholderCSS;
  document.head.appendChild(style);
}
