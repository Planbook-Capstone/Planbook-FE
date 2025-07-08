import { useRef } from "react";

// Use a Map to track counters per prefix to ensure consistency
const counterMap = new Map<string, number>();

/**
 * Hook to generate stable IDs that are consistent between server and client
 * This prevents hydration mismatches caused by random UUIDs
 */
export function useStableId(prefix: string = "id"): string {
  const idRef = useRef<string | null>(null);

  if (idRef.current === null) {
    const currentCount = counterMap.get(prefix) || 0;
    const newCount = currentCount + 1;
    counterMap.set(prefix, newCount);
    idRef.current = `${prefix}-${newCount}`;
  }

  return idRef.current;
}

/**
 * Generate a deterministic ID based on content and position
 */
export function generateStableId(
  prefix: string,
  content: string,
  index?: number
): string {
  // Remove Vietnamese accents and normalize
  const noDiacritics = content
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

  const hash = noDiacritics
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const suffix = index !== undefined ? `-${index}` : "";
  return `${prefix}-${hash}`;
}

export function generateComponentId(
  prefix: string,
  content: string,
  index?: number
): string {
  // Remove Vietnamese accents and normalize
  const noDiacritics = content
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

  const hash = noDiacritics
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const suffix = index !== undefined ? `-${index}` : "";
  return `${prefix}-${hash}${suffix}`;
}

/**
 * Create a stable ID for form fields
 */
export function createFieldId(
  type: string,
  title: string,
  stepId: string
): string {
  return generateStableId(`${type.toLowerCase()}`, title);
}
