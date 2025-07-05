import { Howl, Howler } from 'howler';

interface SoundOptions {
  loop?: boolean;
  volume?: number;
  rate?: number;
  sprite?: { [key: string]: [number, number] };
  autoplay?: boolean;
  mute?: boolean;
  preload?: boolean;
  pool?: number;
  format?: string[];
  onload?: () => void;
  onloaderror?: (id: number, error: unknown) => void;
  onplay?: () => void;
  onpause?: () => void;
  onstop?: () => void;
  onend?: () => void;
  onfade?: () => void;
  onvolume?: () => void;
  onrate?: () => void;
  onseek?: () => void;
  onunlock?: () => void;
}

interface SoundInfo {
  howl: Howl;
  isPlaying: boolean;
  currentSoundId?: number;
}

export class AudioManager {
  private sounds = new Map<string, SoundInfo>();
  private globalVolume = 1;
  private muted = false;

  /**
   * Load a sound into the manager
   * @param id - Unique identifier for the sound
   * @param src - Source URL(s) for the audio file
   * @param options - Howler.js options
   */
  load(id: string, src: string | string[], options: SoundOptions = {}): Howl {
    const howl = new Howl({
      src: Array.isArray(src) ? src : [src],
      ...options
    });

    this.sounds.set(id, {
      howl,
      isPlaying: false
    });

    return howl;
  }

  /**
   * Play a loaded sound
   * @param id - Sound identifier
   * @param sprite - Optional sprite name to play
   * @returns Sound ID from Howler.js or null if sound not found
   */
  play(id: string, sprite?: string): number | null {
    const soundInfo = this.sounds.get(id);
    if (!soundInfo) {
      console.warn(`Sound with id "${id}" not found`);
      return null;
    }

    const soundId = sprite ? soundInfo.howl.play(sprite) : soundInfo.howl.play();
    soundInfo.isPlaying = true;
    soundInfo.currentSoundId = soundId;

    return soundId;
  }

  /**
   * Stop a sound
   * @param id - Sound identifier
   * @param soundId - Optional specific sound instance ID
   */
  stop(id: string, soundId?: number): void {
    const soundInfo = this.sounds.get(id);
    if (!soundInfo) {
      console.warn(`Sound with id "${id}" not found`);
      return;
    }

    soundInfo.howl.stop(soundId);
    soundInfo.isPlaying = false;
    soundInfo.currentSoundId = undefined;
  }

  /**
   * Pause a sound
   * @param id - Sound identifier
   * @param soundId - Optional specific sound instance ID
   */
  pause(id: string, soundId?: number): void {
    const soundInfo = this.sounds.get(id);
    if (!soundInfo) {
      console.warn(`Sound with id "${id}" not found`);
      return;
    }

    soundInfo.howl.pause(soundId);
    soundInfo.isPlaying = false;
  }

  /**
   * Resume a paused sound
   * @param id - Sound identifier
   * @param soundId - Optional specific sound instance ID
   */
  resume(id: string, soundId?: number): void {
    const soundInfo = this.sounds.get(id);
    if (!soundInfo) {
      console.warn(`Sound with id "${id}" not found`);
      return;
    }

    soundInfo.howl.play(soundId);
    soundInfo.isPlaying = true;
  }

  /**
   * Set volume for a specific sound
   * @param id - Sound identifier
   * @param volume - Volume level (0.0 to 1.0)
   * @param soundId - Optional specific sound instance ID
   */
  setVolume(id: string, volume: number, soundId?: number): void {
    const soundInfo = this.sounds.get(id);
    if (!soundInfo) {
      console.warn(`Sound with id "${id}" not found`);
      return;
    }

    if (soundId !== undefined) {
      soundInfo.howl.volume(volume, soundId);
    } else {
      soundInfo.howl.volume(volume);
    }
  }

  /**
   * Get volume for a specific sound
   * @param id - Sound identifier
   * @param soundId - Optional specific sound instance ID
   */
  getVolume(id: string, soundId?: number): number {
    const soundInfo = this.sounds.get(id);
    if (!soundInfo) {
      console.warn(`Sound with id "${id}" not found`);
      return 0;
    }

    if (soundId !== undefined) {
      return soundInfo.howl.volume(soundId) as number;
    } else {
      return soundInfo.howl.volume() as number;
    }
  }

