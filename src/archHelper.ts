import { Disposable, QuickInput, QuickInputButton, QuickInputButtons, QuickPickItem, window } from "vscode";

export enum CPU {
    M68000 = 'M68000',
    M68008 = 'M68008',
    M68010 = 'M68010',
    M68020 = 'M68020',
    M68030 = 'M68030',
    M68040 = 'M68040',
    M68060 = 'M68060',
    M68080 = 'M68080'
}

export enum FPU {
    NONE = 'NONE',
    FPU68851 = 'FPU68851',
    FPU68881 = 'FPU68881',
    FPU68882 = 'FPU68882',
    CPU_INTERNAL = 'CPU_INTERNAL'
}

export enum CHIPSET {
    OCR = 'OCR',
    AGA = 'AGA',
    ECS_AGNUS = 'ECS_AGNUS',
    ECS_DENISE = 'ECS_DENISE',
    FULL_ECS = 'FULL_ECS'
}

export enum AMIGA_MODEL {
    A500 = 'A500',
    A500PLUS = 'A500PLUS',
    A600 = 'A600',
    A1000 = 'A1000',
    A1200 = 'A1200',
    A2000 = 'A2000',
    A3000 = 'A3000',
    A4000 = 'A4000',
    CD32 = 'CD32',
    VAMPYREV4 = 'VAMPYREV4'
}

export enum KICKSTART {
    ROM_1_1 = 'ROM_1_1',
    ROM_1_2 = 'ROM_1_2',
    ROM_1_3 = 'ROM_1_3',
    ROM_2_04 = 'ROM_2_04',
    ROM_2_05 = 'ROM_2_05',
    ROM_3_0 = 'ROM_3_0',
    ROM_3_1 = 'ROM_3_1'
}

export enum EMULATOR {
    FSUAE = 'FSUAE', WINUAE = 'WINUAE'//, VAMIGA = 'VAMIGA'
}

export enum CONFIGURATION_TYPE {
    STANDARD = 'Standard configuration',
    CUSTOM = 'Custom configuration'
}
export class AmigaConfiguration {
    name?: string;
    amigaModel?: AMIGA_MODEL;
    kickstart?: KICKSTART;
    CPU?: CPU;
    FPU?: FPU;
    chipRam?: number;
    fastRam?: number;
    slowRam?: number;
}

interface State {
    title: string;
    step: number;
    totalSteps: number;
    resourceGroup: QuickPickItem | string;
    name: string;
    amigaConfiguration: AmigaConfiguration;
}

