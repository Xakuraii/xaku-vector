import React, { useMemo } from 'react';
import { ImageSourceData, OptimizationResult, PreviewBackground } from '../types';

interface ImagePreviewProps {
  type: 'original' | 'svg';
  sourceImage: ImageSourceData | null;
  result: OptimizationResult | null;
  zoom: number;
  previewBg: PreviewBackground;
  isProcessing?: boolean;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  type,
  sourceImage,
  result,
  zoom,
  previewBg,
  isProcessing = false,
}) => {
  // Compute safe data URL for SVG preview
  const svgDataUrl = useMemo(() => {
    if (type !== 'svg' || !result?.svgString) return null;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(result.svgString)}`;
  }, [type, result]);

  const bgStyles = {
    checker: 'bg-checkerboard-adaptive',
    dark: 'bg-[#09090b]',
    light: 'bg-white',
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-between p-4 min-h-[340px] sm:min-h-[400px] overflow-hidden transition-colors ${bgStyles[previewBg]}`}
    >
      {/* Top Pane Badge */}
      <div className="w-full flex items-center justify-between z-10 mb-2">
        <span className="px-2.5 py-1 rounded-md bg-white/90 dark:bg-zinc-950/90 border border-zinc-200/90 dark:border-zinc-800 text-[11px] font-bold text-zinc-800 dark:text-zinc-200 shadow-sm backdrop-blur-sm">
          {type === 'original' ? 'Original Input' : 'Live Generated .SVG'}
        </span>

        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-zinc-100/90 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
          {type === 'original'
            ? `${sourceImage?.width || 0} × ${sourceImage?.height || 0} px`
            : `${result ? (result.byteLength / 1024).toFixed(1) : 0} KB SVG`}
        </span>
      </div>

      {/* Center Image Rendering Container */}
      <div className="my-auto flex items-center justify-center w-full h-72 sm:h-80 overflow-auto p-2">
        {type === 'original' && sourceImage ? (
          <img
            src={sourceImage.dataUrl}
            alt="Original input graphic"
            style={{ transform: `scale(${zoom})` }}
            className="max-h-full max-w-full object-contain transition-transform duration-150 select-none"
          />
        ) : type === 'svg' && svgDataUrl ? (
          <div
            style={{ transform: `scale(${zoom})` }}
            className="w-full h-full flex items-center justify-center transition-transform duration-150 select-none"
          >
            <img
              src={svgDataUrl}
              alt="Live rendered SVG output"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ) : (
          <div className="text-center p-6 space-y-2 pointer-events-none select-none">
            <div className="w-10 h-10 mx-auto rounded-xl bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500">
              {type === 'original' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              )}
            </div>
            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              {type === 'original' ? 'Original Preview Stage' : 'Generated SVG Stage'}
            </div>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 max-w-xs">
              {type === 'original'
                ? 'Drop an image or paste from clipboard to view'
                : 'Live SVG rendering will appear here'}
            </p>
          </div>
        )}
      </div>

      {/* Processing Overlay if currently optimizing */}
      {isProcessing && type === 'svg' && (
        <div className="absolute inset-0 bg-zinc-950/20 backdrop-blur-[1px] flex items-center justify-center z-20">
          <span className="px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 shadow-lg animate-pulse">
            Optimizing size...
          </span>
        </div>
      )}
    </div>
  );
};
