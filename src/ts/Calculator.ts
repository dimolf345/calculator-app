type NumbersHTML = NodeListOf<HTMLSpanElement>;
type Operator = "+" | "-" | "*" | "/" | undefined;

export default class Calculator {
  private readonly acceptedInputs: RegExp = /[0-9/*\-+/c.]/;

  private numbers: [number, number | null];
  private isDecimal: boolean;
  private numbersHTMLEls: NumbersHTML;
  private operator: Operator;
  private operatorHTMLEl: HTMLSpanElement;
  private numberActive: 0 | 1 = 0;

  constructor(numbersRef: NumbersHTML, operatorRef: HTMLSpanElement) {
    this.numbersHTMLEls = numbersRef;
    this.operatorHTMLEl = operatorRef;
    this.resetCalculator();
    this.updateDisplay();
  }

  private set currentNum(value: number) {
    this.numbers[this.numberActive] = value;
  }

  private get currentNumTextContent(): string {
    return this.numbersHTMLEls[this.numberActive].textContent || "";
  }

  private set currentNumTextContent(newValue: string) {
    this.numbersHTMLEls[+this.numberActive].textContent = newValue;
  }

  private handleNumberInput(input: string): void {
    if (this.currentNumTextContent === "0" || !this.currentNumTextContent)
      this.currentNumTextContent = this.isDecimal ? "0." + input : input;
    else {
      this.currentNumTextContent += input;
    }
    if (this.isDecimal) this.isDecimal = false;
  }

  private handleCommaPressed(): void {
    if (
      this.currentNumTextContent.includes(".") &&
      !this.currentNumTextContent.endsWith(".")
    )
      return;
    this.isDecimal = true;
    this.currentNumTextContent += ".";
  }

  private handleOperatorPressed(operator: Operator) {
    this.currentNum = Number(this.currentNumTextContent);
    if (this.numberActive === 0) {
      this.operator = operator;
      this.numberActive = 1;
    } else {
      this.performCalculation();
      this.operator = operator;
      this.numberActive = 1;
    }
    if (operator === "*") this.operatorHTMLEl.textContent = "x";
    else this.operatorHTMLEl.textContent = operator || "";
  }

  private removeLastCharacter() {
    if (this.currentNumTextContent.length === 1) {
      this.currentNumTextContent = "0";
      return;
    }
    this.currentNumTextContent = this.currentNumTextContent.substring(
      0,
      this.currentNumTextContent.length - 1
    );
  }

  performCalculation() {
    let result: number;
    if (this.currentNumTextContent)
      this.numbers[1] = Number(this.currentNumTextContent);
    switch (this.operator) {
      case "+":
        result = this.numbers[0] + (this.numbers[1] || 0);
        break;
      case "-":
        result = this.numbers[0] - (this.numbers[1] || 0);
        break;
      case "*":
        result = this.numbers[0] * (this.numbers[1] || 1);
        break;
      case "/":
        result = this.numbers[0] / (this.numbers[1] || 1);
        break;
      case undefined:
        result = Number(this.currentNumTextContent);
        break;
      default:
        result = this.numbers[0];
    }
    this.resetCalculator(result);
  }

  pressCancel(): void {
    this.removeLastCharacter();
  }

  updateDisplay(): void {
    this.numbersHTMLEls.forEach((el, i) => {
      el.textContent =
        this.numbers[i]?.toLocaleString(navigator.language) || "";
    });
    this.operatorHTMLEl.textContent = this.operator || "";
  }

  resetCalculator(result?: number): void {
    this.numbers = [result || 0, null];
    this.operator = undefined;
    this.numberActive = 0;
    this.isDecimal = false;
    this.updateDisplay();
  }

  receiveInput(input: string): void {
    if (!this.acceptedInputs.test(input)) return;
    if (input === ".") {
      this.handleCommaPressed();
      return;
    }
    if (/\d/.test(input)) {
      this.handleNumberInput(input);
      return;
    }
    this.handleOperatorPressed(input as Operator);
  }
}
