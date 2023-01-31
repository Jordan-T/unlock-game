import { BaseElement } from "./baseElement";

export class BaseActiveElement<
  T extends HTMLElement = HTMLElement
> extends BaseElement<T> {
  protected active = false;
  static ACTIVE_CLASS: string = "c-cadena__result--active";

  constructor(wrapper: HTMLElement) {
    super(wrapper);
  }

  setActive() {
    this.active = true;
    const constructor = this.constructor as unknown as typeof BaseActiveElement;
    this.element.classList.add(constructor.ACTIVE_CLASS);
  }

  unsetActive() {
    this.active = false;
    const constructor = this.constructor as unknown as typeof BaseActiveElement;
    this.element.classList.remove(constructor.ACTIVE_CLASS);
  }
}
