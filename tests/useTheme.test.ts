import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../src/hooks/useTheme';

describe('useTheme hook', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('initializes with dark theme by default or system preference', () => {
    const { result } = renderHook(() => useTheme());
    expect(['dark', 'light']).toContain(result.current.theme);
  });

  it('toggles theme between dark and light', () => {
    const { result } = renderHook(() => useTheme());
    const initialTheme = result.current.theme;

    act(() => {
      result.current.toggleTheme();
    });

    const expectedTheme = initialTheme === 'dark' ? 'light' : 'dark';
    expect(result.current.theme).toBe(expectedTheme);
    expect(document.documentElement.classList.contains(expectedTheme)).toBe(true);
    expect(localStorage.getItem('xaku-vector-theme')).toBe(expectedTheme);
  });

  it('persists explicit theme change', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('light');
    });

    expect(result.current.theme).toBe('light');
    expect(result.current.isDark).toBe(false);
    expect(localStorage.getItem('xaku-vector-theme')).toBe('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });
});
