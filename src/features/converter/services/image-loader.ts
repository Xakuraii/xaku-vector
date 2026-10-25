import { ImageSourceData } from '../types';
import { validateImageFile } from '../utils/file-validation';
import { sanitizeBaseFilename } from '../utils/filename-utils';

/**
 * Loads an uploaded File into an HTMLImageElement and constructs ImageSourceData.
 */
export function loadImageFromFile(file: File): Promise<ImageSourceData> {
  return new Promise((resolve, reject) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      reject(new Error(validation.error || 'Invalid file'));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;

      if (width <= 0 || height <= 0) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Image could not be decoded. Dimensions are invalid.'));
        return;
      }

      // Also read as dataUrl for preview and canvas operations
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = (e.target?.result as string) || objectUrl;
        resolve({
          file,
          name: sanitizeBaseFilename(file.name),
          byteLength: file.size,
          mimeType: file.type || 'image/png',
          width,
          height,
          dataUrl,
          objectUrl,
          imageElement: img,
        });
      };
      reader.onerror = () => {
        // Fallback to objectUrl
        resolve({
          file,
          name: sanitizeBaseFilename(file.name),
          byteLength: file.size,
          mimeType: file.type || 'image/png',
          width,
          height,
          dataUrl: objectUrl,
          objectUrl,
          imageElement: img,
        });
      };
      reader.readAsDataURL(file);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to decode image. The file may be corrupted or unreadable.'));
    };

    img.src = objectUrl;
  });
}

/**
 * Loads image source data from an existing data URL.
 */
export function loadImageFromDataUrl(
  dataUrl: string,
  name: string,
  byteLength: number,
  mimeType: string
): Promise<ImageSourceData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        file: null,
        name: sanitizeBaseFilename(name),
        byteLength,
        mimeType,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        dataUrl,
        imageElement: img,
      });
    };
    img.onerror = () => {
      reject(new Error('Failed to load image from data URL.'));
    };
    img.src = dataUrl;
  });
}

/**
 * Creates a high-fidelity sample emblem canvas image so the user can
 * immediately explore all conversion, preview, and export controls.
 */
export function createSampleEmblem(): Promise<ImageSourceData> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('Cannot create canvas in non-browser environment'));
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas 2D context is unavailable'));
      return;
    }

    // Transparent background
    ctx.clearRect(0, 0, 1024, 1024);

    // Outer subtle glow shadow
    ctx.save();
    ctx.shadowColor = 'rgba(220, 38, 38, 0.45)';
    ctx.shadowBlur = 40;

    // Outer shield badge
    const badgeGrad = ctx.createLinearGradient(120, 100, 904, 924);
    badgeGrad.addColorStop(0, '#ef4444');
    badgeGrad.addColorStop(0.5, '#991b1b');
    badgeGrad.addColorStop(1, '#f59e0b');

    ctx.strokeStyle = badgeGrad;
    ctx.lineWidth = 28;
    ctx.beginPath();
    ctx.roundRect(110, 110, 804, 804, 160);
    ctx.stroke();
    ctx.restore();

    // Dark circular inner chamber
    const innerGrad = ctx.createRadialGradient(512, 490, 40, 512, 512, 380);
    innerGrad.addColorStop(0, '#1c0808');
    innerGrad.addColorStop(0.7, '#09090b');
    innerGrad.addColorStop(1, '#18181b');

    ctx.beginPath();
    ctx.arc(512, 512, 360, 0, Math.PI * 2);
    ctx.fillStyle = innerGrad;
    ctx.fill();
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#27272a';
    ctx.stroke();

    // Central geometric V / chevron mark
    ctx.save();
    const chevronGrad = ctx.createLinearGradient(512, 280, 512, 600);
    chevronGrad.addColorStop(0, '#f87171');
    chevronGrad.addColorStop(0.5, '#dc2626');
    chevronGrad.addColorStop(1, '#b91c1c');

    ctx.fillStyle = chevronGrad;
    ctx.shadowColor = 'rgba(239, 68, 68, 0.6)';
    ctx.shadowBlur = 30;

    ctx.beginPath();
    // Stylish XakuVector 'V' glyph
    ctx.moveTo(340, 320);
    ctx.lineTo(440, 320);
    ctx.lineTo(512, 470);
    ctx.lineTo(584, 320);
    ctx.lineTo(684, 320);
    ctx.lineTo(564, 570);
    ctx.lineTo(460, 570);
    ctx.closePath();
    ctx.fill();

    // Lower accent diamond
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(512, 595);
    ctx.lineTo(540, 625);
    ctx.lineTo(512, 655);
    ctx.lineTo(484, 625);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Bottom plate
    ctx.fillStyle = '#09090b';
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(160, 690, 704, 140, 20);
    ctx.fill();
    ctx.stroke();

    // Typography
    ctx.font = '800 68px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    const textGrad = ctx.createLinearGradient(250, 710, 770, 760);
    textGrad.addColorStop(0, '#f87171');
    textGrad.addColorStop(0.55, '#ef4444');
    textGrad.addColorStop(0.6, '#fbbf24');
    textGrad.addColorStop(1, '#f59e0b');
    ctx.fillStyle = textGrad;
    ctx.fillText('XAKUVECTOR', 512, 762);

    ctx.font = '600 20px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#a1a1aa';
    ctx.fillText('HIGH-PERFORMANCE SVG CONTAINER', 512, 804);

    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to generate sample emblem blob'));
        return;
      }
      const dataUrl = canvas.toDataURL('image/png');
      const sampleFile = new File([blob], 'xakuvector-sample.png', { type: 'image/png' });
      const img = new Image();
      img.onload = () => {
        resolve({
          file: sampleFile,
          name: 'xakuvector-sample',
          byteLength: blob.size,
          mimeType: 'image/png',
          width: 1024,
          height: 1024,
          dataUrl,
          imageElement: img,
        });
      };
      img.src = dataUrl;
    }, 'image/png');
  });
}

/**
 * Cleans up temporary object URLs to avoid memory leaks.
 */
export function revokeImageSource(source?: ImageSourceData | null): void {
  if (source?.objectUrl) {
    try {
      URL.revokeObjectURL(source.objectUrl);
    } catch {
      // Ignore if already revoked
    }
  }
}
