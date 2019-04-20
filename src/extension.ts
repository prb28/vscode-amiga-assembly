// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { M68kFormatter } from './formatter';
import { M68kHoverProvider } from './hover';
import { M86kColorProvider } from './color';
import { CalcController } from './calcComponents';
import { VASMController } from './vasm';
import { FsUAEDebugSession } from './fsUAEDebug';
import * as Net from 'net';
import { RunFsUAENoDebugSession } from './runFsUAENoDebug';
import { CalcComponent } from './calcComponents';
import { VASMCompiler } from './vasm';
import { StatusManager } from "./status";
import { Disassembler } from './disassemble';
import { M68kDefinitionHandler } from './definitionHandler';
import { DisassemblyContentProvider } from './disassemblyContentProvider';
import { ADFTools } from './adf';
import { DataGeneratorCodeLensProvider } from './expressionDataGenerator';
import { IFFViewerPanel } from './iffImageViewer';

// Setting all the globals values
export const AMIGA_ASM_MODE: vscode.DocumentFilter = { language: 'm68k', scheme: 'file' };
export const AMIGA_DEBUG_ASM_MODE: vscode.DocumentFilter = { language: 'amiga-assembly-debug.disassembly', scheme: 'disassembly' };

/*
 * Set the following compile time flag to true if the
 * debug adapter should run inside the extension host.
 * Please note: the test suite does no longer work in this mode.
 */
const EMBED_DEBUG_ADAPTER = true;

export class ExtensionState {
    private compiler: VASMCompiler | undefined;
    private errorDiagnosticCollection: vscode.DiagnosticCollection | undefined;
    private warningDiagnosticCollection: vscode.DiagnosticCollection | undefined;
    private statusManager: StatusManager | undefined;
    private calc: CalcComponent | undefined;
    private disassembler: Disassembler | undefined;
    private adfTools: ADFTools | undefined;
    private definitionHandler: M68kDefinitionHandler | undefined;
    private dataGenerator: DataGeneratorCodeLensProvider | undefined;
    public getErrorDiagnosticCollection(): vscode.DiagnosticCollection {
        if (this.errorDiagnosticCollection === undefined) {
            this.errorDiagnosticCollection = vscode.languages.createDiagnosticCollection('m68k-error');
        }
        return this.errorDiagnosticCollection;
    }
    public getWarningDiagnosticCollection(): vscode.DiagnosticCollection {
        if (this.warningDiagnosticCollection === undefined) {
            this.warningDiagnosticCollection = vscode.languages.createDiagnosticCollection('m68k-warning');
        }
        return this.warningDiagnosticCollection;
    }
    public getStatusManager(): StatusManager {
        if (this.statusManager === undefined) {
            this.statusManager = new StatusManager();
        }
        return this.statusManager;
    }
    public getCalc(): CalcComponent {
        if (this.calc === undefined) {
            this.calc = new CalcComponent();
        }
        return this.calc;
    }
    public getCompiler(): VASMCompiler {
        if (this.compiler === undefined) {
            this.compiler = new VASMCompiler();
        }
        return this.compiler;
    }
    public getDisassembler(): Disassembler {
        if (this.disassembler === undefined) {
            this.disassembler = new Disassembler();
        }
        return this.disassembler;
    }
    public getADFTools(): ADFTools {
        if (this.adfTools === undefined) {
            this.adfTools = ADFTools.create();
        }
        return this.adfTools;
    }
    public static getCurrent(): ExtensionState {
        // activate the extension
        let ext = vscode.extensions.getExtension('prb28.amiga-assembly');
        if (ext) {
            return ext.exports.getState();
        }
        return new ExtensionState();
    }
    public getDefinitionHandler(): M68kDefinitionHandler {
        if (this.definitionHandler === undefined) {
            this.definitionHandler = new M68kDefinitionHandler();
        }
        return this.definitionHandler;
    }
    public getDataGenerator(): DataGeneratorCodeLensProvider {
        if (this.dataGenerator === undefined) {
            this.dataGenerator = new DataGeneratorCodeLensProvider();
        }
        return this.dataGenerator;
    }
}

