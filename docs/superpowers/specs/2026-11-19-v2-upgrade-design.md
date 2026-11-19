# XakuVector v2.0.0 Upgrade Design Document

## 1. Intent & Purpose
Upgrade XakuVector to version 2.0.0. Clean up legacy demo/sample artifacts, eliminate unicode emoji clutter in favor of clean icons, fix metrics card overflow issues where file size text wraps onto multiple lines, and deliver a modern, fluid preview workspace supporting continuous mouse wheel & pinch zooming, along with right-click desktop dragging and mobile touch panning.

## 2. Requirements & Goals

### Goal 1: Remove Sample Feature
- Remove `createSampleEmblem` from `src/features/converter/services/image-loader.ts`.
- Remove `loadSample` from `useImageConverter.ts` and `src/app/App.tsx`.
- Remove `onLoadSample` prop and "Try sample emblem" button from `src/features/converter/components/UploadDropzone.tsx`.
- Update `tests/components.test.tsx` to remove tests targeting the sample emblem button.

### Goal 2: Replace All Emojis with Icons / Clean Indicators
- In `README.md`, replace all 22 unicode emojis (e.g. `🌟`, `🔒`, `⚙️`, `✨`, `⚡`, `🛡️`, `🎨`, `🔍`, `📊`, `📋`, `🌓`, `📱`, `📁`, `✅`, `❌`, `🚀`, `🛠️`, `🚢`, `🏛️`, `👤`, `📄`, `⭐`) with clean text, SVG badges, or markdown bullet styling.
- Standardize all UI placeholders in `ImagePreview.tsx` to use `lucide-react` icons (`ImageIcon` and `FileCode`).

### Goal 3: Preview Stage Continuous Zoom & Panning
- Replace fixed zoom steps (`1x, 1.5x, 2.25x`) with continuous zoom ranging from `0.25x` (min) to `8.0x` (max).
- **Mouse Wheel Zoom**: Scrolling wheel inside the preview canvas zooms in/out smoothly toward current zoom center.
- **Pinch-to-Zoom (Touch)**: Multi-touch pinch gesture on mobile devices smoothly zooms.
- **Right-Click Drag (Desktop)**: Dragging with mouse right-click pans the viewport freely in X and Y directions. Suppress context menu on drag.
- **Touch Drag (Mobile)**: Single-touch drag pans the viewport smoothly.
- **Synchronized Viewport**: In 'split' view mode, panning or zooming either the Original or SVG pane moves both together so side-by-side inspection stays 100% aligned.
- **Toolbar Controls**:
  - Zoom Out button (`ZoomOut`)
  - Zoom In button (`ZoomIn`)
  - Zoom Level indicator badge (e.g., `100%` or `1.5x`)
  - Reset View button / double-click to re-center pan `(0, 0)` and reset zoom to `1x`.

### Goal 4: Fix Metric Card Layout & Text Size (User Screenshot Issue)
- In `src/features/converter/components/FileMetrics.tsx`, the first card ("Generated .SVG Size") has `text-2xl sm:text-3xl font-extrabold font-mono`. On 4-column layouts, `"186.5 KB"` causes `"KB"` to wrap onto a second line, colliding with the status badge below.
- Fix: Use `text-lg sm:text-xl lg:text-2xl font-bold font-mono whitespace-nowrap` or split unit with `tabular-nums`, ensuring single-line layout and preventing line wrap or overlap.

### Goal 5: Version Bump to 2.0.0
- `package.json`: `"version": "2.0.0"`
- `src/components/layout/AppFooter.tsx`: `"v2.0.0"`
- `tests/components.test.tsx`: Update assertions checking `'v1.0.0'` to `'v2.0.0'`.

## 3. Approaches Considered

### Preview Zoom/Pan Approach
- **Approach A (CSS Scrollbars & fixed overflow)**: Keep standard scrollbars and change zoom levels. Tradeoff: Clunky, scrollbars take space, right-click drag is impossible, pinch zoom fails on mobile.
- **Approach B (Smooth Canvas/Transform Viewport - Selected)**: Use CSS transform `translate3d(panX, panY, 0) scale(zoom)` on an inner wrapper with `overflow-hidden` outer viewport. Handle pointer/mouse/touch events cleanly with right-click panning and wheel/pinch zoom. Synchronize both split panes seamlessly.

## 4. Constraints & Non-Goals
- Must not break existing conversion, optimization, or test suite.
- Must remain 100% client-side with zero external network dependencies.
