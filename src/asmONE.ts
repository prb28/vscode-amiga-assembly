/* eslint-disable @typescript-eslint/ban-types */
import { Hunk, HunkParser, Symbol } from './amigaHunkParser';
import { ICheckResult } from "./execHelper";
import { Uri } from "vscode";
import * as fs from "fs";
import * as winston from "winston";

/**
 * Class to mange AsmONE compatibility
 */
export class AsmONE {
	// AUTO example
	//	AUTO	CS\R_SinCosTable\0\450\5120\32767\0\W1\yy
	rxAuto: RegExp;
	hunkParser: HunkParser;

	constructor() {
		this.rxAuto = RegExp(".*AUTO.*", "gi");
		this.hunkParser = new HunkParser();
	}

	/**
	 * Process AUTO commands from source file
	 * @param filesURI source files URIs
	 * @param exeFile executable file to patch
	 */
	public async Auto(filesURI: Uri[], exeFile: Uri): Promise<void> {
		try {
			let symbols = new Array<Symbol>();
			for (let i = 0; i < filesURI.length; i++) {
				const src = filesURI[i].fsPath;
				const autos = this.findAutos(src);
				if (0 === autos.length) {
					continue;
				}

				// Load exe symbols
				if (0 === symbols.length) {
					symbols = await this.loadExeSymbols(exeFile);
				}

				// Process all autos
				for (const auto of autos) {
					winston.info("AsmONE AUTO " + auto + " source:" + src + " exe:" + exeFile);
					const command = auto.split("\\");
					this.execCommand(command[0], command.slice(1), exeFile.fsPath, symbols);
				}
			}
		} catch (error) {
			winston.info("AsmONE AUTO " + error);
		}
	}

	/**
	 * Remove AsmONE related errors and warnings for handled commands
	 * @param errToFilter list of errors to filter 
	 */
	public filterErrors(errToFilter: ICheckResult[]): ICheckResult[] {
		const filtered = new Array<ICheckResult>();
		for (const err of errToFilter) {
			if (err.severity.toUpperCase() === "WARNING") {
				// remove auto warning message
				if (err.msgData.match(this.rxAuto)) {
					continue;
				}
			}
			filtered.push(err);
		}
		return filtered;
	}

	private findAutos(sourceFile: string): string[] {
		const found: string[] = [];
		const src = fs.readFileSync(sourceFile, 'utf8');
		let res;
		while ((res = this.rxAuto.exec(src)) !== null) {
			let mch = res[0].trim();
			mch = this.stripComment(mch);
			if (mch.length === 0) {
				continue;
			}
			// strip AUTO
			mch = mch.substring(4).trim();
			if (mch.length === 0) {
				continue;
			}
			found.push(mch);
		}
		return found;
	}

	private stripComment(line: string): string {
		if (line.startsWith(";") || line.startsWith("*")) {
			return "";
		}
		let cIdx = line.indexOf(";");
		if (cIdx > 0) {
			line = line.substring(0, cIdx).trim();
		}
		cIdx = line.indexOf("*");
		if (cIdx > 0) {
			line = line.substring(0, cIdx).trim();
		}
		return line;
	}

	private async loadExeSymbols(exeFile: Uri): Promise<Symbol[]> {
		const symbols = new Array<Symbol>();
		const hunks = await this.hunkParser.readFile(exeFile);
		for (let i = 0; i < hunks.length; i++) {
			const hunk: Hunk = hunks[i];
			if (!hunk.symbols) {
				continue;
			}
			for (const lSymbol of hunk.symbols) {
				lSymbol.offset += hunk.dataOffset;
				symbols.push(lSymbol);
			}
		}
		return symbols;
	}

	private execCommand(cmd: string, args: string[], exeFile: string, symbols: Symbol[]) {
		if (cmd.toUpperCase() === "CS") {
			const data = this.CS(Number(args[1]), Number(args[2]), Number(args[3]), Number(args[4]), Number(args[5]), args[6], args[7]);
			this.writeInFile(args[0], data, exeFile, symbols);
		}
	}

