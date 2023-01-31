export class Timer {
  private element: HTMLElement;
  private minutesElement!: HTMLElement;
  private secondsElement!: HTMLElement;
  private endDate!: number;
  private timer?: number;
  private onEnd: () => void;

  constructor({
    element,
    endDate,
    onEnd
  }: {
    element: HTMLElement;
    endDate: number | string;
    onEnd: () => void;
  }) {
    this.element = element;
    this.onEnd = onEnd;

    this.setEnd(endDate);
    this.createDom();
    this.start();
  }

  createDom() {
    this.element.innerHTML = "";

    this.minutesElement = document.createElement("span");
    this.element.append(this.minutesElement);

    this.element.append(":");

    this.secondsElement = document.createElement("span");
    this.element.append(this.secondsElement);
  }

  update = () => {
    requestAnimationFrame(() => {
      const timeLeft = (this.endDate - Date.now()) / 1000;
      const get2Digits = (number: number) => `${number < 10 ? 0 : ""}${number}`;

      if (timeLeft <= 0) {
        this.minutesElement.innerHTML = get2Digits(0);
        this.secondsElement.innerHTML = get2Digits(0);

        this.onEnd();
        return;
      }

      const minutes = Math.floor(timeLeft / 60);
      const seconds = Math.floor(timeLeft - minutes * 60);

      this.minutesElement.innerHTML = get2Digits(minutes);
      this.secondsElement.innerHTML = get2Digits(seconds);

      this.timer = setTimeout(this.update, 1000);
    });
  };

  setEnd(endDate: number | string) {
    this.endDate = typeof endDate === "number" ? endDate : Date.parse(endDate);
  }

  start() {
    this.update();
  }

  stop() {
    clearTimeout(this.timer);
  }

  destroy() {
    this.stop();
    this.element.remove();
  }
}
