export class Toggle {
  private element: HTMLButtonElement;
  private onActive: () => void;
  private onUnactive: () => void;

  private active = false;
  private readonly CLASS = "c-cadena__action";
  private readonly ACTIVE_CLASS = "c-cadena__action--active";

  constructor(
    wrapper: HTMLElement,
    {
      onActive,
      onUnactive,
      html,
      className
    }: {
      onActive: () => void;
      onUnactive: () => void;
      html: string;
      className: string;
    }
  ) {
    this.element = document.createElement("button");
    this.element.className = className;
    this.element.innerHTML = html;
    this.element.classList.add(this.CLASS);

    this.onActive = onActive;
    this.onUnactive = onUnactive;

    this.element.addEventListener("click", this.onClick, true);

    wrapper.append(this.element);
  }

  onClick = (e: Event) => {
    e.preventDefault();
    const needActive = this.active === false;
    if (needActive === true) {
      this.onActive();
    } else {
      this.onUnactive();
    }
    this.element.classList.toggle(this.ACTIVE_CLASS);
    this.active = needActive;
  };

  destroy() {
    this.element.removeEventListener("click", this.onClick, true);
    this.element.remove();
  }
}
