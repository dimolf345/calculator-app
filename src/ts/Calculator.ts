type NumbersHTML = NodeListOf<HTMLSpanElement>;
type Operator = "+" | "-" | "*" | "/" | undefined;

export default class Calculator {
  //1. Initializes properties for first input, second input and operator
  //2. Initializes references to html elements in order to render operators into the display
  //3. Updates operators and display according to input provided by the app
  //4. Performs the actual calculations

  private numbers: [number, number | null];
  private numbersHTMLEls: NumbersHTML;
  private operator: Operator;
  private operatorHTMLEl: HTMLSpanElement;
  private numberActive: boolean;

  constructor(numbersRef: NumbersHTML, operatorRef: HTMLSpanElement) {
    this.numbersHTMLEls = numbersRef;
    this.operatorHTMLEl = operatorRef;
    this.resetCalculator();
    this.updateDisplay();
  }

  private set currentNum(value: number) {
    this.numbers[+this.numberActive] = value;
  }

  private get currentNumTextContent(): string {
    return this.numbersHTMLEls[+this.numberActive].textContent || "";
  }

  private set currentNumTextContent(newValue: string) {
    this.numbersHTMLEls[+this.numberActive].textContent = newValue;
  }

  private handleNumberInput(input: string): void {
    if (
      this.currentNumTextContent.startsWith("0") ||
      !this.currentNumTextContent
    )
      this.currentNumTextContent = input;
    else this.currentNumTextContent += input;
  }

  private handleCommaPressed(): void {
    if (this.currentNumTextContent.includes(".")) return;
    this.currentNumTextContent += ".";
  }

  private handleOperatorPressed(operator: Operator) {
    this.operator = operator;
    this.currentNum = Number(this.currentNumTextContent);
    if (this.numberActive === true) {
      console.log("perform calculation");
      return;
    } else {
      this.numberActive = true;
      this.operatorHTMLEl.textContent = operator || "";
      this.currentNumTextContent = "0";
    }
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

  private setSecondNum(): void {
    if (
      !this.numbersHTMLEls[1].textContent &&
      (this.operator === "*" || this.operator === "/")
    )
      this.numbers[1] = 1;
    else if (
      !this.numbersHTMLEls[1].textContent &&
      (this.operator === "+" || this.operator === "-")
    )
      this.numbers[1] = 0;
    else this.numbers[1] = Number(this.currentNumTextContent);
  }

  performCalculation() {
    let result: number;
    this.setSecondNum();
    switch (this.operator) {
      case "+":
        result = this.numbers[0] + this.numbers[1]!;
        break;
      case "-":
        result = this.numbers[0] - this.numbers[1]!;
        break;
      case "*":
        result = this.numbers[0] * this.numbers[1]!;
        break;
      case "/":
        result = this.numbers[0] / this.numbers[1]!;
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
    this.numberActive = false;
    this.updateDisplay();
  }

  receiveInput(input: string): void {
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
