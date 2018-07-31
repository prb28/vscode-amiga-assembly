import { CancellationToken, Uri, workspace } from "vscode";
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
        const workspaceRootDir = this.getWorkspaceRootDir();
        let rootPath = null;
        if (workspaceRootDir) {
            rootPath = workspaceRootDir.fsPath;
        }
        return this.executor.runToolRetrieveStdout(args, rootPath, this.cstoolPath, null, cancellationToken);
    }

    /**
     * Disassemble a amiga hunk file
     * @param filename File to disassemble
     * @param cancellationToken Token to cancel the process
     */
    public disassembleFile(filename: string, cancellationToken?: CancellationToken): Promise<string> {
        return new Promise(async (resolve, reject) => {
            let di = new DebugInfo();
            if (di.loadInfo(filename)) {
                let codeDataArray = di.getCodeData();
                let allCode = "";
                for (let codeData of codeDataArray) {
                    let s = "";
                    for (let b of codeData) {
                        s += this.padStartWith0(b.toString(16), 8);
                    }
                    await this.disassemble(s, cancellationToken).then((data) => {
                        allCode += data + "\n";
                    });
                }
                resolve(allCode);
            } else {
                reject(new Error(`File '${filename}' could not be parsed`));
            }
        });
    }

    /**
     * Setting the context to run the tests.
     * @param executor mocked executor
     */
    public setTestContext(executor: Executor) {
        this.executor = executor;
    }

    /**
     * Reads the workspace forlder dir
     */
    private getWorkspaceRootDir(): Uri | null {
        if (workspace.workspaceFolders && (workspace.workspaceFolders.length > 0)) {
            return workspace.workspaceFolders[0].uri;
        }
        return null;
    }

    private padStartWith0(stringToPad: string, targetLength: number): string {
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
}