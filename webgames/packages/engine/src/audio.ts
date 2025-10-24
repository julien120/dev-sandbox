type AudioStore = Map<string, HTMLAudioElement>;

export class AudioManager {
  private readonly sounds: AudioStore = new Map();
  private muted = false;

  load(id: string, url: string): void {
    if (this.sounds.has(id)) {
      return;
    }
    const audio = new Audio(url);
    audio.preload = 'auto';
    this.sounds.set(id, audio);
  }

  play(id: string, options: { loop?: boolean; volume?: number } = {}): void {
    const sound = this.sounds.get(id);
    if (!sound || this.muted) {
      return;
    }

    const instance = sound.cloneNode(true) as HTMLAudioElement;
    instance.loop = options.loop ?? false;
    instance.volume = options.volume ?? 1;
    void instance.play();
  }

  setMuted(value: boolean): void {
    this.muted = value;
  }

  isMuted(): boolean {
    return this.muted;
  }
}
