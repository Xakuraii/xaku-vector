import { describe, it, expect } from 'vitest';
import {
  formatBytes,
  calculateSavings,
  formatDimensions,
  formatPercentage,
} from '../src/features/converter/utils/format-utils';

describe('formatBytes', () => {
  it('formats small bytes properly', () => {
    expect(formatBytes(500)).toBe('500 B');
  });

  it('formats kilobytes with precision', () => {
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(300 * 1024)).toBe('300.0 KB');
  });

  it('formats megabytes properly', () => {
    expect(formatBytes(2.5 * 1024 * 1024)).toBe('2.5 MB');
  });

  it('handles zero and negative inputs safely', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(-100)).toBe('0 B');
  });
});

describe('calculateSavings', () => {
  it('calculates reduction percentage accurately', () => {
    const res = calculateSavings(1000, 400);
    expect(res.percent).toBe(60);
    expect(res.isReduction).toBe(true);
    expect(res.text).toBe('-60% smaller');
  });

  it('calculates increase percentage accurately', () => {
    const res = calculateSavings(500, 750);
    expect(res.percent).toBe(50);
    expect(res.isReduction).toBe(false);
    expect(res.text).toBe('+50% larger');
  });

  it('handles equal sizes', () => {
    const res = calculateSavings(500, 500);
    expect(res.percent).toBe(0);
    expect(res.text).toBe('Exact same size');
  });
});

describe('formatDimensions', () => {
  it('formats dimensions with units', () => {
    expect(formatDimensions(1920, 1080)).toBe('1920 × 1080 px');
  });

  it('handles invalid dimensions with a dash', () => {
    expect(formatDimensions(0, 0)).toBe('—');
  });
});

describe('formatPercentage', () => {
  it('formats ratios correctly', () => {
    expect(formatPercentage(0.92)).toBe('92%');
    expect(formatPercentage(1)).toBe('100%');
    expect(formatPercentage(0)).toBe('0%');
  });
});
