import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Manages iff image view webview panels
 */
export class IFFViewerPanel {
    public static readonly VIEW_TYPE = 'iffView';
    private static readonly SCRIPTS_PATH = 'webviews/iffviewer';

    private readonly panel: vscode.WebviewPanel;
    private readonly extensionPath: string;
    private disposables: vscode.Disposable[] = [];
    private image: vscode.Uri;
    private animate: boolean;

    public static async create(extensionPath: string, image: vscode.Uri): Promise<[vscode.WebviewPanel, IFFViewerPanel]> {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        // And restrict the webview to only loading content from our extension's `media` directory.
        const localResourceRoots = [vscode.Uri.file(path.join(extensionPath, IFFViewerPanel.SCRIPTS_PATH))];
        const folders = vscode.workspace.workspaceFolders;
        if (folders && folders.length) {
            for (const folder of folders) {
                localResourceRoots.push(folder.uri);
            }
        }

        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(
            IFFViewerPanel.VIEW_TYPE,
            'IFF Viewer',
            column || vscode.ViewColumn.One,
            {
                // Enable javascript in the webview
                enableScripts: true,
                localResourceRoots: localResourceRoots,
                retainContextWhenHidden: true
            }
        );

        const view = new IFFViewerPanel(panel, extensionPath, image);
        view.update();
        return [panel, view];
    }

    private constructor(panel: vscode.WebviewPanel, extensionPath: string, image: vscode.Uri) {
        this.panel = panel;
        this.extensionPath = extensionPath;
        this.image = image;
        this.animate = false;
        // Set the webview's initial html content
        this.update();

        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programmatically
        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

        // Handle messages from the webview
        this.panel.webview.onDidReceiveMessage(
            message => {
                if (message.command === 'alert') {
                    vscode.window.showErrorMessage(message.text);
                    return;
                }
            },
            null,
            this.disposables
        );
    }

    public dispose(): void {
        // Clean up our resources
        this.panel.dispose();

        while (this.disposables.length) {
            const x = this.disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    public async update(): Promise<void> {
        this.panel.title = path.basename(this.image.fsPath);
        this.panel.webview.html = this.getHtmlForWebview();
        const imageUri = this.panel.webview.asWebviewUri(this.image);
        await this.panel.webview.postMessage({ command: 'showImage', image: imageUri.toString(), animate: this.animate });
    }

    private getHtmlForWebview() {
        // Local path to main script run in the webview
        let pathOnDisk = vscode.Uri.file(
            path.join(this.extensionPath, IFFViewerPanel.SCRIPTS_PATH, 'jdataview.min.js')
        );
        const jdataviewjsUri = this.panel.webview.asWebviewUri(pathOnDisk);
        pathOnDisk = vscode.Uri.file(
            path.join(this.extensionPath, IFFViewerPanel.SCRIPTS_PATH, 'iff.min.js')
        );
        const iffjsUri = this.panel.webview.asWebviewUri(pathOnDisk);
        pathOnDisk = vscode.Uri.file(
            path.join(this.extensionPath, IFFViewerPanel.SCRIPTS_PATH, 'main.js')
        );
        // And the uri we use to load this script in the webview
        const mainUri = this.panel.webview.asWebviewUri(pathOnDisk);
        // Use a nonce to whitelist which scripts can be run
        const nonce = getNonce();

        return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <!--
                Use a content security policy to only allow loading images from https or from our extension directory,
                and only allow scripts that have a specific nonce.
                -->
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: ; script-src 'nonce-${nonce}'; connect-src vscode-resource:">

                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Cat Coding</title>
            </head>
            <body>
                <canvas id="iff_canvas"></canvas>
                <script nonce="${nonce}" src="${jdataviewjsUri}"></script>
                <script nonce="${nonce}" src="${iffjsUri}"></script>
                <script nonce="${nonce}" src="${mainUri}"></script>
            </body>            
        </html>`;
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
