import { StringUtils } from "./stringUtils";

/**
 * Display Format
 */
export enum VariableDisplayFormat {
    DECIMAL,
    BINARY,
    HEXADECIMAL,
    MEMORY,
    ADDRESS
}

/**
 * Formatter for a variable.
 */
export interface VariableDisplayFormatRequest {
    /** info of the variable */
    variableInfo: any;
    /** Requested format */
    variableDisplayFormat: VariableDisplayFormat;
}


/**
 * Class handling the variable format process
 */
export class VariableFormatter {
    public static readonly DECIMAL_FORMATTER = new VariableFormatter(VariableDisplayFormat.DECIMAL);
    public static readonly HEXADECIMAL_FORMATTER = new VariableFormatter(VariableDisplayFormat.HEXADECIMAL);
    public static readonly BINARY_FORMATTER = new VariableFormatter(VariableDisplayFormat.BINARY);
    public static readonly ADDRESS_FORMATTER = new VariableFormatter(VariableDisplayFormat.ADDRESS);
    /** display format */
    private displayFormat: VariableDisplayFormat;

    /**
     * Constructor
     * @param displayFormat Display format selected 
     */
    public constructor(displayFormat: VariableDisplayFormat) {
        this.displayFormat = displayFormat;
    }

    /**
     * Proceed format
     * @param value Value to format
     * @returns String with the formatted value
     */
    public format(value: number): string {
        if (this.displayFormat === VariableDisplayFormat.HEXADECIMAL) {
            return `0x${StringUtils.padStart(value.toString(16), 8, "0")}`;
        } else if (this.displayFormat === VariableDisplayFormat.BINARY) {
            return `0b${StringUtils.padStart(value.toString(2), 32, "0")}`;
        } else if (this.displayFormat === VariableDisplayFormat.ADDRESS) {
            return `$${value.toString(16)}`;
        } else {
            return value.toString(10);
        }
    }
}