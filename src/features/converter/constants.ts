import { ConversionSettingsState, OptimizationPreset } from './types';

export const SUPPORTED_MIME_TYPES = ['image/png', 'image/webp', 'image/jpeg'] as const;

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

export const PRESET_OPTIONS: {
  id: OptimizationPreset;
  label: string;
  sublabel: string;
  targetKB: number;
}[] = [
  {
    id: 150,
    label: '< 150 KB',
    sublabel: 'Ultra Small',
    targetKB: 145,
  },
  {
    id: 300,
    label: '< 300 KB',
    sublabel: 'Recommended',
    targetKB: 290,
  },
  {
    id: 500,
    label: '< 500 KB',
    sublabel: 'High Fidelity',
    targetKB: 490,
  },
  {
    id: 'unrestricted',
    label: 'Max Quality',
    sublabel: 'Unrestricted',
    targetKB: 3000,
  },
];

export const DEFAULT_SETTINGS: ConversionSettingsState = {
  targetMaxKB: 290,
  preset: 300,
  format: 'image/webp',
  mode: 'auto',
  manualQuality: 92,
  manualScale: 100,
  prioritizeQuality: false,
};
