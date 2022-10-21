type NumbersHTML = NodeListOf<HTMLSpanElement>;
type Operator = "+" | "-" | "*" | "/" | undefined;

export default class Calculator {
  private readonly acceptedInputs: RegExp = /[0-9/*\-+/c.]/;

  private numbers: [number, number | null];
  private textNumbers: [string, string | null];
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

  private set currentNumText(value: string) {
    this.textNumbers[this.numberActive] = value;
  }

  private get currentNumText(): string {
    return this.textNumbers[this.numberActive] || "";
  }

  private get currentNumTextContent(): string {
    return this.numbersHTMLEls[this.numberActive].textContent || "";
  }

  private set currentNumTextContent(newValue: string) {
    this.numbersHTMLEls[+this.numberActive].textContent = newValue;
  }

  private handleNumberInput(input: string): void {
    if (this.currentNumText === "0" || !this.currentNumText)
      this.currentNumText = this.isDecimal ? "0." + input : input;
    else {
      this.currentNumText += input;
    }
    if (this.isDecimal) this.isDecimal = false;
  }

  private handleCommaPressed(): void {
    if (this.currentNumText.includes(".") && !this.currentNumText.endsWith("."))
      return;
    this.isDecimal = true;
    this.currentNumText += ".";
  }

  private handleOperatorPressed(operator: Operator) {
    this.currentNum = Number(this.currentNumText);
    if (this.numberActive === 0) {
      this.operator = operator;
      this.numberActive = 1;
    } else {
      this.performCalculation();
      this.operator = operator;
      this.numberActive = 1;
    }
  }

  private removeLastCharacter() {
    if (this.currentNumText.length === 1) {
      this.currentNumText = "0";
      return;
    }
    this.currentNumText = this.currentNumText.substring(
      0,
      this.currentNumText.length - 1
    );
  }

  private convertToLocale(textNum: string | null) {
    if (!textNum) return "";
    return Number(textNum).toLocaleString(navigator.language);
  }

  performCalculation() {
    let result: number;
    if (this.currentNumText) this.numbers[1] = Number(this.currentNumText);
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
        result = Number(this.currentNumText);
        break;
      default:
        result = this.numbers[0];
    }
    this.resetCalculator(result);
  }

  pressCancel(): void {
    this.removeLastCharacter();
    this.updateDisplay();
  }

  updateDisplay(): void {
    this.numbersHTMLEls[0].textContent = this.convertToLocale(
      this.textNumbers[0]
    );
    this.numbersHTMLEls[1].textContent = this.convertToLocale(
      this.textNumbers[1]
    );
    if (this.isDecimal) this.currentNumTextContent += ".";
    if (this.operator === "*") this.operatorHTMLEl.textContent = "x";
    else this.operatorHTMLEl.textContent = this.operator || "";
  }

  resetCalculator(result = 0): void {
    this.numbers = [result, null];
    this.textNumbers = [String(result), ""];
    this.operator = undefined;
    this.numberActive = 0;
    this.isDecimal = false;
    this.updateDisplay();
  }

  receiveInput(input: string): void {
    if (!this.acceptedInputs.test(input)) return;
    if (input === ".") {
      this.handleCommaPressed();
      this.updateDisplay();
      return;
    }
    if (/\d/.test(input)) {
      this.handleNumberInput(input);
      this.updateDisplay();
      return;
    }
    this.handleOperatorPressed(input as Operator);
    this.updateDisplay();
  }
}
