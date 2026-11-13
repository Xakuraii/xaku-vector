import React from 'react';
import { ZoomIn, Eye, Columns, ImageIcon } from 'lucide-react';
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

const ComparisonWorkspaceComponent: React.FC<ComparisonWorkspaceProps> = ({
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
            Preview stage
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
            className="inline-flex rounded-xl bg-zinc-200/80 dark:bg-zinc-800/80 p-0.5 text-xs shadow-inner"
            role="group"
            aria-label="Preview display layout"
          >
            <button
              type="button"
              onClick={() => onViewModeChange('split')}
              aria-pressed={viewMode === 'split'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 ${
                viewMode === 'split'
                  ? 'bg-white dark:bg-zinc-900 text-red-600 dark:text-red-400 shadow-sm'
                  : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split</span>
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange('svg-only')}
              aria-pressed={viewMode === 'svg-only'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 ${
                viewMode === 'svg-only'
                  ? 'bg-white dark:bg-zinc-900 text-red-600 dark:text-red-400 shadow-sm'
                  : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>SVG Only</span>
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange('original-only')}
              aria-pressed={viewMode === 'original-only'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 ${
                viewMode === 'original-only'
                  ? 'bg-white dark:bg-zinc-900 text-red-600 dark:text-red-400 shadow-sm'
                  : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Original</span>
            </button>
          </div>

          {/* Zoom Toggle */}
          <button
            type="button"
            onClick={onToggleZoom}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700/70 transition shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
            title="Toggle preview zoom level"
            aria-label={`Current preview zoom is ${zoom}x. Click to zoom in.`}
          >
            <ZoomIn className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            <span>{zoom}x</span>
          </button>

          {/* Background Switcher */}
          <div
            className="inline-flex rounded-xl bg-zinc-200/80 dark:bg-zinc-800/80 p-0.5 text-xs shadow-inner"
            role="group"
            aria-label="Preview background switcher"
          >
            <button
              type="button"
              onClick={() => onPreviewBgChange('checker')}
              aria-pressed={previewBg === 'checker'}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 ${
                previewBg === 'checker'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm font-semibold'
                  : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
              }`}
              title="Checkerboard background for inspecting transparency"
            >
              Grid
            </button>
            <button
              type="button"
              onClick={() => onPreviewBgChange('dark')}
              aria-pressed={previewBg === 'dark'}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 ${
                previewBg === 'dark'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm font-semibold'
                  : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
              }`}
              title="Solid dark background"
            >
              Dark
            </button>
            <button
              type="button"
              onClick={() => onPreviewBgChange('light')}
              aria-pressed={previewBg === 'light'}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 ${
                previewBg === 'light'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm font-semibold'
                  : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
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
        className={`grid ${
          viewMode === 'split'
            ? 'grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800'
            : 'grid-cols-1'
        }`}
      >
        {(viewMode === 'split' || viewMode === 'original-only') && (
          <ImagePreview
            type="original"
            sourceImage={sourceImage}
            result={result}
            zoom={zoom}
            previewBg={previewBg}
          />
        )}

        {(viewMode === 'split' || viewMode === 'svg-only') && (
          <ImagePreview
            type="svg"
            sourceImage={sourceImage}
            result={result}
            zoom={zoom}
            previewBg={previewBg}
            isProcessing={isProcessing}
          />
        )}
      </div>
    </Card>
  );
};

export const ComparisonWorkspace = React.memo(ComparisonWorkspaceComponent);
