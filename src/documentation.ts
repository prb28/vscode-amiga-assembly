import * as fs from 'fs';
import * as path from 'path';

export enum DocumentationType {
    UNKNHOWN,
    INSTRUCTION,
    REGISTER,
    FUNCTION
}
export class DocumentationElement {
    name: string = "";
    description: string = "";
    type: DocumentationType = DocumentationType.UNKNHOWN;
}
/**
 * Class to manage the instructions
 */
export class DocumentationInstructionsManager {
    instructions = new Map<string, Array<DocumentationInstruction>>();
    constructor(extensionPath: string) {
        // Read the instructions file
        // Creating the relative path to find the test file
        const filePath = path.join(extensionPath, "docs", "intructionsset.csv");
        let lines = fs.readFileSync(filePath, 'utf8').split(/\r\n|\r|\n/g);
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
                    console.error("Error parsing file 'intructionsset.csv' on line [" + lineIndex + "]: '" + line + "'");
                }
            }
            lineIndex += 1;
        }
    }
}

/**
 * Class reprensenting an instruction
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
     * @return HoverInstruction if the parse succeded or null
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
    registersByName = new Map<string, DocumentationRegister>();
    registersByAddress = new Map<string, DocumentationRegister>();
    constructor(extensionPath: string) {
        // Read the registers file
        // Creating the relative path to find the test file
        const dirPath = path.join(extensionPath, "docs", "hardware");
        fs.readdirSync(dirPath).forEach(filename => {
            if (filename.endsWith(".md")) {
                let filePath = path.join(dirPath, filename);
                let description = fs.readFileSync(filePath, 'utf8');
                let elms = filename.replace(".md", "").split("_");
                if (elms.length === 2) {
                    let name = elms[1].toUpperCase();
                    let address = elms[0].toUpperCase();
                    let hr = new DocumentationRegister(address, name, description);
                    this.registersByAddress.set(address, hr);
                    this.registersByName.set(name, hr);
                }
            }
        });
    }
}

/**
 * Class reprensenting a register
 */
export class DocumentationRegister extends DocumentationElement {
    address: string;
    /**
     * Contructor
     * @param address address of the register 
     * @param name Name
     * @param description description in markdown
     */
    constructor(address: string, name: string, description: string) {
        super();
        this.address = address;
        this.name = name;
        this.description = description;
        this.type = DocumentationType.REGISTER;
    }
}

/**
 * Class to manage the libraries documentation
 */
export class DocumentationLibraryManager {
    public functionsByName = new Map<string, DocumentationLibraryFunction>();
    constructor(extensionPath: string) {
        // Read the registers file
        // Creating the relative path to find the test file
        const dirPath = path.join(extensionPath, "docs", "libs");
        fs.readdirSync(dirPath).forEach(dirName => {
            if (!dirName.startsWith(".")) {
                const librariesDirPath = path.join(dirPath, dirName);
                fs.readdirSync(librariesDirPath).forEach(filename => {
                    if (filename.endsWith(".md") && !filename.startsWith('_')) {
                        let filePath = path.join(librariesDirPath, filename);
                        let name = filename.replace(".md", "");
                        let lf = new DocumentationLibraryFunction(dirName, name, "", filePath);
                        this.functionsByName.set(name.toUpperCase(), lf);
                    }
                });
            }
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
    public loadDescription(functionName: string): DocumentationLibraryFunction | undefined {
        let hLibFunc = this.functionsByName.get(functionName);
        if (hLibFunc && (hLibFunc.description.length === 0)) {
            let description = fs.readFileSync(hLibFunc.filepathname, 'utf8');
            // refactor the description links
            hLibFunc.description = this.refactorLinks(`libs/${hLibFunc.libraryName}`, description);
        }
        return hLibFunc;
    }
    public size(): number {
        return this.functionsByName.size;
    }
}

/**
 * Class reprensenting a library function
 */
export class DocumentationLibraryFunction extends DocumentationElement {
    libraryName: string;
    filepathname: string;
    /**
     * Contructor
     * @param libraryName Name of the library
     * @param name Name
     * @param description description in markdown
     * @param filepathname Path to the file
     */
    constructor(libraryName: string, name: string, description: string, filepathname: string) {
        super();
        this.libraryName = libraryName;
        this.name = name;
        this.description = description;
        this.filepathname = filepathname;
        this.type = DocumentationType.FUNCTION;
    }
}

/**
 * Documentation manager manages all the documentation contents and holds the states
 */
export class DocumentationManager {
    instructionsManager: DocumentationInstructionsManager;
    registersManager: DocumentationRegistersManager;
    libraryManager: DocumentationLibraryManager;
    relevantKeywordsMap: Map<string, Array<DocumentationElement>>;
    constructor(extensionPath: string) {
        this.instructionsManager = new DocumentationInstructionsManager(extensionPath);
        this.registersManager = new DocumentationRegistersManager(extensionPath);
        this.libraryManager = new DocumentationLibraryManager(extensionPath);
        this.relevantKeywordsMap = new Map<string, Array<DocumentationElement>>();
        for (const [key, value] of this.instructionsManager.instructions.entries()) {
            this.addRelevantKeywordElements(key, value[0]);
        }
        for (const [key, value] of this.registersManager.registersByName.entries()) {
            this.addRelevantKeywordElements(key, value);
        }
        for (const [key, value] of this.libraryManager.functionsByName.entries()) {
            this.addRelevantKeywordElements(key, value);
        }
    }

    private addRelevantKeywordElements(key: string, element: DocumentationElement) {
        let lkey = key.toUpperCase();
        let lelements = this.relevantKeywordsMap.get(lkey);
        if (!lelements) {
            this.relevantKeywordsMap.set(lkey, [element]);
        } else {
            lelements.push(element);
            this.relevantKeywordsMap.set(lkey, lelements);
        }
    }

    public getInstruction(instruction: string): DocumentationInstruction[] | undefined {
        return this.instructionsManager.instructions.get(instruction.toUpperCase());
    }
    public getRegisterByAddress(address: string): DocumentationRegister | undefined {
        return this.registersManager.registersByAddress.get(address);
    }
    public getRegisterByName(name: string): DocumentationRegister | undefined {
        return this.registersManager.registersByName.get(name);
    }
    public getFunction(functionName: string): DocumentationLibraryFunction | undefined {
        return this.libraryManager.loadDescription(functionName);
    }

    /**
     * Returns the description for a keyword
     * @param keyword Word to search
     * @return Description
     */
    public get(keyword: string): string | null {
        let value: DocumentationElement | undefined;
        if (keyword.length > 0) {
            value = this.getRegisterByAddress(keyword);
            if (!value) {
                value = this.getRegisterByName(keyword);
                if (!value) {
                    let newKeyword = keyword;
                    let pos = newKeyword.indexOf('(');
                    if (pos > 0) {
                        newKeyword = newKeyword.substring(0, pos);
                    }
                    if (newKeyword.startsWith("_LVO")) {
                        newKeyword = newKeyword.substring(4);
                    }
                    value = this.getFunction(newKeyword);
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
    public findKeywordStartingWith(keyword: string): Array<DocumentationElement> {
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
                            const loaded = this.libraryManager.loadDescription(key);
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