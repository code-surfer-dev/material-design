import { MDCTopAppBar } from "@material/top-app-bar";
import { MDCRipple } from "@material/ripple/index";

const topAppBarElement = document.querySelector(".mdc-top-app-bar");
const topAppBar = new MDCTopAppBar(topAppBarElement);
const ripple = new MDCRipple(document.querySelector(".mdc-button"));
