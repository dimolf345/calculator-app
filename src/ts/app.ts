import ThemeHandler from "./ThemeHandler";
import Calculator from "./Calculator";

const htmlDocument = document.querySelector("html") as HTMLHtmlElement;
const numberEls = document.querySelectorAll(
  "span.number"
) as NodeListOf<HTMLSpanElement>;
const operatorEl = document.getElementById("operator") as HTMLSpanElement;
const calculatorBtns = document.querySelectorAll(
  "main .button"
) as NodeListOf<HTMLButtonElement>;

// const appTheme = new ThemeHandler(htmlDocument);
// const appCalculator = new Calculator(numberEls, operatorEl);

// appCalculator.receiveInput("4");
// appCalculator.receiveInput(".");
// appCalculator.receiveInput("1");
// appCalculator.receiveInput("5");
// appCalculator.receiveInput("+");
// appCalculator.receiveInput("4");

// setTimeout(() => {
//   appCalculator.performCalculation();
// }, 2000);

// window.addEventListener("keydown", function (e) {
//   console.log(e);
// });
class App {
  private readonly acceptedInputs: RegExp = /[0-9/*\-+/c.]/;

  private appCalculator: Calculator;
  private appTheme: ThemeHandler;
  private appBtns: NodeListOf<HTMLButtonElement>;

  constructor(btns: NodeListOf<HTMLButtonElement>) {
    this.appCalculator = new Calculator(numberEls, operatorEl);
    this.appTheme = new ThemeHandler(htmlDocument);
    this.appBtns = btns;
    this.createEventListeners();
  }

  private simulateBtnPress(btnValue: string): void {
    const pressedBtn = [...this.appBtns].find((el) => el.value === btnValue);
    pressedBtn?.classList.add("pressed");
    setTimeout(() => {
      pressedBtn?.classList.remove("pressed");
    }, 100);
  }

  private handleKeyboardInputs(e: KeyboardEvent): void {
    switch (e.key) {
      case "Enter":
        this.appCalculator.performCalculation();
        break;
      case "Backspace":
        this.appCalculator.pressCancel();
        break;
      case "c":
        this.appCalculator.resetCalculator();
        break;
      default:
        this.appCalculator.receiveInput(e.key);
    }
  }

  private createEventListeners() {
    window.addEventListener("keydown", this.handleKeyboardInputs.bind(this));
  }
}

const calculatorApp = new App(calculatorBtns);
