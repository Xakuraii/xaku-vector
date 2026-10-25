import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  optimizeImageToSvg,
  isWebpSupportedInCanvas,
} from '../src/features/converter/services/size-optimizer';
import { ConversionSettingsState, ImageSourceData } from '../src/features/converter/types';

describe('size-optimizer', () => {
  let mockSource: ImageSourceData;

  beforeEach(() => {
    // Setup mock canvas 2D context
    const mockCtx = {
      clearRect: vi.fn(),
      drawImage: vi.fn(),
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    };

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
      () => mockCtx as unknown as CanvasRenderingContext2D
    );
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockImplementation((type?: string) => {
      // Mock realistic data URLs
      const sizeMultiplier = type === 'image/png' ? 100 : 50;
      return `data:${type || 'image/png'};base64,${'A'.repeat(sizeMultiplier)}`;
    });

    const img = new Image();
    mockSource = {
      file: null,
      name: 'test-logo',
      byteLength: 50000,
      mimeType: 'image/png',
      width: 800,
      height: 800,
      dataUrl: 'data:image/png;base64,dummy',
      imageElement: img,
    };
  });

  it('detects canvas webp support', () => {
    const supported = isWebpSupportedInCanvas();
    expect(typeof supported).toBe('boolean');
  });

  it('optimizes in auto mode with target < 300 KB', async () => {
    const settings: ConversionSettingsState = {
      targetMaxKB: 290,
      preset: 300,
      format: 'image/webp',
      mode: 'auto',
      manualQuality: 92,
      manualScale: 100,
      prioritizeQuality: false,
    };

    const result = await optimizeImageToSvg(mockSource, settings);

    expect(result.svgString).toContain('<svg');
    expect(result.svgString).toContain('test-logo');
    expect(result.isTargetMet).toBe(true);
    expect(result.byteLength).toBeGreaterThan(0);
    expect(result.encodedWidth).toBeGreaterThan(0);
    expect(result.encodedHeight).toBeGreaterThan(0);
  });

  it('honors manual mode settings', async () => {
    const settings: ConversionSettingsState = {
      targetMaxKB: 290,
      preset: 300,
      format: 'image/webp',
      mode: 'manual',
      manualQuality: 75,
      manualScale: 50,
      prioritizeQuality: false,
    };

    const result = await optimizeImageToSvg(mockSource, settings);

    expect(result.scale).toBe(0.5);
    expect(result.quality).toBe(0.75);
    expect(result.encodedWidth).toBe(400);
    expect(result.encodedHeight).toBe(400);
  });

  it('accurately reports when a target is not met', async () => {
    // If target is ridiculously tiny, say 0.01 KB (10 bytes), our mock SVG will exceed it
    const settings: ConversionSettingsState = {
      targetMaxKB: 0.01,
      preset: 150,
      format: 'image/png',
      mode: 'auto',
      manualQuality: 90,
      manualScale: 100,
      prioritizeQuality: false,
    };

    const result = await optimizeImageToSvg(mockSource, settings);

    expect(result.isTargetMet).toBe(false);
    expect(result.byteLength).toBeGreaterThan(settings.targetMaxKB * 1024);
  });
});
