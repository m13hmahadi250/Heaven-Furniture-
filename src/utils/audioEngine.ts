/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Luxury Spatial Audio Engine
 * Provides synthesized soft lo-fi jazz lounge chords & architectural showroom acoustics
 * with spatial panning, simulated room reverb, and vinyl warmth.
 */

export type AudioMode = 'lofi-jazz' | 'showroom-ambient';

interface AudioEngineState {
  isPlaying: boolean;
  mode: AudioMode;
  volume: number; // 0 to 1
}

class LuxurySpatialAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private pannerNode: StereoPannerNode | null = null;
  private vinylGain: GainNode | null = null;
  private vinylSource: AudioBufferSourceNode | null = null;
  
  private isPlaying = false;
  private currentMode: AudioMode = 'lofi-jazz';
  private currentVolume = 0.35;
  private stepInterval: any = null;
  private chordIndex = 0;
  private activeOscillators: { stop: () => void }[] = [];
  private listeners: ((state: AudioEngineState) => void)[] = [];

  // Lo-Fi Jazz chord progressions (Rhodes frequencies in Hz)
  // Progression 1: Ebmaj9 -> Cm9 -> Fm9 -> Bb13 (Smooth luxury soul jazz)
  private jazzChords = [
    {
      bass: 77.78, // Eb2
      notes: [155.56, 196.00, 233.08, 293.66, 349.23], // Eb3, G3, Bb3, D4, F4
      duration: 4.8,
    },
    {
      bass: 65.41, // C2
      notes: [130.81, 155.56, 196.00, 233.08, 293.66], // C3, Eb3, G3, Bb3, D4
      duration: 4.8,
    },
    {
      bass: 87.31, // F2
      notes: [174.61, 207.65, 261.63, 311.13, 392.00], // F3, Ab3, C4, Eb4, G4
      duration: 4.8,
    },
    {
      bass: 58.27, // Bb1
      notes: [146.83, 207.65, 261.63, 392.00, 440.00], // D3, Ab3, C4, G4, A4 (Bb13)
      duration: 4.8,
    },
    {
      bass: 82.41, // E2
      notes: [164.81, 207.65, 246.94, 329.63, 392.00], // Emaj9
      duration: 4.8,
    },
    {
      bass: 73.42, // D2
      notes: [146.83, 174.61, 220.00, 261.63, 329.63], // Dm9
      duration: 4.8,
    },
    {
      bass: 98.00, // G2
      notes: [146.83, 196.00, 246.94, 293.66, 349.23], // G7(9)
      duration: 4.8,
    },
    {
      bass: 65.41, // C2
      notes: [130.81, 164.81, 196.00, 246.94, 293.66], // Cmaj9
      duration: 4.8,
    },
  ];

  // Showroom Ambient chord progressions (Airy, acoustic, spacious room drones)
  private ambientChords = [
    {
      bass: 65.41, // C2
      notes: [130.81, 196.00, 293.66, 392.00, 523.25, 659.25], // Cmaj9 / Lydian shimmer
      duration: 7.0,
    },
    {
      bass: 87.31, // F2
      notes: [174.61, 261.63, 329.63, 392.00, 523.25, 698.46], // Fmaj7(#11)
      duration: 7.0,
    },
    {
      bass: 73.42, // D2
      notes: [146.83, 220.00, 261.63, 329.63, 440.00, 587.33], // Dm9
      duration: 7.0,
    },
    {
      bass: 98.00, // G2
      notes: [146.83, 196.00, 246.94, 293.66, 440.00, 587.33], // Gadd9
      duration: 7.0,
    },
  ];

  constructor() {
    // Lazy audio context initialization to comply with browser autoplay policies
  }

  private initAudio() {
    if (this.ctx) return;
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtxClass) return;

    this.ctx = new AudioCtxClass();

    // Master Volume Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);

    // Spatial Panner (subtle room drift)
    if (this.ctx.createStereoPanner) {
      this.pannerNode = this.ctx.createStereoPanner();
      this.pannerNode.pan.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.pannerNode);
      this.pannerNode.connect(this.ctx.destination);
    } else {
      this.masterGain.connect(this.ctx.destination);
    }

    // Create high-end impulse response reverb node (Architectural Showroom Space)
    this.reverbNode = this.ctx.createConvolver();
    this.reverbNode.buffer = this.generateShowroomImpulse(2.8, 1.8);
    
    // Mix reverb wet/dry
    const reverbGain = this.ctx.createGain();
    reverbGain.gain.setValueAtTime(0.42, this.ctx.currentTime);
    this.reverbNode.connect(reverbGain);
    reverbGain.connect(this.masterGain);

    // Subtle Vinyl warmth / room texture generator
    this.initVinylWarmth();
  }

  /**
   * Generates a lush, spatial impulse response buffer simulating a grand, high-ceiling showroom.
   */
  private generateShowroomImpulse(duration: number, decay: number): AudioBuffer {
    if (!this.ctx) return null as any;
    const rate = this.ctx.sampleRate;
    const length = Math.floor(rate * duration);
    const impulse = this.ctx.createBuffer(2, length, rate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const t = i / rate;
      const envelope = Math.exp(-t * decay);
      // Soft randomized reflections
      left[i] = (Math.random() * 2 - 1) * envelope;
      right[i] = (Math.random() * 2 - 1) * envelope;
    }

    return impulse;
  }

  /**
   * Initializes a subtle analog warmth/vinyl hiss layer
   */
  private initVinylWarmth() {
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink noise filter approximation
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      let pink = b0 + b1 + b2 + white * 0.5362;
      
      // Random subtle vinyl crackle tick
      if (Math.random() < 0.0003) {
        pink += (Math.random() * 2 - 1) * 3.5;
      }
      output[i] = pink * 0.035;
    }

    this.vinylSource = this.ctx.createBufferSource();
    this.vinylSource.buffer = noiseBuffer;
    this.vinylSource.loop = true;

    // Filter to keep only warm, subtle low-mid vinyl crackle
    const vinylFilter = this.ctx.createBiquadFilter();
    vinylFilter.type = 'lowpass';
    vinylFilter.frequency.setValueAtTime(1800, this.ctx.currentTime);

    this.vinylGain = this.ctx.createGain();
    this.vinylGain.gain.setValueAtTime(0, this.ctx.currentTime);

    this.vinylSource.connect(vinylFilter);
    vinylFilter.connect(this.vinylGain);
    if (this.masterGain) {
      this.vinylGain.connect(this.masterGain);
    }
    this.vinylSource.start(0);
  }

  /**
   * Plays a single lush Rhodes jazz chord with velocity dynamics & envelope
   */
  private playRhodesChord(chord: { bass: number; notes: number[]; duration: number }) {
    if (!this.ctx || !this.masterGain || !this.reverbNode) return;
    const now = this.ctx.currentTime;

    // Subtle spatial pan drift across chords (slow binaural movement)
    if (this.pannerNode) {
      const targetPan = Math.sin(now * 0.15) * 0.25;
      this.pannerNode.pan.setTargetAtTime(targetPan, now, 1.2);
    }

    // 1. Warm Acoustic Sub-Bass Note
    const bassOsc = this.ctx.createOscillator();
    const bassGain = this.ctx.createGain();
    const bassFilter = this.ctx.createBiquadFilter();

    bassOsc.type = 'sine';
    bassOsc.frequency.setValueAtTime(chord.bass, now);

    bassFilter.type = 'lowpass';
    bassFilter.frequency.setValueAtTime(220, now);

    bassGain.gain.setValueAtTime(0.0001, now);
    bassGain.gain.linearRampToValueAtTime(0.28, now + 0.15);
    bassGain.gain.exponentialRampToValueAtTime(0.0001, now + chord.duration * 0.95);

    bassOsc.connect(bassFilter);
    bassFilter.connect(bassGain);
    bassGain.connect(this.masterGain);

    bassOsc.start(now);
    bassOsc.stop(now + chord.duration);

    // 2. Multi-Voice Electric Piano / Rhodes chord cluster
    chord.notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain || !this.reverbNode) return;

      // Stagger note attack slightly for authentic humanized strum
      const noteDelay = idx * 0.035;
      const noteStart = now + noteDelay;

      // Primary tone (triangle wave for vintage electric piano body)
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, noteStart);

      // Subtle warm tine harmonic (sine wave 1 octave or 3rd harmonic above)
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, noteStart);
      // Slight detune for analog chorus/tremolo warmth
      osc2.detune.setValueAtTime(Math.sin(idx) * 4.5, noteStart);

      // Warm dynamic lowpass filter
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, noteStart);
      filter.frequency.exponentialRampToValueAtTime(450, noteStart + chord.duration * 0.8);
      filter.Q.setValueAtTime(1.2, noteStart);

      // Amplitude Envelope (Rhodes bell attack, mellow sustain)
      const noteGain = this.ctx.createGain();
      const velocity = 0.12 - idx * 0.014 + (Math.random() * 0.02 - 0.01);
      const safeVelocity = Math.max(0.04, velocity);

      noteGain.gain.setValueAtTime(0.0001, noteStart);
      noteGain.gain.linearRampToValueAtTime(safeVelocity, noteStart + 0.06);
      noteGain.gain.exponentialRampToValueAtTime(safeVelocity * 0.45, noteStart + 0.6);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + chord.duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(noteGain);

      // Dry path to master
      noteGain.connect(this.masterGain);
      // Wet path to showroom reverb
      noteGain.connect(this.reverbNode);

      osc1.start(noteStart);
      osc2.start(noteStart);

      const stopTime = noteStart + chord.duration;
      osc1.stop(stopTime);
      osc2.stop(stopTime);
    });
  }

  /**
   * Plays airy, crystal showroom ambient drone pads with long shimmer
   */
  private playAmbientPad(chord: { bass: number; notes: number[]; duration: number }) {
    if (!this.ctx || !this.masterGain || !this.reverbNode) return;
    const now = this.ctx.currentTime;

    // Sub-bass drone
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(chord.bass, now);
    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.linearRampToValueAtTime(0.18, now + 2.5);
    subGain.gain.linearRampToValueAtTime(0.001, now + chord.duration);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start(now);
    subOsc.stop(now + chord.duration);

    // Ethereal Pad Stack
    chord.notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain || !this.reverbNode) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime((Math.random() - 0.5) * 6, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800 + Math.sin(now + idx) * 300, now);
      filter.Q.setValueAtTime(0.8, now);

      // Very slow atmospheric swell & fade
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.06 / (idx + 1), now + 3.0);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + chord.duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      gain.connect(this.reverbNode);

      osc.start(now);
      osc.stop(now + chord.duration);
    });
  }

  private tick() {
    if (!this.isPlaying) return;

    if (this.currentMode === 'lofi-jazz') {
      const chord = this.jazzChords[this.chordIndex % this.jazzChords.length];
      this.playRhodesChord(chord);
      this.chordIndex++;
      this.stepInterval = setTimeout(() => this.tick(), (chord.duration - 0.6) * 1000);
    } else {
      const chord = this.ambientChords[this.chordIndex % this.ambientChords.length];
      this.playAmbientPad(chord);
      this.chordIndex++;
      this.stepInterval = setTimeout(() => this.tick(), (chord.duration - 1.2) * 1000);
    }
  }

  public async start(): Promise<boolean> {
    this.initAudio();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    if (this.isPlaying) return true;

    this.isPlaying = true;
    this.chordIndex = 0;

    // Fade in master gain smoothly
    if (this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(0.001, now);
      this.masterGain.gain.linearRampToValueAtTime(this.currentVolume, now + 1.2);
    }

    // Fade in vinyl crackle if in lo-fi mode
    if (this.vinylGain) {
      const now = this.ctx.currentTime;
      const targetVinyl = this.currentMode === 'lofi-jazz' ? 0.08 : 0.015;
      this.vinylGain.gain.linearRampToValueAtTime(targetVinyl, now + 1.0);
    }

    this.tick();
    this.notify();
    return true;
  }

  public stop() {
    if (!this.isPlaying) return;

    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
    }

    if (this.vinylGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.vinylGain.gain.linearRampToValueAtTime(0.0001, now + 0.6);
    }

    if (this.stepInterval) {
      clearTimeout(this.stepInterval);
      this.stepInterval = null;
    }

    setTimeout(() => {
      this.isPlaying = false;
      this.notify();
    }, 850);
  }

  public toggle(): Promise<boolean> | void {
    if (this.isPlaying) {
      this.stop();
      return;
    }
    return this.start();
  }

  public setMode(mode: AudioMode) {
    if (this.currentMode === mode) return;
    this.currentMode = mode;
    this.chordIndex = 0;

    // Adjust vinyl warmth intensity
    if (this.ctx && this.vinylGain) {
      const now = this.ctx.currentTime;
      const targetVinyl = mode === 'lofi-jazz' ? 0.08 : 0.015;
      this.vinylGain.gain.linearRampToValueAtTime(targetVinyl, now + 0.5);
    }

    // Retrigger immediate chord in new mode if already playing
    if (this.isPlaying) {
      if (this.stepInterval) {
        clearTimeout(this.stepInterval);
        this.stepInterval = null;
      }
      this.tick();
    }
    this.notify();
  }

  public setVolume(vol: number) {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    if (this.ctx && this.masterGain && this.isPlaying) {
      this.masterGain.gain.linearRampToValueAtTime(this.currentVolume, this.ctx.currentTime + 0.1);
    }
    this.notify();
  }

  public getState(): AudioEngineState {
    return {
      isPlaying: this.isPlaying,
      mode: this.currentMode,
      volume: this.currentVolume,
    };
  }

  public subscribe(cb: (state: AudioEngineState) => void) {
    this.listeners.push(cb);
    cb(this.getState());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((l) => l(state));
  }
}

// Global Singleton Instance for clean state sharing across the entire app
export const luxuryAudio = new LuxurySpatialAudioEngine();
