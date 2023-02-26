import { substituteVariables } from "../configVariables";
import * as vscode from "vscode";
import * as path from "path";
import { expect } from "chai";
import { ExtensionState } from "../extension";

describe("configVariables", () => {
  describe("substituteVariables", () => {
    before(async function () {
      // activate the extension
      const ext = vscode.extensions.getExtension('prb28.amiga-assembly');
      if (ext) {
        await ext.activate();
      }
    });
    it("leaves text unchanged", () => {
      const str = "foo";
      const result = substituteVariables(str);
      expect(result).to.equal(str);
    });

    it("replaces env vars", () => {
      const str = "foo ${env:example} baz";
      const result = substituteVariables(str, true, {
        environmentVariables: { example: "bar" },
      });
      expect(result).to.equal("foo bar baz");
    });

    it("removes missing env vars", () => {
      const str = "foo  baz";
      const result = substituteVariables(str, true, {
        environmentVariables: {},
      });
      expect(result).to.equal("foo  baz");
    });

    it("replaces config vars", () => {
      const str = "foo ${config:example} baz";
      const configuration = new Map<string, string>([["example", "bar"]]);
      const result = substituteVariables(str, true, {
        configuration:
          configuration as unknown as vscode.WorkspaceConfiguration,
      });
      expect(result).to.equal("foo bar baz");
    });

    it("replaces extensionResourcesFolder", () => {
      const str = "foo ${extensionResourcesFolder} baz";
      const extensionResourcesPath = ExtensionState.getCurrent().getResourcesPath();
      const result = substituteVariables(str, true, {
        extensionState: ExtensionState.getCurrent()
      });
      expect(result).to.equal("foo " + extensionResourcesPath + " baz");
    });

    it("replaces platformName", () => {
      const str = "foo ${platformName} baz";
      const result = substituteVariables(str, true);
      expect(result).to.equal("foo " + process.platform + " baz");
    });

    it("replaces workspaceFolder", () => {
      const str = "foo ${workspaceFolder} baz";
      const result = substituteVariables(str, true, {
        workspaceFolders: [
          {
            uri: vscode.Uri.file("/example/dir"),
            name: "dir",
            index: 0,
          },
        ],
      });
      expect(result.replace(/\\/g, "/")).to.equal("foo /example/dir baz");
    });

    it("replaces workspaceFolderBasename", () => {
      const str = "foo ${workspaceFolderBasename} baz";
      const result = substituteVariables(str, true, {
        workspaceFolders: [
          {
            uri: vscode.Uri.file("/example/dir"),
            name: "dir",
            index: 0,
          },
        ],
      });
      expect(result).to.equal("foo dir baz");
    });

    it("replaces file", () => {
      const str = "foo ${file} baz";
      const result = substituteVariables(str, true, {
        workspaceFolders: [
          {
            uri: vscode.Uri.file("/example/dir"),
            name: "dir",
            index: 0,
          },
        ],
        activeTextEditor: {
          document: {
            uri: vscode.Uri.file("/example/dir/file.s"),
            getText: () => "",
          } as unknown as vscode.TextDocument,
          selection: new vscode.Selection(
            new vscode.Position(0, 0),
            new vscode.Position(0, 0)
          ),
        } as unknown as vscode.TextEditor,
      });
      expect(result.replace(/\\/g, "/")).to.equal("foo /example/dir/file.s baz");
    });

    it("replaces fileWorkspaceFolder", () => {
      const str = "foo ${fileWorkspaceFolder} baz";
      const result = substituteVariables(str, true, {
        workspaceFolders: [
          {
            uri: vscode.Uri.file("/example/dir"),
            name: "dir",
            index: 0,
          },
          {
            uri: vscode.Uri.file("/example2"),
            name: "example2",
            index: 0,
          },
        ],
        activeTextEditor: {
          document: {
            uri: vscode.Uri.file("/example2/file.s"),
            getText: () => "",
          } as unknown as vscode.TextDocument,
          selection: new vscode.Selection(
            new vscode.Position(0, 0),
            new vscode.Position(0, 0)
          ),
        } as unknown as vscode.TextEditor,
      });
      expect(result.replace(/\\/g, "/")).to.equal("foo /example2 baz");
    });

    it("replaces relativeFile", () => {
      const str = "foo ${relativeFile} baz";
      const result = substituteVariables(str, true, {
        workspaceFolders: [
          {
            uri: vscode.Uri.file("/example/dir"),
            name: "dir",
            index: 0,
          },
          {
            uri: vscode.Uri.file("/example2"),
            name: "example2",
            index: 1,
          },
        ],
        activeTextEditor: {
          document: {
            uri: vscode.Uri.file("/example2/file.s"),
            getText: () => "",
          } as unknown as vscode.TextDocument,
          selection: new vscode.Selection(
            new vscode.Position(0, 0),
            new vscode.Position(0, 0)
          ),
        } as unknown as vscode.TextEditor,
      });
      expect(result).to.equal("foo file.s baz");
    });

    it("replaces relativeFileDirname", () => {
      const str = "foo ${relativeFileDirname} baz";
      const result = substituteVariables(str, true, {
        workspaceFolders: [
          {
            uri: vscode.Uri.file("/example/dir"),
            name: "dir",
            index: 0,
          },
          {
            uri: vscode.Uri.file("/example2"),
            name: "example2",
            index: 1,
          },
        ],
        activeTextEditor: {
          document: {
            uri: vscode.Uri.file("/example2/dir/file.s"),
            getText: () => "",
          } as unknown as vscode.TextDocument,
          selection: new vscode.Selection(
            new vscode.Position(0, 0),
            new vscode.Position(0, 0)
          ),
        } as unknown as vscode.TextEditor,
      });
      expect(result).to.equal("foo dir baz");
    });

    it("replaces fileBasename", () => {
      const str = "foo ${fileBasename} baz";
      const result = substituteVariables(str, true, {
        workspaceFolders: [
          {
            uri: vscode.Uri.file("/example/dir"),
            name: "dir",
            index: 0,
          },
        ],
        activeTextEditor: {
          document: {
            uri: vscode.Uri.file("/example/dir/file.s"),
            getText: () => "",
          } as unknown as vscode.TextDocument,
          selection: new vscode.Selection(
            new vscode.Position(0, 0),
            new vscode.Position(0, 0)
          ),
        } as unknown as vscode.TextEditor,
      });
      expect(result).to.equal("foo file.s baz");
    });

    it("replaces fileBasenameNoExtension", () => {
      const str = "foo ${fileBasenameNoExtension} baz";
      const result = substituteVariables(str, true, {
        workspaceFolders: [
          {
            uri: vscode.Uri.file("/example/dir"),
            name: "dir",
            index: 0,
          },
        ],
        activeTextEditor: {
          document: {
            uri: vscode.Uri.file("/example/dir/file.s"),
            getText: () => "",
          } as unknown as vscode.TextDocument,
          selection: new vscode.Selection(
            new vscode.Position(0, 0),
            new vscode.Position(0, 0)
          ),
        } as unknown as vscode.TextEditor,
      });
      expect(result).to.equal("foo file baz");
    });

    it("replaces fileDirname", () => {
      const str = "foo ${fileDirname} baz";
      const result = substituteVariables(str, true, {
        workspaceFolders: [
          {
            uri: vscode.Uri.file("/example/dir"),
            name: "dir",
            index: 0,
          },
        ],
        activeTextEditor: {
          document: {
            uri: vscode.Uri.file("/example/dir/file.s"),
            getText: () => "",
          } as unknown as vscode.TextDocument,
          selection: new vscode.Selection(
            new vscode.Position(0, 0),
            new vscode.Position(0, 0)
          ),
        } as unknown as vscode.TextEditor,
      });
      expect(result).to.equal("foo dir baz");
    });

    it("replaces fileExtname", () => {
      const str = "foo ${fileExtname} baz";
      const result = substituteVariables(str, true, {
        workspaceFolders: [
          {
            uri: vscode.Uri.file("/example/dir"),
            name: "dir",
            index: 0,
          },
        ],
        activeTextEditor: {
          document: {
            uri: vscode.Uri.file("/example/dir/file.s"),
            getText: () => "",
          } as unknown as vscode.TextDocument,
          selection: new vscode.Selection(
            new vscode.Position(0, 0),
            new vscode.Position(0, 0)
          ),
        } as unknown as vscode.TextEditor,
      });
      expect(result).to.equal("foo .s baz");
    });

    it("replaces cwd", () => {
      const str = "foo ${cwd} baz";
      const result = substituteVariables(str, true, {
        workspaceFolders: [
          {
            uri: vscode.Uri.file("/example/dir"),
            name: "dir",
            index: 0,
          },
        ],
        activeTextEditor: {
          document: {
            uri: vscode.Uri.file("/example/dir/file.s"),
            getText: () => "",
          } as unknown as vscode.TextDocument,
          selection: new vscode.Selection(
            new vscode.Position(0, 0),
            new vscode.Position(0, 0)
          ),
        } as unknown as vscode.TextEditor,
      });
      expect(result.replace(/\\/g, "/")).to.equal("foo /example/dir baz");
    });

    it("replaces lineNumber", () => {
      const str = "foo ${lineNumber} baz";
      const result = substituteVariables(str, true, {
        workspaceFolders: [
          {
            uri: vscode.Uri.file("/example/dir"),
            name: "dir",
            index: 0,
          },
        ],
        activeTextEditor: {
          document: {
            uri: vscode.Uri.file("/example/dir/file.s"),
            getText: () => "",
          } as unknown as vscode.TextDocument,
          selection: new vscode.Selection(
            new vscode.Position(1, 0),
            new vscode.Position(1, 0)
          ),
        } as unknown as vscode.TextEditor,
      });
      expect(result).to.equal("foo 2 baz");
    });

    it("replaces selectedText", () => {
      const str = "foo ${selectedText} baz";
      const result = substituteVariables(str, true, {
        workspaceFolders: [
          {
            uri: vscode.Uri.file("/example/dir"),
            name: "dir",
            index: 0,
          },
        ],
        activeTextEditor: {
          document: {
            uri: vscode.Uri.file("/example/dir/file.s"),
            getText: () => "selected text",
          } as unknown as vscode.TextDocument,
          selection: new vscode.Selection(
            new vscode.Position(1, 0),
            new vscode.Position(1, 10)
          ),
        } as unknown as vscode.TextEditor,
      });
      expect(result).to.equal("foo selected text baz");
    });

    it("replaces pathSeparator", () => {
      const str = "foo ${pathSeparator} baz";
      const result = substituteVariables(str, true, {});
      expect(result).to.equal(`foo ${path.sep} baz`);
    });

    it("replaces recursively", () => {
      const str = "foo ${env:example} baz";
      const result = substituteVariables(str, true, {
        environmentVariables: {
          example: "${env:example2}",
          example2: "${pathSeparator}",
        },
      });
      expect(result).to.equal(`foo ${path.sep} baz`);
    });
  });
});
