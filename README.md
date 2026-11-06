<p align="center">
  <img src="public/favicon.svg" alt="XakuVector Logo" width="130" />
</p>

<h1 align="center">XakuVector</h1>

<p align="center">
  <strong>Fast, private, client-side raster image to SVG container and size budgeting optimizer.</strong>
  <br />
  Wrap PNG, WebP, and JPEG graphics into lightweight, production-ready SVG files with strict byte limits — 100% in your browser.
</p>

---

## 🌟 Overview

**XakuVector** is a high-performance, open-source web application designed to package raster artwork (logos, graphics, photos, illustrations) into standard W3C Scalable Vector Graphics (`.svg`) files with precision file-size budgets.

Designed for designers, developers, and content creators who need to meet strict upload limits (such as Discord bots, asset marketplaces, email templates, or embedded web containers), XakuVector iteratively computes the highest visual quality that stays strictly within your specified kilobyte budget.

> 🔒 **100% Client-Side Privacy:** All image decoding, canvas operations, compression, and XML generation happen locally in your browser. No files, metadata, or telemetry are ever uploaded to any external server.

---

## ⚙️ How It Works: SVG Container vs. Vector Tracing

> [!IMPORTANT]
> **XakuVector is an SVG raster container and byte-size optimization engine, NOT an automated bezier vector curve tracer.**
>
> - **What it does:** It creates a valid, standalone W3C `<svg>` document containing an `<image>` element embedding an optimized raster stream (WebP or PNG) with native `viewBox` scaling and dimensions.
> - **What it does NOT do:** It does not trace raster pixels into mathematical bezier paths or vector polygon nodes.
> - **Why use this?** Many platforms, asset workflows, and frameworks require `.svg` file extensions or vector containers with strict maximum byte size budgets (e.g. `< 50 KB` or `< 300 KB`). XakuVector solves this instantly while preserving transparency.

---

## ✨ Features

- **⚡ Strict File Size Budgeting:**
  - One-click presets: `< 50 KB` (Compact / Micro SVG), `< 150 KB` (Ultra Small), `< 300 KB` (Recommended), `< 500 KB` (High Fidelity), and `Max Quality` (Unrestricted).
  - Smooth 60fps fine-tune slider ranging from **20 KB up to 800 KB** with dynamic boundary warnings.
- **🛡️ 100% Client-Side & Offline-Ready:** Zero server communication, zero tracking, zero accounts required. Works fully offline once loaded.
- **🎨 Dual Raster Streams:**
  - **WebP Stream:** Highest compression efficiency with full 8-bit alpha transparency. Downscales resolution automatically for micro-targets down to 20 KB.
  - **PNG Stream:** Lossless standard embedding for maximum legacy viewer and editor compatibility.
- **🔍 Live Comparison Workspace:**
  - Interactive split view and SVG-only inspection mode.
  - Multi-level zoom (`1x`, `1.5x`, `2.25x`).
  - Adaptive transparency checkerboard, solid dark, and solid light background modes.
- **📊 Real-Time File Telemetry:** Exact byte counts, original vs. generated size comparisons, reduction percentages, resolution scaling, and budget progress bars.
- **📋 Export & Code Inspection:** Instant file download, one-click clipboard copy (`Copy SVG Code`), and syntax-highlighted raw SVG XML source code inspector.
- **🌓 Modern UI & Complete Dark/Light Mode:** Minimalist, accessible interface with system theme auto-detection and persistence.
- **📱 Fully Responsive:** Clean mobile experience with a dedicated, touch-friendly hamburger drawer navigation.

---

## 📁 Supported Formats

| Input Format | MIME Type    | Transparency | Max Recommended Size |
| :----------- | :----------- | :----------: | :------------------- |
| **PNG**      | `image/png`  | ✅ Supported | 25 MB                |
| **WebP**     | `image/webp` | ✅ Supported | 25 MB                |
| **JPEG**     | `image/jpeg` | ❌ No Alpha  | 25 MB                |

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Xakuraii/xaku-vector.git

# 2. Enter project directory
cd xaku-vector

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Open your browser at `http://localhost:5173` to view the application.

---

## 🛠️ Available Scripts

| Command              | Description                                                                         |
| :------------------- | :---------------------------------------------------------------------------------- |
| `npm run dev`        | Starts the Vite development server with Hot Module Replacement (HMR)                |
| `npm run build`      | Runs TypeScript check (`tsc -b`) and produces optimized production build in `dist/` |
| `npm run preview`    | Locally serves and previews the production build from `dist/`                       |
| `npm test`           | Executes the complete automated test suite with Vitest                              |
| `npm run test:watch` | Runs Vitest in interactive watch mode for TDD                                       |
| `npm run lint`       | Runs ESLint across all TypeScript and React source files                            |
| `npm run format`     | Auto-formats the entire repository using Prettier                                   |

---

## 🚢 Deployment Guide

Because XakuVector is a 100% static client-side application, it can be deployed to any static hosting provider for free in minutes.

### 1. Deploy to Vercel (Recommended)

