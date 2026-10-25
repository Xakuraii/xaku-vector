import React, { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { formatBytes } from '../utils/format-utils';

interface SvgCodeInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  svgString: string;
  byteLength: number;
  filename: string;
}

export const SvgCodeInspector: React.FC<SvgCodeInspectorProps> = ({
  isOpen,
  onClose,
  svgString,
  byteLength,
  filename,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(svgString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const lineCount = svgString ? svgString.split('\n').length : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="SVG Source Inspector"
      description={`Valid W3C Scalable Vector Graphics XML (${formatBytes(byteLength)}, ${lineCount} lines)`}
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            <Code2 className="w-4 h-4 text-red-500" />
            <span>{filename}.svg</span>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            leftIcon={
              copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )
            }
          >
            {copied ? 'Copied XML' : 'Copy XML'}
          </Button>
        </div>

        {/* Code Content */}
        <div className="relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-zinc-100">
          <textarea
            readOnly
            value={svgString}
            rows={14}
            className="w-full p-4 font-mono text-[11px] leading-relaxed bg-transparent resize-y focus:outline-none focus:ring-1 focus:ring-red-500 text-zinc-300"
            aria-label="Generated SVG raw XML code"
          />
        </div>

        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
          This SVG contains a base64 raster data stream. You can embed it directly into HTML with{' '}
          <code className="text-zinc-700 dark:text-zinc-300">
            &lt;img src=&quot;...svg&quot;&gt;
          </code>{' '}
          or paste the markup inline.
        </p>
      </div>
    </Modal>
  );
};
