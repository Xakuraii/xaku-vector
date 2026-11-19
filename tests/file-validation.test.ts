import { describe, it, expect } from 'vitest';
import { validateImageFile } from '../src/features/converter/utils/file-validation';

describe('validateImageFile', () => {
  it('rejects null or undefined files', () => {
    expect(validateImageFile(null).valid).toBe(false);
    expect(validateImageFile(undefined).valid).toBe(false);
  });

  it('rejects zero-byte files', () => {
    const emptyFile = new File([], 'empty.png', { type: 'image/png' });
    const result = validateImageFile(emptyFile);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('empty');
  });

  it('accepts valid PNG file', () => {
    const file = new File(['dummy-bytes-data'], 'logo.png', { type: 'image/png' });
    const result = validateImageFile(file);
    expect(result.valid).toBe(true);
  });

  it('accepts valid WebP file', () => {
    const file = new File(['dummy-bytes-data'], 'image.webp', { type: 'image/webp' });
    const result = validateImageFile(file);
    expect(result.valid).toBe(true);
  });

  it('accepts valid JPEG file', () => {
    const file = new File(['dummy-bytes-data'], 'photo.jpg', { type: 'image/jpeg' });
    const result = validateImageFile(file);
    expect(result.valid).toBe(true);
  });

  it('accepts valid GIF file', () => {
    const file = new File(['dummy-bytes-data'], 'animation.gif', { type: 'image/gif' });
    const result = validateImageFile(file);
    expect(result.valid).toBe(true);
  });

  it('accepts valid AVIF file', () => {
    const file = new File(['dummy-bytes-data'], 'picture.avif', { type: 'image/avif' });
    const result = validateImageFile(file);
    expect(result.valid).toBe(true);
  });

  it('accepts valid BMP file', () => {
    const file = new File(['dummy-bytes-data'], 'bitmap.bmp', { type: 'image/bmp' });
    const result = validateImageFile(file);
    expect(result.valid).toBe(true);
  });

  it('accepts valid ICO file', () => {
    const file = new File(['dummy-bytes-data'], 'favicon.ico', { type: 'image/x-icon' });
    const result = validateImageFile(file);
    expect(result.valid).toBe(true);
  });

  it('accepts valid SVG file', () => {
    const file = new File(['<svg></svg>'], 'vector.svg', { type: 'image/svg+xml' });
    const result = validateImageFile(file);
    expect(result.valid).toBe(true);
  });

  it('rejects unsupported files like txt or pdf', () => {
    const file = new File(['hello'], 'document.pdf', { type: 'application/pdf' });
    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Unsupported');
  });
});