export class ArchHelper {
    public static readonly STANDARD_AMIGAS = [
        <AmigaConfiguration>{
            name: "A500",
            amigaModel: AMIGA_MODEL.A500,
            kickstart: KICKSTART.ROM_1_3,
            CPU: CPU.M68000,
            FPU: FPU.NONE,
            chipRam: 512,
            fastRam: 0,
            slowRam: 0
        },
        <AmigaConfiguration>{
            name: "A500+",
            amigaModel: AMIGA_MODEL.A500PLUS,
            kickstart: KICKSTART.ROM_2_04,
            CPU: CPU.M68000,
            FPU: FPU.NONE,
            chipRam: 1024,
            fastRam: 0,
            slowRam: 0
        },
        <AmigaConfiguration>{
            name: "A600",
            amigaModel: AMIGA_MODEL.A600,
            kickstart: KICKSTART.ROM_2_05,
            CPU: CPU.M68000,
            FPU: FPU.NONE,
            chipRam: 1024,
            fastRam: 0,
            slowRam: 0
        },
        <AmigaConfiguration>{
            name: "A1000",
            amigaModel: AMIGA_MODEL.A1000,
            kickstart: KICKSTART.ROM_1_3,
            CPU: CPU.M68000,
            FPU: FPU.NONE,
            chipRam: 256,
            fastRam: 0,
            slowRam: 0
        },
        <AmigaConfiguration>{
            name: "A2000",
            amigaModel: AMIGA_MODEL.A2000,
            kickstart: KICKSTART.ROM_1_3,
            CPU: CPU.M68000,
            FPU: FPU.NONE,
            chipRam: 512,
            fastRam: 0,
            slowRam: 0
        },
        <AmigaConfiguration>{
            name: "A1200",
            amigaModel: AMIGA_MODEL.A1200,
            kickstart: KICKSTART.ROM_3_1,
            CPU: CPU.M68020,
            FPU: FPU.NONE,
            chipRam: 2048,
            fastRam: 0,
            slowRam: 0
        },
        <AmigaConfiguration>{
            name: "A3000",
            amigaModel: AMIGA_MODEL.A1200,
            kickstart: KICKSTART.ROM_3_0,
            CPU: CPU.M68030,
            FPU: FPU.NONE,
            chipRam: 1024,
            fastRam: 0,
            slowRam: 0
        },
        <AmigaConfiguration>{
            name: "A4000",
            amigaModel: AMIGA_MODEL.A1200,
            kickstart: KICKSTART.ROM_3_1,
            CPU: CPU.M68030,
            FPU: FPU.NONE,
            chipRam: 2048,
            fastRam: 2048,
            slowRam: 0
        }
    ]
    private title: string;
    public constructor() {
        this.title = "choose";
    }
    public async collectSyntaxCheckerConfiguration() {
        const state = {} as Partial<State>;
        state.amigaConfiguration = new AmigaConfiguration();
        await MultiStepInput.run(input => this.pickStandardOrCustom(input, state));
        return state as State;
    }
    private async pickStandardOrCustom(input: MultiStepInput, state: Partial<State>) {
        const confType: QuickPickItem[] = Object.keys(CONFIGURATION_TYPE).map(label => ({ label }));
        if (!state.amigaConfiguration) {
            state.amigaConfiguration = new AmigaConfiguration();
        }
        const pickLabel = (await input.showQuickPick({
            title: this.title,
            step: 1,
            totalSteps: 3,
            placeholder: 'Select a configuration type',
            items: confType,
            activeItem: confType[0],
            shouldResume: this.shouldResume
        })).label;
        const pick = pickLabel as CONFIGURATION_TYPE;
        if (pick === CONFIGURATION_TYPE.CUSTOM) {
            return (input: MultiStepInput) => this.pickCPU(input, state);
        }
        return (input: MultiStepInput) => this.pickFPU(input, state);
    }
    private async pickCPU(input: MultiStepInput, state: Partial<State>) {
        const cpus: QuickPickItem[] = Object.keys(CPU).map(label => ({ label }));
        if (!state.amigaConfiguration) {
            state.amigaConfiguration = new AmigaConfiguration();
        }
        let activeItem;
        for (const cpu of cpus) {
            if (cpu.label === state.amigaConfiguration.CPU as string) {
                activeItem = cpu;
                break;
            }
        }
        const CPULabel = (await input.showQuickPick({
            title: this.title,
            step: 2,
            totalSteps: 3,
            placeholder: 'Select a CPU',
            items: cpus,
            activeItem: activeItem,
            shouldResume: this.shouldResume
        })).label;
        state.amigaConfiguration.CPU = CPULabel as CPU;
        return (input: MultiStepInput) => this.pickFPU(input, state);
    }
    private async pickFPU(input: MultiStepInput, state: Partial<State>) {
        const cpus: QuickPickItem[] = Object.keys(FPU).map(label => ({ label }));
        if (!state.amigaConfiguration) {
            state.amigaConfiguration = new AmigaConfiguration();
        }
        const FPULabel = (await input.showQuickPick({
            title: this.title,
            step: 3,
            totalSteps: 3,
            placeholder: 'Select a FPU',
            items: cpus,
            activeItem: <QuickPickItem>{ label: state.amigaConfiguration.FPU },
            shouldResume: this.shouldResume
        })).label;
        state.amigaConfiguration.FPU = FPULabel as FPU;
    }

    private async shouldResume() {
        // Could show a notification with the option to resume.
        return new Promise<boolean>((resolve, reject) => {
            // noop
        });
    }
}

// -------------------------------------------------------
// Helper code that wraps the API for the multi-step case.
// -------------------------------------------------------


class InputFlowAction {
    static back = new InputFlowAction();
    static cancel = new InputFlowAction();
    static resume = new InputFlowAction();
}

type InputStep = (input: MultiStepInput) => Thenable<InputStep | void>;

interface QuickPickParameters<T extends QuickPickItem> {
    title: string;
    step: number;
    totalSteps: number;
    items: T[];
    activeItem?: T;
    placeholder: string;
    buttons?: QuickInputButton[];
    shouldResume: () => Thenable<boolean>;
}

