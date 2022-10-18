import ThemeHandler from "./ThemeHandler";
import Calculator from "./Calculator";

import { Theme } from "./ThemeHandler";

const htmlDocument = document.querySelector("html") as HTMLHtmlElement;
const numberEls = document.querySelectorAll(
  "span.number"
) as NodeListOf<HTMLSpanElement>;
const operatorEl = document.getElementById("operator") as HTMLSpanElement;
const calculatorBtns = document.querySelectorAll(
  "main .button"
) as NodeListOf<HTMLButtonElement>;

const themeRadioInputs = document.querySelectorAll(
  'input[name="theme"]'
) as NodeListOf<HTMLInputElement>;
const themeSwitcher = document.querySelector("form h2") as HTMLHeadingElement;

class App {
  private appCalculator: Calculator;
  private appTheme: ThemeHandler;
  private appBtns: NodeListOf<HTMLButtonElement>;
  private appThemeSelectors: NodeListOf<HTMLInputElement>;
  private appThemeSwitcher: HTMLHeadingElement;

  constructor(
    btns: NodeListOf<HTMLButtonElement>,
    themeSelectors: NodeListOf<HTMLInputElement>,
    themeSwitcher: HTMLHeadingElement
  ) {
    this.appCalculator = new Calculator(numberEls, operatorEl);
    this.appTheme = new ThemeHandler(htmlDocument);
    this.appBtns = btns;
    this.appThemeSelectors = themeSelectors;
    this.appThemeSwitcher = themeSwitcher;
    this.createEventListeners();
    this.findCurrentTheme();
  }

  private simulateBtnPress(btnValue: string): void {
    const pressedBtn = [...this.appBtns].find((el) => el.value === btnValue);
    pressedBtn?.classList.add("pressed");
    setTimeout(() => {
      pressedBtn?.classList.remove("pressed");
    }, 100);
  }

  private handleCalculatorInputs(e: KeyboardEvent | MouseEvent): void {
    let inputString;
    if (e instanceof KeyboardEvent) {
      inputString = e.key;
      this.simulateBtnPress(e.key);
    }
    if (e instanceof MouseEvent && e.target instanceof HTMLButtonElement)
      inputString = e.target.value;
    switch (inputString) {
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
        if (inputString.length !== 1) return;
        this.appCalculator.receiveInput(inputString);
    }
  }

  private handleThemeSelect(e: Event): void {
    this.appThemeSelectors.forEach((radioEl) => (radioEl.checked = false));
    if (e.target instanceof HTMLInputElement) {
      e.target.checked = true;
      this.appTheme.theme = e.target.value as Theme;
    }
  }

  private createEventListeners() {
    window.addEventListener("keydown", this.handleCalculatorInputs.bind(this));
    this.appBtns.forEach((btn) =>
      btn.addEventListener("click", this.handleCalculatorInputs.bind(this))
    );
    this.appThemeSelectors.forEach((radioEl) =>
      radioEl.addEventListener("change", this.handleThemeSelect.bind(this))
    );
    this.appThemeSwitcher.addEventListener(
      "click",
      this.changeTheme.bind(this)
    );
  }

  private findCurrentTheme() {
    this.appThemeSelectors.forEach((radioEl) => {
      if (radioEl.value === this.appTheme.theme) radioEl.checked = true;
    });
  }

  private changeTheme() {
    this.appTheme.nextTheme();
    this.findCurrentTheme();
  }
}

new App(calculatorBtns, themeRadioInputs, themeSwitcher);
