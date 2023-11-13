import * as path from 'path';
import { FileProxy } from './fsProxy';
import { Uri } from 'vscode';

export enum DocumentationType {
    UNKNOWN,
    INSTRUCTION,
    DIRECTIVE,
    REGISTER,
    CPU_REGISTER,
    FUNCTION
}
export class DocumentationElement {
    name = "";
    description = "";
    detail = "";
    type: DocumentationType = DocumentationType.UNKNOWN;

    public static refactorLinks(relativePath: string, text: string): string {
        let rText = text;
        // eslint-disable-next-line no-useless-escape
        const matcher = /\[([\/\\a-z0-9_\.\-]*)\]\(([a-z0-9_\-\/\\\.]*)\)/gi;
        let match = matcher.exec(text);
        while (match) {
            const title = match[1];
            const pageName = match[2];
            const args = [{ path: `${relativePath}/${pageName}` }];
            const commandUri = `[${title}](command:amiga-assembly.showdoc?${encodeURIComponent(JSON.stringify(args))})`;
            rText = rText.replace(match[0], commandUri);
            match = matcher.exec(text);
        }
        return rText;
    }
}

/**
 * Class to manage documentations in a folder
 */
abstract class DocumentationMDFileFolderManager {
    protected dirPath: string;
    constructor(extensionPath: string, dirName: string) {
        this.dirPath = path.join(extensionPath, "docs", dirName);
    }

    public async load(): Promise<void> {
        // Read the registers file
        // Creating the relative path to find the test file
        const dirProxy = new FileProxy(Uri.file(this.dirPath), true);
        const files = await dirProxy.listFiles();
        for (const fileProxy of files) {
            const filename = fileProxy.getName();
            if (filename.endsWith(".md")) {
                this.loadFile(filename);
            }
        }
    }

    protected abstract loadFile(filename: string): void;
}


/**
 * Class to manage the instructions
 */
export class DocumentationInstructionsManager extends DocumentationMDFileFolderManager {
    private static readonly bccVariants = ["bcc", "bcs", "beq", "bge", "bgt", "bhi", "ble", "bls", "blt", "bmi", "bne", "bpl", "bvc", "bvs", "bhs", "blo"];
    private static readonly dbccVariants = ["dbcc", "dbt", "dbf", "dbra", "dbhi", "dbls", "dbcc", "dbhs", "dbcs", "dblo", "dbne", "dbvs", "dbeq", "dbpl", "dbvc", "dbmi", "dbge", "dblt", "dbgt", "dble"];
    private static readonly sccVariants = ["scc", "st", "sf", "shi", "sls", "scc", "shs", "scs", "slo", "sne", "seq", "svc", "svs", "spl", "smi", "sge", "slt", "sgt", "sle"];
    private instructions = new Map<string, DocumentationInstruction>();

    constructor(extensionPath: string) {
        super(extensionPath, "instructions");
    }

    protected loadFile(filename: string): void {
        let elms = filename.replace(".md", "").split("_");
        if (elms[0] === "bcc") {
            elms = DocumentationInstructionsManager.bccVariants;
        } else if (elms[0] === "dbcc") {
            elms = DocumentationInstructionsManager.dbccVariants;
        } else if (elms[0] === "scc") {
            elms = DocumentationInstructionsManager.sccVariants;
        }
        elms.forEach(element => {
            const filePath = path.join(this.dirPath, filename);
            const name = element.toUpperCase();
            const di = new DocumentationInstruction(element, this.dirPath, filePath);
            this.instructions.set(name, di);
        });
    }

    /**
     * Retrieves an instruction by it's name
     * @param name Name of the instruction
     */
    public async getInstructionByName(name: string): Promise<DocumentationInstruction | undefined> {
        const instruction = this.instructions.get(name);
        if (instruction) {
            await instruction.loadDescription();
        }
        return instruction;
    }

    /**
     * Iterate on all entries by name.
     */
    public entriesByName(): IterableIterator<[string, DocumentationInstruction]> {
        return this.instructions.entries();
    }

    public getCount(): number {
        return this.instructions.size;
    }
}

/**
 * Class to manage the directives
 */
export class DocumentationDirectivesManager extends DocumentationMDFileFolderManager {
    private directives = new Map<string, DocumentationDirective>();

    constructor(extensionPath: string) {
        super(extensionPath, "directives");
    }

    protected loadFile(filename: string): void {
        const element = filename.replace(".md", "");
        const filePath = path.join(this.dirPath, filename);
        const name = element.toUpperCase();
        const di = new DocumentationDirective(element, this.dirPath, filePath);
        this.directives.set(name, di);
    }

