export class End {
  static WIN = 1;
  static LOOSE = 0;

  constructor(type) {
    if (type === this.constructor.WIN) {
      console.log("WIIIIN");
    } else if (type === this.constructor.LOOSE) {
      console.log("LOOOSER");
    }
  }
}
