import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sliders, Zap, Check, AlertTriangle } from 'lucide-react';
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

  // Local immediate state for ultra-smooth 60fps slider dragging
  const [localTargetKB, setLocalTargetKB] = useState(settings.targetMaxKB);
  const [localQuality, setLocalQuality] = useState(settings.manualQuality);
  const [localScale, setLocalScale] = useState(settings.manualScale);

  const isInteractingTargetRef = useRef(false);
  const isInteractingQualityRef = useRef(false);
  const isInteractingScaleRef = useRef(false);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Synchronize local states when settings change from presets or external triggers
  useEffect(() => {
    if (!isInteractingTargetRef.current) {
      setLocalTargetKB(settings.targetMaxKB);
    }
  }, [settings.targetMaxKB]);

  useEffect(() => {
    if (!isInteractingQualityRef.current) {
      setLocalQuality(settings.manualQuality);
    }
  }, [settings.manualQuality]);

  useEffect(() => {
    if (!isInteractingScaleRef.current) {
      setLocalScale(settings.manualScale);
    }
  }, [settings.manualScale]);

  // Cleanup pending debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const commitDebouncedChange = useCallback(
    (updater: Partial<ConversionSettingsState>) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        onChange(updater);
        debounceTimerRef.current = null;
      }, 120);
    },
    [onChange]
  );

  const flushChange = useCallback(
    (updater: Partial<ConversionSettingsState>) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      onChange(updater);
    },
    [onChange]
  );

  const handlePresetClick = (presetId: OptimizationPreset, targetKB: number) => {
    isInteractingTargetRef.current = false;
    setLocalTargetKB(targetKB);
    flushChange({
      preset: presetId,
      targetMaxKB: targetKB,
      mode: 'auto',
    });
  };

  const calculateMatchingPreset = (val: number): OptimizationPreset => {
    if (val <= 75) return 50;
    if (val <= 200) return 150;
    if (val <= 400) return 300;
    return 500;
  };

  const handleTargetSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    isInteractingTargetRef.current = true;
    setLocalTargetKB(val);

    const matchingPreset = calculateMatchingPreset(val);
    commitDebouncedChange({
      targetMaxKB: val,
      preset: matchingPreset,
      mode: 'auto',
    });
  };

  const handleTargetSliderRelease = () => {
    isInteractingTargetRef.current = false;
    const matchingPreset = calculateMatchingPreset(localTargetKB);
    flushChange({
      targetMaxKB: localTargetKB,
      preset: matchingPreset,
      mode: 'auto',
    });
  };

  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    isInteractingQualityRef.current = true;
    setLocalQuality(val);
    commitDebouncedChange({ manualQuality: val });
  };

  const handleQualityRelease = () => {
    isInteractingQualityRef.current = false;
    flushChange({ manualQuality: localQuality });
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    isInteractingScaleRef.current = true;
    setLocalScale(val);
    commitDebouncedChange({ manualScale: val });
  };

  const handleScaleRelease = () => {
    isInteractingScaleRef.current = false;
    flushChange({ manualScale: localScale });
  };

  const handleFormatChange = (format: OutputFormat) => {
    flushChange({ format });
  };

  const isAtMaxLimit = localTargetKB >= 800;

  return (
    <Card className="p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 dark:bg-red-500"></span>
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            Conversion &amp; Size Budget
          </h2>
        </div>
        <Badge
          variant={isAuto ? 'amber' : 'default'}
          icon={
            isAuto ? <Zap className="w-3 h-3 text-amber-500" /> : <Sliders className="w-3 h-3" />
          }
        >
          {isAuto ? 'Auto-Optimizer ON' : 'Manual Mode'}
        </Badge>
      </div>

      {/* 1. Target Size Budget Presets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
            Target SVG File Size Budget:
          </span>
          <span className="font-mono font-bold text-red-600 dark:text-red-400">
            {settings.preset === 'unrestricted'
              ? 'Unrestricted (Max Quality)'
              : `${localTargetKB} KB limit`}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {PRESET_OPTIONS.map((opt) => {
            const isSelected = settings.preset === opt.id && isAuto;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handlePresetClick(opt.id, opt.targetKB)}
                className={`p-2.5 rounded-xl border text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 cursor-pointer ${
                  isSelected
                    ? 'border-red-600 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 shadow-sm ring-1 ring-red-600 font-semibold'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/40 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
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

      {/* Target Size Slider - ALWAYS stays visible and interactive so it never vanishes */}
      <div className="space-y-2 pt-1 bg-zinc-50/80 dark:bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80">
        <div className="flex justify-between items-center text-xs">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            Fine-Tune Target Size:
          </span>
          <div className="flex items-center gap-1.5">
            {isAtMaxLimit && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-800/60">
                Max Bound
              </span>
            )}
            <span
              className={`font-mono font-bold px-2 py-0.5 rounded border shadow-xs ${
                isAtMaxLimit
                  ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400'
                  : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-red-600 dark:text-red-400'
              }`}
            >
              {localTargetKB} KB
            </span>
          </div>
        </div>

        <div className="py-1">
          <input
            type="range"
            min="20"
            max="800"
            step="5"
            value={localTargetKB}
            onChange={handleTargetSliderChange}
            onPointerUp={handleTargetSliderRelease}
            onMouseUp={handleTargetSliderRelease}
            onTouchEnd={handleTargetSliderRelease}
            onKeyUp={handleTargetSliderRelease}
            className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg cursor-grab active:cursor-grabbing accent-red-600"
            aria-label="Target maximum file size in kilobytes"
          />
        </div>

        <div className="flex justify-between text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">20 KB (Min)</span>
          <span>50 KB</span>
          <span>150 KB</span>
          <span className="text-red-600 dark:text-red-400 font-semibold">300 KB</span>
          <span>500 KB</span>
          <span className={isAtMaxLimit ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}>
            800 KB
          </span>
        </div>

        {/* Warning banner when slider is at maximum limit */}
        {isAtMaxLimit && (
          <div className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-xl p-2.5 mt-2 transition-all">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold block">Maximum slider limit reached (800 KB)</span>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-normal">
                You cannot drag higher than 800 KB. To adjust the limit, slide back down to the
                left, or choose <strong>Max Quality</strong> above for unrestricted SVG packaging.
              </p>
            </div>
          </div>
        )}
      </div>

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
            onClick={() => handleFormatChange('image/webp')}
            className={`flex flex-col text-left p-3 rounded-xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 cursor-pointer ${
              isWebp
                ? 'border-red-600 bg-red-50/60 dark:bg-red-950/30 ring-1 ring-red-600 shadow-sm'
                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/50'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-bold text-zinc-900 dark:text-white">WebP Stream</span>
              {isWebp && <Check className="w-4 h-4 text-red-600 dark:text-red-400" />}
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-normal">
              Optimal compression. Preserves alpha transparency while meeting tight targets down to
              20 KB.
            </p>
          </button>

          {/* PNG */}
          <button
            type="button"
            onClick={() => handleFormatChange('image/png')}
            className={`flex flex-col text-left p-3 rounded-xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 cursor-pointer ${
              !isWebp
                ? 'border-red-600 bg-red-50/60 dark:bg-red-950/30 ring-1 ring-red-600 shadow-sm'
                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/50'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-bold text-zinc-900 dark:text-white">PNG Stream</span>
              {!isWebp && <Check className="w-4 h-4 text-red-600 dark:text-red-400" />}
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
            className="text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer flex items-center gap-2"
          >
            <span className="font-semibold">Manual Quality &amp; Scale Override</span>
          </label>
          <input
            id="manualOverrideCheckbox"
            type="checkbox"
            checked={!isAuto}
            disabled={disabled}
            onChange={(e) =>
              flushChange({
                mode: e.target.checked ? 'manual' : 'auto',
              })
            }
            className="w-4 h-4 rounded text-red-600 focus:ring-red-600 border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 cursor-pointer"
          />
        </div>

        {!isAuto && (
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 space-y-4">
            {/* Manual Quality Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-600 dark:text-zinc-400 font-medium">
                  {isWebp ? 'WebP Compression Quality' : 'PNG Compression (Lossless standard)'}
                </span>
                <span className="font-mono font-bold px-2 py-0.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-red-600 dark:text-red-400">
                  {isWebp ? `${localQuality}%` : '100%'}
                </span>
              </div>
              <div className="py-1">
                <input
                  type="range"
                  min="30"
                  max="100"
                  disabled={!isWebp}
                  value={localQuality}
                  onChange={handleQualityChange}
                  onPointerUp={handleQualityRelease}
                  onMouseUp={handleQualityRelease}
                  onTouchEnd={handleQualityRelease}
                  onKeyUp={handleQualityRelease}
                  className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg cursor-grab active:cursor-grabbing accent-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Manual compression quality percentage"
                />
              </div>
              {!isWebp && (
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  PNG format does not support lossy quality reduction; quality is fixed at 100%.
                </p>
              )}
            </div>

            {/* Manual Resolution Scale Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-600 dark:text-zinc-400 font-medium">
                  Resolution Scale
                </span>
                <span className="font-mono font-bold px-2 py-0.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-red-600 dark:text-red-400">
                  {localScale}%
                </span>
              </div>
              <div className="py-1">
                <input
                  type="range"
                  min="15"
                  max="100"
                  value={localScale}
                  onChange={handleScaleChange}
                  onPointerUp={handleScaleRelease}
                  onMouseUp={handleScaleRelease}
                  onTouchEnd={handleScaleRelease}
                  onKeyUp={handleScaleRelease}
                  className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg cursor-grab active:cursor-grabbing accent-red-600"
                  aria-label="Manual resolution scale percentage"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
