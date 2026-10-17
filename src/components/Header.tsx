import React from 'react';
import { 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Eye, 
  Smartphone,
  Wifi,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  scanlinesEnabled: boolean;
  onToggleScanlines: () => void;
  musicPlaying: boolean;
  onToggleMusic: () => void;
  onOpenApkModal: () => void;
  isOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  scanlinesEnabled,
  onToggleScanlines,
  musicPlaying,
  onToggleMusic,
  onOpenApkModal,
  isOnline,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#030712]/90 backdrop-blur-md border-b border-cyan-500/20 px-3 sm:px-6 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-2.5 min-w-0 shrink-0">
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 bg-cyan-950/60 border border-cyan-400/50 rounded flex items-center justify-center neon-border-cyan shrink-0">
            <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_#22c55e]" />
          </div>
          
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-hud font-bold text-base sm:text-lg tracking-wider text-white truncate">
                TITAN<span className="text-cyan-400">.AI</span>
              </span>
              <span className="hidden xs:inline-block px-1.5 py-0.5 text-[10px] font-terminal tracking-wider bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 rounded">
                v2.4
              </span>
            </div>
            <p className="hidden sm:block text-[11px] font-terminal text-cyan-400/70 truncate">
              UNBAN SYSTEM INTERFACE
            </p>
          </div>
        </div>

        {/* System Online / Local Mode Status (Accurate: Not claiming remote bypass server) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/60 border border-emerald-500/30 rounded text-emerald-400 text-xs font-terminal">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
            <span className="font-semibold tracking-wide">
              {isOnline ? 'LOCAL MODE · READY' : 'OFFLINE MODE'}
            </span>
          </div>

          {/* Quick HUD Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Scanlines Toggle Button */}
            <button
              onClick={onToggleScanlines}
              title={scanlinesEnabled ? 'Turn CRT Scanlines OFF' : 'Turn CRT Scanlines ON'}
              className={`p-2 rounded border text-xs font-terminal transition-all flex items-center gap-1 min-h-[38px] ${
                scanlinesEnabled
                  ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                  : 'bg-black/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden md:inline">SCANLINES</span>
            </button>

            {/* Quick Audio Toggle */}
            <button
              onClick={onToggleMusic}
              title={musicPlaying ? 'Pause Cyber Soundtrack' : 'Play Cyber Soundtrack'}
              className={`p-2 rounded border text-xs font-terminal transition-all flex items-center gap-1 min-h-[38px] ${
                musicPlaying
                  ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300 shadow-[0_0_8px_rgba(34,197,94,0.4)]'
                  : 'bg-black/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {musicPlaying ? (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="hidden md:inline">AUDIO ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="hidden md:inline">AUDIO OFF</span>
                </>
              )}
            </button>

            {/* Android APK Instructions Button */}
            <button
              onClick={onOpenApkModal}
              className="px-2.5 py-1.5 rounded border border-cyan-500/40 bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-300 text-xs font-terminal flex items-center gap-1.5 transition-colors min-h-[38px]"
            >
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline font-semibold">ANDROID APK</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
