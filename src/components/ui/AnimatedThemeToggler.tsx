import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { flushSync } from 'react-dom';

export type TransitionVariant =
  | 'circle'
  | 'square'
  | 'triangle'
  | 'diamond'
  | 'hexagon'
  | 'rectangle'
  | 'star';

interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<'button'> {
  duration?: number;
  variant?: TransitionVariant;
  /** When true, the transition expands from the viewport center instead of the button center. */
  fromCenter?: boolean;
  /**
   * Controlled theme value. When provided, the parent owns persistence
   * and this component will not write to localStorage.
   */
  theme?: 'light' | 'dark';
  /** Called on toggle. Pair with `theme` for controlled usage. */
  onThemeChange?: (theme: 'light' | 'dark') => void;
}

function polygonCollapsed(point: string, vertexCount: number): string {
  const pairs = Array.from({ length: vertexCount }, () => point).join(', ');
  return `polygon(${pairs})`;
}

// All coordinates are percentages of the snapshot reference box so fractional
// display scales (e.g. Windows 125%/150%) render at the exact button position.
function getThemeTransitionClipPaths(
  variant: TransitionVariant,
  cx: number,
  cy: number,
  maxRadius: number,
  viewportWidth: number,
  viewportHeight: number
): [string, string] {
  const safeW = Math.max(1, viewportWidth);
  const safeH = Math.max(1, viewportHeight);
  const toX = (x: number) => `${(x / safeW) * 100}%`;
  const toY = (y: number) => `${(y / safeH) * 100}%`;
  const point = (x: number, y: number) => `${toX(x)} ${toY(y)}`;
  // circle() percentage radii resolve against hypot(w, h) / sqrt(2) of the reference box.
  const toRadius = (r: number) =>
    `${(r / (Math.hypot(safeW, safeH) / Math.SQRT2)) * 100}%`;

  switch (variant) {
    case 'circle':
      return [`circle(0% at ${point(cx, cy)})`, `circle(${toRadius(maxRadius)} at ${point(cx, cy)})`];
    case 'square': {
      const halfW = Math.max(cx, safeW - cx);
      const halfH = Math.max(cy, safeH - cy);
      const halfSide = Math.max(halfW, halfH) * 1.05;
      const end = [
        point(cx - halfSide, cy - halfSide),
        point(cx + halfSide, cy - halfSide),
        point(cx + halfSide, cy + halfSide),
        point(cx - halfSide, cy + halfSide),
      ].join(', ');
      return [polygonCollapsed(point(cx, cy), 4), `polygon(${end})`];
    }
    case 'triangle': {
      const scale = maxRadius * 2.2;
      const dx = (Math.sqrt(3) / 2) * scale;
      const verts = [
        point(cx, cy - scale),
        point(cx + dx, cy + 0.5 * scale),
        point(cx - dx, cy + 0.5 * scale),
      ].join(', ');
      return [polygonCollapsed(point(cx, cy), 3), `polygon(${verts})`];
    }
    case 'diamond': {
      const R = maxRadius * Math.SQRT2;
      const end = [
        point(cx, cy - R),
        point(cx + R, cy),
        point(cx, cy + R),
        point(cx - R, cy),
      ].join(', ');
      return [polygonCollapsed(point(cx, cy), 4), `polygon(${end})`];
    }
    case 'hexagon': {
      const R = maxRadius * Math.SQRT2;
      const verts: string[] = [];
      for (let i = 0; i < 6; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 3;
        verts.push(point(cx + R * Math.cos(a), cy + R * Math.sin(a)));
      }
      return [polygonCollapsed(point(cx, cy), 6), `polygon(${verts.join(', ')})`];
    }
    case 'rectangle': {
      const halfW = Math.max(cx, safeW - cx);
      const halfH = Math.max(cy, safeH - cy);
      const end = [
        point(cx - halfW, cy - halfH),
        point(cx + halfW, cy - halfH),
        point(cx + halfW, cy + halfH),
        point(cx - halfW, cy + halfH),
      ].join(', ');
      return [polygonCollapsed(point(cx, cy), 4), `polygon(${end})`];
    }
    case 'star': {
      const R = maxRadius * Math.SQRT2 * 1.03;
      const innerRatio = 0.42;
      const starPolygon = (radius: number) => {
        const verts: string[] = [];
        for (let i = 0; i < 5; i++) {
          const outerA = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
          verts.push(point(cx + radius * Math.cos(outerA), cy + radius * Math.sin(outerA)));
          const innerA = outerA + Math.PI / 5;
          verts.push(
            point(cx + radius * innerRatio * Math.cos(innerA), cy + radius * innerRatio * Math.sin(innerA))
          );
        }
        return `polygon(${verts.join(', ')})`;
      };
      const startR = Math.max(2, R * 0.025);
      return [starPolygon(startR), starPolygon(R)];
    }
    default:
      return [`circle(0% at ${point(cx, cy)})`, `circle(${toRadius(maxRadius)} at ${point(cx, cy)})`];
  }
}

