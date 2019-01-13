import { MathCalc } from './mathcalc.js';
import { NumberParser } from './parser';

export class Calc {
    private numberParser = new NumberParser();
    /**
     * Performs the calculation
     * @param expression Expression to calculate
     */
    public calculate(expression: string): number {
        // call the function to calculate the expression
        var calc = new MathCalc();
        var expr = calc.parse(this.numberParser.tranformToDecimal(expression));
        return expr.eval();
    }
}