    /**
     * Retrieves an directive by it's name
     * @param name Name of the directive
     */
    public async getDirectiveByName(name: string): Promise<DocumentationDirective | undefined> {
        const directive = this.directives.get(name);
        if (directive) {
            await directive.loadDescription();
        }
        return directive;
    }

    /**
     * Iterate on all entries by name.
     */
    public entriesByName(): IterableIterator<[string, DocumentationDirective]> {
        return this.directives.entries();
    }

    public getCount(): number {
        return this.directives.size;
    }
}

export interface DocumentationLazy {
    loadDescription(): Promise<void>;
}

export function isDocumentationLazy(el: unknown): el is DocumentationLazy {
    return (el as DocumentationLazy).loadDescription !== undefined;
}

/**
 * Class representing an instruction documentation
 */
export class DocumentationInstruction extends DocumentationElement implements DocumentationLazy {
    filename: string;
    parentDir: string;
    loaded: boolean;
    /**
     * Constructor
     * @param name Name
     * @param parentDir path to the parent dir of the file
     * @param filename filename of the documentation
     */
    constructor(name: string, parentDir: string, filename: string) {
        super();
        this.loaded = false;
        this.name = name;
        this.filename = filename;
        this.description = "";
        this.detail = "instruction";
        this.parentDir = parentDir;
        this.type = DocumentationType.INSTRUCTION;
    }

    private removeImages(text: string): string {
        let rText = text;
        // eslint-disable-next-line no-useless-escape
        const matcher = /[!]?\[([\/\\a-z0-9_\s\.\-]*)\]\(([a-z0-9_\-\/\\\.]*)\)/gi;
        let match = matcher.exec(text)
        while (match) {
            rText = rText.replace(match[0], '');
            match = matcher.exec(text)
        }
        return rText;
    }

    /**
     * Lazy loading for descriptions
     */
    public async loadDescription(): Promise<void> {
        if (!this.loaded) {
            const fProxy = new FileProxy(Uri.file(this.filename), true);
            const contents = await fProxy.readFileText('utf8');
            this.description = this.removeImages(contents);
            this.loaded = true;
        }
    }
}

export class DocumentationDirective extends DocumentationInstruction {
    constructor(name: string, parentDir: string, filename: string) {
        super(name, parentDir, filename);
        this.type = DocumentationType.DIRECTIVE;
        this.detail = "directive";
    }
}


/**
 * Class to manage the registers
 */
export class DocumentationRegistersManager extends DocumentationMDFileFolderManager {
    private registersByName = new Map<string, DocumentationRegister>();
    private registersByAddress = new Map<string, DocumentationRegister>();

    constructor(extensionPath: string) {
        super(extensionPath, "hardware");
    }

    protected loadFile(filename: string): void {
        const elms = filename.replace(".md", "").split("_");
        if (elms.length === 2) {
            const filePath = path.join(this.dirPath, filename);
            const name = elms[1].toUpperCase();
            const address = elms[0].toUpperCase();
            const hr = new DocumentationRegister(address, name, filePath);
            this.registersByAddress.set(address, hr);
            this.registersByName.set(name, hr);
        }
    }

    /**
     * Retrieves a register by it's address
     * @param address Address of the register
     */
    public async getRegistersByAddress(address: string): Promise<DocumentationRegister | undefined> {
        const register = this.registersByAddress.get(address);
        if (register) {
            await register.loadDescription();
        }
        return register;
    }

    /**
     * Retrieves a register by it's name
     * @param name Name of the register
     */
    public async getRegistersByName(name: string): Promise<DocumentationRegister | undefined> {
        const register = this.registersByName.get(name);
        if (register) {
            await register.loadDescription();
        }
        return register;
    }

    /**
     * Iterate on all entries by name.
     */
    public entriesByName(): IterableIterator<[string, DocumentationRegister]> {
        return this.registersByName.entries();
    }

    public getRegistersByNameCount(): number {
        return this.registersByName.size;
    }
    public getRegistersByAddressCount(): number {
        return this.registersByAddress.size;
    }
}

/**
 * Class representing a register
 */
export class DocumentationRegister extends DocumentationElement implements DocumentationLazy {
    filename: string;
    loaded: boolean;
    address: string;
    /**
     * Constructor
     * @param address address of the register 
     * @param name Name
     * @param filename filename of the documentation
     */
    constructor(address: string, name: string, filename: string) {
        super();
        this.loaded = false;
        this.address = address;
        this.detail = "hardware $" + address.replace(/^DFF/, '');
        this.name = name;
        this.filename = filename;
        this.description = "";
        this.type = DocumentationType.REGISTER;
    }

    /**
     * Lazy loading for descriptions
     */
    public async loadDescription(): Promise<void> {
        if (!this.loaded) {
            const fProxy = new FileProxy(Uri.file(this.filename), true);
            const contents = await fProxy.readFileText('utf8');
            this.description = this.modifyDescription(contents, this.address, this.name);
            this.loaded = true;
        }
    }

