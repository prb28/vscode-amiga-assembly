import * as vscode from 'vscode';
import { ExtensionState } from './extension';

interface AmigaBuildTaskDefinition extends vscode.TaskDefinition {
}

export class AmigaBuildTaskProvider implements vscode.TaskProvider {
	static readonly AMIGA_BUILD_TASK_NAME = 'build';
	static readonly AMIGA_BUILD_SCRIPT_TYPE = 'amigaassembly';
	static readonly AMIGA_BUILD_PRELAUNCH_TASK_NAME = `${AmigaBuildTaskProvider.AMIGA_BUILD_SCRIPT_TYPE}: ${AmigaBuildTaskProvider.AMIGA_BUILD_TASK_NAME}`;

	private tasks: vscode.Task[] | undefined;
	private extensionState: ExtensionState;

	constructor(extensionState: ExtensionState) {
		this.extensionState = extensionState;
	}

	public async provideTasks(): Promise<vscode.Task[]> {
		return this.getTasks();
	}

	public resolveTask(_task: vscode.Task): vscode.Task | undefined {
		const definition: AmigaBuildTaskDefinition = <any>_task.definition;
		return this.getTask(definition);
	}

	private getTasks(): vscode.Task[] {
		if (this.tasks !== undefined) {
			return this.tasks;
		}
		this.tasks = [this.getTask()];
		return this.tasks;
	}

	private getTask(definition?: AmigaBuildTaskDefinition): vscode.Task {
		if (definition === undefined) {
			definition = {
				type: AmigaBuildTaskProvider.AMIGA_BUILD_SCRIPT_TYPE
			};
		}
		return new vscode.Task(definition, vscode.TaskScope.Workspace, AmigaBuildTaskProvider.AMIGA_BUILD_TASK_NAME,
			AmigaBuildTaskProvider.AMIGA_BUILD_SCRIPT_TYPE, new vscode.CustomExecution(async (): Promise<vscode.Pseudoterminal> => {
				// When the task is executed, this callback will run. Here, we setup for running the task.
				return new AmigaBuildTaskTerminal(this.extensionState);
			}));
	}
}

class AmigaBuildTaskTerminal implements vscode.Pseudoterminal {
	private writeEmitter = new vscode.EventEmitter<string>();
	onDidWrite: vscode.Event<string> = this.writeEmitter.event;
	private closeEmitter = new vscode.EventEmitter<number>();
	onDidClose?: vscode.Event<number> = this.closeEmitter.event;

	constructor(private extensionState: ExtensionState) {
	}

	open(initialDimensions: vscode.TerminalDimensions | undefined): void {
		// At this point we can start using the terminal.
		this.doBuild();
	}

	close(): void {
		// The terminal has been closed. Shutdown the build.
	}

	private async doBuild(): Promise<void> {
		this.writeEmitter.fire('\u001b[36mStarting build...\r\n\u001b[0m');
		try {
			await this.extensionState.getCompiler().buildWorkspace(this.writeEmitter);
			this.closeEmitter.fire(0);
		} catch (e) {
			this.closeEmitter.fire(1);
		}
	}
}