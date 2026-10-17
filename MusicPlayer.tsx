import React, { useState, useRef, useEffect } from 'react';
import { 
  Music, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Repeat, 
  Upload, 
  FileAudio, 
  Radio, 
  Disc,
  AlertCircle
} from 'lucide-react';
import { cyberSynth } from '../audio/synthAudio';

interface MusicPlayerProps {
  isPlaying: boolean;
  onPlayStateChange: (playing: boolean, source: 'synth' | 'custom') => void;
  onAddLog: (level: 'OK' | 'READY' | 'INFO' | 'WARN' | 'ERROR' | 'STATUS' | 'COMPLETE' | 'AUDIO', msg: string) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  isPlaying,
  onPlayStateChange,
  onAddLog,
}) => {
  const [sourceMode, setSourceMode] = useState<'synth' | 'custom'>('synth');
  const [volume, setVolume] = useState(0.6);
  const [isLooping, setIsLooping] = useState(true);
  const [customAudioFile, setCustomAudioFile] = useState<File | null>(null);
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const customAudioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize volume on synth
  useEffect(() => {
    cyberSynth.setVolume(volume);
    if (customAudioRef.current) {
      customAudioRef.current.volume = volume;
    }
  }, [volume]);

  // Audio spectrum visualizer animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let bars = [20, 45, 70, 30, 85, 60, 40, 95, 55, 30, 75, 50, 65, 80, 35, 90];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const barCount = 16;
      const barWidth = width / barCount - 2;

      for (let i = 0; i < barCount; i++) {
        let val = isPlaying ? Math.random() * (height - 8) + 6 : 4;
        // Smooth random heights for lively futuristic visualizer
        bars[i] = bars[i] * 0.7 + val * 0.3;

        const x = i * (barWidth + 2);
        const barHeight = Math.max(3, bars[i]);
        const y = height - barHeight;

        const gradient = ctx.createLinearGradient(0, y, 0, height);
        if (sourceMode === 'synth') {
          gradient.addColorStop(0, '#22c55e');
          gradient.addColorStop(1, '#06b6d4');
        } else {
          gradient.addColorStop(0, '#06b6d4');
          gradient.addColorStop(1, '#3b82f6');
        }

        ctx.fillStyle = isPlaying ? gradient : '#1e293b';
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, sourceMode]);

  // Handle Play
  const handlePlay = async () => {
    setErrorMessage(null);

    if (sourceMode === 'synth') {
      try {
        cyberSynth.start();
        onPlayStateChange(true, 'synth');
        onAddLog('AUDIO', 'Background cyber-synth generator started.');
      } catch (err) {
        setErrorMessage('Browser audio unlock failed. Please interact with the screen first.');
        onAddLog('WARN', 'Audio autoplay blocked by mobile browser.');
      }
    } else {
      // Custom audio file mode
      if (!customAudioUrl || !customAudioRef.current) {
        setErrorMessage('No local audio file provided. Please click "SELECT AUDIO FILE" (MP3/WAV/OGG).');
        onAddLog('WARN', 'Audio playback failed: No audio file selected.');
        return;
      }

      try {
        await customAudioRef.current.play();
        onPlayStateChange(true, 'custom');
        onAddLog('AUDIO', `Playing user track: ${customAudioFile?.name || 'custom_audio'}`);
      } catch (err) {
        setErrorMessage('Audio playback was prevented by browser autoplay policy. Tap play again.');
        onAddLog('WARN', 'Custom audio play blocked by browser.');
      }
    }
  };

  // Handle Pause
  const handlePause = () => {
    if (sourceMode === 'synth') {
      cyberSynth.stop();
    } else {
      if (customAudioRef.current) {
        customAudioRef.current.pause();
      }
    }
    onPlayStateChange(false, sourceMode);
    onAddLog('AUDIO', 'Background music paused.');
  };

  // Toggle Source Mode
  const handleSourceModeChange = (mode: 'synth' | 'custom') => {
    if (isPlaying) {
      handlePause();
    }
    setSourceMode(mode);
    setErrorMessage(null);
    onAddLog('INFO', `Audio source switched to: ${mode === 'synth' ? 'TITAN Synth Engine' : 'Custom Local Audio'}`);
  };

  // Handle File Selection
  const handleCustomAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    const isValid = file.type.startsWith('audio/') || validExtensions.includes(ext);

    if (!isValid) {
      setErrorMessage(`Invalid audio format: "${file.name}". Please provide an MP3, WAV, or OGG file.`);
      onAddLog('WARN', 'Unsupported audio file format selected.');
      return;
    }

    if (isPlaying) {
      handlePause();
    }

    const url = URL.createObjectURL(file);
    setCustomAudioFile(file);
    setCustomAudioUrl(url);
    setErrorMessage(null);
    onAddLog('AUDIO', `Local audio loaded: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB).`);
  };

  return (
    <div className="rounded-xl bg-[#040814] border border-cyan-500/40 p-4 sm:p-6 shadow-xl relative overflow-hidden neon-border-cyan">
      {/* Hidden Native Audio Element */}
      {customAudioUrl && (
        <audio
          ref={customAudioRef}
          src={customAudioUrl}
          loop={isLooping}
          onEnded={() => {
            if (!isLooping) {
              onPlayStateChange(false, 'custom');
              onAddLog('AUDIO', 'Audio track playback finished.');
            }
          }}
        />
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/mp3,audio/wav,audio/ogg,audio/mpeg,.mp3,.wav,.ogg"
        onChange={handleCustomAudioUpload}
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-cyan-400" />
          <h2 className="font-hud font-bold text-base sm:text-lg tracking-wider text-white">
            BACKGROUND MUSIC <span className="text-cyan-400">/ AMBIENT AUDIO</span>
          </h2>
        </div>

        {/* Live Audio Status Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#02050c] border border-slate-700 font-terminal text-xs self-start sm:self-auto">
          <span
            className={`w-2 h-2 rounded-full ${
              isPlaying
                ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]'
                : 'bg-slate-500'
            }`}
          />
          <span className="text-slate-300">
            {isPlaying
              ? sourceMode === 'synth'
                ? 'STATUS: SYNTH WAVE ACTIVE'
                : 'STATUS: CUSTOM AUDIO PLAYING'
              : 'STATUS: AUDIO MUTED / PAUSED'}
          </span>
        </div>
      </div>

      {/* Source Selector Tabs */}
      <div className="mt-4 flex items-center gap-2 p-1 bg-black/60 border border-slate-800 rounded-lg font-terminal text-xs">
        <button
          onClick={() => handleSourceModeChange('synth')}
          className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center gap-2 transition-all min-h-[44px] ${
            sourceMode === 'synth'
              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 shadow-md font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radio className="w-4 h-4 text-cyan-400" />
          <span>TITAN SYNTH TRACK (BUILT-IN)</span>
        </button>

        <button
          onClick={() => handleSourceModeChange('custom')}
          className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center gap-2 transition-all min-h-[44px] ${
            sourceMode === 'custom'
              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 shadow-md font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileAudio className="w-4 h-4 text-cyan-400" />
          <span>CUSTOM LOCAL AUDIO FILE</span>
        </button>
      </div>

      {/* Custom Audio File Status / Upload Callout */}
      {sourceMode === 'custom' && (
        <div className="mt-3 p-3 bg-[#02050c] border border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-terminal">
          <div className="min-w-0">
            <span className="text-slate-500 block text-[10px]">SELECTED AUDIO FILE</span>
            <span className="text-cyan-300 font-bold truncate block">
              {customAudioFile ? customAudioFile.name : 'No file loaded (MP3, WAV, OGG)'}
            </span>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 bg-cyan-900/40 hover:bg-cyan-800/50 border border-cyan-500/40 text-cyan-300 rounded flex items-center justify-center gap-1.5 transition-colors shrink-0 min-h-[44px]"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{customAudioFile ? 'CHANGE AUDIO' : 'SELECT AUDIO FILE'}</span>
          </button>
        </div>
      )}

      {/* Error Notice */}
      {errorMessage && (
        <div className="mt-3 bg-amber-950/40 border border-amber-500/50 rounded-lg p-3 text-xs font-terminal text-amber-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{errorMessage}</div>
        </div>
      )}

      {/* Visualizer Canvas & Controls */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-[#02050b] border border-slate-800 rounded-lg p-3.5">
        {/* Dynamic Spectrum Display */}
        <div className="h-14 bg-black/60 border border-cyan-500/20 rounded p-1 flex items-center justify-center relative overflow-hidden">
          <canvas
            ref={canvasRef}
            width={240}
            height={48}
            className="w-full h-full object-contain"
          />
          {!isPlaying && (
            <span className="absolute text-[10px] font-terminal text-slate-500 uppercase tracking-widest pointer-events-none">
              SPECTRUM IDLE
            </span>
          )}
        </div>

        {/* Playback Action Buttons */}
        <div className="flex items-center justify-center gap-2">
          {isPlaying ? (
            <button
              onClick={handlePause}
              className="px-4 py-2.5 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/50 text-rose-300 rounded-lg font-terminal text-xs font-bold flex items-center gap-2 transition-all min-h-[44px]"
            >
              <Pause className="w-4 h-4" />
              <span>MUSIC OFF / PAUSE</span>
            </button>
          ) : (
            <button
              onClick={handlePlay}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg font-terminal text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-950/50 min-h-[44px]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>MUSIC ON / PLAY</span>
            </button>
          )}

          <button
            onClick={() => setIsLooping(!isLooping)}
            title={isLooping ? 'Looping Enabled' : 'Looping Disabled'}
            className={`p-2.5 rounded-lg border font-terminal text-xs transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
              isLooping
                ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                : 'bg-black/40 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-2.5 px-2 font-terminal text-xs">
          {volume === 0 ? (
            <VolumeX className="w-4 h-4 text-slate-500 shrink-0" />
          ) : (
            <Volume2 className="w-4 h-4 text-cyan-400 shrink-0" />
          )}

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />

          <span className="text-cyan-300 font-bold tabular-nums w-10 text-right shrink-0">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};
