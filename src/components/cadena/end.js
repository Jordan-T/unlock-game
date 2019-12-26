import { Sound } from "../sound";
import winSound from "../../sounds/victory.mp3";

export class End {
  constructor(wrapper, { win, onRetry }, globalSettings = {}) {
    this.globalSettings = globalSettings;

    this.element = document.createElement("div");
    this.element.classList.add("c-end");
    this.element.innerHTML = `<h1>You ${win ? "win" : "loose"}</h1>`;

    if (globalSettings.muted !== true && win === true) {
      new Sound(winSound);
    }

    this.onClick = e => {
      e.preventDefault();
      onRetry();
    };
    this.button = document.createElement("button");
    this.button.innerHTML = win ? "Replay" : "Retry";
    this.button.classList.add("c-btn");
    this.button.addEventListener("click", this.onClick, true);
    this.element.append(this.button);

    wrapper.append(this.element);
  }

  destroy() {
    this.button.removeEventListener("click", this.onClick, true);
    this.element.innerHTML = "";
    this.element.remove();
  }
}
