import { describe, it, expect } from 'vitest';
import {
  buildSvgMarkup,
  getSvgByteLength,
  validateSvgXml,
} from '../src/features/converter/services/svg-generator';

describe('buildSvgMarkup', () => {
  it('generates valid SVG markup containing xml header and viewBox', () => {
    const dataUrl =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const svg = buildSvgMarkup({
      dataUrl,
      width: 800,
      height: 600,
      title: 'Test Logo',
    });

    expect(svg).toContain('<?xml version="1.0" encoding="UTF-8" standalone="no"?>');
    expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('viewBox="0 0 800 600"');
    expect(svg).toContain('<title>Test Logo</title>');
    expect(svg).toContain(`href="${dataUrl}"`);
  });

  it('safely escapes special characters in title and description', () => {
    const dataUrl = 'data:image/png;base64,123';
    const svg = buildSvgMarkup({
      dataUrl,
      width: 100,
      height: 100,
      title: 'Logo & <Brand> "Test"',
      description: 'Dangerous <script>alert(1)</script>',
    });

    expect(svg).toContain('<title>Logo &amp; &lt;Brand&gt; &quot;Test&quot;</title>');
    expect(svg).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(svg).not.toContain('<script>');
  });

  it('passes DOMParser XML validation', () => {
    const dataUrl = 'data:image/png;base64,123';
    const svg = buildSvgMarkup({
      dataUrl,
      width: 200,
      height: 200,
      title: 'Valid SVG',
    });

    const validation = validateSvgXml(svg);
    expect(validation.isValid).toBe(true);
    expect(validation.error).toBeUndefined();
  });

  it('measures byte length accurately', () => {
    const svg = '<svg width="10" height="10"></svg>';
    const bytes = getSvgByteLength(svg);
    expect(bytes).toBe(svg.length);
  });
});
