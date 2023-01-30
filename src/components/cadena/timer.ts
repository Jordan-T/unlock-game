export class Timer {
  private element: HTMLElement;
  private endDate!: number;
  private onEnd: () => void;

  #timer?: number = undefined;

  constructor(
    element: HTMLElement,
    {
      duration,
      endDate,
      onEnd
    }: { duration?: number; endDate?: number | string; onEnd: () => void }
  ) {
    this.element = element;
    this.onEnd = onEnd;

    if (endDate === undefined && duration !== undefined) {
      this.setEnd(new Date().getTime() + duration * 1000);
    } else if (endDate !== undefined) {
      this.setEnd(endDate);
    }

    this.start();
  }

  update = () => {
    requestAnimationFrame(() => {
      const secondsLeft = (this.endDate - Date.now()) / 1000;

      if (secondsLeft <= 0) {
        this.element.innerHTML = "0";

        this.onEnd();
        return;
      }

      const seconds = Math.floor(secondsLeft);

      this.element.innerHTML = `${seconds}`;

      this.#timer = setTimeout(this.update, 1000);
    });
  };

  setEnd(endDate: number | string) {
    this.endDate = typeof endDate === "number" ? endDate : Date.parse(endDate);
  }

  start() {
    this.update();
  }

  stop() {
    clearTimeout(this.#timer);
  }

  destroy() {
    this.element.innerHTML = "";
    this.stop();
  }
}
