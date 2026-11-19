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
    img.decoding = 'async';

    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;

      if (width <= 0 || height <= 0) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Image could not be decoded. Dimensions are invalid.'));
        return;
      }

      // Reuse the object URL for the preview stage. Reading the file a second
      // time as a multi-megabyte base64 data URL wastes memory and CPU.
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