const state = new ExtensionState();

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    context.globalState.update('state', state);
    // Preparing the status manager
    let statusManager = state.getStatusManager();
    statusManager.showStatus("Build", 'amiga-assembly.build-vasm-workspace', "Build Workspace");
    vscode.window.onDidChangeActiveTextEditor(statusManager.showHideStatus, null, context.subscriptions);
    context.subscriptions.push(statusManager);

    statusManager.outputChannel.appendLine("Starting Amiga Assembly");
    let formatter = new M68kFormatter();
    // Declaring the formatter
    let disposable = vscode.languages.registerDocumentFormattingEditProvider(AMIGA_ASM_MODE, formatter);
    context.subscriptions.push(disposable);

    // Formatter for a range in document
    disposable = vscode.languages.registerDocumentRangeFormattingEditProvider(AMIGA_ASM_MODE, formatter);
    context.subscriptions.push(disposable);

    // Format on type
    disposable = vscode.languages.registerOnTypeFormattingEditProvider(AMIGA_ASM_MODE, formatter, ' ', ';');
    context.subscriptions.push(disposable);

    // Declaring the Hover
    disposable = vscode.languages.registerHoverProvider(AMIGA_ASM_MODE, new M68kHoverProvider());
    context.subscriptions.push(disposable);

    // create a new disassembler
    let disassembler = state.getDisassembler();
    disposable = vscode.commands.registerCommand('amiga-assembly.disassemble-file', async () => {
        await disassembler.showInputPanel(false).catch(err => {
            vscode.window.showErrorMessage(err.message);
        });
    });
    context.subscriptions.push(disposable);

    // create a new disassembler for copper address
    disposable = vscode.commands.registerCommand('amiga-assembly.disassemble-copper', async () => {
        await disassembler.showInputPanel(true).catch(err => {
            vscode.window.showErrorMessage(err.message);
        });
    });
    context.subscriptions.push(disposable);

    // create ADF file creator command
    disposable = vscode.commands.registerCommand('amiga-assembly.create-adffile', async () => {
        state.getADFTools().createBootableADFDisk().catch(err => {
            vscode.window.showErrorMessage(err.message);
        });
    });
    context.subscriptions.push(disposable);

    // List all symbols in selection
    disposable = vscode.commands.registerCommand('amiga-assembly.list-used-registers', async () => {
        state.getDefinitionHandler().provideUsedRegistersSymbols().then(symbolsMessage => {
            vscode.window.showInformationMessage(symbolsMessage);
        }).catch(err => {
            vscode.window.showErrorMessage(err.message);
        });
    });
    context.subscriptions.push(disposable);

    // create a new calculator
    let calc = state.getCalc();
    let controller = new CalcController(calc);

    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(controller);
    context.subscriptions.push(calc);

    // Commands for the calculator
    disposable = vscode.commands.registerCommand('amiga-assembly.calculator', () => {
        return calc.showInputPanel();
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('amiga-assembly.evaluate-selection', () => {
        return calc.evaluateSelections();
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('amiga-assembly.evaluate-selection-replace', () => {
        return calc.replaceSelections();
    });
    context.subscriptions.push(disposable);

    // Color provider
    context.subscriptions.push(vscode.languages.registerColorProvider(AMIGA_ASM_MODE, new M86kColorProvider()));
    context.subscriptions.push(vscode.languages.registerColorProvider(AMIGA_DEBUG_ASM_MODE, new M86kColorProvider()));

    // Definition provider
    let definitionHandler = state.getDefinitionHandler();
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(AMIGA_ASM_MODE, definitionHandler));
    context.subscriptions.push(vscode.languages.registerReferenceProvider(AMIGA_ASM_MODE, definitionHandler));
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(AMIGA_ASM_MODE, definitionHandler));

    // Diagnostics 
    let errorDiagnosticCollection = state.getErrorDiagnosticCollection();
    let warningDiagnosticCollection = state.getWarningDiagnosticCollection();
    context.subscriptions.push(errorDiagnosticCollection);
    context.subscriptions.push(warningDiagnosticCollection);

    // VASM Command
    let compiler = state.getCompiler();
    // Build a file
    disposable = vscode.commands.registerCommand('amiga-assembly.build-vasm', async () => {
        statusManager.onDefault();
        await compiler.buildCurrentEditorFile().catch(error => {
            statusManager.onError(error.message);
        });
    });
    context.subscriptions.push(disposable);
    // Build on save
    let vController = new VASMController(compiler);
    context.subscriptions.push(vController);
    // Build the workspace
    vscode.commands.registerCommand('amiga-assembly.build-vasm-workspace', async () => {
        statusManager.onDefault();
        await compiler.buildWorkspace().then(() => {
            statusManager.onSuccess();
        }).catch(error => {
            statusManager.onError(error.message);
        });
    });
    context.subscriptions.push(disposable);
    // Clean the workspace
    disposable = vscode.commands.registerCommand('amiga-assembly.clean-vasm-workspace', async () => {
        await compiler.cleanWorkspace().then(() => {
            statusManager.onDefault();
        }).catch(error => {
            statusManager.onError(error.message);
        });
    });
    context.subscriptions.push(disposable);

    // Data generator code lens provider
    disposable = vscode.commands.registerCommand('amiga-assembly.generate-data', async (range: vscode.Range) => {
        await state.getDataGenerator().onGenerateData(range).catch(error => {
            vscode.window.showErrorMessage(error.message);
        });
    });
    context.subscriptions.push(disposable);
    context.subscriptions.push(vscode.languages.registerCodeLensProvider(AMIGA_ASM_MODE, state.getDataGenerator()));

    // Debug configuration
    context.subscriptions.push(vscode.commands.registerCommand('amiga-assembly.getProgramName', config => {
        return vscode.window.showInputBox({
            placeHolder: "Please enter the name of a program file in the workspace folder",
            value: "myprogram"
        });
    }));

    // register a configuration provider for 'fs-uae' debug type
    const provider = new FsUAEConfigurationProvider();
    context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider('fs-uae', provider));
    context.subscriptions.push(provider);
    const runProvider = new RunFsUAEConfigurationProvider();
    context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider('fs-uae-run', runProvider));
    context.subscriptions.push(runProvider);
    statusManager.outputChannel.appendLine("------> done");

    context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider('disassembly', new DisassemblyContentProvider()));
    // IFF view
    if (vscode.window.registerWebviewPanelSerializer) {
        // Make sure we register a serializer in activation event
        vscode.window.registerWebviewPanelSerializer(IFFViewerPanel.VIEW_TYPE, {
            async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, _state: any) {
                IFFViewerPanel.revive(webviewPanel, context.extensionPath);
            }
        });
    }
    context.subscriptions.push(
        vscode.commands.registerCommand('amiga-assembly.view-iff', (imageUri: vscode.Uri) => {
            IFFViewerPanel.createOrShow(context.extensionPath, imageUri);
        })
    );
    let api = {
        getState(): ExtensionState {
            return state;
        }
    };
    return api;
}

