import { DebugProtocol } from '@vscode/debugprotocol';
import * as vscode from 'vscode';
import {
    FsUAEDebugSession as Base,
    LaunchRequestArguments as BaseLaunchRequestArguments,
} from 'uae-dap';
import { substituteVariables } from './configVariables';
import { MemoryFormat } from 'uae-dap/out/src/program';
import { ConfigurationHelper } from './configurationHelper';

export interface LaunchRequestArguments extends BaseLaunchRequestArguments {
    // Compatibility with original config
    options?: string[];
}

/**
 * Prepare launch request args from extension to be passed to adapter
 */
export function prepareLaunchRequestArgs(
    originalArgs: LaunchRequestArguments
): BaseLaunchRequestArguments {
    const args = {
        ...originalArgs,
    };
    // Rename options -> emulatorOptions
    // This property was renamed in the adapter to avoid a naming conflict (and for clarity)
    // but can be copied here to retain backwards compatibility
    if (args.options && !args.emulatorOptions) {
        args.emulatorOptions = args.options;
    }
    // Replace config variables in path properties
    if (args.emulator) {
        args.emulator = substituteVariables(args.emulator);
    }
    if (args.emulatorWorkingDir) {
        args.emulatorWorkingDir = substituteVariables(args.emulatorWorkingDir);
    }

    // Add memory format settings:
    // These are stored in config as an expression, but the launch request expects them as MemoryFormat objects so they
    // need to be parsed.
    const watchFormat = ConfigurationHelper.retrieveStringPropertyInDefaultConf(
        'display.memoryFormat.watch'
    );
    const hoverFormat = ConfigurationHelper.retrieveStringPropertyInDefaultConf(
        'display.memoryFormat.hover'
    );
    args.memoryFormats = {};
    try {
        if (watchFormat) {
            args.memoryFormats.watch = parseMemoryFormat(watchFormat);
        }
    } catch (error) {
        vscode.window.showErrorMessage(
            'Error parsing watch memory format: ' + watchFormat
        );
    }
    try {
        if (hoverFormat) {
            args.memoryFormats.hover = parseMemoryFormat(hoverFormat);
        }
    } catch (error) {
        vscode.window.showErrorMessage(
            'Error parsing hover memory format: ' + hoverFormat
        );
    }

    return args;
}

function parseMemoryFormat(expression: string): MemoryFormat {
    // Parse expression
    const matches =
        /m\s*(?<address>[^,]+)(,\s*(?<length>(?!(d|c|ab?|ba?)$)[^,]+))?(,\s*(?<wordLength>(?!(d|c|ab?|ba?)$)[^,]+))?(,\s*(?<rowLength>(?!(d|c|ab?|ba?)$)[^,]+))?(,\s*(?<mode>(d|c|ab?|ba?)))?/i.exec(
            expression
        );
    const groups = matches?.groups;
    if (!groups) {
        throw new Error('Expression not recognized');
    }
    return {
        length: parseInt(groups.length),
        wordLength: groups.wordLength ? parseInt(groups.wordLength) : 2,
        rowLength: groups.rowLength ? parseInt(groups.rowLength) : 4,
        mode: groups.mode ?? 'ab',
    };
}

export class FsUAEDebugSession extends Base {
    protected createDbgasmFiles = false;
    /** Current memory display pc */
    protected currentMemoryViewPc = -1;

    protected async onCpuFrame(address: number): Promise<void> {
        super.onCpuFrame(address);
        // Update the disassembled memory view when the frame address changes
        if (address !== this.currentMemoryViewPc && this.program) {
            this.currentMemoryViewPc = address;
            const dLines = await this.program.disassemble({
                memoryReference: address.toString(),
                instructionCount: 25,
            });
            await vscode.commands.executeCommand(
                'disassembledMemory.setDisassembledMemory',
                dLines
            );
        }
    }

    protected launchRequest(
        response: DebugProtocol.LaunchResponse,
        args: LaunchRequestArguments
    ): Promise<void> {
        return super.launchRequest(response, prepareLaunchRequestArgs(args));
    }
}
