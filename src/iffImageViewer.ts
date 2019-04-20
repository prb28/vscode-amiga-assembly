import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Manages iff image view webview panels
 */
export class IFFViewerPanel {
    /**
	 * Track the currently panel. Only allow a single panel to exist at a time.
	 */
    public static currentPanel: IFFViewerPanel | undefined;
    public static readonly VIEW_TYPE = 'iffView';
    private static readonly SCRIPTS_PATH = 'webviews/iffviewer';

    private readonly panel: vscode.WebviewPanel;
    private readonly extensionPath: string;
    private disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionPath: string, image?: vscode.Uri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        // If we already have a panel, show it.
        if (IFFViewerPanel.currentPanel) {
            IFFViewerPanel.currentPanel.update(image, false);
            IFFViewerPanel.currentPanel.panel.reveal(column);
            return;
        }

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
                localResourceRoots: localResourceRoots
            }
        );
        IFFViewerPanel.currentPanel = new IFFViewerPanel(panel, extensionPath, image);
    }

    public static revive(panel: vscode.WebviewPanel, extensionPath: string, image?: vscode.Uri) {
        IFFViewerPanel.currentPanel = new IFFViewerPanel(panel, extensionPath, image);
    }

    private constructor(panel: vscode.WebviewPanel, extensionPath: string, image?: vscode.Uri) {
        this.panel = panel;
        this.extensionPath = extensionPath;

        // Set the webview's initial html content
        this.update(image, false);

        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programatically
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
        IFFViewerPanel.currentPanel = undefined;

        // Clean up our resources
        this.panel.dispose();

        while (this.disposables.length) {
            const x = this.disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private update(image?: vscode.Uri, animate?: boolean) {
        if (image) {
            this.panel.title = path.basename(image.fsPath);
        }
        this.panel.webview.html = this.getHtmlForWebview();
        if (image && animate !== undefined) {
            this.showImage(image, animate);
        }
    }

    public showImage(image: vscode.Uri, animate: boolean) {

        this.panel.webview.postMessage({ command: 'showImage', image: image.with({ scheme: 'vscode-resource' }).toString(), animate: animate });
    }

    private getHtmlForWebview() {
        // Local path to main script run in the webview
        let scriptPathOnDisk = vscode.Uri.file(
            path.join(this.extensionPath, IFFViewerPanel.SCRIPTS_PATH, 'jdataview.js')
        );

        // And the uri we use to load this script in the webview
        const jdataviewjsUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });

        scriptPathOnDisk = vscode.Uri.file(
            path.join(this.extensionPath, IFFViewerPanel.SCRIPTS_PATH, 'iff.js')
        );

        // And the uri we use to load this script in the webview
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
                <script nonce="${nonce}" src="${jdataviewjsUri}"></script>
                <script nonce="${nonce}" src="${iffjsUri}"></script>
                <script nonce="${nonce}" src="${mainUri}"></script>
                <canvas id="iff_canvas"></canvas>
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