export function deactivate() {
    // nothing to do
}

class FsUAEConfigurationProvider implements vscode.DebugConfigurationProvider {

    private server?: Net.Server;

	/**
	 * Massage a debug configuration just before a debug session is being launched,
	 * e.g. add all missing attributes to the debug configuration.
	 */
    resolveDebugConfiguration(folder: vscode.WorkspaceFolder | undefined, config: vscode.DebugConfiguration, token?: vscode.CancellationToken): vscode.ProviderResult<vscode.DebugConfiguration> {

        // if launch.json is missing or empty
        if (!config.type && !config.request && !config.name) {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'm68k') {
                config.type = 'fs-uae';
                config.name = 'Launch';
                config.request = 'launch';
                config.stopOnEntry = true;
                config.startEmulator = true;
                config.emulator = "fs-uae";
                config.program = "${workspaceFolder}/${command:AskForProgramName}";
                config.conf = "configuration/dev.fs-uae";
                config.buildWorkspace = true;
                config.serverName = "localhost";
                config.serverPort = 6860;
            }
        }

        if (!config.program) {
            return vscode.window.showInformationMessage("Cannot find a program to debug").then(_ => {
                return undefined;	// abort launch
            });
        }

        const self = this;
        if (config.buildWorkspace) {
            return vscode.commands.executeCommand("amiga-assembly.build-vasm-workspace").then(() => {
                return self.setSession(folder, config, token);
            });
        } else {
            return this.setSession(folder, config, token);
        }
    }

    /**
     * Sets the session config
     */
    private setSession(folder: vscode.WorkspaceFolder | undefined, config: vscode.DebugConfiguration, token?: vscode.CancellationToken): vscode.ProviderResult<vscode.DebugConfiguration> {
        if (EMBED_DEBUG_ADAPTER) {
            // start port listener on launch of first debug session
            if (!this.server) {
                // start listening on a random port
                this.server = Net.createServer(socket => {
                    const session = new FsUAEDebugSession();
                    session.setRunAsServer(true);
                    session.start(<NodeJS.ReadableStream>socket, socket);
                }).listen(0);
            }
            // make VS Code connect to debug server instead of launching debug adapter
            let address: any = this.server.address();
            if (address instanceof Object) {
                config.debugServer = address.port;
            }
        }
        return config;
    }

    dispose() {
        if (this.server) {
            this.server.close();
        }
    }
}

