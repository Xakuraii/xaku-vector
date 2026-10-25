import React from 'react';
import { ArrowDown, Sparkles, Shield, Cpu, Zap } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface HeroSectionProps {
  onConvertClick: () => void;
  onSampleClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onConvertClick, onSampleClick }) => {
  return (
    <section className="text-center max-w-3xl mx-auto pt-2 pb-6 space-y-5">
      {/* Eyebrow */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100/80 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/40 text-xs font-bold tracking-wider uppercase">
        <Cpu className="w-3.5 h-3.5 text-red-600 dark:text-red-500" />
        <span>Browser-Based Image Conversion</span>
      </div>

      {/* Headline */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.15]">
        Turn your images into SVG.{' '}
        <span className="bg-gradient-to-r from-red-600 via-red-500 to-amber-500 bg-clip-text text-transparent">
          Keep control of the size.
        </span>
      </h1>

      {/* Description */}
      <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
        Convert PNG, WebP, and JPEG images into SVG files with embedded image data. Fine-tune output
        size and quality, preview the result, and download the SVG — all directly in your browser.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Button
          variant="primary"
          size="lg"
          onClick={onConvertClick}
          leftIcon={<ArrowDown className="w-4 h-4" />}
        >
          Convert an image
        </Button>

        <Button
          variant="secondary"
          size="lg"
          onClick={onSampleClick}
          leftIcon={<Sparkles className="w-4 h-4 text-amber-500" />}
        >
          Try with sample logo
        </Button>
      </div>

      {/* Supporting Microcopy & Trust Badges */}
      <div className="pt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span>No account required • 100% processed locally</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Strict &lt; 300 KB budget optimizer</span>
        </div>
      </div>
    </section>
  );
};
