import {
  ConversionSettingsState,
  ImageSourceData,
  OptimizationResult,
  OutputFormat,
} from '../types';
import { buildSvgMarkup, getSvgByteLength } from './svg-generator';

interface CandidateEncoding {
  svgString: string;
  byteLength: number;
  encodedWidth: number;
  encodedHeight: number;
  quality: number;
  scale: number;
  mimeTypeUsed: string;
}

/**
 * Checks whether the current browser environment genuinely supports WebP export in canvas.
 */
export function isWebpSupportedInCanvas(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const dataUrl = canvas.toDataURL('image/webp');
    return dataUrl.startsWith('data:image/webp');
  } catch {
    return false;
  }
}

/**
 * Encodes the source image to a specific resolution scale and quality,
 * packaging it into SVG XML and calculating exact byte size.
 */
export function encodeCandidate(
  source: ImageSourceData,
  scale: number,
  quality: number,
  requestedFormat: OutputFormat,
  canvas?: HTMLCanvasElement
): CandidateEncoding {
  const effectiveScale = Math.max(0.1, Math.min(1.0, scale));
  const effectiveQuality = Math.max(0.1, Math.min(1.0, quality));

  const targetWidth = Math.max(16, Math.round(source.width * effectiveScale));
  const targetHeight = Math.max(16, Math.round(source.height * effectiveScale));

  const cvs = canvas || (typeof document !== 'undefined' ? document.createElement('canvas') : null);
  if (!cvs) {
    throw new Error('Canvas element is unavailable for image encoding');
  }

  cvs.width = targetWidth;
  cvs.height = targetHeight;
  const ctx = cvs.getContext('2d');
  if (!ctx) {
    throw new Error('2D context could not be acquired');
  }

  ctx.clearRect(0, 0, targetWidth, targetHeight);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(source.imageElement, 0, 0, targetWidth, targetHeight);

  // Check actual format support
  let mimeToUse: OutputFormat = requestedFormat;
  if (requestedFormat === 'image/webp' && !isWebpSupportedInCanvas()) {
    mimeToUse = 'image/png';
  }

  const dataUrl =
    mimeToUse === 'image/png'
      ? cvs.toDataURL('image/png')
      : cvs.toDataURL('image/webp', effectiveQuality);

  // Check what the browser actually returned
  const actualMime = dataUrl.startsWith('data:image/webp') ? 'image/webp' : 'image/png';

  // Build SVG with original source viewBox so it scales accurately to original dimensions
  const svgString = buildSvgMarkup({
    dataUrl,
    width: source.width,
    height: source.height,
    title: source.name,
    description: `Optimized with XakuVector (${actualMime}, ${targetWidth}x${targetHeight})`,
  });

  const byteLength = getSvgByteLength(svgString);

  return {
    svgString,
    byteLength,
    encodedWidth: targetWidth,
    encodedHeight: targetHeight,
    quality: effectiveQuality,
    scale: effectiveScale,
    mimeTypeUsed: actualMime,
  };
}

/**
 * Optimizes an image into an SVG container respecting target size constraints.
 * Uses bounded binary search to maximize quality while staying strictly under the KB limit.
 */
export async function optimizeImageToSvg(
  source: ImageSourceData,
  settings: ConversionSettingsState
): Promise<OptimizationResult> {
  const startTime = performance.now();
  const targetBytes = settings.targetMaxKB * 1024;
  const sharedCanvas =
    typeof document !== 'undefined' ? document.createElement('canvas') : undefined;

  let bestCandidate: CandidateEncoding;

  if (settings.mode === 'manual') {
    // Manual explicit settings
    const scale = settings.manualScale / 100;
    const quality = settings.manualQuality / 100;
    bestCandidate = encodeCandidate(source, scale, quality, settings.format, sharedCanvas);
  } else if (settings.preset === 'unrestricted') {
    // Max quality, full resolution
    const quality = settings.format === 'image/webp' ? 0.98 : 1.0;
    bestCandidate = encodeCandidate(source, 1.0, quality, settings.format, sharedCanvas);
  } else if (settings.format === 'image/webp') {
    // WebP Auto-Optimizer:
    // Step 1: Try 100% full resolution at 0.98 quality
    const fullResCandidate = encodeCandidate(source, 1.0, 0.98, 'image/webp', sharedCanvas);

    if (fullResCandidate.byteLength <= targetBytes) {
      bestCandidate = fullResCandidate;
    } else {
      // Step 2: Binary search quality between 0.40 and 0.98 at 100% scale (8 iterations)
      let lowQ = 0.4;
      let highQ = 0.98;
      let bestAtFullRes: CandidateEncoding | null = null;

      for (let i = 0; i < 8; i++) {
        const midQ = (lowQ + highQ) / 2;
        const candidate = encodeCandidate(source, 1.0, midQ, 'image/webp', sharedCanvas);

        if (candidate.byteLength <= targetBytes) {
          bestAtFullRes = candidate;
          lowQ = midQ; // Try higher quality
        } else {
          highQ = midQ; // Need smaller file
        }
      }

      if (bestAtFullRes) {
        bestCandidate = bestAtFullRes;
      } else {
        // Step 3: Resolution scaling needed (e.g. ultra tight size budget)
        let lowS = 0.2;
        let highS = 0.95;
        let bestScaled: CandidateEncoding | null = null;

        for (let i = 0; i < 8; i++) {
          const midS = (lowS + highS) / 2;
          const candidate = encodeCandidate(source, midS, 0.8, 'image/webp', sharedCanvas);

          if (candidate.byteLength <= targetBytes) {
            bestScaled = candidate;
            lowS = midS; // Try larger scale
          } else {
            highS = midS; // Need smaller scale
          }
        }

        // If target was extraordinarily small and even scale 0.2 exceeded, fallback to minimum
        bestCandidate =
          bestScaled || encodeCandidate(source, 0.15, 0.6, 'image/webp', sharedCanvas);
      }
    }
  } else {
    // PNG Auto-Optimizer:
    // PNG data in canvas is lossless; size is optimized via resolution scale
    const fullPng = encodeCandidate(source, 1.0, 1.0, 'image/png', sharedCanvas);

    if (fullPng.byteLength <= targetBytes) {
      bestCandidate = fullPng;
    } else {
      let lowS = 0.15;
      let highS = 0.98;
      let bestPng: CandidateEncoding | null = null;

      for (let i = 0; i < 8; i++) {
        const midS = (lowS + highS) / 2;
        const candidate = encodeCandidate(source, midS, 1.0, 'image/png', sharedCanvas);

        if (candidate.byteLength <= targetBytes) {
          bestPng = candidate;
          lowS = midS;
        } else {
          highS = midS;
        }
      }

      bestCandidate = bestPng || encodeCandidate(source, 0.15, 1.0, 'image/png', sharedCanvas);
    }
  }

  const durationMs = performance.now() - startTime;
  const isTargetMet = settings.preset === 'unrestricted' || bestCandidate.byteLength <= targetBytes;

  return {
    svgString: bestCandidate.svgString,
    byteLength: bestCandidate.byteLength,
    encodedWidth: bestCandidate.encodedWidth,
    encodedHeight: bestCandidate.encodedHeight,
    quality: bestCandidate.quality,
    scale: bestCandidate.scale,
    format: settings.format,
    isTargetMet,
    targetBytes,
    mimeTypeActuallyUsed: bestCandidate.mimeTypeUsed,
    durationMs,
  };
}
