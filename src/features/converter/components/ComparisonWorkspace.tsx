import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Move, Eye, Columns, ImageIcon } from 'lucide-react';
import { ImageSourceData, OptimizationResult, PreviewBackground, ViewMode } from '../types';
import { ImagePreview } from './ImagePreview';
import { Card } from '../../../components/ui/Card';

interface ComparisonWorkspaceProps {
  sourceImage: ImageSourceData | null;
  result: OptimizationResult | null;
  viewMode: ViewMode;
  previewBg: PreviewBackground;
  zoom?: number;
  pan?: { x: number; y: number };
  isProcessing: boolean;
  onViewModeChange: (mode: ViewMode) => void;
  onPreviewBgChange: (bg: PreviewBackground) => void;
  onToggleZoom?: () => void;
  onZoomChange?: (zoom: number | ((prev: number) => number)) => void;
  onPanChange?: (
    pan: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })
  ) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetTransform?: () => void;
}

const ComparisonWorkspaceComponent: React.FC<ComparisonWorkspaceProps> = ({
  sourceImage,
  result,
  viewMode,
  previewBg,
  zoom: controlledZoom,
  pan: controlledPan,
  isProcessing,
  onViewModeChange,
  onPreviewBgChange,
  onToggleZoom,
  onZoomChange,
  onPanChange,
  onZoomIn,
  onZoomOut,
  onResetTransform,
}) => {
  const [internalZoom, setInternalZoom] = useState(1);
  const [internalPan, setInternalPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const activeZoom = controlledZoom !== undefined ? controlledZoom : internalZoom;
  const activePan = controlledPan !== undefined ? controlledPan : internalPan;

  const handleZoomUpdate = useCallback(
    (updater: number | ((prev: number) => number)) => {
      if (onZoomChange) {
        onZoomChange(updater);
      } else {
        setInternalZoom(updater);
      }
    },
    [onZoomChange]
  );

  const handlePanUpdate = useCallback(
    (
      updater:
        | { x: number; y: number }
        | ((prev: { x: number; y: number }) => { x: number; y: number })
    ) => {
      if (onPanChange) {
        onPanChange(updater);
      } else {
        setInternalPan(updater);
      }
    },
    [onPanChange]
  );

  const handleZoomIn = useCallback(() => {
    if (onZoomIn) {
      onZoomIn();
    } else {
      handleZoomUpdate((prev) => Math.min(8.0, Math.round(prev * 1.25 * 100) / 100));
    }
  }, [onZoomIn, handleZoomUpdate]);

  const handleZoomOut = useCallback(() => {
    if (onZoomOut) {
      onZoomOut();
    } else {
      handleZoomUpdate((prev) => Math.max(0.25, Math.round((prev / 1.25) * 100) / 100));
    }
  }, [onZoomOut, handleZoomUpdate]);

  const handleResetTransform = useCallback(() => {
    if (onResetTransform) {
      onResetTransform();
    } else {
      handleZoomUpdate(1);
      handlePanUpdate({ x: 0, y: 0 });
    }
  }, [onResetTransform, handleZoomUpdate, handlePanUpdate]);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const initialPinchDistRef = useRef(0);
  const initialZoomRef = useRef(1);

  // Non-passive wheel event listener on container so scrolling zooms without scrolling page
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.15 : 0.87;
      handleZoomUpdate((prev) =>
        Math.min(8.0, Math.max(0.25, Math.round(prev * factor * 100) / 100))
      );
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleZoomUpdate]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Right click (button 2) or left click (button 0)
    if (e.button === 2 || e.button === 0) {
      isDraggingRef.current = true;
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        panX: activePan.x,
        panY: activePan.y,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    handlePanUpdate({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy,
    });
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    // Suppress context menu to allow smooth right-click panning
    e.preventDefault();
  };

  const handleDoubleClick = () => {
    handleResetTransform();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        panX: activePan.x,
        panY: activePan.y,
      };
    } else if (e.touches.length === 2) {
      isDraggingRef.current = false;
      setIsDragging(false);
      initialPinchDistRef.current = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialZoomRef.current = activeZoom;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDraggingRef.current) {
      const dx = e.touches[0].clientX - dragStartRef.current.x;
      const dy = e.touches[0].clientY - dragStartRef.current.y;
      handlePanUpdate({
        x: dragStartRef.current.panX + dx,
        y: dragStartRef.current.panY + dy,
      });
    } else if (e.touches.length === 2 && initialPinchDistRef.current > 0) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = currentDist / initialPinchDistRef.current;
      const newZoom = Math.min(
        8.0,
        Math.max(0.25, Math.round(initialZoomRef.current * scale * 100) / 100)
      );
      handleZoomUpdate(newZoom);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      initialPinchDistRef.current = 0;
    }
    if (e.touches.length === 0) {
      isDraggingRef.current = false;
      setIsDragging(false);
    }
  };

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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 ${
                viewMode === 'split'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 ${
                viewMode === 'svg-only'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 ${
                viewMode === 'original-only'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Original</span>
            </button>
          </div>

          {/* Interactive Zoom & Pan Controls */}
          <div
            className="inline-flex items-center rounded-xl bg-zinc-200/80 dark:bg-zinc-800/80 p-0.5 text-xs shadow-inner"
            role="group"
            aria-label="Preview zoom and pan controls"
          >
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={activeZoom <= 0.25}
              className="p-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-900 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
              title="Zoom out"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onToggleZoom ? onToggleZoom : handleResetTransform}
              className="px-2.5 py-1 font-mono font-bold text-xs text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-900 rounded-lg transition cursor-pointer"
              title="Toggle preview zoom level"
              aria-label={`Current preview zoom is ${activeZoom}x. Click to toggle or reset.`}
            >
              {activeZoom === 1 || activeZoom === 1.5 || activeZoom === 2.25
                ? `${activeZoom}x`
                : `${Math.round(activeZoom * 100)}%`}
            </button>

            <button
              type="button"
              onClick={handleZoomIn}
              disabled={activeZoom >= 8.0}
              className="p-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-900 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
              title="Zoom in"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            {(activeZoom !== 1 || activePan.x !== 0 || activePan.y !== 0) && (
              <button
                type="button"
                onClick={handleResetTransform}
                className="p-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-900 transition cursor-pointer"
                title="Reset view"
                aria-label="Reset view"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

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
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 ${
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
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 ${
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
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 ${
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
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onContextMenu={handleContextMenu}
        onDoubleClick={handleDoubleClick}
        className={`grid select-none touch-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } ${
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
            zoom={activeZoom}
            pan={activePan}
            isDragging={isDragging}
            previewBg={previewBg}
          />
        )}

        {(viewMode === 'split' || viewMode === 'svg-only') && (
          <ImagePreview
            type="svg"
            sourceImage={sourceImage}
            result={result}
            zoom={activeZoom}
            pan={activePan}
            isDragging={isDragging}
            previewBg={previewBg}
            isProcessing={isProcessing}
          />
        )}
      </div>

      {/* Navigation Helper Footer */}
      <div className="px-4 py-2 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50 flex flex-wrap items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 gap-2">
        <span className="flex items-center gap-1.5">
          <Move className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
          <span>Right-click or touch drag to pan everywhere</span>
        </span>
        <span>Scroll mouse or pinch hand to zoom • Double-click to reset</span>
      </div>
    </Card>
  );
};

export const ComparisonWorkspace = React.memo(ComparisonWorkspaceComponent);
