import React from 'react';
import { Star, ExternalLink, ArrowUp, Code2, ShieldCheck } from 'lucide-react';

const AppFooterComponent: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-[#070709] pt-14 pb-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Col 1: Brand & Identity (5 columns on desktop) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/XakuVector.svg"
                alt="XakuVector Dragon Logo"
                width={48}
                height={48}
                loading="lazy"
                decoding="async"
                className="w-12 h-12 object-contain select-none shrink-0"
              />
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl text-zinc-900 dark:text-white tracking-tight">
                  Xaku<span className="text-zinc-500 dark:text-zinc-400">Vector</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-md">
                  v2.0.0
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm">
              A high-performance, privacy-first client-side utility for packaging raster images
              (PNG, WebP, JPEG, GIF, AVIF, BMP, ICO, SVG) into lightweight, standards-compliant SVG containers with strict
              byte budgeting down to 20 KB.
            </p>

            {/* Privacy & Operational status badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>100% Client-Side Engine • Zero Server Uploads</span>
            </div>
          </div>

          {/* Col 2: Converter Tools (2 columns on desktop) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Features
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <a
                  href="#converter"
                  className="hover:text-zinc-900 dark:hover:text-white transition"
                >
                  Image Converter
                </a>
              </li>
              <li>
                <a
                  href="#converter"
                  className="hover:text-zinc-900 dark:hover:text-white transition"
                >
                  Target Size Presets
                </a>
              </li>
              <li>
                <a
                  href="#converter"
                  className="hover:text-zinc-900 dark:hover:text-white transition"
                >
                  WebP &amp; PNG Streams
                </a>
              </li>
              <li>
                <a
                  href="#converter"
                  className="hover:text-zinc-900 dark:hover:text-white transition"
                >
                  Live Split Comparison
                </a>
              </li>
              <li>
                <a
                  href="#converter"
                  className="hover:text-zinc-900 dark:hover:text-white transition"
                >
                  SVG Code Inspector
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Architecture & Guides (2 columns on desktop) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Documentation
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <a
                  href="#how-it-works"
                  className="hover:text-zinc-900 dark:hover:text-white transition"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-zinc-900 dark:hover:text-white transition">
                  Technical Architecture
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-zinc-900 dark:hover:text-white transition">
                  Raster vs Vector
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-zinc-900 dark:hover:text-white transition">
                  Format FAQ
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-zinc-900 dark:hover:text-white transition">
                  Browser Compatibility
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Open Source Card (3 columns on desktop) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Open Source
            </h4>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                  <span>GitHub Repository</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  MIT
                </span>
              </div>

              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal">
                XakuVector is 100% free &amp; open source. Support the project by starring it on
                GitHub!
              </p>

              <a
                href="https://github.com/Xakuraii/xaku-vector"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-semibold transition hover:scale-[1.02] active:scale-[0.98] shadow-xs group"
                aria-label="Star XakuVector on GitHub"
              >
                <Star className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 group-hover:text-amber-400 group-hover:scale-110 transition-all" />
                <span>Star on GitHub</span>
                <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
              </a>

              <div className="pt-1 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800/80">
                <a
                  href="https://github.com/Xakuraii/xaku-vector/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-900 dark:hover:text-white transition"
                >
                  Report an issue
                </a>
                <span>•</span>
                <a
                  href="https://github.com/Xakuraii"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-900 dark:hover:text-white transition"
                >
                  @Xakuraii
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Author Credit, Back to Top */}
        <div className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex flex-wrap items-center gap-2 text-center sm:text-left">
            <span>© {new Date().getFullYear()} XakuVector.</span>
            <span>•</span>
            <span>Licensed under MIT.</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-zinc-700 dark:text-zinc-300">
              Crafted with <Code2 className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400 inline" /> by{' '}
              <a
                href="https://github.com/Xakuraii"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-zinc-900 dark:text-white hover:text-zinc-900 dark:hover:text-white transition underline underline-offset-2"
              >
                Xakuraii
              </a>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Xakuraii/xaku-vector"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition font-medium flex items-center gap-1.5"
            >
              <span>Source Code</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition shadow-xs cursor-pointer active:scale-95"
              aria-label="Scroll back to top of page"
            >
              <ArrowUp className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
              <span className="font-medium">Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const AppFooter = React.memo(AppFooterComponent);