  /**
   * Set playback rate for a sound
   * @param id - Sound identifier
   * @param rate - Playback rate (0.5 to 4.0)
   * @param soundId - Optional specific sound instance ID
   */
  setRate(id: string, rate: number, soundId?: number): void {
    const soundInfo = this.sounds.get(id);
    if (!soundInfo) {
      console.warn(`Sound with id "${id}" not found`);
      return;
    }

    if (soundId !== undefined) {
      soundInfo.howl.rate(rate, soundId);
    } else {
      soundInfo.howl.rate(rate);
    }
  }

  /**
   * Check if a sound is currently playing
   * @param id - Sound identifier
   * @param soundId - Optional specific sound instance ID
   */
  isPlaying(id: string, soundId?: number): boolean {
    const soundInfo = this.sounds.get(id);
    if (!soundInfo) {
      return false;
    }

    if (soundId !== undefined) {
      return soundInfo.howl.playing(soundId);
    } else {
      return soundInfo.howl.playing();
    }
  }

  /**
   * Get duration of a sound
   * @param id - Sound identifier
   * @param soundId - Optional specific sound instance ID
   */
  getDuration(id: string, soundId?: number): number {
    const soundInfo = this.sounds.get(id);
    if (!soundInfo) {
      console.warn(`Sound with id "${id}" not found`);
      return 0;
    }

    if (soundId !== undefined) {
      return soundInfo.howl.duration(soundId) as number;
    } else {
      return soundInfo.howl.duration() as number;
    }
  }

  /**
   * Seek to a position in a sound
   * @param id - Sound identifier
   * @param seek - Position in seconds
   * @param soundId - Optional specific sound instance ID
   */
  seek(id: string, seek: number, soundId?: number): void {
    const soundInfo = this.sounds.get(id);
    if (!soundInfo) {
      console.warn(`Sound with id "${id}" not found`);
      return;
    }

    if (soundId !== undefined) {
      soundInfo.howl.seek(seek, soundId);
    } else {
      soundInfo.howl.seek(seek);
    }
  }

  /**
   * Fade a sound between volumes
   * @param id - Sound identifier
   * @param from - Starting volume
   * @param to - Ending volume
   * @param duration - Fade duration in milliseconds
   * @param soundId - Optional specific sound instance ID
   */
  fade(id: string, from: number, to: number, duration: number, soundId?: number): void {
    const soundInfo = this.sounds.get(id);
    if (!soundInfo) {
      console.warn(`Sound with id "${id}" not found`);
      return;
    }

    if (soundId !== undefined) {
      soundInfo.howl.fade(from, to, duration, soundId);
    } else {
      soundInfo.howl.fade(from, to, duration);
    }
  }

  /**
   * Unload a sound from memory
   * @param id - Sound identifier
   */
  unload(id: string): void {
    const soundInfo = this.sounds.get(id);
    if (!soundInfo) {
      console.warn(`Sound with id "${id}" not found`);
      return;
    }

    soundInfo.howl.unload();
    this.sounds.delete(id);
  }

  /**
   * Unload all sounds from memory
   */
  unloadAll(): void {
    this.sounds.forEach((soundInfo) => {
      soundInfo.howl.unload();
    });
    this.sounds.clear();
  }

  /**
   * Stop all currently playing sounds
   */
  stopAll(): void {
    this.sounds.forEach((soundInfo, id) => {
      if (soundInfo.isPlaying) {
        this.stop(id);
      }
    });
  }

  /**
   * Pause all currently playing sounds
   */
  pauseAll(): void {
    this.sounds.forEach((soundInfo, id) => {
      if (soundInfo.isPlaying) {
        this.pause(id);
      }
    });
  }

  /**
   * Set global volume for all sounds
   * @param volume - Volume level (0.0 to 1.0)
   */
  setGlobalVolume(volume: number): void {
    this.globalVolume = Math.max(0, Math.min(1, volume));
    Howler.volume(this.globalVolume);
  }

  /**
   * Get global volume
   */
  getGlobalVolume(): number {
    return this.globalVolume;
  }

  /**
   * Mute all sounds
   */
  mute(): void {
    this.muted = true;
    Howler.mute(true);
  }

  /**
   * Unmute all sounds
   */
  unmute(): void {
    this.muted = false;
    Howler.mute(false);
  }

  /**
   * Check if globally muted
   */
  isMuted(): boolean {
    return this.muted;
  }

  /**
   * Get all loaded sound IDs
   */
  getLoadedSounds(): string[] {
    return Array.from(this.sounds.keys());
  }

  /**
   * Check if a sound is loaded
   * @param id - Sound identifier
   */
  isLoaded(id: string): boolean {
    return this.sounds.has(id);
  }