    /**
     * Modifies the description to add the address
     * @param description description to modify
     * @param address Address to be added
     * @return modified string
     */
    private modifyDescription(description: string, address: string, name: string): string {
        // Retrieve the first line
        if (description.trim().startsWith("**")) {
            const lAddress = address.toLocaleLowerCase();
            return DocumentationElement.refactorLinks("hardware", description.replace("**", `**${name}($${lAddress}) - `));
        } else {
            return DocumentationElement.refactorLinks("hardware", description);
        }
    }
}

/**
 * Class representing a CPU data register
 */
export class DocumentationCpuRegister extends DocumentationElement {
    /**
     * Constructor
     * @param name Name
     */
    constructor(name: string, detail: string) {
        super();
        this.name = name;
        this.detail = detail;
        this.description = "";
        this.type = DocumentationType.CPU_REGISTER;
    }
}


/**
 * Class to manage the CPU register documentation
 */
export class DocumentationCpuRegistersManager {
    public registers = new Map<string, DocumentationCpuRegister>();

    constructor() {
        for (let i = 0; i < 8; i++) {
            this.registers.set('A' + i, new DocumentationCpuRegister('A' + i, 'address register'));
            this.registers.set('D' + i, new DocumentationCpuRegister('D' + i, 'data register'));
            this.registers.set('FP' + i, new DocumentationCpuRegister('FP' + i, 'floating point register'));
        }
        this.registers.set('PC', new DocumentationCpuRegister('PC', 'program counter'));
        this.registers.set('SP', new DocumentationCpuRegister('SP', 'stack pointer'));
        this.registers.set('VBR', new DocumentationCpuRegister('VBR', 'vector base register'));
    }

    /**
     * Retrieves an register by it's name
     * @param name Name of the instruction
     */
    public async getRegisterByName(name: string): Promise<DocumentationCpuRegister | undefined> {
        return this.registers.get(name);
    }

    /**
     * Iterate on all entries by name.
     */
    public entriesByName(): IterableIterator<[string, DocumentationCpuRegister]> {
        return this.registers.entries();
    }

    public getCount(): number {
        return this.registers.size;
    }
}

/**
 * Class to manage the libraries documentation
 */
export class DocumentationLibraryManager {
    public functionsByName = new Map<string, DocumentationLibraryFunction>();
    private extensionPath: string;
    constructor(extensionPath: string) {
        this.extensionPath = extensionPath;
    }

    public async load(): Promise<void> {
        // Read the registers file
        // Creating the relative path to find the test file
        const dirPath = path.join(this.extensionPath, "docs", "libs");
        const dirProxy = new FileProxy(Uri.file(dirPath), true);
        const files = await dirProxy.listFiles();
        for (const fileProxy of files) {
            const dirName = fileProxy.getName();
            if (!dirName.startsWith(".")) {
                const childFiles = await fileProxy.listFiles();
                childFiles.forEach(childFile => {
                    const childFileName = childFile.getName();
                    if (childFileName.endsWith(".md")) {
                        const name = childFileName.replace(".md", "");
                        const lf = new DocumentationLibraryFunction(dirName, name, "", childFile);
                        this.functionsByName.set(name.toUpperCase(), lf);
                    }
                });
            }
        }
    }

    public async loadDescription(functionName: string): Promise<DocumentationLibraryFunction | undefined> {
        const hLibFunc = this.functionsByName.get(functionName);
        if (hLibFunc && (hLibFunc.description.length === 0)) {
            const description = await hLibFunc.fileProxy.readFileText('utf8');
            // refactor the description links
            hLibFunc.description = DocumentationElement.refactorLinks(`libs/${hLibFunc.libraryName}`, description);
        }
        return hLibFunc;
    }
    public size(): number {
        return this.functionsByName.size;
    }
}

/**
 * Class representing a library function
 */
export class DocumentationLibraryFunction extends DocumentationElement {
    libraryName: string;
    fileProxy: FileProxy;
    /**
     * Constructor
     * @param libraryName Name of the library
     * @param name Name
     * @param description description in markdown
     * @param fileProxy Path to the file
     */
    constructor(libraryName: string, name: string, description: string, fileProxy: FileProxy) {
        super();
        this.libraryName = libraryName;
        this.detail = `lib ${libraryName}.${name}()`;
        this.name = name;
        this.description = description;
        this.fileProxy = fileProxy;
        this.type = DocumentationType.FUNCTION;
    }
}

/**
 * Documentation manager manages all the documentation contents and holds the states
 */
