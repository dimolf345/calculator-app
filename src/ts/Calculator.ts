type NumbersHTML = NodeListOf<HTMLSpanElement>;

export default class Calculator {
  //1. Initializes properties for first input, second input and operator
  //2. Initializes references to html elements in order to render operators into the display
  //3. Updates operators and display according to input provided by the app
  //4. Performs the actual calculations
  private readonly acceptedInputs = /[0-9/*\-+/c.]/;

  private numbers: [number, number | null];
  private numbersHTMLEls: NumbersHTML;
  private operator: "+" | "-" | "*" | "/" | undefined;
  private operatorHTMLEl: HTMLSpanElement;
  private isSecondNumberActive: boolean;
  private isDecimal = false;

  constructor(numbersRef: NumbersHTML, operatorRef: HTMLSpanElement) {
    this.numbersHTMLEls = numbersRef;
    this.operatorHTMLEl = operatorRef;
    this.resetCalculator();
    this.updateDisplay();
  }

  private handleNumberInput(input: string): void {
    const newInput = this.isDecimal ? "." + input : input;
    const newNumber = Number(
      this.numbers[+this.isSecondNumberActive] + newInput
    );
    this.numbers[+this.isSecondNumberActive] = newNumber;
    this.isDecimal = false;
    this.updateDisplay();
  }

  private handleCommaPressed(): void {
    if (this.isDecimal) return;
    if (!Number.isInteger(this.numbers[+this.isSecondNumberActive])) return;
    this.isDecimal = true;
    this.numbersHTMLEls[+this.isSecondNumberActive].textContent += ".";
  }

  private removeComma() {
    this.numbersHTMLEls[+this.isSecondNumberActive].textContent = String(
      this.numbers[+this.isSecondNumberActive]
    );
    this.isDecimal = false;
  }

  private removeLastCharacter(index: number) {
    const stringValue = String(this.numbers[index]);
    this.numbers[index] = Number(
      stringValue.substring(0, stringValue.length - 1)
    );
  }

  pressCancel(): void {
    if (this.isDecimal) {
      this.removeComma();
      return;
    }
    if (this.operator && !this.isSecondNumberActive) {
      this.operator = undefined;
    } else {
      this.removeLastCharacter(+this.isSecondNumberActive);
    }

    this.updateDisplay();
  }

  updateDisplay(): void {
    this.numbersHTMLEls.forEach((el, i) => {
      el.textContent =
        this.numbers[i]?.toLocaleString(navigator.language) || "";
    });
    this.operatorHTMLEl.textContent = this.operator || "";
  }

  resetCalculator(): void {
    this.numbers = [0, null];
    this.operator = undefined;
    this.isSecondNumberActive = false;
  }

  receiveInput(input: string): void {
    if (!this.acceptedInputs.test(input)) return;
    if (input === ".") this.handleCommaPressed();
    if (/\d/.test(input)) this.handleNumberInput(input);
  }
}
