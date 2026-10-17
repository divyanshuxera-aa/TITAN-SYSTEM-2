import React, { useRef, useEffect, useState } from 'react';
import { Terminal as TerminalIcon, Copy, Trash2, ArrowDownCircle, Check, Play, Pause, AlertCircle } from 'lucide-react';

interface LiveCodeStreamProps {
  isSequenceActive: boolean;
  onClearLogs?: () => void;
}

export const BAN_TO_UNBAN_SEQUENCE = [
  '[STATUS CHECK] CURRENT STATE: [BANNED] | Partition: /dev/auth/cluster_07',
  '[STATUS TRANSITION] BANNED ----> PENDING_UNBAN_RESTORATION',
  '[HEX INJECT] 806A 7E51 C698 :: RE-APPLYING UNBAN TICKET',
  '[OVERRIDE] Injecting unban script sequence -> Memory Address:[0xE0F6032C]',
  '[STATUS TRANSITION] BANNED ----> PENDING_UNBAN_RESTORATION',
  '[GARENA GATEWAY] Gateway verification in progress... Bypass frame sent',
  '[STATUS CHECK] CURRENT STATE: [BANNED] | Partition: /dev/auth/cluster_07',
  '[PATCH] Modifying register: IS_BANNED=1 -> IS_BANNED=0 ... WAITING ACK',
  '[GARENA GATEWAY] Gateway verification in progress... Bypass frame sent',
  '[DAEMON] Applying unban token expiry lock for 10-day synchronization',
  '[PATCH] Modifying register: IS_BANNED=1 -> IS_BANNED=0 ... WAITING ACK',
  '[OVERRIDE] Injecting unban script sequence -> Memory Address:[0xE48B6475]',
  '[DAEMON] Applying unban token expiry lock for 10-day synchronization',
  '[ALERT] Security bot flagged restore attempt. Auto-routing proxy...',
  '[ALERT] Security bot flagged restore attempt. Auto-routing proxy...',
  '[PATCH] Modifying register: IS_BANNED=1 -> IS_BANNED=0 ... WAITING ACK',
  '[GARENA GATEWAY] Gateway verification in progress... Bypass frame sent',
  '[SYNC SUCCESS] Restoration token persistent across cloud nodes.',
  '[OVERRIDE] Injecting unban script sequence -> Memory Address:[0x9BCE7FCC]',
  '[ALERT] Security bot flagged restore attempt. Auto-routing proxy...',
  '[ALERT] Security bot flagged restore attempt. Auto-routing proxy...',
  '[ALERT] Security bot flagged restore attempt. Auto-routing proxy...',
  '[ALERT] Security bot flagged restore attempt. Auto-routing proxy...',
  '[ALERT] Security bot flagged restore attempt. Auto-routing proxy...',
  '[SYNC SUCCESS] Restoration token persistent across cloud nodes.',
  '[OVERRIDE] Injecting unban script sequence -> Memory Address:[0x84F554D8]',
  '[DAEMON] Applying unban token expiry lock for 10-day synchronization',
  '[STATUS TRANSITION] BANNED ----> PENDING_UNBAN_RESTORATION',
  '[GARENA GATEWAY] Gateway verification in progress... Bypass frame sent',
  '[OVERRIDE] Injecting unban script sequence -> Memory Address:[0x76761E9C]',
  '[STATUS CHECK] CURRENT STATE: [BANNED] | Partition: /dev/auth/cluster_07',
  '[STATUS TRANSITION] BANNED ----> PENDING_UNBAN_RESTORATION',
  '[GARENA GATEWAY] Gateway verification in progress... Bypass frame sent',
  '[STATUS CHECK] CURRENT STATE: [BANNED] | Partition: /dev/auth/cluster_07',
  '[DAEMON] Applying unban token expiry lock for 30-day synchronization',
  '[OVERRIDE] Injecting unban script sequence -> Memory Address:[0xCA9ADCC9]',
  '[HEX INJECT] 6BF0 9254 55AE :: RE-APPLYING UNBAN TICKET',
  '[STATUS TRANSITION] BANNED ----> PENDING_UNBAN_RESTORATION',
  '[ALERT] Security bot flagged restore attempt. Auto-routing proxy...',
];

