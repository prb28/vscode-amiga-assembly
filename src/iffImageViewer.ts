import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Manages iff image view webview panels
 */
export class IFFViewerPanel {
    public static views = new Map<vscode.WebviewPanel, IFFViewerPanel>();
    public static readonly VIEW_TYPE = 'iffView';
    private static readonly SCRIPTS_PATH = 'webviews/iffviewer';

    private readonly panel: vscode.WebviewPanel;
    private readonly extensionPath: string;
    private disposables: vscode.Disposable[] = [];
    private image: vscode.Uri;
    private animate: boolean;

    public static create(extensionPath: string, image: vscode.Uri): Promise<void> {
        return new Promise((resolve, _reject) => {
            const column = vscode.window.activeTextEditor
                ? vscode.window.activeTextEditor.viewColumn
                : undefined;

            // And restrict the webview to only loading content from our extension's `media` directory.
            let localResourceRoots = [vscode.Uri.file(path.join(extensionPath, IFFViewerPanel.SCRIPTS_PATH))];
            let folders = vscode.workspace.workspaceFolders;
            if (folders && folders.length) {
                for (let folder of folders) {
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

            let view = new IFFViewerPanel(panel, extensionPath, image);
            IFFViewerPanel.views.set(panel, view);
            resolve();
        });
    }

    public static revive(panel: vscode.WebviewPanel, extensionPath: string, state: any) {
        let viewer = IFFViewerPanel.views.get(panel);
        if (viewer) {
            viewer.update();
        } else {
            IFFViewerPanel.views.set(panel, new IFFViewerPanel(panel, extensionPath, vscode.Uri.parse(state.image)));
        }
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

    public dispose() {
        IFFViewerPanel.views.delete(this.panel);

        // Clean up our resources
        this.panel.dispose();

        while (this.disposables.length) {
            const x = this.disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private update() {
        this.panel.title = path.basename(this.image.fsPath);
        this.panel.webview.html = this.getHtmlForWebview();
        this.panel.webview.postMessage({ command: 'showImage', image: this.image.with({ scheme: 'vscode-resource' }).toString(), animate: this.animate });
    }

    private getHtmlForWebview() {
        // Local path to main script run in the webview
        let scriptPathOnDisk = vscode.Uri.file(
            path.join(this.extensionPath, IFFViewerPanel.SCRIPTS_PATH, 'jdataview.min.js')
        );
        const jdataviewjsUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });
        scriptPathOnDisk = vscode.Uri.file(
            path.join(this.extensionPath, IFFViewerPanel.SCRIPTS_PATH, 'iff.min.js')
        );
        const iffjsUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });
        scriptPathOnDisk = vscode.Uri.file(
            path.join(this.extensionPath, IFFViewerPanel.SCRIPTS_PATH, 'main.js')
        );
        // And the uri we use to load this script in the webview
        const mainUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });
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