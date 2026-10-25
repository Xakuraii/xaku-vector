import { MAX_FILE_SIZE_BYTES, SUPPORTED_MIME_TYPES } from '../constants';
import { FileValidationResult } from '../types';
import { formatBytes } from './format-utils';

const SUPPORTED_EXTENSIONS = ['.png', '.webp', '.jpg', '.jpeg'];

/**
 * Validates whether an uploaded File is acceptable for conversion.
 */
export function validateImageFile(file: File | null | undefined): FileValidationResult {
  if (!file) {
    return {
      valid: false,
      error: 'No file was provided.',
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size (${formatBytes(file.size)}) exceeds the maximum allowed limit of ${formatBytes(MAX_FILE_SIZE_BYTES)}.`,
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: 'The selected file is empty (0 bytes).',
    };
  }

  // Check MIME type
  const mimeType = file.type.toLowerCase();
  const isMimeSupported = SUPPORTED_MIME_TYPES.some((type) => mimeType === type);

  // Check file extension
  const fileName = file.name.toLowerCase();
  const hasSupportedExt = SUPPORTED_EXTENSIONS.some((ext) => fileName.endsWith(ext));

  if (!isMimeSupported && !hasSupportedExt) {
    return {
      valid: false,
      error: `Unsupported file format. Please upload a PNG, WebP, or JPEG image. (Received: ${file.type || 'unknown format'})`,
    };
  }

  // Valid with potential warning if mime type is generic but extension matched
  if (!isMimeSupported && hasSupportedExt) {
    return {
      valid: true,
      warning: `The file MIME type could not be strictly verified, but the extension appears valid.`,
    };
  }

  return { valid: true };
}
