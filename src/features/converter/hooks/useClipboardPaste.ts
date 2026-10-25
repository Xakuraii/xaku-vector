import { useEffect } from 'react';

interface UseClipboardPasteOptions {
  onImagePasted: (file: File) => void;
  enabled?: boolean;
}

/**
 * Listens for clipboard paste events (e.g. Ctrl+V / Cmd+V) to capture image data.
 * Skips paste when the user is actively typing in a text field.
 */
export function useClipboardPaste({ onImagePasted, enabled = true }: UseClipboardPasteOptions) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const handlePaste = (e: ClipboardEvent) => {
      // Don't intercept paste if user is typing in an input, textarea, or contentEditable element
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          (activeElement as HTMLElement).isContentEditable)
      ) {
        return;
      }

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            const renamed = new File([file], file.name || 'clipboard-image.png', {
              type: file.type || 'image/png',
            });
            onImagePasted(renamed);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onImagePasted, enabled]);
}
