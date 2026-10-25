import React from 'react';
import { Sliders, Zap, Check } from 'lucide-react';
import { ConversionSettingsState, OptimizationPreset, OutputFormat } from '../types';
import { PRESET_OPTIONS } from '../constants';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

interface ConversionSettingsProps {
  settings: ConversionSettingsState;
  onChange: (updater: Partial<ConversionSettingsState>) => void;
  disabled?: boolean;
}

export const ConversionSettings: React.FC<ConversionSettingsProps> = ({
  settings,
  onChange,
  disabled = false,
}) => {
  const isAuto = settings.mode === 'auto';
  const isWebp = settings.format === 'image/webp';

  const handlePresetClick = (presetId: OptimizationPreset, targetKB: number) => {
    onChange({
      preset: presetId,
      targetMaxKB: targetKB,
      mode: 'auto',
    });
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    // Find if slider aligns with a preset
    let matchingPreset: OptimizationPreset = 'unrestricted';
    if (val <= 160) matchingPreset = 150;
    else if (val <= 320) matchingPreset = 300;
    else if (val <= 550) matchingPreset = 500;

    onChange({
      targetMaxKB: val,
      preset: matchingPreset,
    });
  };

  const handleFormatChange = (format: OutputFormat) => {
    onChange({ format });
  };

  return (
    <Card className="p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 dark:bg-red-500"></span>
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            Conversion &amp; Size Settings
          </h2>
        </div>
        <Badge
          variant={isAuto ? 'amber' : 'default'}
          icon={isAuto ? <Zap className="w-3 h-3" /> : <Sliders className="w-3 h-3" />}
        >
          {isAuto ? 'Auto-Optimizer ON' : 'Manual Mode'}
        </Badge>
      </div>

      {/* 1. Target Size Budget Presets */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
            Target SVG File Size Budget:
          </span>
          <span className="font-mono font-bold text-red-600 dark:text-amber-400">
            {settings.preset === 'unrestricted'
              ? 'Unrestricted'
              : `${settings.targetMaxKB} KB limit`}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESET_OPTIONS.map((opt) => {
            const isSelected = settings.preset === opt.id && isAuto;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={disabled}
                onClick={() => handlePresetClick(opt.id, opt.targetKB)}
                className={`p-2.5 rounded-xl border text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                  isSelected
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-white shadow-sm ring-1 ring-red-500'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <div className="text-xs font-bold">{opt.label}</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {opt.sublabel}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Size Slider */}
      {settings.preset !== 'unrestricted' && (
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400">
            <span>Fine-Tune Target Size:</span>
            <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-200">
              {settings.targetMaxKB} KB
            </span>
          </div>
          <input
            type="range"
            min="60"
            max="800"
            step="5"
            disabled={disabled}
            value={settings.targetMaxKB}
            onChange={handleSliderChange}
            className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
            aria-label="Target maximum file size in kilobytes"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
            <span>60 KB</span>
            <span>150 KB</span>
            <span className="text-red-600 dark:text-amber-400 font-semibold">300 KB</span>
            <span>500 KB</span>
            <span>800 KB</span>
          </div>
        </div>
      )}

      {/* 2. Format Selection (WebP vs PNG) */}
      <div className="space-y-2.5 pt-3 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold text-zinc-800 dark:text-zinc-200">
            SVG Raster Packaging Format:
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* WebP */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleFormatChange('image/webp')}
            className={`flex flex-col text-left p-3 rounded-xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
              isWebp
                ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 ring-1 ring-red-500'
                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/50'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-bold text-zinc-900 dark:text-white">WebP Stream</span>
              {isWebp && <Check className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />}
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-normal">
              Best compression. Preserves alpha transparency while fitting tight targets.
            </p>
          </button>

          {/* PNG */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleFormatChange('image/png')}
            className={`flex flex-col text-left p-3 rounded-xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
              !isWebp
                ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 ring-1 ring-red-500'
                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/50'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-bold text-zinc-900 dark:text-white">PNG Stream</span>
              {!isWebp && <Check className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />}
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-normal">
              Universal legacy SVG viewer compatibility. Optimizes via resolution downscaling.
            </p>
          </button>
        </div>
      </div>

      {/* 3. Manual Override Toggle & Sliders */}
      <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <label
            htmlFor="manualOverrideCheckbox"
            className="text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer flex items-center gap-1.5"
          >
            <span>Manual Quality &amp; Scale Override</span>
          </label>
          <input
            id="manualOverrideCheckbox"
            type="checkbox"
            checked={!isAuto}
            disabled={disabled}
            onChange={(e) =>
              onChange({
                mode: e.target.checked ? 'manual' : 'auto',
              })
            }
            className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 cursor-pointer"
          />
        </div>

        {!isAuto && (
          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 space-y-3">
            {/* Manual Quality Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-500 dark:text-zinc-400">
                  {isWebp ? 'WebP Compression Quality' : 'PNG Compression (Lossless standard)'}
                </span>
                <span className="font-mono font-semibold text-red-600 dark:text-amber-400">
                  {isWebp ? `${settings.manualQuality}%` : '100%'}
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                disabled={disabled || !isWebp}
                value={settings.manualQuality}
                onChange={(e) => onChange({ manualQuality: parseInt(e.target.value, 10) })}
                className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer disabled:opacity-50"
                aria-label="Manual compression quality percentage"
              />
              {!isWebp && (
                <p className="text-[10px] text-zinc-400 mt-1">
                  PNG format does not support lossy quality reduction; quality is fixed at 100%.
                </p>
              )}
            </div>

            {/* Manual Resolution Scale Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-500 dark:text-zinc-400">Resolution Scale</span>
                <span className="font-mono font-semibold text-red-600 dark:text-amber-400">
                  {settings.manualScale}%
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="100"
                disabled={disabled}
                value={settings.manualScale}
                onChange={(e) => onChange({ manualScale: parseInt(e.target.value, 10) })}
                className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
                aria-label="Manual resolution scale percentage"
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
