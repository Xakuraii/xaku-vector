import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const AppFooter: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/60 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand & summary */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white font-black text-sm">
                X
              </div>
              <span className="font-extrabold text-lg text-zinc-900 dark:text-white">
                Xaku<span className="text-red-600 dark:text-red-500">Vector</span>
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm">
              A modern, browser-based utility for packaging raster images (PNG, WebP, JPEG) into SVG
              containers with strict file-size budgets. All processing is executed client-side.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Zero server image transmission • 100% Private</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Product
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <a
                  href="#converter"
                  className="hover:text-red-600 dark:hover:text-red-400 transition"
                >
                  Image Converter
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="hover:text-red-600 dark:hover:text-red-400 transition"
                >
                  How it Works
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-red-600 dark:hover:text-red-400 transition">
                  Technical Architecture
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-red-600 dark:hover:text-red-400 transition">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Technical Note */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Technical Accuracy
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              XakuVector embeds raster image streams inside SVG XML elements (
              <code className="text-zinc-800 dark:text-zinc-300">&lt;image&gt;</code>). It does not
              compute vector bezier curves or perform automated vector tracing.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-500">
          <p>© {new Date().getFullYear()} XakuVector. Open source frontend utility.</p>
          <div className="flex items-center gap-1">
            <span>Built with focus on performance, clarity &amp; accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
