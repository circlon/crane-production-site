// Типы для VK Video API
declare global {
  interface Window {
    VK?: {
      VideoPlayer: (iframe: HTMLIFrameElement) => VKVideoPlayer;
    };
  }
}

export interface VKVideoPlayer {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  seekLive: () => void;
  getDuration: () => number;
  getCurrentTime: () => number;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  mute: () => void;
  unmute: () => void;
  isMuted: () => boolean;
  getState: () => string;
  getQuality: () => string;
  on: (event: string, handler: (state: VKPlayerState) => void) => void;
  off: (event: string, handler: (state: VKPlayerState) => void) => void;
  destroy: () => void;
}

export interface VKPlayerState {
  state: string;
  volume: number;
  muted: boolean;
  time: number;
  duration: number;
}

export { }; 