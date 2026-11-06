import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UploadDropzone } from '../src/features/converter/components/UploadDropzone';
import { ConversionSettings } from '../src/features/converter/components/ConversionSettings';
import { OutputActions } from '../src/features/converter/components/OutputActions';
import { FileMetrics } from '../src/features/converter/components/FileMetrics';
import { AppHeader } from '../src/components/layout/AppHeader';
import { AppFooter } from '../src/components/layout/AppFooter';
import { HeroSection } from '../src/features/converter/components/HeroSection';
import { DEFAULT_SETTINGS } from '../src/features/converter/constants';
import { ImageSourceData, OptimizationResult } from '../src/features/converter/types';

describe('UploadDropzone component', () => {
  it('renders dropzone prompt when no image is loaded', () => {
    render(<UploadDropzone sourceImage={null} onFileSelected={vi.fn()} onRemoveImage={vi.fn()} />);

    expect(screen.getByText(/Drop your image here/i)).toBeInTheDocument();
    expect(screen.getByText(/PNG, WebP, or JPEG/i)).toBeInTheDocument();
  });

  it('renders loaded image information and replace/remove actions', () => {
    const mockImage: ImageSourceData = {
      file: null,
      name: 'banner-graphic',
      byteLength: 1024 * 200,
      mimeType: 'image/png',
      width: 1200,
      height: 600,
      dataUrl: 'data:image/png;base64,123',
      imageElement: new Image(),
    };

    const handleRemove = vi.fn();
    render(
      <UploadDropzone
        sourceImage={mockImage}
        onFileSelected={vi.fn()}
        onRemoveImage={handleRemove}
      />
    );

    expect(screen.getByText('banner-graphic')).toBeInTheDocument();
    expect(screen.getByText(/200.0 KB/i)).toBeInTheDocument();
    expect(screen.getByText(/1200 × 600 px/i)).toBeInTheDocument();

    const removeBtn = screen.getByLabelText(/Remove image/i);
    fireEvent.click(removeBtn);
    expect(handleRemove).toHaveBeenCalled();
  });

  it('displays error alerts accessibly', () => {
    render(
      <UploadDropzone
        sourceImage={null}
        onFileSelected={vi.fn()}
        onRemoveImage={vi.fn()}
        errorMessage="Corrupted file format"
      />
    );

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Corrupted file format');
  });
});

describe('ConversionSettings component', () => {
  it('renders size presets including < 50 KB and responds to preset selection', () => {
    const handleChange = vi.fn();
    render(<ConversionSettings settings={DEFAULT_SETTINGS} onChange={handleChange} />);

    expect(screen.getByText('< 50 KB')).toBeInTheDocument();
    expect(screen.getByText('< 150 KB')).toBeInTheDocument();
    expect(screen.getByText('< 300 KB')).toBeInTheDocument();
    expect(screen.getByText('< 500 KB')).toBeInTheDocument();
    expect(screen.getByText('Max Quality')).toBeInTheDocument();

    fireEvent.click(screen.getByText('< 50 KB'));
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        preset: 50,
        targetMaxKB: 48,
        mode: 'auto',
      })
    );

    fireEvent.click(screen.getByText('< 150 KB'));
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        preset: 150,
        targetMaxKB: 145,
        mode: 'auto',
      })
    );
  });

  it('keeps fine-tune slider visible and displays a warning when moved to max limit', () => {
    const handleChange = vi.fn();
    render(
      <ConversionSettings
        settings={{ ...DEFAULT_SETTINGS, targetMaxKB: 800 }}
        onChange={handleChange}
      />
    );

    const slider = screen.getByLabelText(/Target maximum file size in kilobytes/i);
    expect(slider).toBeInTheDocument();
    expect(slider).not.toBeDisabled();
    expect(screen.getByText(/Maximum slider limit reached \(800 KB\)/i)).toBeInTheDocument();
  });

  it('toggles manual mode and reveals manual quality and scale sliders', () => {
    const handleChange = vi.fn();
    const { rerender } = render(
      <ConversionSettings settings={DEFAULT_SETTINGS} onChange={handleChange} />
    );

    const manualToggle = screen.getByLabelText(/Manual Quality & Scale Override/i);
    fireEvent.click(manualToggle);
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'manual',
      })
    );

    // Rerender in manual mode
    rerender(
      <ConversionSettings
        settings={{ ...DEFAULT_SETTINGS, mode: 'manual' }}
        onChange={handleChange}
      />
    );

    expect(screen.getByLabelText(/Manual compression quality percentage/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Manual resolution scale percentage/i)).toBeInTheDocument();
  });
});

