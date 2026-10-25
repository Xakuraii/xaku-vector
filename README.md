# XakuVector

> **Browser-based image-to-SVG converter and size optimizer.**  
> Convert PNG, WebP, and JPEG images into clean, responsive SVG containers with strict byte-budget optimization — running 100% locally in your browser.

---

## 1. Overview

**XakuVector** is a focused, client-side web utility that packages raster artwork into W3C Scalable Vector Graphics (`.svg`) files. It enables designers, developers, and creators to convert images while controlling output file size to satisfy strict platform budgets (such as `< 150 KB`, `< 300 KB`, or `< 500 KB`).

### Critical Technical Truthfulness: SVG Container vs. Vector Tracing

> [!IMPORTANT]
> **XakuVector is an SVG container and size optimization engine, NOT a vector curve tracing tool.**
>
> - **What it does:** It creates a valid W3C `<svg>` document containing an `<image>` element with an embedded base64 data stream (WebP or PNG) along with responsive `viewBox` coordinates and XML metadata.
> - **What it does NOT do:** It does not trace raster pixels into mathematical bezier paths or vector nodes.
> - **Fidelity & Compression:** Preserving exact raster pixels occurs in PNG mode without scaling. When using lossy WebP compression or downscaling to hit tight size limits, image quality or internal resolution is adjusted accordingly.

---

## 2. Key Features

- **Local & Private Execution:** 100% client-side image decoding, canvas scaling, and XML generation. No files are ever sent to an external server.
- **Strict Size Budget Optimizer:** Bounded binary-search optimizer automatically fine-tunes compression quality and internal resolution to meet target budgets (`< 150 KB`, `< 300 KB`, `< 500 KB`, or custom slider values).
- **Dual Raster Embedding Modes:**
  - **WebP Stream:** High-efficiency lossy/lossless compression. Ideal for fitting complex logos under 300 KB with full transparency.
  - **PNG Stream:** Lossless standard embedding for maximum legacy viewer compatibility, optimizing via resolution downscaling when budgets require it.
- **Comprehensive Preview Workspace:**
  - Side-by-side split view and SVG-only inspection mode.
  - Multi-level zoom (`1x`, `1.5x`, `2.25x`).
  - Background switcher: adaptive transparency grid, solid dark, and solid light backgrounds.
- **Accurate Telemetry & Metrics:** Real-time feedback for original size, final SVG byte length, viewBox dimensions, embedded raster resolution, and size savings percentage.
- **Export & Code Inspection:** Download standalone `.svg` files, copy raw SVG XML with one click, or inspect source code in a dedicated inspector modal.
- **Complete Light & Dark Mode:** Accessible theme toggle, persistent user choice via `localStorage`, and initial system preference detection (`prefers-color-scheme`).
- **Flexible Ingestion:** Click-to-browse, drag-and-drop, and global clipboard paste (`Ctrl+V` / `Cmd+V`).

---

## 3. Supported Input Formats & Limitations

### Supported Input Formats

- **PNG** (`image/png`) — Transparency supported.
- **WebP** (`image/webp`) — Lossy and lossless WebP with alpha transparency.
- **JPEG** (`image/jpeg`) — Standard photographic files.

### Limitations & Browser Notes

- Maximum input file size: **25 MB**.
- **Browser WebP Canvas Support:** While modern browsers (Chrome, Edge, Firefox, Safari 14+) support WebP canvas encoding, if a legacy environment lacks `toDataURL('image/webp')` support, XakuVector automatically falls back to PNG encoding.
- **SVG Compatibility:** Certain older desktop vector editors or legacy embedded SVG renderers may not render embedded WebP data inside an SVG `<image>` tag. For maximum legacy compatibility, select **PNG Stream** mode.

---

