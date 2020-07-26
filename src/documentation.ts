import * as path from 'path';
import { FileProxy } from './fsProxy';
import { Uri } from 'vscode';

export enum DocumentationType {
    UNKNOWN,
    INSTRUCTION,
    REGISTER,
    FUNCTION
}
export class DocumentationElement {
    name: string = "";
    description: string = "";
    type: DocumentationType = DocumentationType.UNKNOWN;
}

/**
 * Class to manage documentations in a folder
 */
abstract class DocumentationMDFileFolderManager {
    protected dirPath: string;
    constructor(extensionPath: string, dirName: string) {
        this.dirPath = path.join(extensionPath, "docs", dirName);
    }

    public load(): Promise<void> {
        return new Promise(async (resolve, _reject) => {
            // Read the registers file
            // Creating the relative path to find the test file
            const dirProxy = new FileProxy(Uri.file(this.dirPath), true);
            let files = await dirProxy.listFiles();
            files.forEach(fileProxy => {
                let filename = fileProxy.getName();
                if (filename.endsWith(".md")) {
                    this.loadFile(filename);
                }
            });
            resolve();
        });
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

    protected loadFile(filename: string) {
        let elms = filename.replace(".md", "").split("_");
        if (elms[0] === "bcc") {
            elms = DocumentationInstructionsManager.bccVariants;
        } else if (elms[0] === "dbcc") {
            elms = DocumentationInstructionsManager.dbccVariants;
        } else if (elms[0] === "scc") {
            elms = DocumentationInstructionsManager.sccVariants;
        }
        elms.forEach(element => {
            let filePath = path.join(this.dirPath, filename);
            let name = element.toUpperCase();
            let di = new DocumentationInstruction(element, this.dirPath, filePath);
            this.instructions.set(name, di);
        });
    }

    /**
     * Retrieves an instruction by it's name
     * @param name Name of the instruction
     */
    public getInstructionByName(name: string): Promise<DocumentationInstruction | undefined> {
        return new Promise(async (resolve, _) => {
            let instruction = this.instructions.get(name);
            if (instruction) {
                await instruction.loadDescription();
            }
            resolve(instruction);
        });
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
 * Class representing an intruction documentation
 */
export class DocumentationInstruction extends DocumentationElement {
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
        this.parentDir = parentDir;
        this.type = DocumentationType.INSTRUCTION;
    }

    private removeImages(text: string): string {
        let rText = text;
        const matcher = /[!]?\[([\/\\a-z0-9_\s\.\-]*)\]\(([a-z0-9_\-\/\\\.]*)\)/gi;
        let match;
        while (match = matcher.exec(text)) {
            rText = rText.replace(match[0], '');
        }
        return rText;
    }

    /**
     * Lazy loading for descriptions
     */
    public loadDescription(): Promise<void> {
        return new Promise(async (resolve, _reject) => {
            if (!this.loaded) {
                let fProxy = new FileProxy(Uri.file(this.filename), true);
                let contents = await fProxy.readFileText('utf8');
                this.description = this.removeImages(contents);
                this.loaded = true;
            }
            resolve();
        });
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

    protected loadFile(filename: string) {
        let elms = filename.replace(".md", "").split("_");
        if (elms.length === 2) {
            let filePath = path.join(this.dirPath, filename);
            let name = elms[1].toUpperCase();
            let address = elms[0].toUpperCase();
            let hr = new DocumentationRegister(address, name, filePath);
            this.registersByAddress.set(address, hr);
            this.registersByName.set(name, hr);
        }
    }

    /**
     * Retrieves a register by it's address
     * @param address Address of the register
     */
    public getRegistersByAddress(address: string): Promise<DocumentationRegister | undefined> {
        return new Promise(async (resolve, _) => {
            let register = this.registersByAddress.get(address);
            if (register) {
                await register.loadDescription();
            }
            resolve(register);
        });
    }

    /**
     * Retrieves a register by it's name
     * @param name Name of the register
     */
    public getRegistersByName(name: string): Promise<DocumentationRegister | undefined> {
        return new Promise(async (resolve, _) => {
            let register = this.registersByName.get(name);
            if (register) {
                await register.loadDescription();
            }
            resolve(register);
        });
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
export class DocumentationRegister extends DocumentationElement {
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
        this.name = name;
        this.filename = filename;
        this.description = "";
        this.type = DocumentationType.REGISTER;
    }

    /**
     * Lazy loading for descriptions
     */
    public loadDescription(): Promise<void> {
        return new Promise(async (resolve, _reject) => {
            if (!this.loaded) {
                let fProxy = new FileProxy(Uri.file(this.filename), true);
                let contents = await fProxy.readFileText('utf8');
                this.description = this.modifyDescription(contents, this.address, this.name);
                this.loaded = true;
            }
            resolve();
        });
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
            let lAddress = address.toLocaleLowerCase();
            return description.replace("**", `**${name}(\$${lAddress}) - `);
        } else {
            return description;
        }
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

    public load(): Promise<void> {
        return new Promise(async (resolve, _reject) => {
            // Read the registers file
            // Creating the relative path to find the test file
            const dirPath = path.join(this.extensionPath, "docs", "libs");
            const dirProxy = new FileProxy(Uri.file(dirPath), true);
            let files = await dirProxy.listFiles();
            files.forEach(async fileProxy => {
                let dirName = fileProxy.getName();
                if (!dirName.startsWith(".")) {
                    let childFiles = await fileProxy.listFiles();
                    childFiles.forEach(childFile => {
                        let childFileName = childFile.getName();
                        if (childFileName.endsWith(".md")) {
                            let name = childFileName.replace(".md", "");
                            let lf = new DocumentationLibraryFunction(dirName, name, "", childFile);
                            this.functionsByName.set(name.toUpperCase(), lf);
                        }
                    });
                }
            });
            resolve();
        });
    }

    private refactorLinks(relativePath: string, text: string): string {
        let rText = text;
        const matcher = /\[([\/\\a-z0-9_\.\-]*)\]\(([a-z0-9_\-\/\\\.]*)\)/gi;
        let match;
        while (match = matcher.exec(text)) {
            let title = match[1];
            let pageName = match[2];
            let args = [{ path: `${relativePath}/${pageName}` }];
            const commandUri = `[${title}](command:amiga-assembly.showdoc?${encodeURIComponent(JSON.stringify(args))})`;
            rText = rText.replace(match[0], commandUri);
        }
        return rText;
    }

    public loadDescription(functionName: string): Promise<DocumentationLibraryFunction | undefined> {
        return new Promise(async (resolve, reject) => {
            let hLibFunc = this.functionsByName.get(functionName);
            if (hLibFunc && (hLibFunc.description.length === 0)) {
                let description = await hLibFunc.fileProxy.readFileText('utf8');
                // refactor the description links
                hLibFunc.description = this.refactorLinks(`libs/${hLibFunc.libraryName}`, description);
            }
            resolve(hLibFunc);
        });
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
    registersManager: DocumentationRegistersManager;
    libraryManager: DocumentationLibraryManager;
    relevantKeywordsMap: Map<string, Array<DocumentationElement>>;
    constructor(extensionPath: string) {
        this.instructionsManager = new DocumentationInstructionsManager(extensionPath);
        this.registersManager = new DocumentationRegistersManager(extensionPath);
        this.libraryManager = new DocumentationLibraryManager(extensionPath);
        this.relevantKeywordsMap = new Map<string, Array<DocumentationElement>>();
    }

    public load(): Promise<void> {
        if (!this.isLoaded) {
            return new Promise(async (resolve, _) => {
                await Promise.all([this.instructionsManager.load(),
                this.registersManager.load(),
                this.libraryManager.load()]);
                for (const [key, value] of this.instructionsManager.entriesByName()) {
                    this.addRelevantKeywordElements(key, value);
                }
                for (const [key, value] of this.registersManager.entriesByName()) {
                    this.addRelevantKeywordElements(key, value);
                }
                for (const [key, value] of this.libraryManager.functionsByName.entries()) {
                    this.addRelevantKeywordElements(key, value);
                }
                this.isLoaded = true;
                resolve();
            });
        } else {
            return Promise.resolve();
        }
    }

    private addRelevantKeywordElements(key: string, element: DocumentationElement) {
        let lKey = key.toUpperCase();
        let lElements = this.relevantKeywordsMap.get(lKey);
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
    public getRegisterByAddress(address: string): Promise<DocumentationRegister | undefined> {
        return this.registersManager.getRegistersByAddress(address);
    }
    public getRegisterByName(name: string): Promise<DocumentationRegister | undefined> {
        return this.registersManager.getRegistersByName(name);
    }
    public getFunction(functionName: string): Promise<DocumentationLibraryFunction | undefined> {
        return this.libraryManager.loadDescription(functionName);
    }

    /**
     * Returns the description for a keyword
     * @param keyword Word to search
     * @return Description
     */
    public get(keyword: string): Promise<string | null> {
        return new Promise(async (resolve, _reject) => {
            let value: DocumentationElement | undefined;
            if (keyword.length > 0) {
                value = await this.getRegisterByAddress(keyword);
                if (!value) {
                    value = await this.getRegisterByName(keyword);
                    if (!value) {
                        let newKeyword = keyword;
                        let pos = newKeyword.indexOf('(');
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
                resolve(value.description);
            } else {
                resolve(null);
            }
        });
    }
    /**
     * Seeks for a keyword starting with 
     * @param keyword Keyword part
     * @return Array of keywords
     */
    public findKeywordStartingWith(keyword: string): Promise<Array<DocumentationElement>> {
        return new Promise(async (resolve, _reject) => {
            let values = new Array<DocumentationElement>();
            let upper = keyword.toUpperCase();
            if (upper.startsWith("_LVO")) {
                upper = upper.substring(4);
            }
            for (const key of this.relevantKeywordsMap.keys()) {
                if (key.startsWith(upper)) {
                    let keywordValues = this.relevantKeywordsMap.get(key);
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
            resolve(values);
        });
    }
}