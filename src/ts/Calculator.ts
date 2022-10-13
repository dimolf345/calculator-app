type NumbersHTML = [HTMLSpanElement, HTMLSpanElement];

export default class Calculator {
  //1. Initializes properties for first input, second input and operator
  //2. Initializes references to html elements in order to render operators into the display
  //3. Updates operators and display according to input provided by the app
  //4. Performs the actual calculations
  private readonly acceptedInputs = /[0-9/*\-+/c.]/;

  private numbers: [number, number | undefined];
  private numbersHTMLEls: NumbersHTML;
  private operator: "+" | "-" | "*" | "/" | undefined;
  private operatorHTMLEl: HTMLSpanElement;
  private isSecondNumberActive: boolean;

  constructor(numbersRef: NumbersHTML, operatorRef: HTMLSpanElement) {
    this.numbersHTMLEls = numbersRef;
    this.operatorHTMLEl = operatorRef;
    this.resetCalculator();
  }

  private handleNumberInput(input: string): void {
    const newNumber = Number(this.numbers[+this.isSecondNumberActive] + input);
    this.numbers[+this.isSecondNumberActive] = newNumber;
    this.updateDisplay();
  }

  resetCalculator(): void {
    this.numbers = [0, undefined];
    this.operator = undefined;
    this.isSecondNumberActive = false;
  }

  receiveInput(input: string): void {
    if (!this.acceptedInputs.test(input)) return;
    if (/\d/.test(input)) this.handleNumberInput(input);
  }
}
