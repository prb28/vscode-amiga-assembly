import { CancellationToken } from "vscode";
import { Executor } from "./executor";
import { DebugInfo } from "./debugInfo";

/**
 * Class to disassemble the m68k binaries
 */
export class Capstone {
    /** Path to the capstone executable */
    private cstoolPath: string;
    /** Executor to run fs-uae */
    private executor: Executor;

    /**
     * Constructor
     * @param cstoolPath Path to Cstool
     */
    public constructor(cstoolPath: string) {
        this.cstoolPath = cstoolPath;
        this.executor = new Executor();
    }

    /**
     * Disassemble a buffer
     * @param filename File to disassemble
     * @param cancellationToken Token to cancel the process
     */
    public disassemble(buffer: string, cancellationToken?: CancellationToken): Promise<string> {
        let args = ["m68k", buffer];
        return this.executor.runToolRetrieveStdout(args, null, this.cstoolPath, null, cancellationToken);
    }

    /**
     * Disassemble a amiga hunk file
     * @param filename File to disassemble
     * @param cancellationToken Token to cancel the process
     */
    public disassembleFile(filename: string, cancellationToken?: CancellationToken): Promise<string> {
        let di = new DebugInfo();
        if (di.loadInfo(filename)) {
            let codeData = di.getCodeData();
            if (codeData !== null) {
                let s = "";
                for (let b of codeData) {
                    s += b.toString(16);
                }
                return this.disassemble(s, cancellationToken);
            } else {
                return Promise.reject(new Error("No data in file to disassemble"));
            }
        } else {
            return Promise.reject(new Error(`File '${filename}' could not be parsed`));
        }
    }

    /**
     * Setting the context to run the tests.
     * @param executor mocked executor
     */
    public setTestContext(executor: Executor) {
        this.executor = executor;
    }
}