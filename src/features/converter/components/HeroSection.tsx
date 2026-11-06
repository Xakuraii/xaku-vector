import React from 'react';
import { ArrowDown, Shield, Cpu, Zap, Star } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface HeroSectionProps {
  onConvertClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onConvertClick }) => {
  return (
    <section className="text-center max-w-3xl mx-auto pt-4 pb-6 space-y-6">
      {/* Eyebrow */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 text-xs font-bold tracking-wider uppercase">
        <Cpu className="w-3.5 h-3.5 text-red-600 dark:text-red-500" />
        <span>100% Client-Side Vector Packaging</span>
      </div>

      {/* Headline */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.16]">
        Package Images into SVG.{' '}
        <span className="text-red-600 dark:text-red-500">With Strict Size Control.</span>
      </h1>

      {/* Description */}
      <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed">
        Wrap your PNG, WebP, and JPEG graphics into lightweight, production-ready SVG containers
        with custom byte-size limits down to 20 KB and lossless alpha transparency. Everything
        executes directly in your browser — fast, private, and zero server uploads.
      </p>

      {/* CTA Buttons: Primary Action + GitHub Star */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
        <Button
          variant="primary"
          size="lg"
          onClick={onConvertClick}
          leftIcon={<ArrowDown className="w-4 h-4" />}
          className="px-6 py-3 text-sm sm:text-base font-semibold"
        >
          Select or drop an image
        </Button>

        <a
          href="https://github.com/Xakuraii/xaku-vector"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 font-semibold text-sm transition-all hover:scale-105 active:scale-95 shadow-xs group"
          title="Star XakuVector on GitHub"
        >
          <svg
            className="w-4 h-4 text-zinc-800 dark:text-zinc-200 group-hover:text-black dark:group-hover:text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
          <span>Star on GitHub</span>
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 group-hover:scale-110 transition-transform" />
        </a>
      </div>

      {/* Supporting Trust Badges */}
      <div className="pt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span>Zero server uploads • 100% Private local processing</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Dynamic iterative budget optimizer down to 20 KB</span>
        </div>
      </div>
    </section>
  );
};
