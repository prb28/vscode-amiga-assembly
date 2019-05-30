import { ExtensionState } from './extension';
import { Hunk, HunkParser, Symbol } from './amigaHunkParser';
import { ICheckResult } from "./execHelper";
import { Uri } from "vscode";
import * as fs from "fs";

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
	public Auto(filesURI: Uri[], exeFile: string) {
		let outputChannel = ExtensionState.getCurrent().getStatusManager().outputChannel;
		try {
			let symbols = new Array<Symbol>();
			for (let i = 0; i < filesURI.length; i++) {
				let src = filesURI[i].fsPath;
				let autos = this.findAutos(src);
				if (0 === autos.length) {
					continue;
				}

				// Load exe symbols
				if (0 === symbols.length) {
					symbols = this.loadExeSymbols(exeFile);
				}

				// Process all autos
				for (const auto of autos) {
					outputChannel.appendLine("AsmONE AUTO " + auto + " source:" + src + " exe:" + exeFile);
					let command = auto.split("\\");
					this.execCommand(command[0], command.slice(1), exeFile, symbols);
				}
			}
		} catch (error) {
			outputChannel.appendLine("AsmONE AUTO " + error);
		}
	}

	/**
	 * Remove AsmONE related errors and warnings for handled commands
	 * @param errToFilter list of errors to filter 
	 */
	public FilterErrors(errToFilter: ICheckResult[]): ICheckResult[] {
		let filtered = new Array<ICheckResult>();
		for (const err of errToFilter) {
			switch (err.severity.toUpperCase()) {
				case "WARNING":
					// remove auto warning message
					if (err.msgData.match(this.rxAuto)) {
						continue;
					}
					break;
			}
			filtered.push(err);
		}
		return filtered;
	}

	private findAutos(sourceFile: string): string[] {
		let found: string[] = [];
		let src = fs.readFileSync(sourceFile, 'utf8');
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

	private loadExeSymbols(exeFile: string): Symbol[] {
		let symbols = new Array<Symbol>();
		let hunks = this.hunkParser.parse_file(exeFile);
		for (let i = 0; i < hunks.length; i++) {
			let hunk: Hunk = hunks[i];
			if (!hunk.symbols) {
				continue;
			}
			for (const symbol of hunk.symbols) {
				symbol.offset += hunk.dataOffset;
				symbols.push(symbol);
			}
		}
		return symbols;
	}

	private execCommand(cmd: string, args: string[], exeFile: string, symbols: Symbol[]) {
		switch (cmd.toUpperCase()) {
			case "CS":
				let data = this.CS(Number(args[1]), Number(args[2]), Number(args[3]), Number(args[4]), Number(args[5]), args[6], args[7]);
				this.writeInFile(args[0], data, exeFile, symbols);
				break;
			default:
				break;
		}
	}

	private findExeOffset(dest: string, symbols: Symbol[]): number {
		let offset = -1;
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
		let position = this.findExeOffset(symbol, symbols);
		if (position < 0) {
			return;
		}
		let fd = fs.openSync(exeFile, "r+");
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
	 * @param ammount amount of elements between beg and end
	 * @param amplitude sinus amplitude
	 * @param yOffset offset added after integer conversion
	 * @param sizeMultiplier size (B,W,L) and multipler for value
	 * @param correction halfstep correction (Y/N) and round correction (Y/N)
	 */
	private CS(beg: number, end: number, ammount: number,
		amplitude: number, yOffset: number, sizeMultiplier: string, correction: string): Uint8Array {
		let size = this.CSGetSize(sizeMultiplier);
		let multiplier = this.CSGetMultiplier(sizeMultiplier);
		let hcorrection = this.CSIsCorrection(correction.substring(0, 1));
		let rcorrection = this.CSIsCorrection(correction.substring(1, 2));
		let angleBeg = this.CSDegToRad(beg);
		let angleEnd = this.CSDegToRad(end);
		let angleStep = (angleEnd - angleBeg) / ammount;
		if (hcorrection) {
			angleBeg += angleStep / 2;
		}
		let dataPos = 0;
		let data = this.createDataArray(size, ammount);
		for (let i = 0; i < ammount; i++) {
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



/* AsmPRO CS, line 31960

C12920:
	clr.l	(L2DF4C).l
	bra.b	C1293A

C12928:
	lea	(DEST.MSG,pc),a0
	bsr	Druk_MsgAf_GetNumbr
	bne	ERROR_Notdone
	move.l	d0,(L2DF4C).l
C1293A:
	lea	(BEG.MSG,pc),a0
	bsr	Druk_MsgAf_GetNumbr
	bne	ERROR_Notdone
	move.l	d0,(CS_BEG).l
	lea	(END.MSG0,pc),a0
	bsr	Druk_MsgAf_GetNumbr
	bne	ERROR_Notdone
	move.l	d0,(CS_END).l
	lea	(AMOUNT.MSG,pc),a0
	bsr	Druk_MsgAf_GetNumbr
	bne	ERROR_Notdone
	move.l	d0,(CS_AMOUNT).l
	beq	ERROR_Notdone
	lea	(AMPLITUDE.MSG,pc),a0
	bsr	Druk_MsgAf_GetNumbr
	bne	ERROR_Notdone
	move.l	d0,(CS_AMPLITUDE).l
	lea	(YOFFSET.MSG,pc),a0
	bsr	Druk_MsgAf_GetNumbr
	bne	ERROR_Notdone
	move.l	d0,(CS_YOFFSET).l
	clr.l	(CS_SIZE).l
	lea	(SIZEBWL.MSG,pc),a0
	bsr	beeldtextaf
	bsr	GetHotKey
	bclr	#5,d0
	move.l	#1,(CS_SIZE).l
	cmp.b	#$42,d0
	beq.b	C129E2
	move.l	#2,(CS_SIZE).l
	cmp.b	#$57,d0
	beq.b	C129E2
	move.l	#3,(CS_SIZE).l
	cmp.b	#$4C,d0
	beq.b	C129E2
	br	ERROR_Notdone

C129E2:
	lea	(MULTIPLIER.MSG,pc),a0
	bsr	Druk_MsgAf_GetNumbr
	bne	ERROR_Notdone
	move.l	d0,(CS_MULTIPLIER).l
	clr.l	(B2DF6C).l
	lea	(HALFCORRECTIO.MSG,pc),a0
	bsr	beeldtextaf
	bsr	GetHotKey
	bclr	#5,d0
	cmp.b	#'N',d0
	beq.b	C12A20
	bset	#0,(CS_FLAGS).l
	cmp.b	#'Y',d0
	bne	ERROR_Notdone
C12A20:
	lea	(ROUNDCORRECTI.MSG,pc),a0
	bsr	beeldtextaf
	bsr	GetHotKey
	bclr	#5,d0
	cmp.b	#'N',d0
	beq.b	C12A46
	bset	#1,(CS_FLAGS).l
	cmp.b	#'Y',d0
	bne	ERROR_Notdone
C12A46:
	movem.l	d0-d7/a1-a6,-(sp)
	bsr.b	C12A54
	movem.l	(sp)+,d0-d7/a1-a6
	br	beeldtextaf

C12A54:
	move.l	(4).w,a6
	lea	(MathffpName,pc),a1
	jsr	(_LVOOldOpenLibrary,a6)
	move.l	d0,(MathFfpBase-DT,a4)
	bne.b	C12A6C
	lea	(Couldntopenma.MSG,pc),a0
	rts

C12A6C:
	lea	(MathtransName,pc),a1
	jsr	(_LVOOldOpenLibrary,a6)
	move.l	d0,(MathTransBase-DT,a4)
	bne.b	C12A88
	move.l	(MathFfpBase-DT,a4),a1
	jsr	(_LVOCloseLibrary,a6)		; ***
	lea	(Couldntopenma.MSG0,pc),a0
	rts

C12A88:
	move.b	(SomeBits2-DT,a4),d0
	move	d0,-(sp)
	bclr	#SB2_INDEBUGMODE,(SomeBits2-DT,a4)
	bset	#SB2_INSERTINSOURCE,(SomeBits2-DT,a4)
	move.l	(FirstLinePtr-DT,a4),-(sp)
	moveq	#0,d3
	move.l	(MathFfpBase-DT,a4),a6
	move.l	(MathTransBase-DT,a4),a5
	move.l	(CS_END-DT,a4),d0
	sub.l	(CS_BEG-DT,a4),d0		;END - BEG
	jsr	(_LVOSPFlt,a6)		; ***
	move.l	#$8EFA353B,d1
	jsr	(_LVOSPMul,a6)		; ***
	move.l	d0,-(sp)
	move.l	(CS_AMOUNT-DT,a4),d0
	jsr	(_LVOSPFlt,a6)		; ***
	move.l	d0,d1
	move.l	(sp)+,d0
	jsr	(_LVOSPDiv,a6)		; ***
	move.l	d0,(L2DF7C-DT,a4)
	move.l	(CS_BEG-DT,a4),d0
	jsr	(_LVOSPFlt,a6)		; ***
	move.l	#$8EFA353B,d1
	jsr	(_LVOSPMul,a6)		; ***
	btst	#0,(CS_FLAGS-DT,a4)
	beq.b	C12AF8
	move.l	(L2DF7C-DT,a4),d1
	subq.b	#1,d1
	jsr	(_LVOSPAdd,a6)		; ***
C12AF8:
	move.l	d0,(L2DF78-DT,a4)
	move.l	(CS_AMPLITUDE-DT,a4),d0
	jsr	(_LVOSPFlt,a6)		; ***
	move.l	d0,(L2DF80-DT,a4)
	move.l	(CS_AMOUNT-DT,a4),d7
	move.l	(L2DF4C-DT,a4),a3
C12B10:
	move.l	(L2DF78-DT,a4),d0
	exg	a5,a6
	jsr	(_LVOSPSin,a6)		; ***
	exg	a5,a6
	move.l	(L2DF80-DT,a4),d1
	jsr	(_LVOSPMul,a6)		; ***
	btst	#1,(CS_FLAGS-DT,a4)
	beq.b	C12B42
	move.l	#$80000040,d1
	btst	#7,d0
	beq.b	C12B3E
	move.l	#$800000C0,d1
C12B3E:
	jsr	(_LVOSPAdd,a6)		; ***
C12B42:
	jsr	(_LVOSPFix,a6)		; ***
	add.l	(CS_YOFFSET-DT,a4),d0
	move.l	(CS_MULTIPLIER-DT,a4),d2
	beq.b	C12B52
	muls	d2,d0
C12B52:
	cmp.l	a3,d3
	bne	C12C46
	cmp.b	#1,(B2DF67-DT,a4)
	bne.b	C12B9C
	move	d0,-(sp)
	tst	(W2DF4E-DT,a4)
	bne.b	C12B72
	lea	(DCB.MSG,pc),a0
	bsr	printthetext
	bra.b	C12B78

C12B72:
	moveq	#$2C,d0
	bsr	SENDONECHARNORMAL
C12B78:
	moveq	#$24,d0
	bsr	SENDONECHARNORMAL
	move	(sp)+,d0
	bsr	C15908
	move	(W2DF4E-DT,a4),d0
	addq.w	#1,d0
	and	#15,d0
	move	d0,(W2DF4E-DT,a4)
	bne.b	C12B9C
	moveq	#1,d3
	bsr	Druk_af_eol
	moveq	#0,d3
C12B9C:
	cmp.b	#2,(B2DF67-DT,a4)
	bne.b	C12BEA
	move	d0,-(sp)
	tst	(W2DF4E-DT,a4)
	bne.b	C12BB6
	lea	(DCW.MSG,pc),a0
	bsr	printthetext
	bra.b	C12BBC

C12BB6:
	moveq	#$2C,d0
	bsr	SENDONECHARNORMAL
C12BBC:
	moveq	#$24,d0
	bsr	SENDONECHARNORMAL
	move.b	(sp),d0
	bsr	C15908
	move	(sp)+,d0
	bsr	C15908
	move	(W2DF4E-DT,a4),d0
	addq.w	#1,d0
	move	d0,(W2DF4E-DT,a4)
	cmp	#10,d0
	bne.b	C12BEA
	clr	(W2DF4E-DT,a4)
	moveq	#1,d3
	bsr	Druk_af_eol
	moveq	#0,d3
C12BEA:
	cmp.b	#3,(B2DF67-DT,a4)
	bne.b	C12C64
	move.l	d0,-(sp)
	tst	(W2DF4E-DT,a4)
	bne.b	C12C04
	lea	(DCL.MSG,pc),a0
	bsr	printthetext
	bra.b	C12C0A

C12C04:
	moveq	#$2C,d0
	bsr	SENDONECHARNORMAL
C12C0A:
	moveq	#$24,d0
	bsr	SENDONECHARNORMAL
	move.b	(sp),d0
	bsr	C15908
	move	(sp)+,d0
	bsr	C15908
	move.b	(sp),d0
	bsr	C15908
	move	(sp)+,d0
	bsr	C15908
	move	(W2DF4E-DT,a4),d0
	addq.w	#1,d0
	move	d0,(W2DF4E-DT,a4)
	cmp	#6,d0
	bne.b	C12C64
	clr	(W2DF4E-DT,a4)
	moveq	#1,d3
	bsr	Druk_af_eol
	moveq	#0,d3
	bra.b	C12C64

C12C46:
	cmp.b	#1,(B2DF67-DT,a4)
	bne.b	C12C50
	move.b	d0,(a3)+
C12C50:
	cmp.b	#2,(B2DF67-DT,a4)
	bne.b	C12C5A
	move	d0,(a3)+
C12C5A:
	cmp.b	#3,(B2DF67-DT,a4)
	bne.b	C12C64
	move.l	d0,(a3)+
C12C64:
	move.l	(L2DF78-DT,a4),d0
	move.l	(L2DF7C-DT,a4),d1
	jsr	(_LVOSPAdd,a6)			; ***
	move.l	d0,(L2DF78-DT,a4)
	subq.l	#1,d7
	bne	C12B10
	move.l	(4).w,a6
	move.l	(MathFfpBase-DT,a4),a1
	jsr	(_LVOCloseLibrary,a6)
	move.l	(MathTransBase-DT,a4),a1
	jsr	(_LVOCloseLibrary,a6)		; ***
	cmp.l	a3,d3
	bne.b	C12C9E
	moveq	#1,d3
;	moveq	#0,d0
;	bsr	SENDONECHARNORMAL
	bsr	Druk_af_eol
	bsr	Druk_Clearbuffer
	bsr	Druk_af_eol

C12C9E:
	move.l	(sp)+,(FirstLinePtr-DT,a4)
	lea	(Sinuscreated.MSG,pc),a0
	move	(sp)+,d0
	move.b	d0,(SomeBits2-DT,a4)
	rts
*/