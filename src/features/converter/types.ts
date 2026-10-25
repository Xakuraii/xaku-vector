export type SupportedMimeType = 'image/png' | 'image/webp' | 'image/jpeg';

export type OutputFormat = 'image/webp' | 'image/png';

export type OptimizationPreset = 150 | 300 | 500 | 'unrestricted';

export interface ImageSourceData {
  file: File | null;
  name: string;
  byteLength: number;
  mimeType: string;
  width: number;
  height: number;
  dataUrl: string;
  objectUrl?: string;
  imageElement: HTMLImageElement;
}

export interface ConversionSettingsState {
  targetMaxKB: number;
  preset: OptimizationPreset;
  format: OutputFormat;
  mode: 'auto' | 'manual';
  manualQuality: number; // 30 - 100
  manualScale: number; // 10 - 100
  prioritizeQuality: boolean;
}

export interface OptimizationResult {
  svgString: string;
  byteLength: number;
  encodedWidth: number;
  encodedHeight: number;
  quality: number; // 0.0 - 1.0
  scale: number; // 0.0 - 1.0
  format: OutputFormat;
  isTargetMet: boolean;
  targetBytes: number;
  mimeTypeActuallyUsed: string;
  durationMs: number;
}

export type ViewMode = 'split' | 'svg-only' | 'original-only';

export type PreviewBackground = 'checker' | 'dark' | 'light';

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  warning?: string;
}
