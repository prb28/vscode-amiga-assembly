import { commands, CustomExecution, Disposable, Event, EventEmitter, Pseudoterminal, Task, TaskDefinition, TaskProvider, TaskScope, TerminalDimensions, TextDocument, workspace } from 'vscode';
import { AdfGeneratorProperties, ADFTools } from './adf';
import { ExtensionState } from './extension';
import { VasmBuildProperties, VASMCompiler } from './vasm';
import { VlinkBuildProperties, VLINKLinker } from './vlink';

interface AmigaBuildTaskDefinition extends TaskDefinition {
	vasm?: VasmBuildProperties;
	vlink?: VlinkBuildProperties;
	adfgenerator?: AdfGeneratorProperties;
}

export class AmigaBuildTaskProvider implements TaskProvider {
	static readonly AMIGA_BUILD_TASK_NAME = 'build';
	static readonly AMIGA_COMPILE_CURRENT_TASK_NAME = 'compile current file';
	static readonly AMIGA_CREATE_ADF_TASK_NAME = 'create ADF';
	static readonly AMIGA_BUILD_SCRIPT_TYPE = 'amigaassembly';
	static readonly AMIGA_CREATE_ADF_FULL_TASK_NAME = `${AmigaBuildTaskProvider.AMIGA_BUILD_SCRIPT_TYPE}: ${AmigaBuildTaskProvider.AMIGA_CREATE_ADF_TASK_NAME}`;
	static readonly AMIGA_COMPILE_FULL_TASK_NAME = `${AmigaBuildTaskProvider.AMIGA_BUILD_SCRIPT_TYPE}: ${AmigaBuildTaskProvider.AMIGA_COMPILE_CURRENT_TASK_NAME}`;
	static readonly AMIGA_BUILD_PRELAUNCH_TASK_NAME = `${AmigaBuildTaskProvider.AMIGA_BUILD_SCRIPT_TYPE}: ${AmigaBuildTaskProvider.AMIGA_BUILD_TASK_NAME}`;

	private tasks: Task[] | undefined;
	private extensionState: ExtensionState;

	constructor(extensionState: ExtensionState) {
		this.extensionState = extensionState;
	}

	public async provideTasks(): Promise<Task[]> {
		return this.getTasks();
	}

	public resolveTask(_task: Task): Task | undefined {
		const definition: AmigaBuildTaskDefinition = <any>_task.definition;
		return this.getTask(definition);
	}

	private getTasks(): Task[] {
		if (this.tasks !== undefined) {
			return this.tasks;
		}
		this.tasks = [this.getTask(), this.getTask(undefined, true), this.getTask(undefined, false, true)];
		return this.tasks;
	}

	private getTask(definition?: AmigaBuildTaskDefinition, isCompileTask?: boolean, isBuildWithADF?: boolean): Task {
		let lDefinition: AmigaBuildTaskDefinition;
		if (!definition) {
			lDefinition = {
				type: AmigaBuildTaskProvider.AMIGA_BUILD_SCRIPT_TYPE,
				watch: false,
				vasm: VASMCompiler.DEFAULT_BUILD_CONFIGURATION
			};
			if (!isCompileTask) {
				lDefinition.vlink = VLINKLinker.DEFAULT_BUILD_CONFIGURATION;
			}
			if (isBuildWithADF) {
				lDefinition.adfgenerator = ADFTools.DEFAULT_BUILD_CONFIGURATION;
			}
		} else {
			lDefinition = definition;
		}
		let taskName: string;
		if (isCompileTask) {
			taskName = AmigaBuildTaskProvider.AMIGA_COMPILE_CURRENT_TASK_NAME;
		} else if (isBuildWithADF) {
			taskName = AmigaBuildTaskProvider.AMIGA_CREATE_ADF_TASK_NAME;
		} else {
			taskName = AmigaBuildTaskProvider.AMIGA_BUILD_TASK_NAME;
		}
		return new Task(lDefinition, TaskScope.Workspace, taskName,
			AmigaBuildTaskProvider.AMIGA_BUILD_SCRIPT_TYPE, new CustomExecution(async (): Promise<Pseudoterminal> => {
				return new AmigaBuildTaskTerminal(this.extensionState, lDefinition.vasm, lDefinition.vlink, lDefinition.adfgenerator, isCompileTask);
			}));
	}
}

