type SfxType = 'bounce' | 'coin' | 'hit' | 'countdown';

const FREQUENCIES: Record<SfxType, number[]> = {
  bounce: [440, 660],
  coin: [820, 1020],
  hit: [180, 120, 90],
  countdown: [480],
};

export class SfxSynth {
  private readonly context: AudioContext;
  private muted = false;

  constructor() {
    const fallbackWindow = window as Window & { webkitAudioContext?: typeof AudioContext };
    const AudioContextClass = window.AudioContext ?? fallbackWindow.webkitAudioContext;
    if (!AudioContextClass) {
      throw new Error('Web Audio API is not supported in this browser.');
    }
    this.context = new AudioContextClass();
    this.context.suspend().catch(() => {});
  }

  setMuted(value: boolean): void {
    this.muted = value;
    if (!value && this.context.state === 'suspended') {
      void this.context.resume();
    }
  }

  toggle(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  async resume(): Promise<void> {
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  async play(type: SfxType, options: { volume?: number; duration?: number } = {}): Promise<void> {
    if (this.muted) {
      return;
    }
    await this.resume();
    const now = this.context.currentTime;
    const freqs = FREQUENCIES[type] ?? [440];
    const duration = options.duration ?? 0.16;
    const volume = options.volume ?? 0.35;

    freqs.forEach((frequency, index) => {
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.type = 'triangle';
      oscillator.frequency.value = frequency;
      const startTime = now + index * 0.025;
      const endTime = startTime + duration;

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

      oscillator.connect(gain).connect(this.context.destination);
      oscillator.start(startTime);
      oscillator.stop(endTime + 0.02);
    });
  }
}
