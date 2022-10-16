import ThemeHandler from "./ThemeHandler";
import Calculator from "./Calculator";

const htmlDocument = document.querySelector("html") as HTMLHtmlElement;
const numberEls = document.querySelectorAll(
  "span.number"
) as NodeListOf<HTMLSpanElement>;
const operatorEl = document.getElementById("operator") as HTMLSpanElement;

const appTheme = new ThemeHandler(htmlDocument);
const appCalculator = new Calculator(numberEls, operatorEl);

appCalculator.receiveInput("4");
appCalculator.receiveInput(".");
appCalculator.receiveInput("1");
appCalculator.receiveInput("5");
appCalculator.receiveInput("+");
appCalculator.receiveInput("4");

setTimeout(() => {
  appCalculator.performCalculation();
}, 2000);

window.addEventListener("keydown", function (e) {
  console.log(e);
});