class RunFsUAEConfigurationProvider implements vscode.DebugConfigurationProvider {
    private runServer?: Net.Server;
	/**
	 * Massage a debug configuration just before a debug session is being launched,
	 * e.g. add all missing attributes to the debug configuration.
	 */
    resolveDebugConfiguration(folder: vscode.WorkspaceFolder | undefined, config: vscode.DebugConfiguration, token?: vscode.CancellationToken): vscode.ProviderResult<vscode.DebugConfiguration> {

        // if launch.json is missing or empty
        if (!config.type && !config.request && !config.name) {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'm68k') {
                config.type = 'fs-uae-run';
                config.name = 'Launch';
                config.request = 'launch';
                config.emulator = "fs-uae";
                config.conf = "configuration/dev.fs-uae";
                config.buildWorkspace = true;
            }
        }
        const self = this;
        if (config.buildWorkspace) {
            return vscode.commands.executeCommand("amiga-assembly.build-vasm-workspace").then(() => {
                return self.setSession(folder, config, token);
            });
        } else {
            return this.setSession(folder, config, token);
        }
    }

    /**
     * Sets the session config
     */
    private setSession(folder: vscode.WorkspaceFolder | undefined, config: vscode.DebugConfiguration, token?: vscode.CancellationToken): vscode.ProviderResult<vscode.DebugConfiguration> {
        if (EMBED_DEBUG_ADAPTER) {
            // start port listener on launch of first debug session
            if (!this.runServer) {
                // start listening on a random port
                this.runServer = Net.createServer(socket => {
                    const session = new RunFsUAENoDebugSession();
                    session.setRunAsServer(true);
                    session.start(<NodeJS.ReadableStream>socket, socket);
                }).listen(0);
            }
            // make VS Code connect to debug server instead of launching debug adapter
            let address: any = this.runServer.address();
            if (address instanceof Object) {
                config.debugServer = address.port;
            }
        }
        return config;
    }

    dispose() {
        if (this.runServer) {
            this.runServer.close();
        }
    }
}