interface InputBoxParameters {
    title: string;
    step: number;
    totalSteps: number;
    value: string;
    prompt: string;
    validate: (value: string) => Promise<string | undefined>;
    buttons?: QuickInputButton[];
    shouldResume: () => Thenable<boolean>;
}

class MultiStepInput {

    static async run<T>(start: InputStep) {
        const input = new MultiStepInput();
        return input.stepThrough(start);
    }

    private current?: QuickInput;
    private steps: InputStep[] = [];

    private async stepThrough<T>(start: InputStep) {
        let step: InputStep | void = start;
        while (step) {
            this.steps.push(step);
            if (this.current) {
                this.current.enabled = false;
                this.current.busy = true;
            }
            try {
                step = await step(this);
            } catch (err) {
                if (err === InputFlowAction.back) {
                    this.steps.pop();
                    step = this.steps.pop();
                } else if (err === InputFlowAction.resume) {
                    step = this.steps.pop();
                } else if (err === InputFlowAction.cancel) {
                    step = undefined;
                } else {
                    throw err;
                }
            }
        }
        if (this.current) {
            this.current.dispose();
        }
    }

    async showQuickPick<T extends QuickPickItem, P extends QuickPickParameters<T>>({ title, step, totalSteps, items, activeItem, placeholder, buttons, shouldResume }: P) {
        const disposables: Disposable[] = [];
        try {
            return await new Promise<T | (P extends { buttons: (infer I)[] } ? I : never)>((resolve, reject) => {
                const input = window.createQuickPick<T>();
                input.title = title;
                input.step = step;
                input.totalSteps = totalSteps;
                input.placeholder = placeholder;
                input.items = items;
                if (activeItem) {
                    input.activeItems = [activeItem];
                }
                input.buttons = [
                    ...(this.steps.length > 1 ? [QuickInputButtons.Back] : []),
                    ...(buttons || [])
                ];
                disposables.push(
                    input.onDidTriggerButton(item => {
                        if (item === QuickInputButtons.Back) {
                            reject(InputFlowAction.back);
                        } else {
                            resolve(<any>item);
                        }
                    }),
                    input.onDidChangeSelection(items => resolve(items[0])),
                    input.onDidHide(() => {
                        (async () => {
                            reject(shouldResume && await shouldResume() ? InputFlowAction.resume : InputFlowAction.cancel);
                        })()
                            .catch(reject);
                    })
                );
                if (this.current) {
                    this.current.dispose();
                }
                this.current = input;
                this.current.show();
            });
        } finally {
            disposables.forEach(d => d.dispose());
        }
    }

    async showInputBox<P extends InputBoxParameters>({ title, step, totalSteps, value, prompt, validate, buttons, shouldResume }: P) {
        const disposables: Disposable[] = [];
        try {
            return await new Promise<string | (P extends { buttons: (infer I)[] } ? I : never)>((resolve, reject) => {
                const input = window.createInputBox();
                input.title = title;
                input.step = step;
                input.totalSteps = totalSteps;
                input.value = value || '';
                input.prompt = prompt;
                input.buttons = [
                    ...(this.steps.length > 1 ? [QuickInputButtons.Back] : []),
                    ...(buttons || [])
                ];
                let validating = validate('');
                disposables.push(
                    input.onDidTriggerButton(item => {
                        if (item === QuickInputButtons.Back) {
                            reject(InputFlowAction.back);
                        } else {
                            resolve(<any>item);
                        }
                    }),
                    input.onDidAccept(async () => {
                        const value = input.value;
                        input.enabled = false;
                        input.busy = true;
                        if (!(await validate(value))) {
                            resolve(value);
                        }
                        input.enabled = true;
                        input.busy = false;
                    }),
                    input.onDidChangeValue(async text => {
                        const current = validate(text);
                        validating = current;
                        const validationMessage = await current;
                        if (current === validating) {
                            input.validationMessage = validationMessage;
                        }
                    }),
                    input.onDidHide(() => {
                        (async () => {
                            reject(shouldResume && await shouldResume() ? InputFlowAction.resume : InputFlowAction.cancel);
                        })()
                            .catch(reject);
                    })
                );
                if (this.current) {
                    this.current.dispose();
                }
                this.current = input;
                this.current.show();
            });
        } finally {
            disposables.forEach(d => d.dispose());
        }
    }
}
