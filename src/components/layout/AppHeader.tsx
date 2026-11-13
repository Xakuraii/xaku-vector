import React, { useState } from 'react';
import {
  Star,
  Menu,
  X,
  Sliders,
  Layers,
  Shield,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { AnimatedThemeToggler } from '../ui/AnimatedThemeToggler';

interface AppHeaderProps {
  targetKB?: number;
}

const AppHeaderComponent: React.FC<AppHeaderProps> = ({ targetKB }) => {
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    {
      title: 'Converter Studio',
      subtitle: 'Convert images & control SVG file size',
      href: '#converter',
      icon: <Sliders className="w-4 h-4 text-red-600 dark:text-red-400" />,
    },
    {
      title: 'How It Works',
      subtitle: '3-step local vector packaging process',
      href: '#how-it-works',
      icon: <Layers className="w-4 h-4 text-amber-500" />,
    },
    {
      title: 'Architecture & Privacy',
      subtitle: '100% in-browser, zero server uploads',
      href: '#about',
      icon: <Shield className="w-4 h-4 text-emerald-500" />,
    },
    {
      title: 'Frequently Asked Questions',
      subtitle: 'Formats, compatibility & quality guide',
      href: '#faq',
      icon: <HelpCircle className="w-4 h-4 text-sky-500" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-2xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand / Logo using User's Dragon Logo */}
        <a
          href="#top"
          onClick={closeMobileMenu}
          className="flex items-center gap-2.5 sm:gap-3.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-xl p-1 shrink-0"
        >
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 p-1 sm:p-1.5 flex items-center justify-center shrink-0 shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:border-red-500/50">
            <img
              src="/favicon.svg"
              alt="XakuVector Dragon Logo"
              width={44}
              height={44}
              decoding="async"
              className="w-full h-full object-contain select-none transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-base sm:text-xl text-zinc-900 dark:text-white">
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

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 text-xs lg:text-sm font-medium text-zinc-600 dark:text-zinc-300 shadow-xs">
          <a
            href="#converter"
            className="px-3.5 py-1 rounded-full hover:text-zinc-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 transition-all duration-150"
          >
            Converter
          </a>
          <a
            href="#how-it-works"
            className="px-3.5 py-1 rounded-full hover:text-zinc-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 transition-all duration-150"
          >
            How it works
          </a>
          <a
            href="#about"
            className="px-3.5 py-1 rounded-full hover:text-zinc-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 transition-all duration-150"
          >
            Technical Reality
          </a>
          <a
            href="#faq"
            className="px-3.5 py-1 rounded-full hover:text-zinc-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 transition-all duration-150"
          >
            FAQ
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {targetKB && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100/90 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-zinc-500 dark:text-zinc-400">Budget:</span>
              <span className="font-semibold font-mono text-zinc-900 dark:text-zinc-100">
                &lt; {targetKB} KB
              </span>
            </div>
          )}

          {/* GitHub Star Button (Desktop) */}
          <a
            href="https://github.com/Xakuraii/xaku-vector"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-xs group"
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
            <span>Star</span>
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          </a>

          {/* Theme Toggle Button */}
          <AnimatedThemeToggler
            variant="circle"
            duration={400}
            theme={theme}
            onThemeChange={setTheme}
            className="p-2 sm:p-2.5 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 cursor-pointer shadow-xs hover:scale-105 active:scale-95"
          />

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            className="md:hidden p-2 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 cursor-pointer shadow-xs active:scale-95"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-red-600 dark:text-red-500" />
            ) : (
              <Menu className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />
            )}
          </button>
        </div>
      </div>

      {/* Modern Overlay Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <>
          {/* Subtle backdrop overlay */}
          <div
            onClick={closeMobileMenu}
            className="fixed inset-0 top-16 bg-black/40 dark:bg-black/60 backdrop-blur-xs z-30 md:hidden animate-in fade-in duration-150"
            aria-hidden="true"
          />

          {/* Floating dropdown drawer */}
          <div className="absolute top-full left-0 w-full z-40 md:hidden bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border-b border-zinc-200/90 dark:border-zinc-800/90 shadow-2xl rounded-b-3xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
            <div className="p-4 sm:p-5 space-y-2.5">
              <nav className="space-y-1.5" aria-label="Mobile navigation">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50/70 hover:bg-zinc-100 dark:bg-zinc-900/60 dark:hover:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-800/60 transition-all duration-150 active:scale-[0.99] group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                        {item.icon}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-red-600 dark:group-hover:text-red-400 group-hover:translate-x-0.5 transition-all" />
                  </a>
                ))}
              </nav>

              {/* Target budget indicator in mobile menu if active */}
              {targetKB && (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 text-xs">
                  <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Target Size Budget:
                  </span>
                  <span className="font-bold font-mono text-zinc-900 dark:text-zinc-100">
                    &lt; {targetKB} KB
                  </span>
                </div>
              )}

              {/* Open-source GitHub Star Banner */}
              <div className="pt-1">
                <a
                  href="https://github.com/Xakuraii/xaku-vector"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold text-xs transition shadow-sm active:scale-[0.99] group"
                >
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform" />
                  <span>Star XakuVector on GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export const AppHeader = React.memo(AppHeaderComponent);
