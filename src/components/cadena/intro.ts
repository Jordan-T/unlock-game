export class Intro {
  private element: HTMLElement;
  private form: HTMLFormElement;
  private onSubmit: (e: Event) => void;

  constructor(
    element: HTMLElement,
    onSubmit: (data: { difficulty: string }) => void
  ) {
    this.element = element;
    this.element.innerHTML = `
      <div class="c-intro">
        <h1>Unlock me</h1>
        <form class="c-intro__form">
          <label for="difficulty">Select the difficulty</label>
          <select id="difficulty">
            <option value="very-easy">Very easy</option>
            <option value="easy">Easy</option>
            <option value="medium" selected>Medium</option>
            <option value="hard">Hard</option>
            <option value="very-hard">Very hard</option>
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
        difficulty:
          this.element.querySelector<HTMLSelectElement>("#difficulty")!.value
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