## 4. Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or later (Node v20+ recommended)
- **npm**: v9.0.0 or later

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Xakuraii/xaku-vector.git
cd xaku-vector
npm install
```

---

## 5. Available Scripts

| Command              | Description                                                                   |
| :------------------- | :---------------------------------------------------------------------------- |
| `npm run dev`        | Starts the Vite development server with Hot Module Replacement (HMR)          |
| `npm run build`      | Runs TypeScript type checking (`tsc -b`) and bundles for production with Vite |
| `npm run preview`    | Previews the local production build                                           |
| `npm test`           | Runs the full Vitest automated test suite                                     |
| `npm run test:watch` | Runs Vitest in interactive watch mode                                         |
| `npm run lint`       | Runs ESLint across all TypeScript and React files                             |
| `npm run format`     | Formats the codebase using Prettier                                           |

---

## 6. Architecture & Project Structure

The project follows a modular, feature-first structure with strict separation of concerns:

```text
xaku-vector/
├── public/
│   └── favicon.svg              # Bespoke SVG brand icon
├── src/
│   ├── app/
│   │   └── App.tsx              # Main application orchestration
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppHeader.tsx    # Header with navigation & theme toggle
│   │   │   ├── AppFooter.tsx    # Footer with privacy & technical notices
│   │   │   └── AppLayout.tsx    # Responsive shell container
│   │   └── ui/
│   │       ├── Badge.tsx        # Status and preset badges
│   │       ├── Button.tsx       # Accessible button with states
│   │       ├── Card.tsx         # Theme-aware surface card
│   │       └── Modal.tsx        # Keyboard-accessible dialog
│   ├── features/
│   │   └── converter/
│   │       ├── components/
│   │       │   ├── HeroSection.tsx          # Landing hero copy & CTAs
│   │       │   ├── UploadDropzone.tsx       # Drag/drop, browse & clipboard
│   │       │   ├── ConversionSettings.tsx   # Size targets, format, manual override
│   │       │   ├── ComparisonWorkspace.tsx  # Dual preview stage & zoom
│   │       │   ├── ImagePreview.tsx         # Safe data-URL preview rendering
│   │       │   ├── FileMetrics.tsx          # Telemetry stats & budget bar
│   │       │   ├── SvgCodeInspector.tsx     # XML source code inspector
│   │       │   ├── OutputActions.tsx        # Download, copy & reprocess
│   │       │   └── SupportingSections.tsx   # How it works, About & FAQ
│   │       ├── hooks/
│   │       │   ├── useImageConverter.ts     # Primary conversion state machine
│   │       │   └── useClipboardPaste.ts     # Global Ctrl+V clipboard hook
│   │       ├── services/
│   │       │   ├── image-loader.ts          # File decoding & sample emblem generator
│   │       │   ├── size-optimizer.ts        # Bounded binary search optimizer
│   │       │   └── svg-generator.ts         # Safe W3C SVG XML generator
│   │       ├── utils/
│   │       │   ├── file-validation.ts       # File size & MIME type validation
│   │       │   ├── filename-utils.ts        # XML escaping & filename sanitization
│   │       │   └── format-utils.ts          # Byte formatting & percentage math
│   │       ├── constants.ts                 # Size presets & default configuration
│   │       └── types.ts                     # TypeScript interfaces and types
│   ├── hooks/
│   │   └── useTheme.ts          # Theme management & localStorage persistence
│   ├── index.css                # Tailwind CSS v4 directives & custom tokens
│   ├── main.tsx                 # React DOM mount point
│   └── vite-env.d.ts            # Vite client types
├── tests/
│   ├── components.test.tsx      # React component integration tests
│   ├── file-validation.test.ts  # File validation unit tests
│   ├── filename-utils.test.ts   # XML escaping and filename sanitization tests
│   ├── format-utils.test.ts     # Byte and dimension formatting tests
│   ├── size-optimizer.test.ts   # Optimizer boundary and target verification tests
│   ├── smoke.test.ts            # Smoke test
│   ├── svg-generator.test.ts    # SVG generation & DOMParser XML validation tests
│   └── useTheme.test.ts         # Theme switching and persistence tests
├── .prettierrc.json
├── eslint.config.js
├── index.html                   # HTML entry with anti-flash script & typography
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 7. Deployment to Vercel

XakuVector is a 100% static, client-side web application with no server dependencies or database requirements. It deploys seamlessly to Vercel.

### Via Vercel CLI

```bash
# Install Vercel CLI if needed
npm install -g vercel

# Deploy from project directory
vercel
```

### Via Git Integration (Vercel Dashboard)

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. In the Vercel Dashboard, select **Add New Project** and import the repository.
3. Framework Preset: **Vite** (automatically detected).
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Install Command: `npm install`
7. Click **Deploy**.

---

## 8. License

This project is licensed under the [MIT License](LICENSE).
