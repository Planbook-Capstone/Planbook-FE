// Spotlight colors constants
export const SPOTLIGHT_COLORS = [
  "rgba(59, 130, 246, 0.3)",   // Blue
  "rgba(34, 197, 94, 0.3)",    // Green
  "rgba(168, 85, 247, 0.3)",   // Purple
  "rgba(239, 68, 68, 0.3)",    // Red
  "rgba(245, 158, 11, 0.3)",   // Orange
  "rgba(236, 72, 153, 0.3)",   // Pink
  "rgba(14, 165, 233, 0.3)",   // Sky
  "rgba(99, 102, 241, 0.3)",   // Indigo
  "rgba(16, 185, 129, 0.3)",   // Emerald
  "rgba(251, 191, 36, 0.3)",   // Yellow
  "rgba(139, 69, 19, 0.3)",    // Brown
  "rgba(75, 85, 99, 0.3)",     // Gray
] as const;

// Function to get random spotlight color
export const getRandomSpotlightColor = (): string => {
  const randomIndex = Math.floor(Math.random() * SPOTLIGHT_COLORS.length);
  return SPOTLIGHT_COLORS[randomIndex];
};

// Function to get spotlight color by index (for consistent colors)
export const getSpotlightColorByIndex = (index: number): string => {
  return SPOTLIGHT_COLORS[index % SPOTLIGHT_COLORS.length];
};
