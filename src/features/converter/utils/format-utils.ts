/**
 * Formats a byte number into human-readable B, KB, or MB.
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;

  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(decimals)} KB`;
  }

  const mb = kb / 1024;
  return `${mb.toFixed(decimals)} MB`;
}

/**
 * Calculates percentage size savings or increase relative to original bytes.
 */
export function calculateSavings(
  originalBytes: number,
  outputBytes: number
): { percent: number; isReduction: boolean; text: string } {
  if (originalBytes <= 0 || outputBytes <= 0) {
    return { percent: 0, isReduction: false, text: 'No change' };
  }

  const diff = originalBytes - outputBytes;
  const percent = Math.abs(Math.round((diff / originalBytes) * 100));

  if (diff > 0) {
    return { percent, isReduction: true, text: `-${percent}% smaller` };
  } else if (diff < 0) {
    return { percent, isReduction: false, text: `+${percent}% larger` };
  }

  return { percent: 0, isReduction: false, text: 'Exact same size' };
}

/**
 * Formats width and height into dimension label.
 */
export function formatDimensions(w: number, h: number): string {
  if (w <= 0 || h <= 0) return '—';
  return `${Math.round(w)} × ${Math.round(h)} px`;
}

/**
 * Formats 0.0 - 1.0 fraction to percentage string.
 */
export function formatPercentage(value: number): string {
  const clamped = Math.max(0, Math.min(1, value));
  return `${Math.round(clamped * 100)}%`;
}
