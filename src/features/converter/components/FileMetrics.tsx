import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { ConversionSettingsState, ImageSourceData, OptimizationResult } from '../types';
import { formatBytes, calculateSavings } from '../utils/format-utils';
import { Card } from '../../../components/ui/Card';

interface FileMetricsProps {
  sourceImage: ImageSourceData | null;
  result: OptimizationResult | null;
  settings: ConversionSettingsState;
}

export const FileMetrics: React.FC<FileMetricsProps> = ({ sourceImage, result, settings }) => {
  if (!sourceImage || !result) {
    return (
      <Card className="p-4 sm:p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
              Final .SVG Size
            </span>
            <div className="text-lg font-bold font-mono text-zinc-400 dark:text-zinc-600 mt-1">
              —
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Awaiting input</div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
              Input Image Size
            </span>
            <div className="text-lg font-bold font-mono text-zinc-400 dark:text-zinc-600 mt-1">
              —
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Awaiting input</div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
              SVG ViewBox
            </span>
            <div className="text-lg font-bold font-mono text-zinc-400 dark:text-zinc-600 mt-1">
              —
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Awaiting input</div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
              Raster Packaging
            </span>
            <div className="text-lg font-bold font-mono text-zinc-400 dark:text-zinc-600 mt-1">
              —
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Awaiting input</div>
          </div>
        </div>
      </Card>
    );
  }

  const svgKB = result.byteLength / 1024;
  const limitKB = settings.targetMaxKB;
  const isTargetMet = result.isTargetMet;
  const savings = calculateSavings(sourceImage.byteLength, result.byteLength);

  // Budget calculation
  const budgetRatio =
    settings.preset === 'unrestricted' ? 0 : Math.min(100, Math.round((svgKB / limitKB) * 100));

  return (
    <Card className="p-4 sm:p-5 space-y-4">
      {/* 4 Primary Telemetry Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1: Final SVG File Size */}
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/70 dark:border-zinc-800">
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium block">
            Generated .SVG Size
          </span>
          <div
            className={`text-lg sm:text-xl font-extrabold font-mono mt-0.5 ${
              isTargetMet
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-amber-600 dark:text-amber-400'
            }`}
          >
            {formatBytes(result.byteLength)}
          </div>
          <div className="flex items-center gap-1 text-[10px] font-semibold mt-0.5">
            {isTargetMet ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" />
                {settings.preset === 'unrestricted' ? 'Unrestricted' : `Under ${limitKB} KB Target`}
              </span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                <AlertTriangle className="w-3 h-3" />
                Closest achievable
              </span>
            )}
          </div>
        </div>

        {/* Metric 2: Original Input Size */}
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/70 dark:border-zinc-800">
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium block">
            Original Input Size
          </span>
          <div className="text-lg sm:text-xl font-bold font-mono text-zinc-800 dark:text-zinc-200 mt-0.5">
            {formatBytes(sourceImage.byteLength)}
          </div>
          <div
            className={`text-[10px] font-semibold mt-0.5 ${
              savings.isReduction
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-zinc-500 dark:text-zinc-400'
            }`}
          >
            {savings.text}
          </div>
        </div>

        {/* Metric 3: SVG ViewBox & Encoded Raster */}
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/70 dark:border-zinc-800">
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium block">
            SVG ViewBox / Raster
          </span>
          <div className="text-sm sm:text-base font-bold font-mono text-zinc-800 dark:text-zinc-200 mt-0.5">
            {sourceImage.width} × {sourceImage.height}
          </div>
          <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            Raster: {result.encodedWidth} × {result.encodedHeight} ({Math.round(result.scale * 100)}
            %)
          </div>
        </div>

        {/* Metric 4: Compression Fidelity */}
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/70 dark:border-zinc-800">
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium block">
            Embedded Format
          </span>
          <div className="text-sm sm:text-base font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
            {result.mimeTypeActuallyUsed === 'image/webp' ? 'WebP Data' : 'PNG Data'}
          </div>
          <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
            {result.mimeTypeActuallyUsed === 'image/webp'
              ? `Quality: ${Math.round(result.quality * 100)}%`
              : 'Lossless stream'}
          </div>
        </div>
      </div>

      {/* Budget Progress Bar */}
      {settings.preset !== 'unrestricted' && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-600 dark:text-zinc-400 font-medium">
              SVG File Size Budget:
            </span>
            <span
              className={`font-mono text-xs font-semibold ${
                isTargetMet
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {svgKB.toFixed(1)} KB / {limitKB} KB ({budgetRatio}%)
            </span>
          </div>

          <div
            className="w-full h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5"
            role="progressbar"
            aria-valuenow={budgetRatio}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="SVG file size budget consumption"
          >
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isTargetMet
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                  : 'bg-gradient-to-r from-amber-500 to-red-500'
              }`}
              style={{ width: `${Math.min(100, budgetRatio)}%` }}
            />
          </div>
        </div>
      )}
    </Card>
  );
};
