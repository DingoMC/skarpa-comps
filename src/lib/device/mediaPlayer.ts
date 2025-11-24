interface IAudioPlayer {
  playAudio(): void;
}

interface IVideoPlayer {
  playVideo(): void;
}

interface IAudioRecorder {
  recordAudio(): void;
}

interface IVideoRecorder {
  recordVideo(): void;
}

interface IStreamer {
  stream(): void;
}

class MP3Player implements IAudioPlayer {
  playAudio(): void {
    console.log('Playing Audio...');
  }
}

class VideoCamera implements IVideoRecorder, IVideoPlayer {
  playVideo() {
    console.log('Playing Video...');
  }
  recordVideo() {
    console.log('Recording Video...');
  }
}
