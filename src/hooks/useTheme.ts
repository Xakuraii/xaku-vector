import { useState, useEffect, useCallback } from 'react';

export type Theme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'xaku-vector-theme';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark';
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
      if (typeof window.matchMedia === 'function') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return 'dark';
    } catch {
      return 'dark';
    }
  });

  const applyTheme = useCallback((newTheme: Theme) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {
      // LocalStorage access may fail in restricted iframes
    }
  }, []);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      applyTheme(newTheme);
    },
    [applyTheme]
  );

  const toggleTheme = useCallback(() => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  }, [theme, setTheme]);

  // Synchronize on mount and handle system preference changes if no manual preference stored
  useEffect(() => {
    applyTheme(theme);

    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e: MediaQueryListEvent) => {
      try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (!stored) {
          const sysTheme: Theme = e.matches ? 'dark' : 'light';
          setThemeState(sysTheme);
          applyTheme(sysTheme);
        }
      } catch {
        // Ignored
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemChange);
      return () => mediaQuery.removeEventListener('change', handleSystemChange);
    }
  }, [theme, applyTheme]);

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme,
  };
}