describe('OutputActions component', () => {
  it('disables actions when result is null', () => {
    render(
      <OutputActions
        result={null}
        filename="test"
        isProcessing={false}
        copySuccess={false}
        onDownload={vi.fn()}
        onCopy={vi.fn()}
        onInspect={vi.fn()}
        onReprocess={vi.fn()}
      />
    );

    const downloadBtn = screen.getByRole('button', { name: /Download .SVG File/i });
    expect(downloadBtn).toBeDisabled();
  });

  it('enables and triggers download and copy when result is present', () => {
    const handleDownload = vi.fn();
    const handleCopy = vi.fn();
    const handleInspect = vi.fn();

    const mockResult: OptimizationResult = {
      svgString: '<svg>test</svg>',
      byteLength: 204800,
      encodedWidth: 800,
      encodedHeight: 800,
      quality: 0.9,
      scale: 1,
      format: 'image/webp',
      isTargetMet: true,
      targetBytes: 300000,
      mimeTypeActuallyUsed: 'image/webp',
      durationMs: 15,
    };

    render(
      <OutputActions
        result={mockResult}
        filename="custom-logo"
        isProcessing={false}
        copySuccess={false}
        onDownload={handleDownload}
        onCopy={handleCopy}
        onInspect={handleInspect}
        onReprocess={vi.fn()}
      />
    );

    const downloadBtn = screen.getByRole('button', { name: /Download .SVG/i });
    expect(downloadBtn).not.toBeDisabled();
    fireEvent.click(downloadBtn);
    expect(handleDownload).toHaveBeenCalled();

    const copyBtn = screen.getByRole('button', { name: /Copy SVG Code/i });
    fireEvent.click(copyBtn);
    expect(handleCopy).toHaveBeenCalled();

    const inspectBtn = screen.getByRole('button', { name: /Inspect SVG XML/i });
    fireEvent.click(inspectBtn);
    expect(handleInspect).toHaveBeenCalled();
  });
});

describe('FileMetrics component', () => {
  it('renders placeholders in empty state', () => {
    render(<FileMetrics sourceImage={null} result={null} settings={DEFAULT_SETTINGS} />);

    const awaitingElements = screen.getAllByText('Awaiting input');
    expect(awaitingElements.length).toBeGreaterThanOrEqual(4);
  });

  it('renders actual metrics and target status when result exists', () => {
    const mockImage: ImageSourceData = {
      file: null,
      name: 'graphic',
      byteLength: 500000,
      mimeType: 'image/png',
      width: 1000,
      height: 1000,
      dataUrl: 'data:image/png;base64,123',
      imageElement: new Image(),
    };

    const mockResult: OptimizationResult = {
      svgString: '<svg></svg>',
      byteLength: 250000,
      encodedWidth: 1000,
      encodedHeight: 1000,
      quality: 0.92,
      scale: 1,
      format: 'image/webp',
      isTargetMet: true,
      targetBytes: 290 * 1024,
      mimeTypeActuallyUsed: 'image/webp',
      durationMs: 25,
    };

    render(<FileMetrics sourceImage={mockImage} result={mockResult} settings={DEFAULT_SETTINGS} />);

    expect(screen.getAllByText(/244.1/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/488.3 KB/i)).toBeInTheDocument();
    expect(screen.getByText(/-50% smaller/i)).toBeInTheDocument();
    expect(screen.getByText(/Under 290 KB Target/i)).toBeInTheDocument();
  });
});

