import { describe, it, expect } from 'vitest';
import { escapeXml, sanitizeBaseFilename } from '../src/features/converter/utils/filename-utils';

describe('escapeXml', () => {
  it('escapes special XML characters correctly', () => {
    const input = '<div class="test" data-id=\'1\' & value="foo & bar">';
    const expected =
      '&lt;div class=&quot;test&quot; data-id=&apos;1&apos; &amp; value=&quot;foo &amp; bar&quot;&gt;';
    expect(escapeXml(input)).toBe(expected);
  });

  it('handles empty or null string gracefully', () => {
    expect(escapeXml('')).toBe('');
    // @ts-expect-error testing invalid type
    expect(escapeXml(null)).toBe('');
  });

  it('preserves clean alphanumeric text without alterations', () => {
    expect(escapeXml('SimpleLogo123')).toBe('SimpleLogo123');
  });
});

describe('sanitizeBaseFilename', () => {
  it('removes extension from simple filenames', () => {
    expect(sanitizeBaseFilename('my-logo.png')).toBe('my-logo');
    expect(sanitizeBaseFilename('banner.photo.webp')).toBe('banner.photo');
  });

  it('sanitizes illegal path and OS characters', () => {
    expect(sanitizeBaseFilename('../../secret:file?.png')).toBe('.._.._secret_file');
  });

  it('provides a safe fallback for empty or whitespace names', () => {
    expect(sanitizeBaseFilename('')).toBe('xakuvector-output');
    expect(sanitizeBaseFilename('   .png')).toBe('xakuvector-output');
  });

  it('caps the filename length to 64 characters', () => {
    const longName = 'a'.repeat(100) + '.png';
    const result = sanitizeBaseFilename(longName);
    expect(result.length).toBeLessThanOrEqual(64);
  });
});
