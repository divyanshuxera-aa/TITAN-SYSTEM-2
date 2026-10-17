import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PlayerIdentityCard } from './components/PlayerIdentityCard';
import { LiveCodeStream } from './components/LiveCodeStream';
import { LocalSessionStatus } from './components/LocalSessionStatus';
import { CountdownPanel } from './components/CountdownPanel';
import { UidValidator } from './components/UidValidator';
import { ScreenshotSelector } from './components/ScreenshotSelector';
import { MusicPlayer } from './components/MusicPlayer';
import { AccountSafety } from './components/AccountSafety';
import { AndroidApkModal } from './components/AndroidApkModal';
import { TerminalLog, LogLevel, LocalSessionInfo, ScreenshotData } from './types';
import { cyberSynth } from './audio/synthAudio';

export default function App() {
  const [scanlinesEnabled, setScanlinesEnabled] = useState(true);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [showApkModal, setShowApkModal] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicSource, setMusicSource] = useState<'synth' | 'custom'>('synth');

  // Submission & Sequence Activation States (Initial state: idle, not running)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedUid, setSubmittedUid] = useState<string>('');
  const [activeUid, setActiveUid] = useState<string>('');
  const [isSequenceActive, setIsSequenceActive] = useState<boolean>(false);
  const [isCountdownActive, setIsCountdownActive] = useState<boolean>(false);

  const [screenshotData, setScreenshotData] = useState<ScreenshotData>({
    file: null,
    previewUrl: null,
    fileName: '',
    fileSizeFormatted: '',
    fileType: '',
    uploadTimestamp: '',
  });

  const [sessionInfo, setSessionInfo] = useState<LocalSessionInfo>({
    sessionActive: true,
    uidStatus: 'WAITING_INPUT',
    screenshotStatus: 'NO_IMAGE',
    musicStatus: 'DISABLED',
    lastAction: 'TITAN interface loaded. Standby for form submission.',
    lastActionTimestamp: new Date().toLocaleTimeString(),
    initializationTime: new Date().toLocaleTimeString(),
  });

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Central session action dispatcher
  const logSessionAction = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setSessionInfo((prev) => ({
      ...prev,
      lastAction: message,
      lastActionTimestamp: timestamp,
    }));
  }, []);

  // Form submission handler:
  // Starts the live code animation and cooldown countdown ONLY after successful submission
  const handleFormSubmitted = (data: { uid: string; region: string; appealReason: string }) => {
    setIsSubmitted(true);
    setSubmittedUid(data.uid);
    setActiveUid(data.uid);

    // Start live code typewriter animation
    setIsSequenceActive(true);

    // Start cooldown countdown at that same moment
    setIsCountdownActive(true);

    setSessionInfo((prev) => ({
      ...prev,
      uidStatus: 'VALIDATED',
      lastAction: `Unban form submitted for UID ${data.uid}. Sequence & 30-day countdown active.`,
      lastActionTimestamp: new Date().toLocaleTimeString(),
    }));
  };

  const handleFormClear = () => {
    setIsSubmitted(false);
    setSubmittedUid('');
    setActiveUid('');
    setIsSequenceActive(false);
    setIsCountdownActive(false);

    setSessionInfo((prev) => ({
      ...prev,
      uidStatus: 'WAITING_INPUT',
      lastAction: 'Form cleared and reset to initial state.',
      lastActionTimestamp: new Date().toLocaleTimeString(),
    }));
  };

  // Screenshot handler
  const handleSelectScreenshot = (data: ScreenshotData) => {
    setScreenshotData(data);
    setSessionInfo((prev) => ({
      ...prev,
      screenshotStatus: 'IMAGE_LOADED',
      lastAction: `Loaded screenshot ${data.fileName}`,
      lastActionTimestamp: new Date().toLocaleTimeString(),
    }));
  };

  const handleRemoveScreenshot = () => {
    setScreenshotData({
      file: null,
      previewUrl: null,
      fileName: '',
      fileSizeFormatted: '',
      fileType: '',
      uploadTimestamp: '',
    });
    setSessionInfo((prev) => ({
      ...prev,
      screenshotStatus: 'NO_IMAGE',
      lastAction: 'Screenshot removed from workspace.',
      lastActionTimestamp: new Date().toLocaleTimeString(),
    }));
  };

  // Music handlers
  const handlePlayStateChange = (playing: boolean, source: 'synth' | 'custom') => {
    setMusicPlaying(playing);
    setMusicSource(source);

    setSessionInfo((prev) => ({
      ...prev,
      musicStatus: playing
        ? source === 'synth'
          ? 'SYNTH_ACTIVE'
          : 'FILE_PLAYING'
        : 'PAUSED',
      lastAction: playing ? `Background audio active (${source})` : 'Background audio paused',
      lastActionTimestamp: new Date().toLocaleTimeString(),
    }));
  };

  // Header quick music toggle
  const handleQuickMusicToggle = () => {
    if (musicPlaying) {
      cyberSynth.stop();
      handlePlayStateChange(false, musicSource);
      logSessionAction('Quick toggle: Background music stopped.');
    } else {
      try {
        cyberSynth.start();
        handlePlayStateChange(true, 'synth');
        logSessionAction('Quick toggle: TITAN synth track started.');
      } catch (err) {
        logSessionAction('Quick toggle: Audio playback requires user interaction.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col relative selection:bg-cyan-500/40 selection:text-cyan-200">
      {/* Optional CRT Scanlines Effect */}
      {scanlinesEnabled && (
        <div className="scanlines-overlay fixed inset-0 z-30 pointer-events-none opacity-40" />
      )}

      {/* Cyber Grid Texture */}
      <div className="cyber-grid fixed inset-0 pointer-events-none opacity-25 z-0" />

      {/* Top Header */}
      <Header
        scanlinesEnabled={scanlinesEnabled}
        onToggleScanlines={() => setScanlinesEnabled(!scanlinesEnabled)}
        musicPlaying={musicPlaying}
        onToggleMusic={handleQuickMusicToggle}
        onOpenApkModal={() => setShowApkModal(true)}
        isOnline={isOnline}
      />

      {/* Main Layout Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 space-y-5 sm:space-y-6 relative z-10">
        {/* 1. Hero Section: TITAN UNBAN SYSTEM ACTIVATED */}
        <HeroSection sessionActive={sessionInfo.sessionActive} activeUid={submittedUid || activeUid} />

        {/* 2. Player Identity & Local Display Card */}
        <PlayerIdentityCard activeUid={submittedUid || activeUid} />

        {/* 3. Dual Terminal Panels: LIVE CODE STREAM & LOCAL SESSION STATUS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch">
          <LiveCodeStream isSequenceActive={isSequenceActive} />
          <LocalSessionStatus
            sessionInfo={sessionInfo}
            isSubmitted={isSubmitted}
            submittedUid={submittedUid}
          />
        </div>

        {/* 4. 30-Day Reminder Countdown Panel (Idle on load, starts only after submission) */}
        <CountdownPanel
          isActive={isCountdownActive}
          onResetTimer={() => logSessionAction('30-Day reminder countdown reset by user.')}
        />

        {/* 5. UID Analysis & Submission Form Section */}
        <UidValidator
          onFormSubmitted={handleFormSubmitted}
          onClear={handleFormClear}
          onAddLog={(_level, msg) => logSessionAction(msg)}
          isSubmitted={isSubmitted}
          submittedUid={submittedUid}
        />

        {/* 6. Screenshot Selector Section */}
        <ScreenshotSelector
          screenshot={screenshotData}
          onSelectScreenshot={handleSelectScreenshot}
          onRemoveScreenshot={handleRemoveScreenshot}
          onAddLog={(_level, msg) => logSessionAction(msg)}
        />

        {/* 7. Background Music Controls */}
        <MusicPlayer
          isPlaying={musicPlaying}
          onPlayStateChange={handlePlayStateChange}
          onAddLog={(_level, msg) => logSessionAction(msg)}
        />

        {/* 8. Account Information & Safety Section */}
        <AccountSafety />
      </main>

      {/* Footer */}
      <footer className="mt-8 border-t border-cyan-500/20 bg-[#02050e] py-5 px-4 text-center text-xs font-terminal text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-bold tracking-wider">TITAN UNBAN SYSTEM · LOCAL WORKSTATION</span>
          </div>

          <p className="text-slate-400 text-[11px]">
            Simulated visual interface · Zero credentials stored · Independent appeal companion
          </p>

          <button
            onClick={() => setShowApkModal(true)}
            className="text-cyan-400 hover:text-cyan-300 underline text-xs"
          >
            Android APK Instructions
          </button>
        </div>
      </footer>

      {/* Android APK Modal */}
      <AndroidApkModal isOpen={showApkModal} onClose={() => setShowApkModal(false)} />
    </div>
  );
}
