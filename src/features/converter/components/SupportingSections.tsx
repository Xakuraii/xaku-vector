import React from 'react';
import { Info, ShieldCheck, HelpCircle, FileCode, CheckCircle2 } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

export const SupportingSections: React.FC = () => {
  return (
    <div className="space-y-16 pt-8">
      {/* 1. How It Works Section */}
      <section id="how-it-works" className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            How It Works
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Three simple steps to transform and optimize your raster graphics into SVG files.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/50 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              1. Upload Your Image
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Drag and drop any PNG, WebP, or JPEG image directly into the workspace, click to
              browse your disk, or press{' '}
              <kbd className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] font-mono">
                Ctrl+V
              </kbd>{' '}
              to paste from your clipboard.
            </p>
          </Card>

          <Card className="p-6 space-y-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              2. Select Size Target
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Choose from standard presets like &lt;300 KB, or specify a custom byte limit. The
              built-in auto-optimizer automatically searches for the highest quality that stays
              strictly within your limit.
            </p>
          </Card>

          <Card className="p-6 space-y-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              3. Preview &amp; Download
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Inspect the original and generated SVG side-by-side, verify transparency on the
              checkerboard grid, inspect raw SVG XML markup, and download your ready-to-use{' '}
              <code className="text-zinc-800 dark:text-zinc-200">.svg</code> file.
            </p>
          </Card>
        </div>
      </section>

      {/* 2. What to Expect (Critical Technical Honesty) */}
      <section id="about" className="space-y-6">
        <Card className="p-6 sm:p-8 border-l-4 border-l-red-600 space-y-4">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-red-600 dark:text-red-500" />
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
              What to Expect: Understanding the SVG Container
            </h2>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <p>
              XakuVector embeds your image data directly inside an official W3C{' '}
              <code className="text-zinc-900 dark:text-zinc-200 font-mono">&lt;svg&gt;</code>{' '}
              container using an embedded{' '}
              <code className="text-zinc-900 dark:text-zinc-200 font-mono">&lt;image&gt;</code>{' '}
              raster stream.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 space-y-1">
                <span className="font-semibold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  What XakuVector Does
                </span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
                  Creates valid, standalone <code className="font-mono">.svg</code> files that
                  render in all modern browsers, retain transparent alpha backgrounds, and maintain
                  crisp viewBox scaling without exceeding strict byte limits.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 space-y-1">
                <span className="font-semibold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5 text-xs">
                  <Info className="w-4 h-4 text-amber-500" />
                  What It Does Not Do
                </span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
                  It does <strong>not</strong> trace raster pixels into mathematical bezier paths or
                  vector curves. If you need infinitely rescalable line art with vector nodes, a
                  tracing tool or vector illustrator is required.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* 3. Privacy & Client-Side Guarantee */}
      <section className="space-y-4">
        <Card className="p-6 sm:p-8 bg-gradient-to-br from-zinc-50 to-emerald-50/20 dark:from-zinc-900/90 dark:to-emerald-950/10 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
              Private, 100% Client-Side Processing
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            All image decoding, canvas scaling, WebP/PNG compression, and SVG XML construction
            happen entirely within your local browser runtime. Your images are never transmitted to
            any external server, cloud storage, or third-party API.
          </p>
        </Card>
      </section>

      {/* 4. Frequently Asked Questions */}
      <section id="faq" className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Clear, honest answers about formats, compatibility, and file size optimization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 space-y-2">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-red-500 shrink-0" />
              What image formats can I upload?
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              You can upload PNG, WebP, and JPEG files up to 25 MB in size. Transparent alpha
              channels in PNG and WebP files are fully preserved.
            </p>
          </Card>

          <Card className="p-5 space-y-2">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-red-500 shrink-0" />
              Does this convert an image into vector paths?
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              No. It packages the image into a standard SVG container (
              <code className="font-mono">&lt;image&gt;</code>) with viewBox responsiveness. It does
              not perform vector curve tracing or node extraction.
            </p>
          </Card>

          <Card className="p-5 space-y-2">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-red-500 shrink-0" />
              Can I control the SVG file size?
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Yes. You can choose from presets (&lt;150 KB, &lt;300 KB, &lt;500 KB) or use the
              fine-tune slider. The auto-optimizer iteratively calculates the best quality to stay
              strictly under that limit.
            </p>
          </Card>

          <Card className="p-5 space-y-2">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-red-500 shrink-0" />
              Does reducing file size affect image quality?
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              If an image is very large and the target size budget is small, compression quality or
              internal resolution is adjusted to meet the target. You can inspect the visual result
              in real-time on the comparison stage.
            </p>
          </Card>

          <Card className="p-5 space-y-2">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-red-500 shrink-0" />
              Are my images uploaded to a server?
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              No. The entire conversion and size optimization loop runs locally in your browser
              using HTML5 Canvas and native Web APIs. No image data is ever uploaded.
            </p>
          </Card>

          <Card className="p-5 space-y-2">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-red-500 shrink-0" />
              Which applications can open the resulting SVG?
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              All modern web browsers (Chrome, Firefox, Safari, Edge), Figma, Adobe Illustrator,
              Inkscape, VS Code, and standard graphics viewers can open and display the resulting
              SVG.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
};
