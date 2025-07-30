"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";

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
  const [isInitialized, setIsInitialized] = useState(false);

  // Convert the value to display format (with proper HTML rendering)
  const displayValue = React.useMemo(() => {
    if (!value) return "";
    return value.replace(/<br\s*\/?>/gi, "<br/>").replace(/&nbsp;/gi, "&nbsp;");
  }, [value]);

  // Initialize editor content only once and when value changes from external source
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    // Only update if this is initial load or if the content is significantly different
    const currentContent = editor.innerHTML;
    const shouldUpdate =
      !isInitialized ||
      (currentContent !== displayValue &&
        !editor.contains(document.activeElement));

    if (shouldUpdate) {
      // Save cursor position before updating
      const selection = window.getSelection();
      let cursorPosition = 0;
      let wasActive = false;

      if (
        selection &&
        selection.rangeCount > 0 &&
        editor.contains(document.activeElement)
      ) {
        wasActive = true;
        const range = selection.getRangeAt(0);
        cursorPosition = range.startOffset;
      }

      editor.innerHTML = displayValue;

      // Restore cursor position only if editor was active
      if (wasActive) {
        try {
          const newRange = document.createRange();
          const walker = document.createTreeWalker(
            editor,
            NodeFilter.SHOW_TEXT,
            null
          );

          let currentPos = 0;
          let targetNode = null;
          let targetOffset = 0;

          while (walker.nextNode()) {
            const node = walker.currentNode;
            const nodeLength = node.textContent?.length || 0;

            if (currentPos + nodeLength >= cursorPosition) {
              targetNode = node;
              targetOffset = cursorPosition - currentPos;
              break;
            }
            currentPos += nodeLength;
          }

          if (targetNode && selection) {
            newRange.setStart(
              targetNode,
              Math.min(targetOffset, targetNode.textContent?.length || 0)
            );
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
          }
        } catch (e) {
          // Ignore cursor positioning errors
        }
      }

      setIsInitialized(true);
    }
  }, [displayValue, isInitialized]);

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
    const processedLines = lines.map((line) => {
      // Handle leading spaces by converting them to &nbsp;
      const leadingSpaces = line.match(/^(\s*)/)?.[1] || "";
      const restOfLine = line.substring(leadingSpaces.length);
      const nbspIndent = leadingSpaces.replace(/ /g, "&nbsp;");
      return nbspIndent + restOfLine;
    });

    const finalContent = processedLines.join("<br/>");
    onChange(finalContent);
  }, [onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
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
    },
    [handleInput]
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

        // Trigger input event
        setTimeout(handleInput, 0);
      }
    },
    [handleInput]
  );

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
if (
  typeof document !== "undefined" &&
  !document.getElementById("rich-textarea-styles")
) {
  const style = document.createElement("style");
  style.id = "rich-textarea-styles";
  style.textContent = placeholderCSS;
  document.head.appendChild(style);
}
