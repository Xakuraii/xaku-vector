import React from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface AppHeaderProps {
  targetKB?: number;
  onSelectSample?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ targetKB, onSelectSample }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <a
          href="#top"
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg p-1"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 via-red-500 to-amber-500 p-0.5 shadow-md shadow-red-900/20 group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full bg-white dark:bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <svg
                className="w-5 h-5 text-red-600 dark:text-red-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1" />
                <path d="m14 9-4 4-4-4" />
                <path d="M10 4v9" />
                <path d="M19 11l-3 3 3 3" opacity="0.5" />
              </svg>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-base sm:text-lg text-zinc-900 dark:text-white">
                Xaku<span className="text-red-600 dark:text-red-500">Vector</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-800/50 rounded">
                SVG Container
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden sm:block">
              Client-Side Image to SVG Optimizer
            </p>
          </div>
        </a>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-600 dark:text-zinc-300">
          <a href="#converter" className="hover:text-red-600 dark:hover:text-red-400 transition">
            Converter
          </a>
          <a href="#how-it-works" className="hover:text-red-600 dark:hover:text-red-400 transition">
            How it works
          </a>
          <a href="#about" className="hover:text-red-600 dark:hover:text-red-400 transition">
            About &amp; Privacy
          </a>
          <a href="#faq" className="hover:text-red-600 dark:hover:text-red-400 transition">
            FAQ
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {targetKB && (
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-zinc-500 dark:text-zinc-400">Target:</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-100">
                &lt; {targetKB} KB
              </span>
            </div>
          )}

          {onSelectSample && (
            <button
              type="button"
              onClick={onSelectSample}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-200 transition"
              title="Load demo image into converter"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Demo Logo
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 cursor-pointer"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
