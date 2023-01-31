import { BaseActiveElement } from "../../utils/baseActiveElement";

export class Btn extends BaseActiveElement<HTMLButtonElement> {
  static TAG_NAME = "button";
  static BASE_CLASS = "c-cadena__btn";
  static ACTIVE_CLASS = "c-cadena__btn--active";
  private onClick: (e: Event) => void;

  constructor(
    wrapper: HTMLElement,
    value: string,
    onClick: (active: boolean) => void
  ) {
    super(wrapper);

    this.element.type = "button";
    this.element.dataset.value = value;

    this.onClick = (e) => {
      e.preventDefault();
      onClick(this.active);
    };
    this.element.addEventListener("click", this.onClick, true);
  }

  setActive(): void {
    super.setActive();
    this.element.disabled = true;
  }

  unsetActive(): void {
    super.unsetActive();
    this.element.disabled = false;
  }

  destroy() {
    super.destroy();
    this.element.removeEventListener("click", this.onClick, true);
  }
}
