// Snap alignment configuration
export interface SnapSettings {
  enabled: boolean;
  threshold: number;
  showGuides: boolean;
  snapToCanvas: boolean;
  snapToElements: boolean;
  guideOnly: boolean; // Show guides but don't snap to positions
}

// Default snap settings - FIXED TO GUIDE ONLY MODE
export const DEFAULT_SNAP_SETTINGS: SnapSettings = {
  enabled: true, // Keep enabled to show guides
  threshold: 3, // Threshold for guide detection
  showGuides: true, // Show alignment guides
  snapToCanvas: false, // Don't snap to canvas edges
  snapToElements: false, // Don't snap to other elements
  guideOnly: true, // FIXED: Only show guides, no snapping
};

// Global snap settings - can be modified at runtime
let globalSnapSettings: SnapSettings = { ...DEFAULT_SNAP_SETTINGS };

// Get current snap settings
export const getSnapSettings = (): SnapSettings => {
  return { ...globalSnapSettings };
};

// Update snap settings
export const updateSnapSettings = (settings: Partial<SnapSettings>): void => {
  globalSnapSettings = { ...globalSnapSettings, ...settings };
};

// Quick toggle functions
export const toggleSnap = (): boolean => {
  globalSnapSettings.enabled = !globalSnapSettings.enabled;
  return globalSnapSettings.enabled;
};

export const disableSnap = (): void => {
  globalSnapSettings.enabled = false;
};

export const enableSnap = (): void => {
  globalSnapSettings.enabled = true;
};

// Preset configurations
export const SNAP_PRESETS = {
  OFF: {
    enabled: false,
    threshold: 0,
    showGuides: false,
    snapToCanvas: false,
    snapToElements: false,
    guideOnly: false,
  },
  GUIDE_ONLY: {
    enabled: true,
    threshold: 3,
    showGuides: true,
    snapToCanvas: false,
    snapToElements: false,
    guideOnly: true,
  },
  LOW_SENSITIVITY: {
    enabled: true,
    threshold: 2,
    showGuides: true,
    snapToCanvas: true,
    snapToElements: true,
    guideOnly: false,
  },
  MEDIUM_SENSITIVITY: {
    enabled: true,
    threshold: 3,
    showGuides: true,
    snapToCanvas: true,
    snapToElements: true,
    guideOnly: false,
  },
  HIGH_SENSITIVITY: {
    enabled: true,
    threshold: 6,
    showGuides: true,
    snapToCanvas: true,
    snapToElements: true,
    guideOnly: false,
  },
} as const;

// Apply preset
export const applySnapPreset = (preset: keyof typeof SNAP_PRESETS): void => {
  globalSnapSettings = { ...SNAP_PRESETS[preset] };
};
