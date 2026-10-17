import React, { useState } from 'react';
import { Smartphone, X, Copy, Check, Terminal, ExternalLink, ShieldCheck, Download } from 'lucide-react';

interface AndroidApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidApkModal: React.FC<AndroidApkModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'capacitor' | 'pwa' | 'cordova'>('capacitor');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyCommand = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const capacitorCommands = [
    { title: 'Step 1: Install Capacitor Core & CLI', cmd: 'npm install @capacitor/core @capacitor/cli @capacitor/android' },
    { title: 'Step 2: Initialize Capacitor Config', cmd: 'npx cap init "TITAN UNBAN SYSTEM" "com.titan.unbansystem" --web-dir dist' },
    { title: 'Step 3: Build Web Production Assets', cmd: 'npm run build' },
    { title: 'Step 4: Add Android Native Project', cmd: 'npx cap add android' },
    { title: 'Step 5: Sync Assets & Open in Android Studio', cmd: 'npx cap sync android && npx cap open android' },
    { title: 'Step 6: Build APK in Android Studio', cmd: 'Build -> Build Bundle(s) / APK(s) -> Build APK(s)' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#050914] border border-cyan-500/40 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden neon-border-cyan">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/30 bg-[#02050c]">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-hud font-bold text-sm sm:text-base text-white tracking-wider">
                ANDROID APK PACKAGING & INSTALLATION GUIDE
              </h3>
              <p className="text-[11px] font-terminal text-cyan-400/80">
                CAPACITOR · CORDOVA · PWA STANDALONE DEPLOYMENT
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/60 min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice of Transparency */}
        <div className="bg-cyan-950/30 border-b border-cyan-500/20 px-4 py-2.5 text-xs font-sans text-cyan-200 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            This application is currently running as a responsive high-performance web workstation. Follow the steps below to compile a native Android .APK file.
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-2 bg-[#02040a] border-b border-slate-800 font-terminal text-xs">
          <button
            onClick={() => setActiveTab('capacitor')}
            className={`flex-1 py-1.5 px-3 rounded transition-colors text-center ${
              activeTab === 'capacitor'
                ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CAPACITOR (RECOMMENDED)
          </button>
          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex-1 py-1.5 px-3 rounded transition-colors text-center ${
              activeTab === 'pwa'
                ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            INSTANT PWA (NO COMPILATION)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto terminal-scrollbar space-y-4 font-terminal text-xs">
          {activeTab === 'capacitor' ? (
            <div className="space-y-3">
              <p className="text-slate-300 font-sans text-xs">
                Package this React + Vite codebase into a standalone Android APK using Capacitor in under 5 minutes:
              </p>

              {capacitorCommands.map((item, idx) => (
                <div key={idx} className="bg-[#020409] border border-slate-800 rounded p-2.5 space-y-1">
                  <div className="text-[11px] text-cyan-400 font-bold">{item.title}</div>
                  <div className="flex items-center justify-between gap-2 bg-black/60 p-2 rounded border border-slate-900">
                    <code className="text-emerald-400 break-all select-all">{item.cmd}</code>
                    <button
                      onClick={() => copyCommand(item.cmd, idx)}
                      className="p-1 text-slate-400 hover:text-cyan-300 rounded shrink-0 min-h-[32px] min-w-[32px] flex items-center justify-center"
                      title="Copy command"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 font-sans text-xs text-slate-300">
              <div className="bg-[#02050c] border border-slate-800 rounded p-3 space-y-2">
                <h4 className="font-terminal font-bold text-cyan-400 text-sm">
                  Option 2: Add to Home Screen on Android (PWA)
                </h4>
                <p className="leading-relaxed">
                  You can install this app directly onto your Android device without building an APK:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 leading-relaxed font-terminal text-[11px]">
                  <li>Open Chrome or Samsung Internet on your Android phone.</li>
                  <li>Tap the three vertical dots (Menu) in the top-right corner.</li>
                  <li>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                  <li>The TITAN UNBAN SYSTEM cyber icon will appear on your app drawer like a native APK.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#02050c] border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-terminal text-xs transition-colors min-h-[40px]"
          >
            CLOSE GUIDE
          </button>
        </div>
      </div>
    </div>
  );
};
