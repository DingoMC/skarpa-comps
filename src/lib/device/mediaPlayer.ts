export interface IMediaPlayer {
  playAudio(): void;
  playVideo(): void;
  recordAudio(): void;
  recordVideo(): void;
  stream(): void;
}
