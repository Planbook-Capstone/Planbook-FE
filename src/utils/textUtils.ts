/**
 * Utility functions for handling text formatting and conversion
 */

/**
 * Convert <br/> tags, &nbsp; entities, and <strong> tags to line breaks and spaces for display in textarea
 * @param text - Text containing <br/> tags, &nbsp; entities, and <strong> tags
 * @returns Text with line breaks, regular spaces, and <strong> tags preserved for rendering
 */
export function convertBrTagsToLineBreaks(text: string): string {
  if (!text) return "";
  return text.replace(/<br\s*\/?>/gi, "\n").replace(/&nbsp;/gi, " ");
  // Keep <strong> tags as-is for proper bold rendering
}

/**
 * Convert line breaks and leading spaces to <br/> tags and &nbsp; entities for storage
 * @param text - Text containing line breaks and spaces (with <strong> tags preserved)
 * @returns Text with <br/> tags and &nbsp; entities
 */
export function convertLineBreaksToBrTags(text: string): string {
  if (!text) return "";
  return text
    .split("\n")
    .map((line) => {
      // Convert leading spaces to &nbsp; entities for proper indentation
      const leadingSpaces = line.match(/^(\s*)/)?.[1] || "";
      const restOfLine = line.substring(leadingSpaces.length);
      const nbspIndent = leadingSpaces.replace(/ /g, "&nbsp;");
      return nbspIndent + restOfLine;
    })
    .join("<br/>");
}

/**
 * Hook for handling textarea value with <br/> tag conversion
 * @param value - Current value with <br/> tags
 * @param onChange - Callback to update value with <br/> tags
 * @returns Object with displayValue and handleChange function
 */
export function useBrTagTextarea(
  value: string,
  onChange: (value: string) => void
) {
  const displayValue = convertBrTagsToLineBreaks(value);

  const handleChange = (newValue: string) => {
    const valueWithBrTags = convertLineBreaksToBrTags(newValue);
    onChange(valueWithBrTags);
  };

  return {
    displayValue,
    handleChange,
  };
}

/**
 * Process text content that may contain <br/> tags for display
 * @param text - Text that may contain <br/> tags
 * @returns Processed text for display
 */
export function processTextForDisplay(text: string): string {
  return convertBrTagsToLineBreaks(text);
}

/**
 * Process text content for storage (convert line breaks to <br/> tags)
 * @param text - Text that may contain line breaks
 * @returns Processed text for storage
 */
export function processTextForStorage(text: string): string {
  return convertLineBreaksToBrTags(text);
}