	private findExeOffset(dest: string, symbols: Symbol[]): number {
		const offset = -1;
		for (let i = 0; i < symbols.length; i++) {
			if (dest === symbols[i].name) {
				return symbols[i].offset;
			}
		}
		return offset;
	}

	private writeInFile(symbol: string, data: Uint8Array, exeFile: string, symbols: Symbol[]) {
		if (0 === data.length) {
			return;
		}
		const position = this.findExeOffset(symbol, symbols);
		if (position < 0) {
			return;
		}
		const fd = fs.openSync(exeFile, "r+");
		fs.writeSync(fd, data, 0, data.length, position);
		fs.closeSync(fd);
	}

	private createDataArray(size: string, len: number): Uint8Array {
		let aLen = 0;
		switch (size) {
			case "B":
				aLen = len;
				break;
			case "W":
				aLen = len * 2;
				break;
			case "L":
				aLen = len * 4;
				break;
		}
		return new Uint8Array(aLen);
	}

	private writeData(size: string, val: number, idx: number, data: Uint8Array): number {
		switch (size) {
			case "B":
				data[idx++] = val & 0xff;
				return idx;
			case "W":
				data[idx++] = (val >> 8) & 0xff;
				data[idx++] = val & 0xff;
				return idx;
			case "L":
				data[idx++] = (val >> 24) & 0xff;
				data[idx++] = (val >> 16) & 0xff;
				data[idx++] = (val >> 8) & 0xff;
				data[idx++] = val & 0xff;
				return idx;
			default:
				return idx;
		}
	}

	/**
	 * AsmONE Create Sinus command
	 * - Code reference: AsmPRO CS command source, line 31960
	 * @param beg begin angle in degrees
	 * @param end end angle in degrees
	 * @param amount amount of elements between beg and end
	 * @param amplitude sinus amplitude
	 * @param yOffset offset added after integer conversion
	 * @param sizeMultiplier size (B,W,L) and multiplier for value
	 * @param correction half step correction (Y/N) and round correction (Y/N)
	 */
	private CS(beg: number, end: number, amount: number,
		amplitude: number, yOffset: number, sizeMultiplier: string, correction: string): Uint8Array {
		const size = this.CSGetSize(sizeMultiplier);
		const multiplier = this.CSGetMultiplier(sizeMultiplier);
		const hcorrection = this.CSIsCorrection(correction.substring(0, 1));
		const rcorrection = this.CSIsCorrection(correction.substring(1, 2));
		let angleBeg = this.CSDegToRad(beg);
		const angleEnd = this.CSDegToRad(end);
		const angleStep = (angleEnd - angleBeg) / amount;
		if (hcorrection) {
			angleBeg += angleStep / 2;
		}
		let dataPos = 0;
		const data = this.createDataArray(size, amount);
		for (let i = 0; i < amount; i++) {
			let val = Math.sin(angleBeg) * amplitude;
			if (rcorrection) {
				val += val < 0 ? -0.5 : 0.5;
			}
			val = Math.floor(val);
			val += yOffset;
			val *= multiplier;
			dataPos = this.writeData(size, val, dataPos, data);
			angleBeg += angleStep;
		}
		return data;
	}

	private CSGetSize(sizeMultiplier: string): string {
		return sizeMultiplier.substring(0, 1).toUpperCase();
	}

	private CSGetMultiplier(sizeMultiplier: string): number {
		let val = Number(sizeMultiplier.substring(1));
		if (0 === val) {
			val = 1;
		}
		return val;
	}

	private CSIsCorrection(correction: string): boolean {
		return correction.toUpperCase() === "Y";
	}

	private CSDegToRad(deg: number): number {
		return deg * Math.PI / 180.0;
	}
}
