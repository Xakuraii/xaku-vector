import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, RefreshCw, Trash2, AlertCircle } from 'lucide-react';
import { ImageSourceData } from '../types';
import { formatBytes, formatDimensions } from '../utils/format-utils';
import { Button } from '../../../components/ui/Button';

interface UploadDropzoneProps {
  sourceImage: ImageSourceData | null;
  onFileSelected: (file: File) => void;
  onRemoveImage: () => void;
  errorMessage?: string | null;
  warningMessage?: string | null;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  sourceImage,
  onFileSelected,
  onRemoveImage,
  errorMessage,
  warningMessage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
      // Reset input value so re-selecting same file triggers change
      e.target.value = '';
    }
  };

  const triggerBrowse = () => {
    fileInputRef.current?.click();
  };

  return (
    <div id="converter" className="w-full space-y-3">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/webp,image/jpeg"
        onChange={handleFileInputChange}
        className="hidden"
        aria-label="Upload image file"
      />

      {/* When Image Is Loaded: Compact Header Bar */}
      {sourceImage ? (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-900/40 flex items-center justify-center shrink-0">
              <ImageIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 truncate max-w-[200px] sm:max-w-xs">
                  {sourceImage.name}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  {sourceImage.mimeType.replace('image/', '')}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                <span>{formatBytes(sourceImage.byteLength)}</span>
                <span>•</span>
                <span>{formatDimensions(sourceImage.width, sourceImage.height)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={triggerBrowse}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Replace
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemoveImage}
              aria-label="Remove image"
              className="text-red-500 hover:text-red-600 dark:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerBrowse}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              triggerBrowse();
            }
          }}
          className={`relative rounded-2xl border-2 border-dashed p-6 sm:p-10 text-center cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
            isDragOver
              ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 scale-[0.99]'
              : 'border-zinc-300 dark:border-zinc-700/80 hover:border-red-500/80 dark:hover:border-red-500/80 bg-white/60 dark:bg-zinc-900/40 hover:bg-zinc-50 dark:hover:bg-zinc-900/70 shadow-sm'
          }`}
        >
          <div className="max-w-md mx-auto flex flex-col items-center space-y-3 pointer-events-none">
            <div className="w-12 h-12 rounded-2xl bg-red-100/80 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400">
              <UploadCloud className="w-6 h-6" />
            </div>

            <div>
              <p className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
                Drop your image here{' '}
                <span className="font-normal text-zinc-500 dark:text-zinc-400">or</span>{' '}
                <span className="text-red-600 dark:text-red-400 underline decoration-red-400/40 hover:decoration-red-400">
                  choose from your device
                </span>
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                PNG, WebP, or JPEG. Select a file to get started.
              </p>
            </div>

            <div className="pt-1 flex flex-wrap items-center justify-center gap-2">
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                Pro tip: Press{' '}
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 font-mono text-[10px]">
                  Ctrl+V
                </kbd>{' '}
                to paste from clipboard
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Error Announcement */}
      {errorMessage && (
        <div
          role="alert"
          className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-xs text-red-700 dark:text-red-400 font-medium"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Warning Announcement */}
      {warningMessage && (
        <div
          role="status"
          className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-700 dark:text-amber-400 font-medium"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{warningMessage}</span>
        </div>
      )}
    </div>
  );
};