  /**
   * Register a Howl instance with a custom ID (for Sound class)
   * @param id - Unique identifier
   * @param howl - Howl instance
   */
  public registerSound(id: string, howl: Howl): void {
    this.sounds.set(id, {
      howl,
      isPlaying: false
    });
  }

  /**
   * Unregister a sound by ID (for Sound class)
   * @param id - Unique identifier
   */
  public unregisterSound(id: string): void {
    this.sounds.delete(id);
  }
}

/**
 * Individual Sound class for easier instantiation
 */
export class Sound {
  private static idCounter = 0;
  private id: string;
  private howl: Howl;
  private currentSoundId?: number;

  constructor(src: string | string[], options: SoundOptions = {}) {
    // Generate unique ID for this sound instance
    this.id = `sound_${++Sound.idCounter}_${Date.now()}`;
    
    this.howl = new Howl({
      src: Array.isArray(src) ? src : [src],
      ...options
    });

    // Register with global audio manager for centralized control if needed
    audioManager.registerSound(this.id, this.howl);
  }

  /**
   * Play this sound
   * @param sprite - Optional sprite name
   * @returns Sound ID from Howler.js
   */
  play(sprite?: string): number {
    const soundId = sprite ? this.howl.play(sprite) : this.howl.play();
    this.currentSoundId = soundId;
    return soundId;
  }

  /**
   * Stop this sound
   * @param soundId - Optional specific sound instance ID
   */
  stop(soundId?: number): void {
    this.howl.stop(soundId);
    if (!soundId || soundId === this.currentSoundId) {
      this.currentSoundId = undefined;
    }
  }

  /**
   * Pause this sound
   * @param soundId - Optional specific sound instance ID
   */
  pause(soundId?: number): void {
    this.howl.pause(soundId);
  }

  /**
   * Resume this sound
   * @param soundId - Optional specific sound instance ID
   */
  resume(soundId?: number): void {
    this.howl.play(soundId);
  }

  /**
   * Set volume for this sound
   * @param volume - Volume level (0.0 to 1.0)
   * @param soundId - Optional specific sound instance ID
   */
  setVolume(volume: number, soundId?: number): void {
    if (soundId !== undefined) {
      this.howl.volume(volume, soundId);
    } else {
      this.howl.volume(volume);
    }
  }

  /**
   * Get volume for this sound
   * @param soundId - Optional specific sound instance ID
   */
  getVolume(soundId?: number): number {
    if (soundId !== undefined) {
      return this.howl.volume(soundId) as number;
    } else {
      return this.howl.volume() as number;
    }
  }

  /**
   * Set playback rate
   * @param rate - Playback rate (0.5 to 4.0)
   * @param soundId - Optional specific sound instance ID
   */
  setRate(rate: number, soundId?: number): void {
    if (soundId !== undefined) {
      this.howl.rate(rate, soundId);
    } else {
      this.howl.rate(rate);
    }
  }

  /**
   * Check if this sound is playing
   * @param soundId - Optional specific sound instance ID
   */
  isPlaying(soundId?: number): boolean {
    if (soundId !== undefined) {
      return this.howl.playing(soundId);
    } else {
      return this.howl.playing();
    }
  }

  /**
   * Get duration of this sound
   * @param soundId - Optional specific sound instance ID
   */
  getDuration(soundId?: number): number {
    if (soundId !== undefined) {
      return this.howl.duration(soundId) as number;
    } else {
      return this.howl.duration() as number;
    }
  }

  /**
   * Seek to position in this sound
   * @param seek - Position in seconds
   * @param soundId - Optional specific sound instance ID
   */
  seek(seek: number, soundId?: number): void {
    if (soundId !== undefined) {
      this.howl.seek(seek, soundId);
    } else {
      this.howl.seek(seek);
    }
  }

  /**
   * Fade this sound between volumes
   * @param from - Starting volume
   * @param to - Ending volume
   * @param duration - Fade duration in milliseconds
   * @param soundId - Optional specific sound instance ID
   */
  fade(from: number, to: number, duration: number, soundId?: number): void {
    if (soundId !== undefined) {
      this.howl.fade(from, to, duration, soundId);
    } else {
      this.howl.fade(from, to, duration);
    }
  }

  /**
   * Unload this sound from memory
   */
  unload(): void {
    this.howl.unload();
    audioManager.unregisterSound(this.id);
  }

  /**
   * Get the unique ID of this sound instance
   */
  getId(): string {
    return this.id;
  }

  /**
   * Get the underlying Howl instance
   */
  getHowl(): Howl {
    return this.howl;
  }
}

// Export singleton instance of AudioManager
export const audioManager = new AudioManager();