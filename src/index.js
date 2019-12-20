import ready from "./utils/ready";
import { Cadenas } from "./components/cadena";

import "./styles.scss";

ready(() => {
  new Cadenas(document.getElementById("game"));
});
