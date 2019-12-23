export class Timer {
  static BASE_CLASS = "c-cadena__timer";
  #timer = null;

  constructor(element, { duration, endDate, onEnd }) {
    this.element = element;
    this.onEnd = onEnd;

    if (endDate === undefined && duration !== undefined) {
      this.setEnd(new Date().getTime() + duration * 1000);
    } else {
      this.setEnd(endDate);
    }

    this.start();
  }

  update = () => {
    requestAnimationFrame(() => {
      const secondsLeft = (this.endDate - Date.parse(new Date())) / 1000;

      if (secondsLeft <= 0) {
        this.element.innerHTML = "0";

        this.onEnd();
        return;
      }

      const seconds = Math.floor(secondsLeft);

      this.element.innerHTML = seconds;

      this.#timer = setTimeout(this.update, 1000);
    });
  };

  setEnd(endDate) {
    this.endDate = typeof endDate === "number" ? endDate : Date.parse(endDate);
  }

  start() {
    this.update();
  }

  stop() {
    clearTimeout(this.#timer);
  }

  destroy() {
    this.innerHTML = "";
    this.stop();
  }
}
