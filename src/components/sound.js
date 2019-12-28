export class Sound {
  constructor(sound, { volume, repeat } = {}) {
    this.sound = document.createElement("audio");
    if (volume) {
      this.volume(volume);
    }
    this.sound.src = sound;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.repeat = repeat;

    // add auto destroy
    this.sound.addEventListener("ended", this.onEnd, true);
    this.sound.loop = repeat;
    this.play();
  }

  onEnd = () => {
    if (this.repeat === true) {
      this.sound.currentTime = 0;
      this.play();
      return;
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
      result.catch((error) => {
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

  volume(value) {
    this.sound.volume = value;
  }

  destroy() {
    this.pause();
    this.sound.remove();
  }
}
