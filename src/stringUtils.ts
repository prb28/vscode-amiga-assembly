export class StringUtils {
    /**
     * Padding on start of string
     * @param stringToPad String to pad
     * @param targetLength Length targetted
     * @param padString Char as string to fill default to space
     * @return Padding string
     */
    public static padStart(stringToPad: string, targetLength: number, padString: string = " "): string {
        return StringUtils.createPad(stringToPad, targetLength, padString) + stringToPad;
    }

    /**
	 * Create pad of the good size for string
	 * @param stringToPad String to pad
	 * @param targetLength Length targetted
     * @param padString Char as string to fill default to space
	 * @return Padding string
	 */
    public static createPad(stringToPad: string, targetLength: number, padString: string = " "): string {
        targetLength = targetLength >> 0; //truncate if number or convert non-number to 0;
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

    /**
	 * Getting a padded string
	 * @param stringToPad String to pad
	 * @param targetLength Length targetted
     * @param padString Char as string to fill default to space
	 * @return Padded string
	 */
    public static padEnd(stringToPad: string, targetLength: number, padString: string = " "): string {
        return stringToPad + StringUtils.createPad(stringToPad, targetLength, padString);
    }

    /**
     * Chunks a string
     * @param str String to chunk
     * @param n Array of chek elements
     */
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

    /**
     * Converts a byte to a character
     * @param byte byte to convert
     * @return character in string
     */
    public static convertByteToASCII(byte: number): string {
        let asciiContents;
        if ((byte < 32) || ((byte > 127) && (byte < 161)) || (byte > 255)) {
            asciiContents = ".";
        } else {
            asciiContents = String.fromCharCode(byte);
        }
        return asciiContents;
    }

    /**
     * Converts a string containing hex values to an ascii string
     * @param value string to convert
     * @return ascii string
     */
    public static convertHexStringToASCII(value: string): string {
        let asciiContents = "";
        let chunks = this.chunk(value, 2);
        for (let c of chunks) {
            let i = parseInt(c, 16);
            asciiContents += StringUtils.convertByteToASCII(i);
        }
        return asciiContents;
    }

    /**
     * Converts a int32 in an array of bytes
     * @param num Number to convert
     * @return array of bytes
     */
    public static toBytesInt32(num: number): Array<number> {
        return [(num & 0xff000000) >> 24,
        (num & 0x00ff0000) >> 16,
        (num & 0x0000ff00) >> 8,
        (num & 0x000000ff)
        ];
    }

    /**
     * Converts a int 32 to an ascii string
     * @param value integer to convert
     * @return ascii string
     */
    public static convertInt32ToASCII(value: number): string {
        let asciiContents = "";
        let bytes = StringUtils.toBytesInt32(value);
        for (let i of bytes) {
            asciiContents += StringUtils.convertByteToASCII(i);
        }
        return asciiContents;
    }

    /**
     * Converts a string to a string of hex values
     * @param asciiString ascii string to convert
     * @return string of hex values
     */
    public static convertStringToHex(asciiString: string): string {
        let result = "";
        for (let i = 0; i < asciiString.length; ++i) {
            result += ('00' + asciiString.charCodeAt(i).toString(16)).slice(-2);
        }
        return result;
    }

    /** 
     * Convert a hex string to a byte array
     **/
    public static hexToBytes(hex: string): Array<number> {
        let bytes = new Array<number>();
        for (let c = 0; c < hex.length; c += 2) {
            bytes.push(parseInt(hex.substr(c, 2), 16));
        }
        return bytes;
    }

    /** 
     * Convert a byte array to a hex string
     **/
    public static bytesToHex(bytes: Array<number>): string {
        let hex = Array<string>();
        for (let i = 0; i < bytes.length; i++) {
            let current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
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