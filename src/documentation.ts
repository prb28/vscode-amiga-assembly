import * as fs from 'fs';
import * as path from 'path';

/**
 * Class to manage the instructions
 */
export class HoverInstructionsManager {
    instructions = new Map<string, Array<HoverInstruction>>();
    constructor() {
        // Read the instructions file
        // Creating the relative path to find the test file
        const filePath = path.join(__dirname, "..", "docs", "intructionsset.csv");
        var lines = fs.readFileSync(filePath, 'utf8').split(/\r\n|\r|\n/g);
        var lineIndex = 0;
        for (let line of lines) {
            if (line.length > 0) {
                let hi = HoverInstruction.parse(line);
                if (hi) {
                    let list = this.instructions.get(hi.instruction);
                    if (!list) {
                        list = new Array<HoverInstruction>();
                    }
                    list.push(hi);
                    this.instructions.set(hi.instruction, list);
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
export class HoverInstruction {
    instruction: string = "";
    decription: string = "";
    syntax: string = "";
    size: string = "";
    x: string = "";
    n: string = "";
    z: string = "";
    v: string = "";
    c: string = "";
    /**
     * Constructor
     */
    constructor() {
        // Empty...
    }
    /**
     * Function to parse a line and create a HoverInstruction
     * 
     * @param cvsLine The line to parse
     * @return HoverInstruction if the parse succeded or null
     */
    static parse(csvLine: string): any {
        let hi = new HoverInstruction();
        let elements = csvLine.split(";");
        if (elements.length < 9) {
            return null;
        } else {
            hi.instruction = elements[0];
            hi.decription = elements[1];
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
export class HoverRegistersManager {
    registersByName = new Map<string, HoverRegister>();
    registersByAddress = new Map<string, HoverRegister>();
    constructor() {
        // Read the registers file
        // Creating the relative path to find the test file
        const dirPath = path.join(__dirname, "..", "docs", "hardware");
        fs.readdirSync(dirPath).forEach(filename => {
            if (filename.endsWith(".md")) {
                let filePath = path.join(dirPath, filename);
                let description = fs.readFileSync(filePath, 'utf8');
                let elms = filename.replace(".md", "").split("_");
                if (elms.length === 2) {
                    let name = elms[1].toUpperCase();
                    let address = elms[0].toUpperCase();
                    let hr = new HoverRegister(address, name, description);
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
export class HoverRegister {
    address: string;
    name: string;
    description: string;
    /**
     * Contructor
     * @param address address of the register 
     * @param name Name
     * @param description description in markdown
     */
    constructor(address: string, name: string, description: string) {
        this.address = address;
        this.name = name;
        this.description = description;
    }
}

/**
 * Class to manage the libraries documentation
 */
export class HoverLibraryManager {
    private functionsByName = new Map<string, HoverLibraryFunction>();
    constructor() {
        // Read the registers file
        // Creating the relative path to find the test file
        const dirPath = path.join(__dirname, "..", "docs", "libs");
        fs.readdirSync(dirPath).forEach(dirName => {
            if (!dirName.startsWith(".")) {
                const librariesDirPath = path.join(dirPath, dirName);
                fs.readdirSync(librariesDirPath).forEach(filename => {
                    if (filename.endsWith(".md") && !filename.startsWith('_')) {
                        let filePath = path.join(librariesDirPath, filename);
                        let name = filename.replace(".md", "").toUpperCase();
                        let lf = new HoverLibraryFunction(dirName, name, "", filePath);
                        this.functionsByName.set(name, lf);
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
    public loadDescription(functionName: string): HoverLibraryFunction | undefined {
        let hLibFunc = this.functionsByName.get(functionName);
        if (hLibFunc) {
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
export class HoverLibraryFunction {
    libraryName: string;
    name: string;
    description: string;
    filepathname: string;
    /**
     * Contructor
     * @param libraryName Name of the library
     * @param name Name
     * @param description description in markdown
     * @param filepathname Path to the file
     */
    constructor(libraryName: string, name: string, description: string, filepathname: string) {
        this.libraryName = libraryName;
        this.name = name;
        this.description = description;
        this.filepathname = filepathname;
    }
}
