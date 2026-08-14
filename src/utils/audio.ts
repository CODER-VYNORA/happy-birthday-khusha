// Synthesizer & Audio Engine using Web Audio API

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isBgmPlaying: boolean = false;
  private bgmTimeoutId: number | null = null;
  private customAudio: HTMLAudioElement | null = null;
  private currentBgmUrl: string = '/bgm.mp3';

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setBgmUrl(url: string) {
    this.currentBgmUrl = url;
    if (this.customAudio) {
      const wasPlaying = !this.customAudio.paused;
      this.customAudio.src = url;
      if (wasPlaying && !this.isMuted) {
        this.customAudio.play().catch(() => {});
      }
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBgm();
    } else {
      this.startBgm(this.currentBgmUrl);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public pauseBgm() {
    if (this.customAudio) {
      this.customAudio.pause();
    }
    if (this.bgmTimeoutId) {
      window.clearTimeout(this.bgmTimeoutId);
      this.bgmTimeoutId = null;
    }
  }

  public resumeBgm() {
    if (!this.isMuted && this.isBgmPlaying) {
      if (this.customAudio && this.currentBgmUrl) {
        this.customAudio.play().catch(() => {});
      } else {
        this.playBirthdaySongLoop();
      }
    }
  }

  // Play a synthesized sound effect
  public playSfx(type: 'pop' | 'boing' | 'sparkle' | 'cheer' | 'blow' | 'fanfare' | 'click' | 'tada') {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'pop') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'boing') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(600, now + 0.15);
        osc.frequency.linearRampToValueAtTime(280, now + 0.3);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'sparkle') {
        const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.06);
          gain.gain.setValueAtTime(0, now + i * 0.06);
          gain.gain.linearRampToValueAtTime(0.2, now + i * 0.06 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.25);
        });
      } else if (type === 'blow') {
        // Noise buffer for candle blow sound
        const bufferSize = ctx.sampleRate * 0.4;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.linearRampToValueAtTime(200, now + 0.4);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);
      } else if (type === 'cheer' || type === 'tada') {
        // Happy celebration chord
        const chords = [
          { f: 523.25, time: 0 }, // C5
          { f: 659.25, time: 0.08 }, // E5
          { f: 783.99, time: 0.16 }, // G5
          { f: 1046.5, time: 0.24 }, // C6
        ];
        chords.forEach(({ f, time }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now + time);
          gain.gain.setValueAtTime(0, now + time);
          gain.gain.linearRampToValueAtTime(0.25, now + time + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + time + 0.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + time);
          osc.stop(now + time + 0.8);
        });
      } else if (type === 'fanfare') {
        // Happy Birthday opening motif
        const notes = [
          { f: 261.63, d: 0.2, t: 0 }, // C
          { f: 261.63, d: 0.2, t: 0.25 }, // C
          { f: 293.66, d: 0.4, t: 0.5 }, // D
          { f: 261.63, d: 0.4, t: 0.95 }, // C
          { f: 349.23, d: 0.4, t: 1.4 }, // F
          { f: 329.63, d: 0.8, t: 1.85 }, // E
        ];
        notes.forEach(({ f, d, t }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now + t);
          gain.gain.setValueAtTime(0, now + t);
          gain.gain.linearRampToValueAtTime(0.2, now + t + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + t);
          osc.stop(now + t + d);
        });
      }
    } catch {
      // Audio autoplay might be waiting for user interaction
    }
  }

  // Play background music (audio track with seamless loop, fallback to chime synth)
  public startBgm(url?: string) {
    if (this.isMuted) return;
    this.isBgmPlaying = true;
    const audioUrl = url || this.currentBgmUrl || '/bgm.mp3';

    if (audioUrl) {
      if (!this.customAudio) {
        this.customAudio = new Audio();
        this.customAudio.loop = true;
        this.customAudio.volume = 0.75;
      }
      
      const targetSrc = audioUrl.startsWith('http') || audioUrl.startsWith('/') ? audioUrl : `/${audioUrl}`;
      if (this.customAudio.src !== targetSrc && !this.customAudio.src.endsWith(encodeURI(targetSrc))) {
        this.customAudio.src = targetSrc;
      }

      this.customAudio.play().catch(() => {
        // Fallback to synthesized chimes if direct audio blocked
        this.playBirthdaySongLoop();
      });
      return;
    }

    this.playBirthdaySongLoop();
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.customAudio) {
      this.customAudio.pause();
    }
    if (this.bgmTimeoutId) {
      window.clearTimeout(this.bgmTimeoutId);
      this.bgmTimeoutId = null;
    }
  }

  private playBirthdaySongLoop() {
    if (!this.isBgmPlaying || this.isMuted) return;

    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      // Happy Birthday Melody in F Major / C Major (music box chime tone)
      const melody = [
        { f: 523.25, d: 0.25, gap: 0.3 }, // C5
        { f: 523.25, d: 0.25, gap: 0.3 }, // C5
        { f: 587.33, d: 0.5, gap: 0.6 },  // D5
        { f: 523.25, d: 0.5, gap: 0.6 },  // C5
        { f: 698.46, d: 0.5, gap: 0.6 },  // F5
        { f: 659.25, d: 1.0, gap: 1.1 },  // E5

        { f: 523.25, d: 0.25, gap: 0.3 }, // C5
        { f: 523.25, d: 0.25, gap: 0.3 }, // C5
        { f: 587.33, d: 0.5, gap: 0.6 },  // D5
        { f: 523.25, d: 0.5, gap: 0.6 },  // C5
        { f: 783.99, d: 0.5, gap: 0.6 },  // G5
        { f: 698.46, d: 1.0, gap: 1.1 },  // F5

        { f: 523.25, d: 0.25, gap: 0.3 }, // C5
        { f: 523.25, d: 0.25, gap: 0.3 }, // C5
        { f: 1046.5, d: 0.5, gap: 0.6 },  // C6
        { f: 880.00, d: 0.5, gap: 0.6 },  // A5
        { f: 698.46, d: 0.5, gap: 0.6 },  // F5
        { f: 659.25, d: 0.5, gap: 0.6 },  // E5
        { f: 587.33, d: 0.8, gap: 0.9 },  // D5

        { f: 932.33, d: 0.25, gap: 0.3 }, // Bb5
        { f: 932.33, d: 0.25, gap: 0.3 }, // Bb5
        { f: 880.00, d: 0.5, gap: 0.6 },  // A5
        { f: 698.46, d: 0.5, gap: 0.6 },  // F5
        { f: 783.99, d: 0.5, gap: 0.6 },  // G5
        { f: 698.46, d: 1.2, gap: 1.4 },  // F5
      ];

      let totalDuration = 0;
      melody.forEach(({ f, d, gap }) => {
        const noteTime = now + totalDuration;

        // Main chime
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, noteTime);

        // Soft harmonics
        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(0.08, noteTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + d);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(noteTime);
        osc.stop(noteTime + d);

        // Light background warmth bell
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(f * 0.5, noteTime);
        gain2.gain.setValueAtTime(0, noteTime);
        gain2.gain.linearRampToValueAtTime(0.03, noteTime + 0.02);
        gain2.gain.exponentialRampToValueAtTime(0.001, noteTime + d);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(noteTime);
        osc2.stop(noteTime + d);

        totalDuration += gap * 0.65; // brisk, cheerful tempo
      });

      // Loop after full tune + 1s silence
      const waitMs = (totalDuration + 1.2) * 1000;
      this.bgmTimeoutId = window.setTimeout(() => {
        if (this.isBgmPlaying && !this.isMuted) {
          this.playBirthdaySongLoop();
        }
      }, waitMs);
    } catch {
      // Ignore if autoplay blocked
    }
  }

  // Candle blowing detection via microphone
  public setupBlowingDetector(
    onBlowing: (volume: number) => void,
    onBlowTrigger: () => void
  ): { stop: () => void; isSupported: boolean } {
    let stream: MediaStream | null = null;
    let animFrame: number | null = null;
    let blowStreak = 0;

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const ctx = this.initCtx();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.3;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const checkAudio = () => {
          analyser.getByteFrequencyData(dataArray);

          // Calculate average low-to-mid frequency noise characteristic of breath
          let sum = 0;
          const lowBins = 30;
          for (let i = 0; i < lowBins; i++) {
            sum += dataArray[i];
          }
          const avg = sum / lowBins;
          const normalizedVol = Math.min(1, avg / 120);

          onBlowing(normalizedVol);

          if (avg > 55) {
            blowStreak++;
            if (blowStreak >= 4) {
              onBlowTrigger();
              blowStreak = 0;
            }
          } else {
            blowStreak = Math.max(0, blowStreak - 1);
          }

          animFrame = requestAnimationFrame(checkAudio);
        };

        checkAudio();
      } catch (err) {
        console.warn('Microphone blow detector not available:', err);
      }
    };

    start();

    return {
      stop: () => {
        if (animFrame) cancelAnimationFrame(animFrame);
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      },
      isSupported: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    };
  }
}

export const sound = new SoundEngine();
