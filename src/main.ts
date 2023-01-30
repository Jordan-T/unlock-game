import ready from "./utils/ready";
import { Cadena } from "./components/cadena";

import "./styles.scss";

ready(() => {
  new Cadena(document.getElementById("game")!);
});
