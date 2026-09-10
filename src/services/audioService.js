/**
 * ============================================================================
 * WATTVISION - AUDIO CHIME SERVICE (WEB AUDIO API)
 * ============================================================================
 * Generates synthetic pleasant chimes for warning and critical electrical anomalies.
 * Zero external audio files or dependencies required.
 */

class AudioService {
  constructor() {
    this.audioCtx = null;
    this.muted = typeof window !== 'undefined' && localStorage.getItem('wattvision_sound_muted') === 'true';
  }

  getAudioContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  isMuted() {
    return this.muted;
  }

  setMuted(muted) {
    this.muted = !!muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('wattvision_sound_muted', String(this.muted));
    }
    return this.muted;
  }

  toggleMute() {
    return this.setMuted(!this.muted);
  }

  /**
   * Play subtle 2-tone chime for warnings (e.g. slight PF degradation)
   */
  playWarningChime() {
    if (this.muted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch (e) {
      // Audio autoplay policy or device without audio
    }
  }

  /**
   * Play urgent 3-tone chime for critical anomalies (overvoltage, overcurrent)
   */
  playCriticalChime() {
    if (this.muted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      [
        { freq: 880, start: 0, dur: 0.12 },     // A5
        { freq: 784, start: 0.13, dur: 0.12 },   // G5
        { freq: 1046.5, start: 0.26, dur: 0.25 } // C6
      ].forEach((tone) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(tone.freq, now + tone.start);

        gain.gain.setValueAtTime(0.12, now + tone.start);
        gain.gain.exponentialRampToValueAtTime(0.001, now + tone.start + tone.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + tone.start);
        osc.stop(now + tone.start + tone.dur + 0.05);
      });
    } catch (e) {
      // Audio autoplay policy
    }
  }
}

export const audioService = new AudioService();
export default audioService;
