/**
 * Escapes characters that have special meaning in XML/HTML.
 * Ensures that file names or metadata cannot corrupt SVG structure or inject unsafe content.
 */
export function escapeXml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Cleans an input filename to produce a safe base name without extension.
 * Replaces illegal filename characters and limits length.
 */
export function sanitizeBaseFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    return 'xakuvector-output';
  }

  // Remove extension if present and trim whitespace
  const withoutExt = filename.replace(/\.[^/.]+$/, '').trim();

  // Strip dangerous path and filesystem characters, replace whitespace with underscore
  const cleaned = withoutExt
    // eslint-disable-next-line no-control-regex
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/^_+|_+$/g, '')
    .trim();

  // If empty after stripping, provide fallback
  if (!cleaned) {
    return 'xakuvector-output';
  }

  // Limit length to 64 chars
  return cleaned.slice(0, 64);
}
