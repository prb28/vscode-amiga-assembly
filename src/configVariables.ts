import * as vscode from "vscode";
import * as path from "path";
import { ExtensionState } from "./extension";

interface Context {
  workspaceFolders?: vscode.WorkspaceFolder[];
  activeTextEditor?: vscode.TextEditor;
  configuration?: vscode.WorkspaceConfiguration;
  environmentVariables?: Record<string, string>;
  extensionState?: ExtensionState;
}

/**
 * Expand variable tokens in a config string.
 *
 * @see {@link https://code.visualstudio.com/docs/editor/variables-reference|Variables reference}
 *
 * The built-in logic in vscode only applies to specific properties and is not currently exposed in the public API
 * https://github.com/Microsoft/vscode/issues/46471
 *
 * For now we need to re-create the behaviour in order to apply it to custom properties.
 *
 * Supported variables:
 * - ${env:Name} - environment variable
 * - ${config:Name} - configuration key name
 * - ${workspaceFolder} - the path of the folder opened in VS Code
 * - ${workspaceFolderBasename} - the name of the folder opened in VS Code without any slashes (/)
 * - ${file} - the current opened file
 * - ${fileWorkspaceFolder} - the current opened file's workspace folder
 * - ${relativeFile} - the current opened file relative to workspaceFolder
 * - ${relativeFileDirname} - the current opened file's dirname relative to workspaceFolder
 * - ${fileBasename} - the current opened file's basename
 * - ${fileBasenameNoExtension} - the current opened file's basename with no file extension
 * - ${fileDirname} - the current opened file's dirname
 * - ${fileExtname} - the current opened file's extension
 * - ${cwd} - current working directory
 * - ${lineNumber} - the current selected line number in the active file
 * - ${selectedText} - the current selected text in the active file
 * - ${pathSeparator} - the character used by the operating system to separate components in file paths
 *
 * Custom properties
 * - ${extensionResourcesFolder} - Directory containing the resources
 * - ${platformName} - name of the current platform os
 * @param str String to process
 * @param recursive Apply substitutions recursively?
 * @param ctx Context
 *
 * @return Processed string
 */
export function substituteVariables(
  str: string,
  recursive = false,
  ctx?: Context
) {
  // Allow context to be set explicitly for testing, default to global state.
  const workspaceFolders =
    ctx?.workspaceFolders ?? vscode.workspace.workspaceFolders;
  const activeTextEditor =
    ctx?.activeTextEditor ?? vscode.window.activeTextEditor;
  const configuration =
    ctx?.configuration ?? vscode.workspace.getConfiguration();
  const environmentVariables = ctx?.environmentVariables ?? process.env;
  const extensionState = ctx?.extensionState ?? undefined;

  const workspace = workspaceFolders?.[0];
  const activeFile = activeTextEditor?.document;
  const file = activeFile?.uri.fsPath;
  const parsedPath = file ? path.parse(file) : undefined;

  // Find the workspace which contains the active file and get the relative path
  let relativeFile = file;
  let activeWorkspace = workspace;
  if (file && workspaceFolders) {
    for (const ws of workspaceFolders) {
      if (file.startsWith(ws.uri.fsPath)) {
        activeWorkspace = ws;
        relativeFile = file.replace(ws.uri.fsPath, "").substring(path.sep.length);
        break;
      }
    }
  }

  // Predefined replacements:
  const replacements: Record<string, string | undefined> = {
    workspaceFolder: workspace?.uri.fsPath,
    workspaceFolderBasename: workspace?.name,
    file,
    fileBasename: parsedPath?.base,
    fileBasenameNoExtension: parsedPath?.name,
    fileDirname: parsedPath?.dir.substring(
      parsedPath.dir.lastIndexOf(path.sep) + 1
    ),
    fileExtname: parsedPath?.ext,
    cwd: parsedPath?.dir,
    fileWorkspaceFolder: activeWorkspace?.uri.fsPath,
    relativeFile,
    relativeFileDirname: relativeFile?.substring(
      0,
      relativeFile.lastIndexOf(path.sep)
    ),
    lineNumber: activeTextEditor
      ? String(activeTextEditor.selection.start.line + 1)
      : "",
    selectedText: activeTextEditor?.document.getText(
      new vscode.Range(
        activeTextEditor.selection.start,
        activeTextEditor.selection.end
      )
    ),
    pathSeparator: path.sep
  };

  let key: keyof typeof replacements;
  for (key in replacements) {
    const pattern = new RegExp("\\${" + key + "}", "g");
    str = str.replace(pattern, replacements[key] ?? "");
  }

  // Environment variables:
  str = str.replace(/\${env:(.*?)}/g, (variable) => {
    const varName = variable.match(/\${env:(.*?)}/)?.[1];
    return varName ? environmentVariables[varName] ?? "" : "";
  });

  // Config keys:
  str = str.replace(/\${config:(.*?)}/g, (variable) => {
    const varName = variable.match(/\${config:(.*?)}/)?.[1];
    return varName ? configuration.get(varName, "") : "";
  });

  // Custom variables
  // extensionResourcesFolder
  if (extensionState) {
    const pattern = new RegExp("\\${extensionResourcesFolder}", "g");
    str = str.replace(pattern, extensionState.getResourcesPath() ?? "");
  }
  // platformName
  const pattern = new RegExp("\\${platformName}", "g");
  str = str.replace(pattern, process.platform ?? "");

  // Apply recursive replacements if enabled and string still contains any variables
  if (
    recursive &&
    str.match(
      new RegExp(
        "\\${(" +
        Object.keys(replacements).join("|") +
        "|env:(.*?)|config:(.*?))}"
      )
    )
  ) {
    str = substituteVariables(str, recursive, ctx);
  }

  return str;
}
