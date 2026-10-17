/**
 * High-performance Web Audio Cyber-Synth Engine
 * Provides authentic futuristic cyberpunk ambient music loops without external network dependencies,
 * fully compliant with mobile browser audio unlocking and volume scaling.
 */

class CyberSynthEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private volume = 0.5;
  private masterGain: GainNode | null = null;
  private timerId: number | null = null;
  private step = 0;
  private analyser: AnalyserNode | null = null;

  // Dark cyberpunk bassline notes (frequencies in Hz)
  private readonly bassline = [
    55.0,  // A1
    55.0,  // A1
    65.41, // C2
    73.42, // D2
    55.0,  // A1
    49.0,  // G1
    55.0,  // A1
    82.41, // E2
    55.0,  // A1
    65.41, // C2
    73.42, // D2
    87.31, // F2
    82.41, // E2
    73.42, // D2
    65.41, // C2
    55.0,  // A1
  ];

  // Futuristic arpeggio notes
  private readonly arp = [
    220.0, // A3
    261.63,// C4
    329.63,// E4
    440.0, // A4
    392.0, // G4
    329.63,// E4
    293.66,// D4
    261.63,// C4
  ];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public start() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.isPlaying) return;
    this.isPlaying = true;

    const tempo = 124; // Cyber BPM
    const stepDurationMs = (60 / tempo / 4) * 1000; // 16th note

    this.timerId = window.setInterval(() => {
      this.tick();
    }, stepDurationMs);
  }

  private tick() {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;

    const now = this.ctx.currentTime;
    const currentStep = this.step;

    // Trigger Kick on quarter notes (steps 0, 4, 8, 12)
    if (currentStep % 4 === 0) {
      this.triggerCyberKick(now);
    }

    // Trigger Snare / Clang on steps 4 and 12
    if (currentStep % 8 === 4) {
      this.triggerCyberSnare(now);
    }

    // Trigger Hihat on every off-beat 8th note
    if (currentStep % 2 === 1) {
      this.triggerHiHat(now);
    }

    // Trigger Bass synth
    if (currentStep % 2 === 0) {
      const bassIndex = (currentStep / 2) % this.bassline.length;
      const freq = this.bassline[bassIndex];
      this.triggerBass(freq, now, (60 / 124 / 2) * 0.8);
    }

    // Trigger Arp Lead
    const arpFreq = this.arp[currentStep % this.arp.length];
    this.triggerLead(arpFreq, now, 0.12);

    this.step = (this.step + 1) % 32;
  }

  private triggerCyberKick(time: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(38, time + 0.12);

    gain.gain.setValueAtTime(0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.23);
  }

  private triggerCyberSnare(time: number) {
    if (!this.ctx || !this.masterGain) return;
    // Tone
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(190, time);
    oscGain.gain.setValueAtTime(0.2, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.16);

    // Noise burst
    const bufferSize = this.ctx.sampleRate * 0.1;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1000, time);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.25, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    whiteNoise.start(time);
    whiteNoise.stop(time + 0.15);
  }

  private triggerHiHat(time: number) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.3;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7000, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + 0.05);
  }

  private triggerBass(freq: number, time: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, time);
    filter.frequency.exponentialRampToValueAtTime(120, time + duration);

    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  private triggerLead(freq: number, time: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  public stop() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.isPlaying = false;
    this.step = 0;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const cyberSynth = new CyberSynthEngine();
