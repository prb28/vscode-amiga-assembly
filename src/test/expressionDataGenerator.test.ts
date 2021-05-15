// The module 'chai' provides assertion methods from node
import { expect } from 'chai';
import { ExpressionDataGenerator, ExpressionDataVariable, OutputDataType, ExpressionDataGeneratorSerializer, DataGeneratorCodeLensProvider } from '../expressionDataGenerator';
import { Uri, Position, window, CancellationTokenSource, commands } from "vscode";
import { fail } from 'assert';

describe("Expression data generator", function () {
    it("should generate a line expression data", function () {
        const expVar = new ExpressionDataVariable("x", 1, 10, 1);
        const expDGen = new ExpressionDataGenerator("x+2", expVar);
        expect(expDGen.eval()).to.be.eql([3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    });
    it("should throw an exception on invalid function", function () {
        const expVar = new ExpressionDataVariable("x", 1, 10, 1);
        const expDGen = new ExpressionDataGenerator("x/2)", expVar);
        expect(() => expDGen.eval()).to.throw("Parsing error at 3: Unmatched paren");
    });
    it("should throw an exception on eval runtime", function () {
        const expVar = new ExpressionDataVariable("x", 0, 10, 1);
        const expDGen = new ExpressionDataGenerator("foo(x)", expVar);
        expect(() => expDGen.eval()).to.throw();
    });
    it("should generate a sinus expression data", function () {
        const expVar = new ExpressionDataVariable("x", 0, 5, 1);
        const expDGen = new ExpressionDataGenerator("round(sin(x*pi/180)*pow(2,14))", expVar);
        const values = expDGen.eval();
        for (let x = 0; x <= 5; x++) {
            const p = Math.pow(2, 14);
            const s = Math.sin(x * Math.PI / 180);
            const v = Math.round(s * p);
            expect(values[x]).to.be.equal(v);
        }
    });
    it("should pad generate numbers", function () {
        const expVar = new ExpressionDataVariable("x", 1, 2, 1);
        const expDGen = new ExpressionDataGenerator("x", expVar);
        expDGen.setOutputDataType(OutputDataType.BYTE);
        expDGen.setOutputInHex(true);
        expect(expDGen.evalString()).to.be.equal("dc.b $01, $02");
        expDGen.setOutputDataType(OutputDataType.WORD);
        expDGen.setOutputInHex(true);
        expect(expDGen.evalString()).to.be.equal("dc.w $0001, $0002");
        expDGen.setOutputDataType(OutputDataType.LONG);
        expDGen.setOutputInHex(true);
        expect(expDGen.evalString()).to.be.equal("dc.l $00000001, $00000002");
    });
    it("should generate negative numbers", function () {
        const expVar = new ExpressionDataVariable("x", 1, 2, 1);
        const expDGen = new ExpressionDataGenerator("-x", expVar);
        expDGen.setOutputDataType(OutputDataType.BYTE);
        expDGen.setOutputInHex(false);
        expect(expDGen.evalString()).to.be.equal(ExpressionDataGenerator.SIGNED_VALUES_COMMENT + "dc.b -1, -2");
        expDGen.setOutputInHex(true);
        expect(expDGen.evalString()).to.be.equal(ExpressionDataGenerator.SIGNED_VALUES_COMMENT + "dc.b $ff, $fe");
        expDGen.setOutputDataType(OutputDataType.WORD);
        expDGen.setOutputInHex(false);
        expect(expDGen.evalString()).to.be.equal(ExpressionDataGenerator.SIGNED_VALUES_COMMENT + "dc.w -1, -2");
        expDGen.setOutputInHex(true);
        expect(expDGen.evalString()).to.be.equal(ExpressionDataGenerator.SIGNED_VALUES_COMMENT + "dc.w $ffff, $fffe");
        expDGen.setOutputDataType(OutputDataType.LONG);
        expDGen.setOutputInHex(false);
        expect(expDGen.evalString()).to.be.equal(ExpressionDataGenerator.SIGNED_VALUES_COMMENT + "dc.l -1, -2");
        expDGen.setOutputInHex(true);
        expect(expDGen.evalString()).to.be.equal(ExpressionDataGenerator.SIGNED_VALUES_COMMENT + "dc.l $ffffffff, $fffffffe");
    });
    it("should prevent negative numbers byte out of bounds", function () {
        let expVar = new ExpressionDataVariable("x", 0x7f + 1, 0x7f + 2, 1);
        let expDGen = new ExpressionDataGenerator("-x", expVar);
        expDGen.setOutputInHex(true);
        expDGen.setOutputDataType(OutputDataType.BYTE);
        expect(() => expDGen.evalString()).to.throw();

        expVar = new ExpressionDataVariable("x", -1, 149, 50);
        expDGen = new ExpressionDataGenerator("x", expVar);
        expDGen.setOutputInHex(true);
        expDGen.setOutputDataType(OutputDataType.BYTE);
        expect(() => expDGen.evalString()).to.throw();
    });
    it("should prevent negative numbers word out of bounds", function () {
        let expVar = new ExpressionDataVariable("x", 0x7fff + 1, 0x7fff + 2, 1);
        let expDGen = new ExpressionDataGenerator("-x", expVar);
        expDGen.setOutputInHex(true);
        expDGen.setOutputDataType(OutputDataType.WORD);
        expect(() => expDGen.evalString()).to.throw();

        expVar = new ExpressionDataVariable("x", -1, 0X7fff + 10, 0x1001);
        expDGen = new ExpressionDataGenerator("x", expVar);
        expDGen.setOutputInHex(true);
        expDGen.setOutputDataType(OutputDataType.WORD);
        expect(() => expDGen.evalString()).to.throw();
    });
    it("should prevent negative numbers long out of bounds", function () {
        let expVar = new ExpressionDataVariable("x", 0x7fffffff + 1, 0x7fffffff + 2, 1);
        let expDGen = new ExpressionDataGenerator("-x", expVar);
        expDGen.setOutputInHex(true);
        expDGen.setOutputDataType(OutputDataType.LONG);
        expect(() => expDGen.evalString()).to.throw();

        expVar = new ExpressionDataVariable("x", -1, 0X7fffffff + 10, 0x10000001);
        expDGen = new ExpressionDataGenerator("x", expVar);
        expDGen.setOutputInHex(true);
        expDGen.setOutputDataType(OutputDataType.LONG);
        expect(() => expDGen.evalString()).to.throw();
    });
    it("should generate a string output for all output types", function () {
        const expVar = new ExpressionDataVariable("x", 0, 3, 1);
        let expDGen = new ExpressionDataGenerator("round(sin(x*pi/180)*pow(2,14))", expVar);
        // default values WORD / 10 per line
        expDGen.setValuesPerLine(1);
        let output = expDGen.evalString();
        let expected = "dc.w 0\ndc.w 286\ndc.w 572\ndc.w 857";
        expect(output).to.be.equal(expected);
        expDGen.setOutputDataType(OutputDataType.LONG);
        expDGen.setValuesPerLine(1);
        expected = "dc.l 0\ndc.l 286\ndc.l 572\ndc.l 857";
        output = expDGen.evalString();
        expect(output).to.be.equal(expected);
        expDGen = new ExpressionDataGenerator("x", expVar);
        expDGen.setOutputDataType(OutputDataType.BYTE);
        expDGen.setValuesPerLine(1);
        output = expDGen.evalString();
        expected = "dc.b 0\ndc.b 1\ndc.b 2\ndc.b 3";
        expect(output).to.be.equal(expected);
    });
    it("should generate a string output for hex format", function () {
        const expVar = new ExpressionDataVariable("x", 10, 11, 1);
        const expDGen = new ExpressionDataGenerator("x", expVar);
        expDGen.setOutputDataType(OutputDataType.BYTE);
        expDGen.setOutputInHex(true);
        expDGen.setValuesPerLine(2);
        const output = expDGen.evalString();
        const expected = "dc.b $0a, $0b";
        expect(output).to.be.equal(expected);
    });
    it("should throw an exception on override", function () {
        const expVar = new ExpressionDataVariable("x", 1, 2, 1);
        let expDGen = new ExpressionDataGenerator("x+300", expVar);
        expDGen.setOutputDataType(OutputDataType.BYTE);
        expect(() => expDGen.evalString()).to.throw();
        expDGen = new ExpressionDataGenerator("x+pow(2,15)", expVar);
        expDGen.setOutputDataType(OutputDataType.WORD);
        expect(() => expDGen.evalString()).to.throw();
        expDGen = new ExpressionDataGenerator("x+pow(2,31)", expVar);
        expDGen.setOutputDataType(OutputDataType.LONG);
        expect(() => expDGen.evalString()).to.throw();
    });
    it("should parse and print a comment data generator", function () {
        const expression = "round(sin(x*pi/180)*pow(2,14))";
        const name = "x";
        const startValue = 0;
        const endValue = 3;
        const step = 1;
        const outputType = "W";
        const outputHex = false;
        const valuesPerLine = 1;
        let comment = `;${ExpressionDataGeneratorSerializer.START_KEYWORD}----------------\n`;
        comment += "; This code was generated by Amiga Assembly extension\n";
        comment += ";\n";
        comment += ";----- parameters : modify ------\n";
        comment += `;${ExpressionDataGeneratorSerializer.EXPRESSION_KEYWORD}(x as variable): ${expression}\n`;
        comment += `;${ExpressionDataGeneratorSerializer.VARIABLE_KEYWORD}:\n`;
        comment += `;   ${ExpressionDataGeneratorSerializer.VARIABLE_NAME_KEYWORD}:${name}\n`;
        comment += `;   ${ExpressionDataGeneratorSerializer.VARIABLE_STARTVALUE_KEYWORD}:${startValue}\n`;
        comment += `;   ${ExpressionDataGeneratorSerializer.VARIABLE_ENDVALUE_KEYWORD}:${endValue}\n`;
        comment += `;   ${ExpressionDataGeneratorSerializer.VARIABLE_STEP_KEYWORD}:${step}\n`;
        comment += `;${ExpressionDataGeneratorSerializer.OUTPUTTYPE_KEYWORD}(B,W,L): ${outputType}\n`;
        comment += `;${ExpressionDataGeneratorSerializer.OUTPUTHEX_KEYWORD}: ${outputHex}\n`;
        comment += `;${ExpressionDataGeneratorSerializer.VALUES_PER_LINE_KEYWORD}: ${valuesPerLine}\n`;
        comment += ";--------------------------------\n";
        comment += ";- DO NOT MODIFY following lines -\n";
        comment += " dc.w 0\n dc.w 286\n dc.w 572\n dc.w 857\n";
        comment += `;${ExpressionDataGeneratorSerializer.END_KEYWORD}----------------\n`;
        const serializer = new ExpressionDataGeneratorSerializer();
        const result = serializer.parse(comment);
        expect(result.expression).to.be.equal(expression);
        expect(result.outputInHex).to.be.equal(outputHex);
        expect(result.outputDataType).to.be.equal(OutputDataType.WORD);
        expect(result.valuesPerLine).to.be.equal(valuesPerLine);
        const variable = result.variable;
        expect(variable.name).to.be.equal(name);
        expect(variable.startValue).to.be.equal(startValue);
        expect(variable.endValue).to.be.equal(endValue);
        expect(variable.step).to.be.equal(step);
        const output = serializer.print(result);
        expect(comment).to.be.equal(output);
    });
    context("CodeLens provider", function () {
        const expVar = new ExpressionDataVariable("x", 0, 3, 1);
        const expDGen = new ExpressionDataGenerator("round(sin(x*pi/180)*pow(2,14))", expVar);
        before(async function () {
            const newFile = Uri.parse("untitled://./contentprovtest.s");
            await window.showTextDocument(newFile).then(async (textEditor) => {
                await textEditor.edit(edit => {
                    const serializer = new ExpressionDataGeneratorSerializer();
                    let text = serializer.print(expDGen);
                    text = text.replace("parameters : modify", "FOOFOO");
                    edit.insert(new Position(0, 0), text);
                });
            });
        });
        after(async () => {
            await commands.executeCommand('workbench.action.closeActiveEditor');
        });
        it("should locate codelens / resolve and apply", async () => {
            const tokenEmitter = new CancellationTokenSource();
            const prov = new DataGeneratorCodeLensProvider();
            const editor = window.activeTextEditor;
            // tslint:disable-next-line:no-unused-expression
            expect(editor).to.not.be.undefined;
            if (editor) {
                const codeLens = await prov.provideCodeLenses(editor.document, tokenEmitter.token);
                expect(codeLens.length).to.be.equal(1);
                const range = codeLens[0].range;
                expect(range.start).to.be.eql(new Position(0, 0));
                expect(range.end.line).to.be.eql(16);
                expect(range.end.character).to.be.greaterThan(29);
                // resolve
                const cl = codeLens[0];
                if (cl && prov.resolveCodeLens) {
                    const resolved = await prov.resolveCodeLens(cl, tokenEmitter.token);
                    // tslint:disable-next-line: no-unused-expression
                    expect(resolved.isResolved).to.be.true;
                    if (resolved.command) {
                        expect(resolved.command.command).to.be.equal("amiga-assembly.generate-data");
                    }
                } else {
                    fail("expected elements");
                }
                // Editor opened
                // tslint:disable-next-line: no-unused-expression
                expect(editor.document.getText().includes("FOOFOO")).to.be.true;
                await prov.onGenerateData(range);
                const newText = editor.document.getText();
                // tslint:disable-next-line: no-unused-expression
                expect(newText.includes("FOOFOO")).to.be.false;
            } else {
                fail("Editor not selected");
            }
        });
    });
});