export class StringUtils {
    /**
     * Padding on start of string
     * @param stringToPad String to pad
     * @param targetLength Length targetted
     * @return Padding string
     */
    public static padStartWith0(stringToPad: string, targetLength: number): string {
        targetLength = targetLength >> 0; //truncate if number or convert non-number to 0;
        let padString = '0';
        if (stringToPad.length > targetLength) {
            return stringToPad;
        }
        else {
            targetLength = targetLength - stringToPad.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0, targetLength) + stringToPad;
        }
    }

    /**
	 * Getting the pad of the good size at the end of string
	 * @param stringToPad String to pad
	 * @param targetLength Length targetted
	 * @return Padding string
	 */
    public static getEndPad(stringToPad: string, targetLength: number): string {
        targetLength = targetLength >> 0; //truncate if number or convert non-number to 0;
        let padString = ' ';
        if (stringToPad.length > targetLength) {
            return '';
        }
        else {
            targetLength = targetLength - stringToPad.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0, targetLength);
        }
    }

    public static chunk(str: string, n: number): string[] {
        let ret = [];
        let maxCount = str.length - n - 1;
        let i;
        for (i = 0; i < maxCount; i += n) {
            ret.push(str.substring(i, n + i));
        }
        if ((str.length - i) > 0) {
            ret.push(str.substring(i));
        }
        return ret;
    }
    public static convertToASCII(memory: string): string {
        let asciiContents = "";
        var chunks = this.chunk(memory, 2);
        for (let c of chunks) {
            let i = parseInt(c, 16);
            if ((i < 32) || (i > 176)) {
                asciiContents += ".";
            } else {
                asciiContents += String.fromCharCode(i);
            }
        }
        return asciiContents;
    }

    /** 
     * Convert a hex string to a byte array
     **/
    public static hexToBytes(hex: string): Array<number> {
        let bytes = new Array<number>();
        for (let c = 0; c < hex.length; c += 2)
            bytes.push(parseInt(hex.substr(c, 2), 16));
        return bytes;
    }

    /** 
     * Convert a byte array to a hex string
     **/
    public static bytesToHex(bytes: Array<number>): string {
        let hex = Array<string>();
        for (let i = 0; i < bytes.length; i++) {
            var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
            hex.push((current >>> 4).toString(16));
            hex.push((current & 0xF).toString(16));
        }
        return hex.join("");
    }

    /** 
     * Convert a hex string to a base64 string
     **/
    static hexToBase64(hexString: string): string {
        // Conversion to bytes
        let buffer = Buffer.from(StringUtils.hexToBytes(hexString));
        return buffer.toString('base64');
    }
}