export class DocumentationManager {
    private isLoaded = false;
    instructionsManager: DocumentationInstructionsManager;
    directivesManager: DocumentationDirectivesManager;
    registersManager: DocumentationRegistersManager;
    cpuRegistersManager: DocumentationCpuRegistersManager;
    libraryManager: DocumentationLibraryManager;
    relevantKeywordsMap: Map<string, Array<DocumentationElement>>;
    constructor(extensionPath: string) {
        this.instructionsManager = new DocumentationInstructionsManager(extensionPath);
        this.directivesManager = new DocumentationDirectivesManager(extensionPath);
        this.registersManager = new DocumentationRegistersManager(extensionPath);
        this.cpuRegistersManager = new DocumentationCpuRegistersManager();
        this.libraryManager = new DocumentationLibraryManager(extensionPath);
        this.relevantKeywordsMap = new Map<string, Array<DocumentationElement>>();
    }

    public async load(): Promise<void> {
        if (!this.isLoaded) {
            await Promise.all([this.instructionsManager.load(),
            this.directivesManager.load(),
            this.registersManager.load(),
            this.libraryManager.load()]);
            for (const [key, value] of this.instructionsManager.entriesByName()) {
                this.addRelevantKeywordElements(key, value);
            }
            for (const [key, value] of this.directivesManager.entriesByName()) {
                this.addRelevantKeywordElements(key, value);
            }
            for (const [key, value] of this.registersManager.entriesByName()) {
                this.addRelevantKeywordElements(key, value);
            }
            for (const [key, value] of this.cpuRegistersManager.entriesByName()) {
                this.addRelevantKeywordElements(key, value);
            }
            for (const [key, value] of this.libraryManager.functionsByName.entries()) {
                this.addRelevantKeywordElements(key, value);
            }
            this.isLoaded = true;
        }
    }

    private addRelevantKeywordElements(key: string, element: DocumentationElement) {
        const lKey = key.toUpperCase();
        const lElements = this.relevantKeywordsMap.get(lKey);
        if (!lElements) {
            this.relevantKeywordsMap.set(lKey, [element]);
        } else {
            lElements.push(element);
            this.relevantKeywordsMap.set(lKey, lElements);
        }
    }

    public getInstruction(instruction: string): Promise<DocumentationInstruction | undefined> {
        return this.instructionsManager.getInstructionByName(instruction.toUpperCase());
    }
    public getDirective(directive: string): Promise<DocumentationInstruction | undefined> {
        return this.directivesManager.getDirectiveByName(directive.toUpperCase());
    }
    public getRegisterByAddress(address: string): Promise<DocumentationRegister | undefined> {
        return this.registersManager.getRegistersByAddress(address);
    }
    public getRegisterByName(name: string): Promise<DocumentationRegister | undefined> {
        return this.registersManager.getRegistersByName(name);
    }
    public getCpuRegister(name: string): Promise<DocumentationCpuRegister | undefined> {
        return this.cpuRegistersManager.getRegisterByName(name);
    }
    public getFunction(functionName: string): Promise<DocumentationLibraryFunction | undefined> {
        return this.libraryManager.loadDescription(functionName);
    }

    /**
     * Returns the description for a keyword
     * @param keyword Word to search
     * @return Description
     */
    public async get(keyword: string): Promise<string | null> {
        let value: DocumentationElement | undefined;
        if (keyword.length > 0) {
            value = await this.getRegisterByAddress(keyword);
            if (!value) {
                value = await this.getRegisterByName(keyword);
                if (!value) {
                    let newKeyword = keyword;
                    const pos = newKeyword.indexOf('(');
                    if (pos > 0) {
                        newKeyword = newKeyword.substring(0, pos);
                    }
                    if (newKeyword.startsWith("_LVO")) {
                        newKeyword = newKeyword.substring(4);
                    }
                    value = await this.getFunction(newKeyword);
                }
            }
        }
        if (value) {
            return value.description;
        } else {
            return null;
        }
    }
    /**
     * Seeks for a keyword starting with 
     * @param keyword Keyword part
     * @return Array of keywords
     */
    public async findKeywordStartingWith(keyword: string): Promise<Array<DocumentationElement>> {
        const values = new Array<DocumentationElement>();
        let upper = keyword.toUpperCase();
        if (upper.startsWith("_LVO")) {
            upper = upper.substring(4);
        }
        for (const key of this.relevantKeywordsMap.keys()) {
            if (key.startsWith(upper)) {
                const keywordValues = this.relevantKeywordsMap.get(key);
                if (keywordValues) {
                    for (const v of keywordValues) {
                        if (v instanceof DocumentationLibraryFunction) {
                            const loaded = await this.libraryManager.loadDescription(key);
                            if (loaded) {
                                values.push(loaded);
                            }
                        } else {
                            values.push(v);
                        }
                    }
                }
            }
        }
        return values;
    }
}