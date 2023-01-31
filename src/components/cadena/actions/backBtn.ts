import { Btn } from "../btn";

export default class BackBtn extends Btn {
  static BASE_CLASS: string = "c-cadena__back-btn";

  constructor(wrapper: HTMLElement, onClick: () => void) {
    super(wrapper, "", onClick);
    this.element.classList.add("c-btn");
    this.element.classList.add("c-btn--danger");
    this.element.innerText = "< Back";
  }
}
