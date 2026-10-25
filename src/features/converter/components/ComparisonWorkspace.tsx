import React from 'react';
import { ZoomIn, Eye, Columns } from 'lucide-react';
import { ImageSourceData, OptimizationResult, PreviewBackground, ViewMode } from '../types';
import { ImagePreview } from './ImagePreview';
import { Card } from '../../../components/ui/Card';

interface ComparisonWorkspaceProps {
  sourceImage: ImageSourceData | null;
  result: OptimizationResult | null;
  viewMode: ViewMode;
  previewBg: PreviewBackground;
  zoom: number;
  isProcessing: boolean;
  onViewModeChange: (mode: ViewMode) => void;
  onPreviewBgChange: (bg: PreviewBackground) => void;
  onToggleZoom: () => void;
}

export const ComparisonWorkspace: React.FC<ComparisonWorkspaceProps> = ({
  sourceImage,
  result,
  viewMode,
  previewBg,
  zoom,
  isProcessing,
  onViewModeChange,
  onPreviewBgChange,
  onToggleZoom,
}) => {
  return (
    <Card className="overflow-hidden">
      {/* Workspace Toolbar */}
      <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 bg-zinc-50/70 dark:bg-zinc-950/70">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
            Preview Stage
          </span>
          {isProcessing && (
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 rounded-full animate-pulse border border-amber-200 dark:border-amber-900/50">
              Encoding...
            </span>
          )}
        </div>

        {/* View Mode & View Background Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Switcher */}
          <div
            className="inline-flex rounded-xl bg-zinc-200/80 dark:bg-zinc-800/80 p-0.5 text-xs"
            role="group"
            aria-label="Preview display layout"
          >
            <button
              type="button"
              onClick={() => onViewModeChange('split')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                viewMode === 'split'
                  ? 'bg-white dark:bg-zinc-900 text-red-600 dark:text-red-400 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split</span>
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange('svg-only')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                viewMode === 'svg-only'
                  ? 'bg-white dark:bg-zinc-900 text-red-600 dark:text-red-400 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>SVG Only</span>
            </button>
          </div>

          {/* Zoom Toggle */}
          <button
            type="button"
            onClick={onToggleZoom}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700/70 transition"
            title="Toggle preview zoom level"
          >
            <ZoomIn className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            <span>{zoom}x</span>
          </button>

          {/* Background Switcher */}
          <div
            className="inline-flex rounded-xl bg-zinc-200/80 dark:bg-zinc-800/80 p-0.5 text-xs"
            role="group"
            aria-label="Preview background switcher"
          >
            <button
              type="button"
              onClick={() => onPreviewBgChange('checker')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition ${
                previewBg === 'checker'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
              title="Checkerboard background for inspecting transparency"
            >
              Grid
            </button>
            <button
              type="button"
              onClick={() => onPreviewBgChange('dark')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition ${
                previewBg === 'dark'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
              title="Solid dark background"
            >
              Dark
            </button>
            <button
              type="button"
              onClick={() => onPreviewBgChange('light')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition ${
                previewBg === 'light'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
              title="Solid light background"
            >
              Light
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Stage Grid */}
      <div
        className={`grid divide-y md:divide-y-0 ${
          viewMode === 'split'
            ? 'grid-cols-1 md:grid-cols-2 md:divide-x divide-zinc-200 dark:divide-zinc-800'
            : 'grid-cols-1'
        }`}
      >
        {viewMode === 'split' && (
          <ImagePreview
            type="original"
            sourceImage={sourceImage}
            result={result}
            zoom={zoom}
            previewBg={previewBg}
          />
        )}

        <ImagePreview
          type="svg"
          sourceImage={sourceImage}
          result={result}
          zoom={zoom}
          previewBg={previewBg}
          isProcessing={isProcessing}
        />
      </div>
    </Card>
  );
};