export const AnimatedThemeToggler: React.FC<AnimatedThemeTogglerProps> = ({
  className,
  duration = 400,
  variant = 'circle',
  fromCenter = false,
  theme,
  onThemeChange,
  onClick,
  ...props
}) => {
  const isControlled = theme !== undefined;
  const [internalIsDark, setInternalIsDark] = useState(false);
  const isDark = isControlled ? theme === 'dark' : internalIsDark;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isTransitioningRef = useRef(false);
  const activeAnimRef = useRef<Animation | null>(null);

  const cancelAnim = useCallback(() => {
    activeAnimRef.current?.cancel();
    activeAnimRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      cancelAnim();
      const root = document.documentElement;
      if (root.dataset.magicuiThemeVt !== 'active') return;
      delete root.dataset.magicuiThemeVt;
      root.style.removeProperty('--magicui-theme-toggle-vt-duration');
      root.style.removeProperty('--magicui-theme-vt-clip-from');
    };
  }, [cancelAnim]);

  useEffect(() => {
    if (isControlled) return;

    const updateTheme = () => {
      setInternalIsDark(document.documentElement.classList.contains('dark'));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [isControlled]);

  const toggleTheme = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);

      const button = buttonRef.current;
      if (
        !button ||
        isTransitioningRef.current ||
        document.documentElement.dataset.magicuiThemeVt === 'active'
      ) {
        return;
      }

      const nextTheme: 'light' | 'dark' = isDark ? 'light' : 'dark';

      const applyTheme = () => {
        if (isControlled) {
          onThemeChange?.(nextTheme);
        } else {
          document.documentElement.classList.toggle('dark', nextTheme === 'dark');
          document.documentElement.classList.toggle('light', nextTheme === 'light');
          setInternalIsDark(nextTheme === 'dark');
          try {
            localStorage.setItem('theme', nextTheme);
          } catch {
            // Ignored
          }
        }
      };

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (typeof document.startViewTransition !== 'function' || prefersReducedMotion) {
        applyTheme();
        return;
      }

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let x: number;
      let y: number;
      if (fromCenter) {
        x = viewportWidth / 2;
        y = viewportHeight / 2;
      } else {
        const { top, left, width, height } = button.getBoundingClientRect();
        x = left + width / 2;
        y = top + height / 2;
      }

      const maxRadius = Math.hypot(
        Math.max(x, viewportWidth - x),
        Math.max(y, viewportHeight - y)
      );

      const clipPath = getThemeTransitionClipPaths(
        variant,
        x,
        y,
        maxRadius,
        viewportWidth,
        viewportHeight
      );

      const root = document.documentElement;
      root.dataset.magicuiThemeVt = 'active';
      root.style.setProperty('--magicui-theme-toggle-vt-duration', `${duration}ms`);
      root.style.setProperty('--magicui-theme-vt-clip-from', clipPath[0]);

      const cleanup = () => {
        isTransitioningRef.current = false;
        delete root.dataset.magicuiThemeVt;
        root.style.removeProperty('--magicui-theme-toggle-vt-duration');
        root.style.removeProperty('--magicui-theme-vt-clip-from');
        cancelAnim();
      };

      isTransitioningRef.current = true;
      const transition = document.startViewTransition(() => {
        flushSync(applyTheme);
      });

      if (typeof transition?.finished?.finally === 'function') {
        transition.finished.finally(cleanup).catch(() => {});
      } else {
        cleanup();
      }

      const ready = transition?.ready;
      if (ready && typeof ready.then === 'function') {
        ready
          .then(() => {
            const anim = document.documentElement.animate(
              { clipPath },
              {
                duration,
                easing: variant === 'star' ? 'linear' : 'ease-in-out',
                fill: 'forwards',
                pseudoElement: '::view-transition-new(root)',
              }
            );
            activeAnimRef.current = anim;
          })
          .catch(() => {});
      }
    },
    [
      onClick,
      isDark,
      isControlled,
      onThemeChange,
      fromCenter,
      variant,
      duration,
      cancelAnim,
    ]
  );

  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={toggleTheme}
      aria-label={props['aria-label'] ?? (isDark ? 'Switch to light mode' : 'Switch to dark mode')}
      className={className}
      {...props}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-zinc-700" />
      )}
    </button>
  );
};

