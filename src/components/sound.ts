export class Sound {
  private readonly sound: HTMLAudioElement;
  private repeat: number | boolean;
  private onEnd?: () => void;

  constructor(
    sound: string,
    {
      volume,
      repeat,
      onEnd
    }: { volume?: number; repeat?: number | boolean; onEnd?: () => void } = {}
  ) {
    this.sound = document.createElement("audio");
    if (volume) {
      this.volume(volume);
    }
    this.sound.src = sound;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.repeat = repeat ?? false;

    // add auto destroy
    this.onEnd = onEnd;
    this.sound.addEventListener("ended", this.handleEnd, true);
    this.sound.loop = repeat === true;
    this.play();
  }

  handleEnd = () => {
    if (this.repeat === true || this.repeat > 1) {
      this.sound.currentTime = 0;
      this.play();
      if (typeof this.repeat === "number") {
        this.repeat -= 1;
      }
      return;
    }
    if (typeof this.onEnd === "function") {
      this.onEnd();
    }
    this.destroy();
  };

  /**
   * Play the sound
   * If the sound cannot be played, it will still be played when the user clicks on the page.
   * In particular, on the first arrival on the page
   */
  play() {
    const result = this.sound.play();
    if (result !== undefined) {
      result.catch((_) => {
        const onClick = () => {
          this.play();
          document.body.removeEventListener("click", onClick, true);
        };
        document.body.addEventListener("click", onClick, true);
      });
    }
  }

  pause() {
    this.sound.pause();
  }

  volume(value: number) {
    this.sound.volume = value;
  }

  destroy() {
    this.pause();
    this.sound.remove();
  }
}