export const LiveCodeStream: React.FC<LiveCodeStreamProps> = ({ isSequenceActive }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [copied, setCopied] = useState(false);

  // Animation state: completed lines and currently typing line
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Reset or initialize when isSequenceActive changes
  useEffect(() => {
    if (!isSequenceActive) {
      setCompletedLines([]);
      setCurrentLineIndex(0);
      setCurrentCharIndex(0);
      setIsFinished(false);
    }
  }, [isSequenceActive]);

  // Typewriter animation effect
  useEffect(() => {
    if (!isSequenceActive || isFinished) return;

    if (currentLineIndex >= BAN_TO_UNBAN_SEQUENCE.length) {
      setIsFinished(true);
      return;
    }

    const targetLine = BAN_TO_UNBAN_SEQUENCE[currentLineIndex];

    if (currentCharIndex < targetLine.length) {
      // Type next chunk of characters (2 chars at a time for energetic cyber cadence)
      const timeout = setTimeout(() => {
        setCurrentCharIndex((prev) => Math.min(prev + 2, targetLine.length));
      }, 16);
      return () => clearTimeout(timeout);
    } else {
      // Line completed, short pause before moving to next line
      const timeout = setTimeout(() => {
        setCompletedLines((prev) => [...prev, targetLine]);
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }, 120);
      return () => clearTimeout(timeout);
    }
  }, [isSequenceActive, currentLineIndex, currentCharIndex, isFinished]);

  // Auto-scroll effect
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [completedLines, currentCharIndex, autoScroll]);

  const handleCopyLogs = () => {
    const textToCopy = isSequenceActive
      ? [
          ...completedLines,
          ...(currentLineIndex < BAN_TO_UNBAN_SEQUENCE.length
            ? [BAN_TO_UNBAN_SEQUENCE[currentLineIndex].slice(0, currentCharIndex)]
            : []),
        ].join('\n')
      : 'Terminal Idle. Sequence not started.';

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLineClass = (line: string) => {
    if (line.includes('[ALERT]')) {
      return 'text-amber-400 font-semibold';
    }
    if (line.includes('[SYNC SUCCESS]')) {
      return 'text-emerald-400 font-bold';
    }
    if (line.includes('[HEX INJECT]') || line.includes('[OVERRIDE]')) {
      return 'text-cyan-300 font-medium';
    }
    if (line.includes('[GARENA GATEWAY]')) {
      return 'text-teal-300';
    }
    if (line.includes('[STATUS TRANSITION]')) {
      return 'text-cyan-400 font-bold';
    }
    if (line.includes('[PATCH]')) {
      return 'text-emerald-300';
    }
    if (line.includes('[STATUS CHECK]')) {
      return 'text-slate-300';
    }
    if (line.includes('[DAEMON]')) {
      return 'text-teal-400';
    }
    return 'text-slate-200';
  };

  const currentTypingSnippet =
    isSequenceActive && currentLineIndex < BAN_TO_UNBAN_SEQUENCE.length
      ? BAN_TO_UNBAN_SEQUENCE[currentLineIndex].slice(0, currentCharIndex)
      : '';

  return (
    <div className="rounded-xl bg-[#030611] border border-cyan-500/40 overflow-hidden shadow-xl flex flex-col h-[380px] sm:h-[420px] neon-border-cyan">
      {/* Stream Header */}
      <div className="bg-[#02040a] px-3 sm:px-4 py-2.5 border-b border-cyan-500/20 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-emerald-400" />
            <h2 className="font-hud font-bold text-xs sm:text-sm tracking-widest text-emerald-400">
              LIVE CODE STREAM
            </h2>
          </div>
          <p className="text-[10px] font-terminal text-cyan-400 tracking-wider">
            BAN TO UNBAN SEQUENCE
          </p>
        </div>

        {/* Action Controls & Status */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span
            className={`text-[10px] font-terminal px-2 py-0.5 rounded border ${
              isSequenceActive
                ? isFinished
                  ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40'
                  : 'bg-cyan-950/70 text-cyan-300 border-cyan-400/40 animate-pulse'
                : 'bg-black/60 text-slate-400 border-slate-800'
            }`}
          >
            {isSequenceActive
              ? isFinished
                ? 'SEQUENCE FINISHED'
                : 'RUNNING SEQUENCE'
              : 'IDLE · AWAITING SUBMISSION'}
          </span>

          <button
            onClick={() => setAutoScroll(!autoScroll)}
            title={autoScroll ? 'Pause auto-scroll' : 'Resume auto-scroll'}
            className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1 ${
              autoScroll ? 'text-cyan-400 bg-cyan-950/50' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowDownCircle className={`w-3.5 h-3.5 ${autoScroll && isSequenceActive && !isFinished ? 'animate-bounce' : ''}`} />
            <span className="hidden xs:inline text-[10px] font-terminal">
              {autoScroll ? 'AUTO' : 'MANUAL'}
            </span>
          </button>

          <button
            onClick={handleCopyLogs}
            title="Copy logs"
            className="p-1.5 text-slate-400 hover:text-cyan-300 transition-colors rounded hover:bg-slate-800/60"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Simulated Visual Animation Label */}
      <div className="bg-[#02050e] border-b border-slate-800/80 px-3 py-1 flex items-center gap-1.5 text-[10px] font-terminal text-slate-400">
        <AlertCircle className="w-3 h-3 text-cyan-400 shrink-0" />
        <span className="truncate">
          SIMULATED VISUAL ANIMATION · NOT A REAL GARENA SERVER OPERATION
        </span>
      </div>

      {/* Terminal Output Body */}
      <div
        ref={scrollRef}
        className="flex-1 p-3.5 font-terminal text-[11px] sm:text-xs overflow-y-auto terminal-scrollbar space-y-1 bg-[#030611]/95"
      >
        {!isSequenceActive ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 font-terminal">
            <div className="w-9 h-9 rounded-full bg-slate-900/80 border border-slate-800 flex items-center justify-center mb-2">
              <TerminalIcon className="w-5 h-5 text-slate-500" />
            </div>
            <div className="text-slate-300 font-bold text-xs tracking-wider">
              TERMINAL IDLE · SEQUENCE STANDBY
            </div>
            <div className="text-[11px] text-slate-500 mt-1 max-w-xs">
              Complete UID validation and click &ldquo;SUBMIT UNBAN REQUEST&rdquo; below to initiate the visual sequence.
            </div>
          </div>
        ) : (
          <>
            {completedLines.map((line, index) => (
              <div
                key={index}
                className={`leading-relaxed tracking-wide hover:bg-cyan-950/20 px-1 rounded transition-colors break-words ${getLineClass(
                  line
                )}`}
              >
                {line}
              </div>
            ))}

            {currentTypingSnippet && (
              <div
                className={`leading-relaxed tracking-wide px-1 break-words ${getLineClass(
                  currentTypingSnippet
                )}`}
              >
                {currentTypingSnippet}
                <span className="terminal-cursor inline-block w-2 h-3.5 bg-emerald-400 align-middle ml-0.5" />
              </div>
            )}

            {isFinished && (
              <div className="pt-2 text-emerald-400 font-bold flex items-center gap-1.5">
                <span>&gt; SEQUENCE COMPLETED. COOLDOWN IN EFFECT.</span>
                <span className="terminal-cursor inline-block w-2 h-3.5 bg-emerald-400 align-middle" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
