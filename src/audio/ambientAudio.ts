/**
 * Web Audio API Ambient Sound Generator
 * Generates vintage radio AM hiss and gentle monsoon rain programmatically
 * without external audio files.
 */

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private radioHissGain: GainNode | null = null;
  private rainGain: GainNode | null = null;
  private radioSource: AudioBufferSourceNode | null = null;
  private rainSource: AudioBufferSourceNode | null = null;
  private isRadioPlaying = false;
  private isRainPlaying = false;
  private radioVolume = 0.12;
  private rainVolume = 0.25;

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Generates a 5-second seamless looping pinkish noise buffer
   */
  private createNoiseBuffer(ctx: AudioContext, type: 'radio' | 'rain'): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const bufferSize = sampleRate * 5;
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;

      if (type === 'radio') {
        // Pink noise filter approximation
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        let pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        b6 = white * 0.115926;

        // Occasional faint vinyl/tape crackle
        if (Math.random() < 0.0008) {
          pink += (Math.random() * 2 - 1) * 1.8;
        }

        data[i] = pink * 0.06;
      } else {
        // Rain wash noise (brownish/pink mix)
        b0 = 0.99 * b0 + white * 0.08;
        b1 = 0.95 * b1 + white * 0.14;
        let rain = b0 + b1 + white * 0.2;

        // Soft random drop taps on metallic car roof
        if (Math.random() < 0.004) {
          rain += (Math.random() * 2 - 1) * 0.9;
        }

        data[i] = rain * 0.07;
      }
    }

    return buffer;
  }

  public setRadioHiss(enable: boolean, volume?: number): void {
    if (volume !== undefined) {
      this.radioVolume = Math.max(0, Math.min(1, volume));
      if (this.radioHissGain && this.ctx) {
        this.radioHissGain.gain.setValueAtTime(this.radioVolume, this.ctx.currentTime);
      }
    }

    if (enable && !this.isRadioPlaying) {
      const ctx = this.initContext();
      const buffer = this.createNoiseBuffer(ctx, 'radio');
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      // Vintage radio bandpass: removes harsh highs (>3.5kHz) and deep rumble (<350Hz)
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(3200, ctx.currentTime);

      const highpass = ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(450, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(this.radioVolume, ctx.currentTime + 0.6);

      source.connect(highpass);
      highpass.connect(lowpass);
      lowpass.connect(gain);
      gain.connect(ctx.destination);

      source.start();
      this.radioSource = source;
      this.radioHissGain = gain;
      this.isRadioPlaying = true;
    } else if (!enable && this.isRadioPlaying && this.radioSource && this.radioHissGain && this.ctx) {
      this.radioHissGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
      const sourceToStop = this.radioSource;
      setTimeout(() => {
        try {
          sourceToStop.stop();
          sourceToStop.disconnect();
        } catch {
          // ignore already stopped
        }
      }, 450);
      this.radioSource = null;
      this.radioHissGain = null;
      this.isRadioPlaying = false;
    }
  }

  public setRainSound(enable: boolean, volume?: number): void {
    if (volume !== undefined) {
      this.rainVolume = Math.max(0, Math.min(1, volume));
      if (this.rainGain && this.ctx) {
        this.rainGain.gain.setValueAtTime(this.rainVolume, this.ctx.currentTime);
      }
    }

    if (enable && !this.isRainPlaying) {
      const ctx = this.initContext();
      const buffer = this.createNoiseBuffer(ctx, 'rain');
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      // Filter: soft rain hitting car windshield
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(1400, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(this.rainVolume, ctx.currentTime + 0.8);

      source.connect(lowpass);
      lowpass.connect(gain);
      gain.connect(ctx.destination);

      source.start();
      this.rainSource = source;
      this.rainGain = gain;
      this.isRainPlaying = true;
    } else if (!enable && this.isRainPlaying && this.rainSource && this.rainGain && this.ctx) {
      this.rainGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
      const sourceToStop = this.rainSource;
      setTimeout(() => {
        try {
          sourceToStop.stop();
          sourceToStop.disconnect();
        } catch {
          // ignore
        }
      }, 550);
      this.rainSource = null;
      this.rainGain = null;
      this.isRainPlaying = false;
    }
  }

  public getRadioVolume(): number {
    return this.radioVolume;
  }

  public getRainVolume(): number {
    return this.rainVolume;
  }

  public isRadioActive(): boolean {
    return this.isRadioPlaying;
  }

  public isRainActive(): boolean {
    return this.isRainPlaying;
  }
}

export const ambientAudio = new AmbientAudioEngine();
