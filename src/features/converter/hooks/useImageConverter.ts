import { useState, useCallback, useRef, useEffect } from 'react';
import {
  ConversionSettingsState,
  ImageSourceData,
  OptimizationResult,
  PreviewBackground,
  ViewMode,
} from '../types';
import { DEFAULT_SETTINGS } from '../constants';
import { loadImageFromFile, revokeImageSource, createSampleEmblem } from '../services/image-loader';
import { optimizeImageToSvg } from '../services/size-optimizer';

export type ConverterStatus = 'idle' | 'loading' | 'optimizing' | 'success' | 'error';

export function useImageConverter() {
  const [sourceImage, setSourceImage] = useState<ImageSourceData | null>(null);
  const [settings, setSettings] = useState<ConversionSettingsState>(DEFAULT_SETTINGS);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [status, setStatus] = useState<ConverterStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [previewBg, setPreviewBg] = useState<PreviewBackground>('checker');
  const [zoom, setZoom] = useState<number>(1);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Stale async protection
  const activeJobIdRef = useRef<number>(0);
  const sourceImageRef = useRef<ImageSourceData | null>(null);
  const settingsRef = useRef<ConversionSettingsState>(settings);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const downloadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    sourceImageRef.current = sourceImage;
  }, [sourceImage]);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sourceImageRef.current) {
        revokeImageSource(sourceImageRef.current);
      }
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
      if (downloadTimerRef.current) {
        clearTimeout(downloadTimerRef.current);
      }
    };
  }, []);

  const triggerOptimization = useCallback(
    async (source: ImageSourceData, currentSettings: ConversionSettingsState) => {
      const jobId = ++activeJobIdRef.current;
      setStatus('optimizing');
      setErrorMessage(null);

      try {
        const optResult = await optimizeImageToSvg(
          source,
          currentSettings,
          () => jobId !== activeJobIdRef.current
        );

        // If another job started in the meantime, discard stale result
        if (jobId !== activeJobIdRef.current) return;

        setResult(optResult);
        setStatus('success');
      } catch (err) {
        // A newer optimization replaced this one; not a user-facing error.
        if (err instanceof Error && err.name === 'AbortError') return;
        if (jobId !== activeJobIdRef.current) return;
        setStatus('error');
        setErrorMessage(
          err instanceof Error ? err.message : 'An error occurred during SVG optimization.'
        );
      }
    },
    []
  );

  const loadUserFile = useCallback(
    async (file: File) => {
      const jobId = ++activeJobIdRef.current;
      setStatus('loading');
      setErrorMessage(null);
      setWarningMessage(null);

      try {
        const loadedSource = await loadImageFromFile(file);
        if (jobId !== activeJobIdRef.current) {
          revokeImageSource(loadedSource);
          return;
        }

        // Revoke previous source image
        if (sourceImageRef.current) {
          revokeImageSource(sourceImageRef.current);
        }

        sourceImageRef.current = loadedSource;
        setSourceImage(loadedSource);
        await triggerOptimization(loadedSource, settingsRef.current);
      } catch (err) {
        if (jobId !== activeJobIdRef.current) return;
        setStatus('error');
        setErrorMessage(
          err instanceof Error ? err.message : 'Failed to load and decode the selected image.'
        );
      }
    },
    [triggerOptimization]
  );

  const loadSample = useCallback(async () => {
    const jobId = ++activeJobIdRef.current;
    setStatus('loading');
    setErrorMessage(null);
    setWarningMessage(null);

    try {
      const sample = await createSampleEmblem();
      if (jobId !== activeJobIdRef.current) {
        revokeImageSource(sample);
        return;
      }

      if (sourceImageRef.current) {
        revokeImageSource(sourceImageRef.current);
      }

      sourceImageRef.current = sample;
      setSourceImage(sample);
      await triggerOptimization(sample, settingsRef.current);
    } catch (err) {
      if (jobId !== activeJobIdRef.current) return;
      setStatus('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to generate sample emblem image.'
      );
    }
  }, [triggerOptimization]);

  const removeImage = useCallback(() => {
    activeJobIdRef.current++;
    if (sourceImageRef.current) {
      revokeImageSource(sourceImageRef.current);
    }
    sourceImageRef.current = null;
    setSourceImage(null);
    setResult(null);
    setStatus('idle');
    setErrorMessage(null);
    setWarningMessage(null);
    setZoom(1);
    setIsInspectorOpen(false);
  }, []);

  const updateSettings = useCallback(
    (newSettingsOrUpdater: Partial<ConversionSettingsState>) => {
      // Keep the trigger outside the state updater: React may invoke updaters
      // twice in StrictMode, which previously ran the optimizer twice.
      const updated = { ...settingsRef.current, ...newSettingsOrUpdater };
      settingsRef.current = updated;
      setSettings(updated);

      if (sourceImageRef.current) {
        triggerOptimization(sourceImageRef.current, updated);
      }
    },
    [triggerOptimization]
  );

  const reprocess = useCallback(() => {
    if (sourceImageRef.current) {
      triggerOptimization(sourceImageRef.current, settingsRef.current);
    }
  }, [triggerOptimization]);

  const downloadSvg = useCallback(() => {
    if (!result?.svgString || !sourceImage) return;

    try {
      const blob = new Blob([result.svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${sourceImage.name || 'xakuvector'}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      if (downloadTimerRef.current) {
        clearTimeout(downloadTimerRef.current);
      }
      downloadTimerRef.current = setTimeout(() => {
        setDownloadSuccess(false);
        downloadTimerRef.current = null;
      }, 2200);
    } catch {
      setErrorMessage('Failed to trigger download.');
    }
  }, [result, sourceImage]);

  const copySvg = useCallback(async (): Promise<boolean> => {
    if (!result?.svgString) return false;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(result.svgString);
      } else {
        // Fallback for environments where clipboard API is restricted
        const textArea = document.createElement('textarea');
        textArea.value = result.svgString;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopySuccess(true);
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = setTimeout(() => {
        setCopySuccess(false);
        copyTimerRef.current = null;
      }, 2200);
      return true;
    } catch {
      setErrorMessage('Could not copy SVG source to clipboard.');
      return false;
    }
  }, [result]);

  const toggleZoom = useCallback(() => {
    setZoom((prev) => {
      if (prev === 1) return 1.5;
      if (prev === 1.5) return 2.25;
      return 1;
    });
  }, []);

  const resetZoom = useCallback(() => setZoom(1), []);

  const toggleInspector = useCallback(() => {
    setIsInspectorOpen((prev) => !prev);
  }, []);

  const closeInspector = useCallback(() => {
    setIsInspectorOpen(false);
  }, []);

  return {
    sourceImage,
    settings,
    result,
    status,
    errorMessage,
    warningMessage,
    viewMode,
    previewBg,
    zoom,
    isInspectorOpen,
    copySuccess,
    downloadSuccess,
    loadUserFile,
    loadSample,
    removeImage,
    updateSettings,
    reprocess,
    downloadSvg,
    copySvg,
    setViewMode,
    setPreviewBg,
    toggleZoom,
    resetZoom,
    toggleInspector,
    closeInspector,
  };
}