describe('AppHeader component', () => {
  it('renders brand logo from favicon.svg, GitHub star link, and navigation links without demo button', () => {
    render(<AppHeader targetKB={290} />);

    const logoImg = screen.getByAltText(/XakuVector Dragon Logo/i);
    expect(logoImg).toBeInTheDocument();
    expect(logoImg).toHaveAttribute('src', '/favicon.svg');
    expect(screen.getByText('Xaku')).toBeInTheDocument();
    expect(screen.getByText('Vector')).toBeInTheDocument();
    expect(screen.getByText('SVG Engine')).toBeInTheDocument();
    expect(screen.getByText(/< 290 KB/i)).toBeInTheDocument();

    // Verify GitHub star link
    const ghLink = screen.getByRole('link', { name: /Star XakuVector on GitHub/i });
    expect(ghLink).toBeInTheDocument();
    expect(ghLink).toHaveAttribute('href', 'https://github.com/Xakuraii/xaku-vector');
    expect(ghLink).toHaveAttribute('target', '_blank');

    // Verify demo button is not rendered
    expect(screen.queryByText(/Demo Logo/i)).not.toBeInTheDocument();
  });
});

describe('HeroSection component', () => {
  it('renders clean headline, description, GitHub star button, and primary CTA without sample button', () => {
    const handleConvert = vi.fn();
    render(<HeroSection onConvertClick={handleConvert} />);

    expect(screen.getByText(/Package Images into SVG./i)).toBeInTheDocument();
    expect(screen.getByText(/With Strict Size Control./i)).toBeInTheDocument();
    expect(screen.queryByText(/Try with sample logo/i)).not.toBeInTheDocument();

    const convertBtn = screen.getByRole('button', { name: /Select or drop an image/i });
    expect(convertBtn).toBeInTheDocument();
    fireEvent.click(convertBtn);
    expect(handleConvert).toHaveBeenCalled();

    const ghHeroLink = screen.getByTitle(/Star XakuVector on GitHub/i);
    expect(ghHeroLink).toHaveAttribute('href', 'https://github.com/Xakuraii/xaku-vector');
  });
});

describe('AppFooter component', () => {
  it('renders branding, open-source card, GitHub links, author credit, and back-to-top button', () => {
    // Mock window.scrollTo
    window.scrollTo = vi.fn();

    render(<AppFooter />);

    // Brand and logo
    const logoImg = screen.getByAltText(/XakuVector Dragon Logo/i);
    expect(logoImg).toBeInTheDocument();
    expect(logoImg).toHaveAttribute('src', '/favicon.svg');
    expect(screen.getByText('v1.0.0')).toBeInTheDocument();

    // Open source GitHub card
    expect(screen.getByText(/XakuVector is 100% free & open source/i)).toBeInTheDocument();
    const starBtn = screen.getByRole('link', { name: /Star XakuVector on GitHub/i });
    expect(starBtn).toHaveAttribute('href', 'https://github.com/Xakuraii/xaku-vector');

    // Author credit
    const authorLinks = screen.getAllByRole('link', { name: /Xakuraii/i });
    expect(authorLinks.length).toBeGreaterThanOrEqual(1);
    expect(authorLinks[0]).toHaveAttribute('href', 'https://github.com/Xakuraii');

    // Scroll to top
    const topBtn = screen.getByRole('button', { name: /Scroll back to top of page/i });
    expect(topBtn).toBeInTheDocument();
    fireEvent.click(topBtn);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});

describe('AppFooter component', () => {
  it('renders branding, open-source card, GitHub links, author credit, and back-to-top button', () => {
    // Mock window.scrollTo
    window.scrollTo = vi.fn();

    render(<AppFooter />);

    // Brand and logo
    const logoImg = screen.getByAltText(/XakuVector Dragon Logo/i);
    expect(logoImg).toBeInTheDocument();
    expect(logoImg).toHaveAttribute('src', '/favicon.svg');
    expect(screen.getByText('v1.0.0')).toBeInTheDocument();

    // Open source GitHub card
    expect(screen.getByText(/XakuVector is 100% free & open source/i)).toBeInTheDocument();
    const starBtn = screen.getByRole('link', { name: /Star XakuVector on GitHub/i });
    expect(starBtn).toHaveAttribute('href', 'https://github.com/Xakuraii/xaku-vector');

    // Author credit
    const authorLinks = screen.getAllByRole('link', { name: /Xakuraii/i });
    expect(authorLinks.length).toBeGreaterThanOrEqual(1);
    expect(authorLinks[0]).toHaveAttribute('href', 'https://github.com/Xakuraii');

    // Scroll to top
    const topBtn = screen.getByRole('button', { name: /Scroll back to top of page/i });
    expect(topBtn).toBeInTheDocument();
    fireEvent.click(topBtn);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});

