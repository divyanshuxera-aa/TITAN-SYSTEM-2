import React from 'react';
import { ShieldCheck, CheckCircle2, Clock, CheckSquare, Sparkles } from 'lucide-react';
import { LocalSessionInfo } from '../types';

interface LocalSessionStatusProps {
  sessionInfo: LocalSessionInfo;
  isSubmitted: boolean;
  submittedUid: string;
}

export const LocalSessionStatus: React.FC<LocalSessionStatusProps> = ({
  sessionInfo,
  isSubmitted,
  submittedUid,
}) => {
  const getUidStatusBadge = () => {
    if (isSubmitted && submittedUid) {
      return {
        tag: 'SUBMITTED',
        text: `UID ${submittedUid} submitted to sequence.`,
        badgeClass: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40',
      };
    }

    switch (sessionInfo.uidStatus) {
      case 'VALIDATED':
        return {
          tag: 'COMPLETE',
          text: 'Local input validation finished.',
          badgeClass: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40',
        };
      case 'CHECKING':
        return {
          tag: 'PROCESSING',
          text: 'Local syntax validation in progress...',
          badgeClass: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40',
        };
      case 'SYNTAX_ERROR':
        return {
          tag: 'ERROR',
          text: 'UID syntax error detected.',
          badgeClass: 'text-rose-400 border-rose-500/40 bg-rose-950/40',
        };
      case 'WAITING_INPUT':
      default:
        return {
          tag: 'READY',
          text: 'Local input validation module ready.',
          badgeClass: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/40',
        };
    }
  };

  const getScreenshotStatusBadge = () => {
    switch (sessionInfo.screenshotStatus) {
      case 'IMAGE_LOADED':
        return {
          tag: 'LOADED',
          text: 'Screenshot verified & cached locally.',
          badgeClass: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40',
        };
      case 'INVALID_FORMAT':
        return {
          tag: 'WARN',
          text: 'Unsupported image file format.',
          badgeClass: 'text-amber-400 border-amber-500/40 bg-amber-950/40',
        };
      case 'NO_IMAGE':
      default:
        return {
          tag: 'READY',
          text: 'Screenshot selector ready.',
          badgeClass: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/40',
        };
    }
  };

  const getMusicStatusBadge = () => {
    switch (sessionInfo.musicStatus) {
      case 'SYNTH_ACTIVE':
        return {
          tag: 'ACTIVE',
          text: 'TITAN synth loop operational.',
          badgeClass: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40',
        };
      case 'FILE_PLAYING':
        return {
          tag: 'ACTIVE',
          text: 'Custom audio track playing.',
          badgeClass: 'text-teal-400 border-teal-500/40 bg-teal-950/40',
        };
      case 'PAUSED':
        return {
          tag: 'PAUSED',
          text: 'Background audio paused.',
          badgeClass: 'text-amber-400 border-amber-500/40 bg-amber-950/40',
        };
      case 'DISABLED':
      default:
        return {
          tag: 'STANDBY',
          text: 'Background music standby.',
          badgeClass: 'text-slate-400 border-slate-700 bg-slate-900/60',
        };
    }
  };

  const getSequenceStatusBadge = () => {
    if (isSubmitted) {
      return {
        tag: 'ACTIVE',
        text: 'BAN TO UNBAN Sequence animating.',
        badgeClass: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40',
      };
    }
    return {
      tag: 'STANDBY',
      text: 'Live code sequence idle (awaiting submit).',
      badgeClass: 'text-slate-400 border-slate-700 bg-slate-900/60',
    };
  };

  const uidBadge = getUidStatusBadge();
  const screenBadge = getScreenshotStatusBadge();
  const musicBadge = getMusicStatusBadge();
  const seqBadge = getSequenceStatusBadge();

  return (
    <div className="rounded-xl bg-[#030611] border border-cyan-500/40 overflow-hidden shadow-xl flex flex-col h-[380px] sm:h-[420px] neon-border-cyan">
      {/* Panel Header */}
      <div className="bg-[#02040a] px-3 sm:px-4 py-2.5 border-b border-cyan-500/20 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <h2 className="font-hud font-bold text-xs sm:text-sm tracking-widest text-cyan-400">
            LOCAL SESSION STATUS
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-terminal text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{isSubmitted ? 'SUBMISSION ACTIVE' : 'INITIALIZED'}</span>
        </div>
      </div>

      {/* Status Items List */}
      <div className="flex-1 p-3.5 sm:p-4 space-y-2.5 font-terminal text-xs overflow-y-auto terminal-scrollbar">
        {/* Item 1: Submission / UID Status */}
        <div className="bg-[#02050c] border border-slate-800/80 rounded-lg p-2.5 sm:p-3 flex items-start gap-2.5">
          <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold uppercase shrink-0 ${uidBadge.badgeClass}`}>
            [ {uidBadge.tag} ]
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-slate-200 font-semibold">{uidBadge.text}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">UID syntax analysis engine</div>
          </div>
        </div>

        {/* Item 2: Live Code Stream Sequence */}
        <div className="bg-[#02050c] border border-slate-800/80 rounded-lg p-2.5 sm:p-3 flex items-start gap-2.5">
          <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold uppercase shrink-0 ${seqBadge.badgeClass}`}>
            [ {seqBadge.tag} ]
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-slate-200 font-semibold">{seqBadge.text}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Terminal typewriter animation stream</div>
          </div>
        </div>

        {/* Item 3: Screenshot Selector */}
        <div className="bg-[#02050c] border border-slate-800/80 rounded-lg p-2.5 sm:p-3 flex items-start gap-2.5">
          <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold uppercase shrink-0 ${screenBadge.badgeClass}`}>
            [ {screenBadge.tag} ]
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-slate-200 font-semibold">{screenBadge.text}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Local image preview and inspection</div>
          </div>
        </div>

        {/* Item 4: Background Music */}
        <div className="bg-[#02050c] border border-slate-800/80 rounded-lg p-2.5 sm:p-3 flex items-start gap-2.5">
          <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold uppercase shrink-0 ${musicBadge.badgeClass}`}>
            [ {musicBadge.tag} ]
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-slate-200 font-semibold">{musicBadge.text}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Ambient audio synthesis module</div>
          </div>
        </div>

        {/* Item 5: Local Session Core */}
        <div className="bg-[#02050c] border border-slate-800/80 rounded-lg p-2.5 sm:p-3 flex items-start gap-2.5">
          <span className="px-1.5 py-0.5 rounded border text-[10px] font-bold uppercase shrink-0 text-emerald-400 border-emerald-500/40 bg-emerald-950/40">
            [ STATUS ]
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-slate-200 font-semibold">Local session active.</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Client-side execution verified</div>
          </div>
        </div>
      </div>

      {/* Footer Info: Last Action Timestamp */}
      <div className="bg-[#02040a] px-3 sm:px-4 py-2 border-t border-cyan-500/20 flex items-center justify-between text-[11px] font-terminal text-slate-400 shrink-0">
        <div className="flex items-center gap-1.5 truncate">
          <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="truncate">LAST ACTION: <span className="text-cyan-300 font-medium">{sessionInfo.lastAction}</span></span>
        </div>
        <span className="tabular-nums text-slate-500 text-[10px] shrink-0 ml-2">
          {sessionInfo.lastActionTimestamp}
        </span>
      </div>
    </div>
  );
};
