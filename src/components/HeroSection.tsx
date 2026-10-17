import React from 'react';
import { Shield, Activity, Lock, Radio, Terminal as TerminalIcon } from 'lucide-react';

interface HeroSectionProps {
  sessionActive: boolean;
  activeUid: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ sessionActive, activeUid }) => {
  return (
    <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#050b18] via-[#040813] to-[#081329] border border-cyan-500/40 p-4 sm:p-6 lg:p-7 neon-border-cyan shadow-2xl">
      {/* Tactical HUD Corner Reticles */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

      {/* Cyber Background Glow Circles */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Column: Activated Banner & Description */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-terminal">
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-950/70 border border-cyan-400/50 rounded text-cyan-300 font-bold uppercase tracking-wider">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              SYSTEM ACTIVATED
            </span>
            <span className="px-2 py-0.5 bg-black/60 border border-slate-700/60 rounded text-slate-300">
              HUD ARCHITECTURE v2.4
            </span>
            <span className="px-2 py-0.5 bg-emerald-950/60 border border-emerald-500/40 rounded text-emerald-300">
              LOCAL ENCRYPTION ON
            </span>
          </div>

          <h1 className="font-hud text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-wide text-white leading-tight">
            TITAN UNBAN SYSTEM{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">
              ACTIVATED
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
            Client-side diagnostic workstation for Free Fire player identifiers, ban notification screenshot analysis, appeal countdown tracking, and account security verification.
          </p>
        </div>

        {/* Right Column: Tactical HUD Status Module */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 shrink-0 md:w-72 font-terminal">
          <div className="bg-[#02050c]/80 border border-cyan-500/30 rounded-lg p-2.5 sm:p-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>CORE STATUS</span>
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="mt-1 text-sm sm:text-base font-bold text-emerald-400">
              ONLINE / LOCAL
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Zero external leaks</div>
          </div>

          <div className="bg-[#02050c]/80 border border-cyan-500/30 rounded-lg p-2.5 sm:p-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>ACTIVE TARGET</span>
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="mt-1 text-sm sm:text-base font-bold text-cyan-300 truncate">
              {activeUid ? activeUid : 'NONE'}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">UID Buffer</div>
          </div>

          <div className="bg-[#02050c]/80 border border-cyan-500/30 rounded-lg p-2.5 sm:p-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>PRIVACY MODE</span>
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="mt-1 text-sm sm:text-base font-bold text-slate-200">
              100% CLIENT
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">No login credentials</div>
          </div>

          <div className="bg-[#02050c]/80 border border-cyan-500/30 rounded-lg p-2.5 sm:p-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>SECURITY CHECK</span>
              <TerminalIcon className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <div className="mt-1 text-sm sm:text-base font-bold text-teal-300">
              COMPLIANT
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Safe appeals only</div>
          </div>
        </div>
      </div>
    </section>
  );
};
