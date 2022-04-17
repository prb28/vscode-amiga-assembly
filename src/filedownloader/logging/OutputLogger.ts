// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ExtensionContext, OutputChannel } from "vscode";
import ILogger from "./ILogger";

export default class OutputLogger implements ILogger {
    private readonly _outputChannel: OutputChannel;

    public constructor(outputChannel: OutputChannel, context: ExtensionContext) {
        this._outputChannel = outputChannel;
        context.subscriptions.push(this._outputChannel);
    }

    public log(message: string): void {
        this._outputChannel.appendLine(message);
    }

    public warn(message: string): void {
        this.log(`Warning: ${message}`);
    }

    public error(message: string): void {
        this.log(`ERROR: ${message}`);
    }
}