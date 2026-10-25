import React from 'react';
import { Download, Copy, Check, Code, RefreshCw } from 'lucide-react';
import { OptimizationResult } from '../types';
import { formatBytes } from '../utils/format-utils';
import { Button } from '../../../components/ui/Button';

interface OutputActionsProps {
  result: OptimizationResult | null;
  filename: string;
  isProcessing: boolean;
  copySuccess: boolean;
  onDownload: () => void;
  onCopy: () => void;
  onInspect: () => void;
  onReprocess: () => void;
}

export const OutputActions: React.FC<OutputActionsProps> = ({
  result,
  filename,
  isProcessing,
  copySuccess,
  onDownload,
  onCopy,
  onInspect,
  onReprocess,
}) => {
  const isAvailable = Boolean(result?.svgString) && !isProcessing;
  const sizeLabel = result ? formatBytes(result.byteLength) : '';
  const downloadText = result
    ? `Download .SVG (${filename}.svg — ${sizeLabel})`
    : 'Download .SVG File';

  return (
    <div className="space-y-3 pt-2">
      {/* Primary Download Button */}
      <Button
        variant="primary"
        size="lg"
        disabled={!isAvailable}
        isLoading={isProcessing}
        onClick={onDownload}
        className="w-full text-sm sm:text-base py-3.5 shadow-lg shadow-red-600/20"
        leftIcon={<Download className="w-5 h-5" />}
      >
        <span>{downloadText}</span>
      </Button>

      {/* Secondary Quick Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={!isAvailable}
          onClick={onCopy}
          leftIcon={
            copySuccess ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4 text-amber-500" />
            )
          }
        >
          <span>{copySuccess ? 'Copied to Clipboard!' : 'Copy SVG Code'}</span>
        </Button>

        <Button
          variant="secondary"
          size="sm"
          disabled={!isAvailable}
          onClick={onInspect}
          leftIcon={<Code className="w-4 h-4 text-red-500" />}
        >
          <span>Inspect SVG XML</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={!isAvailable}
          onClick={onReprocess}
          leftIcon={<RefreshCw className="w-4 h-4 text-zinc-500" />}
        >
          <span>Re-optimize</span>
        </Button>
      </div>
    </div>
  );
};