class AmigaBuildTaskTerminal implements Pseudoterminal {
	private writeEmitter = new EventEmitter<string>();
	onDidWrite: Event<string> = this.writeEmitter.event;
	private closeEmitter = new EventEmitter<number>();
	onDidClose?: Event<number> = this.closeEmitter.event;
	private vasmBuildProperties?: VasmBuildProperties;
	private vlinkBuildProperties?: VlinkBuildProperties;
	private adfGeneratorProperties?: AdfGeneratorProperties;
	private compileCurrentFile?: boolean;

	constructor(private extensionState: ExtensionState, vasmBuildProperties?: VasmBuildProperties, vlinkBuildProperties?: VlinkBuildProperties, adfGeneratorProperties?: AdfGeneratorProperties, compileCurrentFile?: boolean) {
		this.vasmBuildProperties = vasmBuildProperties;
		this.vlinkBuildProperties = vlinkBuildProperties;
		this.compileCurrentFile = compileCurrentFile;
		this.adfGeneratorProperties = adfGeneratorProperties;
	}

	open(initialDimensions: TerminalDimensions | undefined): Promise<void> {
		return this.doBuild();
	}

	close(): void {
		// nothing to do during close
	}

	private async doBuild(): Promise<void> {
		try {
			if (this.compileCurrentFile) {
				this.writeEmitter.fire('\u001b[36mCompiling current editor file...\r\n\u001b[0m');
				await this.extensionState.getCompiler().buildCurrentEditorFile(this.vasmBuildProperties, this.writeEmitter);
			} else {
				this.writeEmitter.fire('\u001b[36mStarting build...\r\n\u001b[0m');
				await this.extensionState.getCompiler().buildWorkspace(this.writeEmitter, this.vasmBuildProperties, this.vlinkBuildProperties);
				if (this.adfGeneratorProperties) {
					const adfTools = new ADFTools(this.adfGeneratorProperties.ADFToolsParentDir);
					this.writeEmitter.fire('\u001b[36mCreating ADF file...\r\n\u001b[0m');
					await adfTools.createBootableADFDisk(this.adfGeneratorProperties, this.writeEmitter, this.extensionState.getCompiler());
					this.writeEmitter.fire('\u001b[32mADF file done\r\n\u001b[0m');
				}
			}
			this.closeEmitter.fire(0);
		} catch (e) {
			this.writeEmitter.fire(`\u001b[31m${e.message}\u001b[0m\r\n`);
			this.closeEmitter.fire(1);
		}
	}
}

export class CompilerController {
	private disposable: Disposable;

	constructor() {
		// subscribe to selection change and editor activation events
		const subscriptions: Disposable[] = [];
		workspace.onDidSaveTextDocument(
			document => {
				this.onSaveDocument(document);
			},
			null,
			subscriptions
		);

		// create a combined disposable from both event subscriptions
		this.disposable = Disposable.from(...subscriptions);
	}

	public compile(): Thenable<unknown> {
		return commands.executeCommand("workbench.action.tasks.runTask", AmigaBuildTaskProvider.AMIGA_COMPILE_FULL_TASK_NAME);
	}

	public async onSaveDocument(document: TextDocument): Promise<void> {
		const state = ExtensionState.getCurrent();
		const statusManager = state.getStatusManager();
		if (document.languageId === "m68k") {
			statusManager.onDefault();
			try {
				await this.compile();
			} catch (error) {
				statusManager.onError(error.message);
			}
		}
	}

	dispose(): void {
		this.disposable.dispose();
	}
}