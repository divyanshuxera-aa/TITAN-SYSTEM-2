import React, { useState, useEffect } from 'react';
import { Clock, RotateCcw, Calendar, Info, Play, ShieldAlert } from 'lucide-react';
import { CountdownTime } from '../types';

interface CountdownPanelProps {
  isActive: boolean;
  onResetTimer?: () => void;
}

const STORAGE_KEY = 'titan_30day_countdown_target';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export const CountdownPanel: React.FC<CountdownPanelProps> = ({ isActive, onResetTimer }) => {
  const [targetTimestamp, setTargetTimestamp] = useState<number | null>(() => {
    // Only retrieve stored target if one was saved by a previous submission
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed)) return parsed;
    }
    return null;
  });

  const [timeLeft, setTimeLeft] = useState<CountdownTime>({
    days: 30,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Synchronize target timestamp when activated
  useEffect(() => {
    if (isActive) {
      // If we don't have a target yet, create one for 30 days
      if (!targetTimestamp) {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = parseInt(saved, 10);
          if (!isNaN(parsed)) {
            setTargetTimestamp(parsed);
            return;
          }
        }
        const newTarget = Date.now() + THIRTY_DAYS_MS;
        localStorage.setItem(STORAGE_KEY, newTarget.toString());
        setTargetTimestamp(newTarget);
      }
    }
  }, [isActive, targetTimestamp]);

  // Tick timer every second only when active and targetTimestamp exists
  useEffect(() => {
    if (!isActive || !targetTimestamp) {
      return;
    }

    const calculateTime = () => {
      const difference = targetTimestamp - Date.now();

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [isActive, targetTimestamp]);

  const handleReset = () => {
    const newTarget = Date.now() + THIRTY_DAYS_MS;
    localStorage.setItem(STORAGE_KEY, newTarget.toString());
    setTargetTimestamp(newTarget);
    setShowResetConfirm(false);
    if (onResetTimer) onResetTimer();
  };

  const targetDateFormatted = targetTimestamp
    ? new Date(targetTimestamp).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'STANDBY · AWAITING SUBMISSION';

  return (
    <div className="rounded-xl bg-gradient-to-b from-[#050b18] to-[#030612] border border-cyan-500/40 p-4 sm:p-6 shadow-xl relative overflow-hidden neon-border-cyan">
      {/* HUD Framing Accents */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-2.5">
          <Clock className={`w-5 h-5 text-cyan-400 ${isActive ? 'animate-spin-slow' : ''}`} />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-hud font-bold text-base sm:text-lg tracking-wider text-white">
                30-DAY REMINDER <span className="text-cyan-400">· TIME LEFT</span>
              </h2>
              <span
                className={`text-[10px] font-terminal px-2 py-0.5 rounded border ${
                  isActive
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                    : 'bg-black/60 text-slate-400 border-slate-800'
                }`}
              >
                {isActive ? 'COOLDOWN COUNTDOWN ACTIVE' : 'TIMER IDLE'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-terminal text-slate-400 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-500" />
              <span>
                TARGET EXPIRATION:{' '}
                <strong className="text-cyan-300 font-semibold">{targetDateFormatted}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Reset Trigger (only visible when timer has been started) */}
        {isActive && (
          <div className="flex items-center gap-2">
            {showResetConfirm ? (
              <div className="flex items-center gap-1.5 bg-black/80 border border-amber-500/50 p-1 rounded font-terminal text-xs">
                <span className="text-amber-400 px-1 text-[11px]">RESET TIMER?</span>
                <button
                  onClick={handleReset}
                  className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded text-[10px] transition-colors"
                >
                  YES
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] transition-colors"
                >
                  NO
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-3 py-1.5 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/40 text-cyan-300 rounded text-xs font-terminal flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span>RESET 30-DAY TIMER</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Futuristic Digital Digits Grid */}
      <div className="py-5 sm:py-6">
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-2xl mx-auto text-center font-terminal">
          {/* Days */}
          <div className="bg-[#02040b] border border-cyan-500/40 rounded-lg p-2.5 sm:p-4 shadow-inner relative group">
            <div className={`text-2xl sm:text-4xl lg:text-5xl font-extrabold tabular-nums tracking-wider ${isActive ? 'text-cyan-300 neon-glow-cyan' : 'text-slate-500'}`}>
              {isActive ? String(timeLeft.days).padStart(2, '0') : '30'}
            </div>
            <div className="text-[10px] sm:text-xs font-bold text-cyan-400/80 mt-1 uppercase tracking-widest">
              DAYS
            </div>
          </div>

          {/* Hours */}
          <div className="bg-[#02040b] border border-cyan-500/40 rounded-lg p-2.5 sm:p-4 shadow-inner relative group">
            <div className={`text-2xl sm:text-4xl lg:text-5xl font-extrabold tabular-nums tracking-wider ${isActive ? 'text-cyan-300 neon-glow-cyan' : 'text-slate-500'}`}>
              {isActive ? String(timeLeft.hours).padStart(2, '0') : '00'}
            </div>
            <div className="text-[10px] sm:text-xs font-bold text-cyan-400/80 mt-1 uppercase tracking-widest">
              HOURS
            </div>
          </div>

          {/* Minutes */}
          <div className="bg-[#02040b] border border-cyan-500/40 rounded-lg p-2.5 sm:p-4 shadow-inner relative group">
            <div className={`text-2xl sm:text-4xl lg:text-5xl font-extrabold tabular-nums tracking-wider ${isActive ? 'text-teal-300' : 'text-slate-500'}`}>
              {isActive ? String(timeLeft.minutes).padStart(2, '0') : '00'}
            </div>
            <div className="text-[10px] sm:text-xs font-bold text-teal-400/80 mt-1 uppercase tracking-widest">
              MINUTES
            </div>
          </div>

          {/* Seconds */}
          <div className="bg-[#02040b] border border-emerald-500/40 rounded-lg p-2.5 sm:p-4 shadow-inner relative group">
            <div className={`text-2xl sm:text-4xl lg:text-5xl font-extrabold tabular-nums tracking-wider ${isActive ? 'text-emerald-400 neon-glow-green' : 'text-slate-500'}`}>
              {isActive ? String(timeLeft.seconds).padStart(2, '0') : '00'}
            </div>
            <div className="text-[10px] sm:text-xs font-bold text-emerald-400/80 mt-1 uppercase tracking-widest">
              SECONDS
            </div>
          </div>
        </div>

        {!isActive && (
          <div className="mt-3 text-center text-xs font-terminal text-slate-400">
            [ COOLDOWN TIMER STANDBY · SUBMIT THE UNBAN FORM BELOW TO ACTIVATE 30-DAY COUNTDOWN ]
          </div>
        )}
      </div>

      {/* Mandatory Disclaimer & Compliance Notice */}
      <div className="bg-[#02050e] border border-slate-800 rounded-lg p-3 flex items-start gap-2.5 text-xs font-sans text-slate-300">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-cyan-300 font-semibold">Local Tracker Notice: </strong> 
          This countdown is a client-side reminder for monitoring your 30-day official ticket follow-up period. It starts only upon form submission and does not represent an automated server unban or guarantee account restoration.
        </p>
      </div>
    </div>
  );
};
