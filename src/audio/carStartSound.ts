/**
 * Realistic Vintage Car Ignition Sound Generator using Web Audio API
 * Synthesizes starter motor crank -> engine catch -> throaty engine rev -> idle purr.
 */

export function playCarStartSound(): Promise<void> {
  return new Promise((resolve) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // Master output gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.7, now);
      masterGain.connect(ctx.destination);

      // --- 1. Starter Motor Cranking (0.0s to 0.75s) ---
      // Low rumble pulses simulating the flywheel cranking
      const crankCount = 4;
      const crankInterval = 0.16;

      for (let i = 0; i < crankCount; i++) {
        const crankTime = now + i * crankInterval;

        const crankOsc = ctx.createOscillator();
        const crankGain = ctx.createGain();
        const crankFilter = ctx.createBiquadFilter();

        crankOsc.type = 'sawtooth';
        crankOsc.frequency.setValueAtTime(45 + i * 4, crankTime);
        crankOsc.frequency.exponentialRampToValueAtTime(30, crankTime + 0.12);

        crankFilter.type = 'lowpass';
        crankFilter.frequency.setValueAtTime(380, crankTime);

        crankGain.gain.setValueAtTime(0, crankTime);
        crankGain.gain.linearRampToValueAtTime(0.6, crankTime + 0.03);
        crankGain.gain.exponentialRampToValueAtTime(0.01, crankTime + 0.13);

        crankOsc.connect(crankFilter);
        crankFilter.connect(crankGain);
        crankGain.connect(masterGain);

        crankOsc.start(crankTime);
        crankOsc.stop(crankTime + 0.14);
      }

      // --- 2. Engine Catch & Throttle Rev (0.7s to 1.8s) ---
      const catchTime = now + 0.68;

      // Engine fundamental low rumble oscillator
      const engineOsc = ctx.createOscillator();
      const engineGain = ctx.createGain();
      const engineFilter = ctx.createBiquadFilter();

      engineOsc.type = 'sawtooth';
      engineOsc.frequency.setValueAtTime(55, catchTime);
      // Throttle blip rev up to ~160Hz then drops to idle ~75Hz
      engineOsc.frequency.exponentialRampToValueAtTime(170, catchTime + 0.35);
      engineOsc.frequency.exponentialRampToValueAtTime(75, catchTime + 1.1);

      engineFilter.type = 'lowpass';
      engineFilter.frequency.setValueAtTime(400, catchTime);
      engineFilter.frequency.linearRampToValueAtTime(900, catchTime + 0.35);
      engineFilter.frequency.linearRampToValueAtTime(280, catchTime + 1.2);

      engineGain.gain.setValueAtTime(0.01, catchTime);
      engineGain.gain.linearRampToValueAtTime(0.75, catchTime + 0.2);
      engineGain.gain.linearRampToValueAtTime(0.45, catchTime + 0.8);
      engineGain.gain.exponentialRampToValueAtTime(0.001, catchTime + 1.6);

      engineOsc.connect(engineFilter);
      engineFilter.connect(engineGain);
      engineGain.connect(masterGain);

      engineOsc.start(catchTime);
      engineOsc.stop(catchTime + 1.65);

      // --- 3. Exhaust Noise Chug ---
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let j = 0; j < noiseBuffer.length; j++) {
        output[j] = Math.random() * 2 - 1;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(220, catchTime);
      noiseFilter.Q.setValueAtTime(2.5, catchTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.01, catchTime);
      noiseGain.gain.linearRampToValueAtTime(0.4, catchTime + 0.15);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, catchTime + 1.3);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);

      noiseSource.start(catchTime);
      noiseSource.stop(catchTime + 1.4);

      // Cleanup after playback finishes
      setTimeout(() => {
        try {
          ctx.close();
        } catch {
          // ignore
        }
        resolve();
      }, 1900);
    } catch (e) {
      console.warn('Car start audio synthesis error:', e);
      resolve();
    }
  });
}
