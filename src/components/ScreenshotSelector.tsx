import React, { useRef, useState } from 'react';
import { Image as ImageIcon, Upload, Trash2, Maximize2, AlertTriangle, FileCheck, RefreshCw, X } from 'lucide-react';
import { ScreenshotData } from '../types';

interface ScreenshotSelectorProps {
  screenshot: ScreenshotData;
  onSelectScreenshot: (data: ScreenshotData) => void;
  onRemoveScreenshot: () => void;
  onAddLog: (level: 'OK' | 'READY' | 'INFO' | 'WARN' | 'ERROR' | 'STATUS' | 'COMPLETE', msg: string) => void;
}

const SUPPORTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

export const ScreenshotSelector: React.FC<ScreenshotSelectorProps> = ({
  screenshot,
  onSelectScreenshot,
  onRemoveScreenshot,
  onAddLog,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isInspecting, setIsInspecting] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const isValidType = SUPPORTED_TYPES.includes(file.type) || SUPPORTED_EXTENSIONS.includes(fileExtension);

    if (!isValidType) {
      setErrorMessage(
        `Unsupported file format: "${file.name}". Please select a JPG, JPEG, PNG, or WEBP screenshot.`
      );
      onAddLog('WARN', `Screenshot rejected: Unsupported file format [${file.type || fileExtension}].`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setErrorMessage(null);

    // Read image and create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const previewUrl = event.target?.result as string;

      // Extract image dimensions
      const img = new Image();
      img.onload = () => {
        const data: ScreenshotData = {
          file,
          previewUrl,
          fileName: file.name,
          fileSizeFormatted: formatFileSize(file.size),
          fileType: file.type || fileExtension.replace('.', '').toUpperCase(),
          uploadTimestamp: new Date().toLocaleTimeString(),
          dimensions: { width: img.naturalWidth, height: img.naturalHeight },
        };

        onSelectScreenshot(data);
        onAddLog(
          'OK',
          `Screenshot selected: ${file.name} (${data.fileSizeFormatted}, ${img.naturalWidth}x${img.naturalHeight}px).`
        );
      };
      img.src = previewUrl;
    };

    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onRemoveScreenshot();
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onAddLog('INFO', 'Screenshot removed from local cache.');
  };

  return (
    <div className="rounded-xl bg-[#040814] border border-cyan-500/40 p-4 sm:p-6 shadow-xl relative overflow-hidden neon-border-cyan">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cyan-500/20">
        <div>
          <h2 className="font-hud font-bold text-base sm:text-lg tracking-wider text-white">
            SCREENSHOT SELECTOR <span className="text-cyan-400">/ BAN NOTICE</span>
          </h2>
          <p className="text-xs font-sans text-slate-400 mt-0.5">
            Attach in-game ban warning, suspension dialogue, or error code for client inspection.
          </p>
        </div>

        <div className="text-[11px] font-terminal text-cyan-400/80 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30 self-start sm:self-auto">
          JPG · PNG · WEBP
        </div>
      </div>

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error Notice */}
      {errorMessage && (
        <div className="mt-3 bg-rose-950/40 border border-rose-500/50 rounded-lg p-3 text-xs font-terminal text-rose-300 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{errorMessage}</div>
        </div>
      )}

      {/* Main Container */}
      <div className="mt-4">
        {screenshot.previewUrl ? (
          /* Active Screenshot Loaded View */
          <div className="space-y-4">
            <div className="relative group rounded-lg overflow-hidden border border-cyan-500/50 bg-black max-h-[360px] flex items-center justify-center">
              <img
                src={screenshot.previewUrl}
                alt="Selected Ban Screenshot"
                referrerPolicy="no-referrer"
                className="max-h-[340px] w-auto max-w-full object-contain mx-auto"
              />

              {/* Hover / Touch HUD Action Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-90 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-terminal text-cyan-300 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded border border-cyan-500/30">
                  <div className="flex items-center gap-1.5 truncate">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{screenshot.fileName}</span>
                  </div>
                  <span className="shrink-0 text-[10px] text-slate-400 ml-2">
                    {screenshot.fileSizeFormatted}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setIsInspecting(true)}
                    className="px-3 py-1.5 bg-cyan-900/80 hover:bg-cyan-800 text-cyan-200 text-xs font-terminal rounded flex items-center gap-1.5 transition-colors border border-cyan-400/40"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>ZOOM INSPECT</span>
                  </button>
                </div>
              </div>
            </div>

            {/* File Metadata Details & Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#02050c] border border-slate-800 rounded-lg p-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-terminal">
                <div>
                  <span className="text-[10px] text-slate-500 block">FORMAT</span>
                  <span className="text-cyan-300 font-bold">{screenshot.fileType}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">DIMENSIONS</span>
                  <span className="text-slate-300 font-bold">
                    {screenshot.dimensions
                      ? `${screenshot.dimensions.width}x${screenshot.dimensions.height}`
                      : 'N/A'}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-500 block">LOADED AT</span>
                  <span className="text-slate-400">{screenshot.uploadTimestamp}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 sm:flex-initial px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-terminal flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>CHANGE</span>
                </button>

                <button
                  onClick={handleRemove}
                  className="flex-1 sm:flex-initial px-3 py-2 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/40 text-rose-300 rounded text-xs font-terminal flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>REMOVE SCREENSHOT</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State: Select Screenshot CTA */
          <div className="border-2 border-dashed border-cyan-500/30 hover:border-cyan-400/60 rounded-xl p-6 sm:p-8 text-center bg-[#02050e]/60 transition-colors">
            <div className="w-12 h-12 rounded-full bg-cyan-950/60 border border-cyan-400/40 flex items-center justify-center mx-auto mb-3 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
              <Upload className="w-6 h-6 text-cyan-400" />
            </div>

            <h3 className="font-hud font-bold text-sm sm:text-base text-white tracking-wide">
              NO BAN SCREENSHOT ATTACHED
            </h3>

            <p className="text-xs font-sans text-slate-400 max-w-md mx-auto mt-1 mb-5">
              Select an image from device storage showing the Free Fire ban dialogue, suspension countdown, or error code for local evidence compilation.
            </p>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-terminal font-bold text-sm tracking-wider rounded-lg shadow-lg shadow-cyan-950/50 inline-flex items-center gap-2 transition-all min-h-[48px] active:scale-[0.98]"
            >
              <Upload className="w-4 h-4" />
              <span>SELECT SCREENSHOT</span>
            </button>

            <div className="mt-3 text-[11px] font-terminal text-slate-500">
              Supported Formats: JPG, JPEG, PNG, WEBP · Mobile & Tablet Friendly
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen HUD Inspection Modal */}
      {isInspecting && screenshot.previewUrl && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col p-4 sm:p-6 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/30 text-xs font-terminal">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <ImageIcon className="w-4 h-4" />
              <span>HUD INSPECTOR · {screenshot.fileName}</span>
            </div>
            <button
              onClick={() => setIsInspecting(false)}
              className="p-2 rounded bg-slate-800 text-slate-300 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-auto flex items-center justify-center p-2 relative">
            <img
              src={screenshot.previewUrl}
              alt="Inspected Screenshot"
              referrerPolicy="no-referrer"
              className="max-h-full max-w-full object-contain rounded border border-cyan-500/30 shadow-2xl"
            />
          </div>

          <div className="pt-2 text-center text-xs font-terminal text-slate-400 border-t border-slate-800">
            Press close or tap background to return to dashboard.
          </div>
        </div>
      )}
    </div>
  );
};
