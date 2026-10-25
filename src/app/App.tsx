import React, { useEffect, useRef } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { HeroSection } from '../features/converter/components/HeroSection';
import { UploadDropzone } from '../features/converter/components/UploadDropzone';
import { ConversionSettings } from '../features/converter/components/ConversionSettings';
import { FileMetrics } from '../features/converter/components/FileMetrics';
import { ComparisonWorkspace } from '../features/converter/components/ComparisonWorkspace';
import { OutputActions } from '../features/converter/components/OutputActions';
import { SvgCodeInspector } from '../features/converter/components/SvgCodeInspector';
import { SupportingSections } from '../features/converter/components/SupportingSections';
import { useImageConverter } from '../features/converter/hooks/useImageConverter';
import { useClipboardPaste } from '../features/converter/hooks/useClipboardPaste';

export const App: React.FC = () => {
  const {
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
    toggleInspector,
    closeInspector,
  } = useImageConverter();

  // Global clipboard paste listener
  useClipboardPaste({
    onImagePasted: loadUserFile,
  });

  // Load sample emblem on first mount so the application is immediately testable
  const initialLoadRef = useRef(false);
  useEffect(() => {
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      loadSample();
    }
  }, [loadSample]);

  const handleHeroConvertClick = () => {
    const dropzone = document.getElementById('converter');
    if (dropzone) {
      dropzone.scrollIntoView({ behavior: 'smooth' });
      // If no image, open file picker
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput && !sourceImage) {
        fileInput.click();
      }
    }
  };

  const isProcessing = status === 'optimizing' || status === 'loading';

  return (
    <AppLayout
      targetKB={settings.preset === 'unrestricted' ? undefined : settings.targetMaxKB}
      onSelectSample={loadSample}
    >
      <div id="top" />

      {/* Hero Section */}
      <HeroSection onConvertClick={handleHeroConvertClick} onSampleClick={loadSample} />

      {/* Upload Dropzone */}
      <UploadDropzone
        sourceImage={sourceImage}
        onFileSelected={loadUserFile}
        onRemoveImage={removeImage}
        errorMessage={errorMessage}
        warningMessage={warningMessage}
      />

      {/* Main Converter Workspace Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Settings and Output Actions (5 columns on large screens) */}
        <div className="lg:col-span-5 space-y-6">
          <ConversionSettings
            settings={settings}
            onChange={updateSettings}
            disabled={isProcessing}
          />

          <OutputActions
            result={result}
            filename={sourceImage?.name || 'xakuvector'}
            isProcessing={isProcessing}
            copySuccess={copySuccess}
            onDownload={downloadSvg}
            onCopy={copySvg}
            onInspect={toggleInspector}
            onReprocess={reprocess}
          />
        </div>

        {/* Right Column: Telemetry Metrics & Live Comparison Workspace (7 columns on large screens) */}
        <div className="lg:col-span-7 space-y-6">
          <FileMetrics sourceImage={sourceImage} result={result} settings={settings} />

          <ComparisonWorkspace
            sourceImage={sourceImage}
            result={result}
            viewMode={viewMode}
            previewBg={previewBg}
            zoom={zoom}
            isProcessing={isProcessing}
            onViewModeChange={setViewMode}
            onPreviewBgChange={setPreviewBg}
            onToggleZoom={toggleZoom}
          />
        </div>
      </section>

      {/* SVG Code Inspector Modal */}
      {result && (
        <SvgCodeInspector
          isOpen={isInspectorOpen}
          onClose={closeInspector}
          svgString={result.svgString}
          byteLength={result.byteLength}
          filename={sourceImage?.name || 'xakuvector'}
        />
      )}

      {/* Supporting Content: How it works, Technical Reality, Privacy, FAQ */}
      <SupportingSections />
    </AppLayout>
  );
};

export default App;
