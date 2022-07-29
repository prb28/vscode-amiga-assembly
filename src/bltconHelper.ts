import * as vscode from 'vscode';

export function createBltconHelperPanel(extensionUri: vscode.Uri): vscode.WebviewPanel {
    const panel = vscode.window.createWebviewPanel(
        'bltcon-helper',
        'BLTCON Helper',
        { viewColumn: vscode.ViewColumn.Beside },
        { enableScripts: true }
    );

    const cssPath = vscode.Uri.joinPath(extensionUri, 'webviews', 'bltcon-helper', 'style.css');
    const cssUri = panel.webview.asWebviewUri(cssPath);
    const jsPath = vscode.Uri.joinPath(extensionUri, 'webviews', 'bltcon-helper', 'main.js');
    const jsUri = panel.webview.asWebviewUri(jsPath);

    panel.webview.html = /*html*/ `<!DOCTYPE html>
        <html lang="en">
            <head>
                <link rel="stylesheet" href="${cssUri}" />
            </head>
        
            <body>
                <div class="container">
                    <div class="top-bar">
                        <div class="presets">
                            Presets:
                            <button type="button" class="preset" value="clear">
                                clear
                            </button>
                            <button type="button" class="preset" value="fill">
                                fill
                            </button>
                            <button type="button" class="preset" value="copy">
                                copy
                            </button>
                            <button type="button" class="preset" value="mask">
                                mask
                            </button>
                            <button type="button" class="preset" value="bob">
                                bob
                            </button>
                        </div>
                    </div>
                    <div class="top-bar">
                        <div class="outputs">
                            <div class="register">
                                <span class="register-name">BLTCON0:</span>
                                <input
                                    type="text"
                                    id="BLTCON0"
                                    maxlength="9"
                                    size="10"
                                />
                                <span class="exp" id="BLTCON0Exp"></span>
                            </div>
                            <div class="register">
                                <span class="register-name">BLTCON1:</span>
                                <input
                                    type="text"
                                    id="BLTCON1"
                                    maxlength="9"
                                    size="10"
                                />
                                <span class="exp" id="BLTCON1Exp"></span>
                            </div>
                        </div>
                    </div>
        
                    <div class="content">
                        <table class="minterms">
                            <thead>
                                <tr>
                                    <th rowspan="2">Minterm</th>
                                    <th colspan="3">DMA Source</th>
                                    <th>Dest</th>
                                </tr>
                                <tr>
                                    <th>
                                        <label>
                                            <div>
                                                <input
                                                    type="checkbox"
                                                    id="useSourceA"
                                                />
                                                <abbr
                                                    title="Source A is the source data you want to blit to your destination. Do not forget to initialize BLTAPT and BLTAMOD. You almost always need source A, except in 2 cases: You just want to clear the destination, You want to copy the contents of BLTADAT (to draw blazing fast vertical lines for example)"
                                                    >A</abbr
                                                >
                                            </div>
                                            <canvas
                                                id="ACvs"
                                                width="64"
                                                height="64"
                                            ></canvas>
                                        </label>
                                    </th>
                                    <th>
                                        <label>
                                            <div>
                                                <input
                                                    type="checkbox"
                                                    id="useSourceB"
                                                />
                                                <abbr
                                                    title="Source B is a secondary source you want to mix with source A. Typically a mask. Do not forget to initialize BLTBPT and BLTBMOD."
                                                    >B</abbr
                                                >
                                            </div>
                                            <canvas
                                                id="BCvs"
                                                width="64"
                                                height="64"
                                            ></canvas>
                                        </label>
                                    </th>
                                    <th>
                                        <label>
                                            <div>
                                                <input
                                                    type="checkbox"
                                                    id="useSourceC"
                                                />
                                                <abbr
                                                    title="Source C is a third source you want to mix with A and B. Often used to point to the screen (destination buffer). For example, to draw a circular Bob over a background screen, you need to use A for the bob image, use B for the bob circular mask, and use C to keep the background data outside of the mask, but inside the blit window. Do not forget to initialize BLTCPT and BLTCMOD."
                                                    >C</abbr
                                                >
                                            </div>
                                            <canvas
                                                id="CCvs"
                                                width="64"
                                                height="64"
                                            ></canvas>
                                        </label>
                                    </th>
                                    <th>
                                        <label>
                                            <div>
                                                <input
                                                    type="checkbox"
                                                    id="useDestD"
                                                    checked
                                                />
                                                <abbr
                                                    title="You need it most of the times. Some disable DMA D to perform collision detection (A & B) and no need to write to D. Then the Zero flag is read from DMACONR to know if a collision occured. Do not forget to initialize BLTDPT and BLTDMOD."
                                                    >D</abbr
                                                >
                                            </div>
                                            <canvas
                                                id="DCvs"
                                                width="64"
                                                height="64"
                                            ></canvas>
                                        </label>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th class="minterms-label" scope="row">abc</th>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <input type="checkbox" id="MINTERM0" />
                                    </td>
                                </tr>
                                <tr>
                                    <th class="minterms-label" scope="row">
                                        ab<strong>C</strong>
                                    </th>
                                    <td></td>
                                    <td></td>
                                    <td>✅</td>
                                    <td>
                                        <input type="checkbox" id="MINTERM1" />
                                    </td>
                                </tr>
                                <tr>
                                    <th class="minterms-label" scope="row">
                                        a<strong>B</strong>c
                                    </th>
                                    <td></td>
                                    <td>✅</td>
                                    <td></td>
                                    <td>
                                        <input type="checkbox" id="MINTERM2" />
                                    </td>
                                </tr>
                                <tr>
                                    <th class="minterms-label" scope="row">
                                        a<strong>BC</strong>
                                    </th>
                                    <td></td>
                                    <td>✅</td>
                                    <td>✅</td>
                                    <td>
                                        <input type="checkbox" id="MINTERM3" />
                                    </td>
                                </tr>
                                <tr>
                                    <th class="minterms-label" scope="row">
                                        <strong>A</strong>bc
                                    </th>
                                    <td>✅</td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <input type="checkbox" id="MINTERM4" />
                                    </td>
                                </tr>
                                <tr>
                                    <th class="minterms-label" scope="row">
                                        <strong>A</strong>b<strong>C</strong>
                                    </th>
                                    <td>✅</td>
                                    <td></td>
                                    <td>✅</td>
                                    <td>
                                        <input type="checkbox" id="MINTERM5" />
                                    </td>
                                </tr>
                                <tr>
                                    <th class="minterms-label" scope="row">
                                        <strong>AB</strong>c
                                    </th>
                                    <td>✅</td>
                                    <td>✅</td>
                                    <td></td>
                                    <td>
                                        <input type="checkbox" id="MINTERM6" />
                                    </td>
                                </tr>
                                <tr>
                                    <th class="minterms-label" scope="row">
                                        <strong>ABC</strong>
                                    </th>
                                    <td>✅</td>
                                    <td>✅</td>
                                    <td>✅</td>
                                    <td>
                                        <input type="checkbox" id="MINTERM7" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
        
                        <div class="options">
                            <div class="option">
                                <label>
                                    A Shift:
                                    <input
                                        type="number"
                                        id="ASHIFT"
                                        maxlength="4"
                                        size="6"
                                        value="0"
                                        min="0"
                                        max="15"
                                    />
                                </label>
                            </div>
                            <div class="option">
                                <label>
                                    B Shift:
                                    <input
                                        type="number"
                                        id="BSHIFT"
                                        maxlength="4"
                                        size="6"
                                        value="0"
                                        min="0"
                                        max="15"
                                    />
                                </label>
                            </div>
                            <div class="option">
                                <label>
                                    <input type="checkbox" id="EFE" />
                                    Exclusive fill
                                </label>
                            </div>
                            <div class="option">
                                <label>
                                    <input type="checkbox" id="IFE" />
                                    Inclusive fill
                                </label>
                            </div>
                            <div class="option">
                                <label>
                                    <input type="checkbox" id="DESC" />
                                    Descending
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="footer">
                        <p>Based on <a href="http://deadliners.net/BLTCONCheatSheet/index.html">BLTCONCheatSheet</a> by Soundy/Deadliners</p>
                    </div>
                </div>
                <script src="${jsUri}"></script>
            </body>
        </html>`;

    return panel;
}
