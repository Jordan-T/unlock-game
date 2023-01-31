import { GameSettings } from ".";
import { difficulties, Difficulty } from "./config";

export class Intro {
  private element: HTMLElement;
  private form: HTMLFormElement;
  private onSubmit: (e: Event) => void;

  constructor(
    element: HTMLElement,
    onSubmit: (data: { difficulty: Difficulty }) => void,
    globalSettings: GameSettings
  ) {
    this.element = element;
    this.element.innerHTML = `
      <div class="c-intro">
        <h1>Unlock me</h1>
        <form class="c-intro__form">
          <label for="difficulty">Select the difficulty</label>
          <select id="difficulty" autofocus>
            ${Object.entries(difficulties)
              .map(
                ([key, { text }]) =>
                  `<option value="${key}"${
                    globalSettings.currentDifficulty === key ? " selected" : ""
                  }>${text}</option>`
              )
              .join("")})}
          </select>

          <div>
            <button type="submit" class="c-btn">Play</button>
          </div>
        </form>
      </div>
    `;

    this.onSubmit = (e) => {
      e.preventDefault();

      onSubmit({
        difficulty: this.element.querySelector<HTMLSelectElement>(
          "#difficulty"
        )!.value as Difficulty
      });
    };

    this.form = this.element.getElementsByTagName("form")[0];
    this.form.addEventListener("submit", this.onSubmit, true);
  }

  destroy() {
    this.form.removeEventListener("submit", this.onSubmit, true);
    this.element.innerHTML = "";
  }
}
