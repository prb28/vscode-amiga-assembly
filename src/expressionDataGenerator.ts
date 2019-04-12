import { MathCalc } from "./mathcalc";

export class ExpressionDataVariable {
    name: string;
    startValue: number;
    endValue: number;
    step: number;
    constructor(name: string, startValue: number, endValue: number, step: number) {
        this.name = name;
        this.startValue = startValue;
        this.endValue = endValue;
        this.step = step;
    }
}

export enum OutputDataType {
    LONG,
    WORD,
    BYTE
}

export class ExpressionDataGenerator {
    calc = new MathCalc();
    expression: string;
    variable: ExpressionDataVariable;
    constructor(expression: string, variable: ExpressionDataVariable) {
        this.expression = expression;
        this.variable = variable;
    }
    public eval(): Array<number> {
        let values = new Array<number>();
        var expr = this.calc.parse(this.expression);
        if (expr.error) {
            throw new Error('Parsing error at ' + expr.error.pos + ': ' + expr.error.text);
        } else {
            for (let x = this.variable.startValue; x <= this.variable.endValue; x += this.variable.step) {
                let value = expr.eval({ x: x });
                if (expr.scope.runtimeError) {
                    throw new Error('Error: ' + expr.error.text);
                }
                values.push(value);
            }
        }
        return values;
    }

    public evalString(outputDataType: OutputDataType, valuePerLine: number): string {
        let value = "";
        let isFirst = true;
        let type = 'b';
        if (outputDataType === OutputDataType.WORD) {
            type = 'w';
        } else if (outputDataType === OutputDataType.LONG) {
            type = 'l';
        }
        for (let v of this.eval()) {
            if (!isFirst) {
                value += '\n';
            } else {
                isFirst = false;
            }
            value += `dc.${type} ${v}`;
        }
        return value;
    }
}