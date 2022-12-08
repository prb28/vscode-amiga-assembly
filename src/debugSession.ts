import { DebugProtocol } from '@vscode/debugprotocol';
import * as vscode from 'vscode';
import {
    UAEDebugSession as Base,
    LaunchRequestArguments as BaseLaunchRequestArguments,
    MemoryFormat,
} from 'uae-dap';
import { substituteVariables } from './configVariables';
import { ConfigurationHelper } from './configurationHelper';
import { DataBreakpointSizesStorage } from './breakpointStorage';

export interface LaunchRequestArguments extends BaseLaunchRequestArguments {
    // Compatibility with original config
    options?: string[];
    emulator?: string;
    type: 'fs-uae' | 'winuae' | 'uae-run' | 'amiga-assembly';
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

    // Map original vscode-amiga-assembly launch args schema to uae-dap args
    if (args.options && !args.emulatorArgs) {
        args.emulatorArgs = args.options;
    }
    if (args.emulator && !args.emulatorBin) {
        args.emulatorBin = substituteVariables(args.emulator);
    }
    if (args.type && !args.emulatorType && (args.type === 'fs-uae' || args.type === 'winuae')) {
        args.emulatorType = args.type;
    }
    if (args.type === 'uae-run') {
        args.noDebug = true;
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

export class DebugSession extends Base {
    protected static BREAKPOINT_EVENT_SET = false;
    /** Current memory display pc */
    protected currentMemoryViewPc = -1;
    protected dataBreakpointStorage = new DataBreakpointSizesStorage();

    protected async onCpuFrame(address: number): Promise<void> {
        super.onCpuFrame(address);
        if (address !== this.currentMemoryViewPc) {
            this.currentMemoryViewPc = address;
            const dLines = await this.disassemblyManager().disassemble({
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

    /**
     * Prompt the user for the size in bytes for a data breakpoint
     */
    protected async getDataBreakpointSize(
        address: string,
        variable: string
    ): Promise<number> {
        const input = await vscode.window.showInputBox(<vscode.InputBoxOptions>{
            prompt: `Enter the size in bytes to watch starting at address '${address}' (variable: '${variable}')`,
            value: '2',
            validateInput: (value: string) => {
                if (!Number.isInteger(parseInt(value))) {
                    return 'The value must be an integer.';
                }
                if (!value) {
                    return 'Size must be at lest one byte.';
                }
                return null;
            },
        });
        return input ? parseInt(input) : 2;
    }
}
