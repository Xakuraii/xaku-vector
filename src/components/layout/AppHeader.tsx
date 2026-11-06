import React from 'react';
import { Sun, Moon, Star } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface AppHeaderProps {
  targetKB?: number;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ targetKB }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand / Logo using User's Logo */}
        <a
          href="#top"
          className="flex items-center gap-3 sm:gap-3.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-xl p-1"
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 flex items-center justify-center shrink-0 shadow-xs transition-all duration-200 group-hover:scale-105 group-hover:border-red-500/60">
            <img
              src="/favicon.svg"
              alt="XakuVector Dragon Logo"
              className="w-full h-full object-contain select-none"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-lg sm:text-xl text-zinc-900 dark:text-white">
                Xaku<span className="text-red-600 dark:text-red-500">Vector</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-md">
                SVG Engine
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium hidden sm:block">
              Client-Side Image to SVG Optimizer
            </p>
          </div>
        </a>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          <a
            href="#converter"
            className="px-3 py-1.5 rounded-lg hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition"
          >
            Converter
          </a>
          <a
            href="#how-it-works"
            className="px-3 py-1.5 rounded-lg hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition"
          >
            How it works
          </a>
          <a
            href="#about"
            className="px-3 py-1.5 rounded-lg hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition"
          >
            Technical Reality
          </a>
          <a
            href="#faq"
            className="px-3 py-1.5 rounded-lg hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition"
          >
            FAQ
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {targetKB && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-zinc-500 dark:text-zinc-400">Budget:</span>
              <span className="font-semibold font-mono text-zinc-900 dark:text-zinc-100">
                &lt; {targetKB} KB
              </span>
            </div>
          )}

          {/* GitHub Star Button */}
          <a
            href="https://github.com/Xakuraii/xaku-vector"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-xs group"
            title="Star XakuVector on GitHub"
            aria-label="Star XakuVector on GitHub"
          >
            <svg
              className="w-4 h-4 text-zinc-800 dark:text-zinc-200 group-hover:text-black dark:group-hover:text-white shrink-0"
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
            <span className="hidden sm:inline">Star</span>
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          </a>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 sm:p-2.5 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 cursor-pointer shadow-xs hover:scale-105 active:scale-95"
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
