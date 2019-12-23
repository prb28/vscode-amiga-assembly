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
 * Class to manage the instructions
 */
export class DocumentationInstructionsManager {
    instructions = new Map<string, Array<DocumentationInstruction>>();
    private extensionPath: string;

    constructor(extensionPath: string) {
        this.extensionPath = extensionPath;
    }

    public load(): Promise<void> {
        return new Promise(async (resolve, _reject) => {
            // Read the instructions file
            // Creating the relative path to find the test file
            const filePath = path.join(this.extensionPath, "docs", "instructionsset.csv");
            const fileProxy = new FileProxy(Uri.file(filePath));
            let lines = (await fileProxy.readFileText('utf8')).split(/\r\n|\r|\n/g);
            let lineIndex = 0;
            for (let line of lines) {
                if (line.length > 0) {
                    let hi = DocumentationInstruction.parse(line);
                    if (hi) {
                        let key = hi.name.toUpperCase();
                        let list = this.instructions.get(key);
                        if (!list) {
                            list = new Array<DocumentationInstruction>();
                        }
                        list.push(hi);
                        this.instructions.set(key, list);
                    } else {
                        console.error("Error parsing file 'instructionsset.csv' on line [" + lineIndex + "]: '" + line + "'");
                    }
                }
                lineIndex += 1;
            }
            resolve();
        });
    }
}

/**
 * Class representing an instruction
 */
export class DocumentationInstruction extends DocumentationElement {
    syntax: string = "";
    size: string = "";
    x: string = "";
    n: string = "";
    z: string = "";
    v: string = "";
    c: string = "";
    constructor() {
        super();
        this.type = DocumentationType.INSTRUCTION;
    }
    /**
     * Function to parse a line and create a HoverInstruction
     * 
     * @param cvsLine The line to parse
     * @return HoverInstruction if the parse succeeded or null
     */
    static parse(csvLine: string): any {
        let hi = new DocumentationInstruction();
        let elements = csvLine.split(";");
        if (elements.length < 9) {
            return null;
        } else {
            hi.name = elements[0].toLowerCase();
            hi.description = elements[1];
            hi.syntax = elements[2];
            hi.size = elements[3].replace("-", "");
            hi.x = elements[4];
            hi.n = elements[5];
            hi.z = elements[6];
            hi.v = elements[7];
            hi.c = elements[8];
            return hi;
        }
    }
}

/**
 * Class to manage the registers
 */
export class DocumentationRegistersManager {
    private registersByName = new Map<string, DocumentationRegister>();
    private registersByAddress = new Map<string, DocumentationRegister>();
    private extensionPath: string;
    constructor(extensionPath: string) {
        this.extensionPath = extensionPath;
    }

    public load(): Promise<void> {
        return new Promise(async (resolve, _reject) => {
            // Read the registers file
            // Creating the relative path to find the test file
            const dirPath = path.join(this.extensionPath, "docs", "hardware");
            const dirProxy = new FileProxy(Uri.file(dirPath));
            let files = await dirProxy.listFiles();
            files.forEach(fileProxy => {
                let filename = fileProxy.getName();
                if (filename.endsWith(".md")) {
                    let elms = filename.replace(".md", "").split("_");
                    if (elms.length === 2) {
                        let filePath = path.join(dirPath, filename);
                        let name = elms[1].toUpperCase();
                        let address = elms[0].toUpperCase();
                        let hr = new DocumentationRegister(address, name, filePath);
                        this.registersByAddress.set(address, hr);
                        this.registersByName.set(name, hr);
                    }
                }
            });
            resolve();
        });
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
                let fProxy = new FileProxy(Uri.file(this.filename));
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
            const dirProxy = new FileProxy(Uri.file(dirPath));
            let files = await dirProxy.listFiles();
            files.forEach(async fileProxy => {
                let dirName = fileProxy.getName();
                if (!dirName.startsWith(".")) {
                    let childFiles = await fileProxy.listFiles();
                    childFiles.forEach(childFile => {
                        let childFileName = childFile.getName();
                        if (childFileName.endsWith(".md") && !childFileName.startsWith('_')) {
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
                this.libraryManager.load()]).then(() => {
                    for (const [key, value] of this.instructionsManager.instructions.entries()) {
                        this.addRelevantKeywordElements(key, value[0]);
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

    public getInstruction(instruction: string): DocumentationInstruction[] | undefined {
        return this.instructionsManager.instructions.get(instruction.toUpperCase());
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