#### Option A: Via Vercel Dashboard (One-Click Git)

1. Fork or push this repository to your GitHub account.
2. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New Project**.
3. Import your `xaku-vector` repository.
4. Framework Preset: **Vite** (auto-detected).
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Click **Deploy**.

#### Option B: Via Vercel CLI

```bash
npm install -g vercel
vercel
```

---

### 2. Deploy to Netlify

#### Option A: Via Netlify Dashboard

1. Connect your GitHub repository on [Netlify](https://app.netlify.com/).
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy!

#### Option B: Drag and Drop

Run `npm run build` locally, then drag the generated `dist` folder into the Netlify App upload box.

---

### 3. Deploy to Cloudflare Pages

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages**.
2. Select **Create application** > **Pages** > **Connect to Git**.
3. Select your repository.
4. Build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Click **Save and Deploy**.

---

### 4. Deploy to GitHub Pages

1. In `vite.config.ts`, set the base path if deploying under a subpath (e.g. `base: '/xaku-vector/'`).
2. Add a simple GitHub Actions workflow (`.github/workflows/deploy.yml`):

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

### 5. Deploy with Docker & Nginx

Create a `Dockerfile` in the project root:

```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:

```bash
docker build -t xaku-vector .
docker run -p 8080:80 xaku-vector
```

---

## 🏛️ Architecture & Project Structure

```text
xaku-vector/
├── public/
│   └── favicon.svg              # Official XakuVector dragon emblem & favicon
├── src/
│   ├── app/
│   │   └── App.tsx              # Application shell & state coordination
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppHeader.tsx    # Responsive header with mobile hamburger drawer
│   │   │   ├── AppFooter.tsx    # Modern footer with documentation & GitHub links
│   │   │   └── AppLayout.tsx    # Page layout wrapper
│   │   └── ui/
│   │       ├── Badge.tsx        # UI status and preset pills
│   │       ├── Button.tsx       # Accessible button with loading/variant states
│   │       ├── Card.tsx         # Theme-aware card surface
│   │       └── Modal.tsx        # Accessible dialog wrapper
│   ├── features/
│   │   └── converter/
│   │       ├── components/
│   │       │   ├── HeroSection.tsx          # Landing hero & call-to-actions
│   │       │   ├── UploadDropzone.tsx       # Drag/drop, file browse & clipboard paste
│   │       │   ├── ConversionSettings.tsx   # Budget presets, 20-800KB slider & format
│   │       │   ├── ComparisonWorkspace.tsx  # Dual preview comparison stage
│   │       │   ├── ImagePreview.tsx         # Canvas & SVG rendering preview
│   │       │   ├── FileMetrics.tsx          # Real-time byte savings & metrics
│   │       │   ├── SvgCodeInspector.tsx     # SVG XML source code inspector modal
│   │       │   ├── OutputActions.tsx        # Download, copy & reprocess buttons
│   │       │   └── SupportingSections.tsx   # How it works, About & FAQ
│   │       ├── hooks/
│   │       │   ├── useImageConverter.ts     # Core conversion state machine
│   │       │   └── useClipboardPaste.ts     # Global Ctrl+V clipboard listener
│   │       ├── services/
│   │       │   ├── image-loader.ts          # Image decoding & blob cleanup
│   │       │   ├── size-optimizer.ts        # Iterative binary search size optimizer
│   │       │   └── svg-generator.ts         # W3C-compliant SVG XML markup generator
│   │       ├── utils/
│   │       │   ├── file-validation.ts       # Size & MIME type validation
│   │       │   ├── filename-utils.ts        # XML sanitization & escaping
│   │       │   └── format-utils.ts          # Byte formatting & math utilities
│   │       ├── constants.ts                 # Size presets & default config
│   │       └── types.ts                     # TypeScript interfaces & types
│   ├── hooks/
│   │   └── useTheme.ts          # Theme toggle (dark/light) & persistence
│   ├── index.css                # Tailwind CSS v4 styling & slider thumb styles
│   └── main.tsx                 # Application entry point
├── tests/
│   ├── components.test.tsx      # Integration tests for UI & conversion flow
│   ├── file-validation.test.ts  # File validation unit tests
│   ├── filename-utils.test.ts   # Filename & XML escaping tests
│   ├── format-utils.test.ts     # Byte & dimension formatting tests
│   ├── size-optimizer.test.ts   # Optimizer boundary & target tests
│   ├── smoke.test.ts            # Environment sanity test
│   ├── svg-generator.test.ts    # SVG generation & DOMParser XML tests
│   └── useTheme.test.ts         # Theme switching & persistence tests
├── index.html                   # HTML entry template
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 👤 Author

- **Xakuraii** — [@Xakuraii](https://github.com/Xakuraii)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
Feel free to use, modify, and distribute it for personal or commercial projects.

---

<p align="center">
  If you find XakuVector useful, please consider giving it a ⭐ on <a href="https://github.com/Xakuraii/xaku-vector">GitHub</a>!
</p>
