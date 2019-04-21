var image = null;
var animate = null;
(function () {
    // Inside a webview script
    const vscode = acquireVsCodeApi();
    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent
        if (message.command === 'showImage') {
            console.log("showImage = " + message.image)
            image = message.image;
            animate = message.animate;
            vscode.setState({ image: image, animate: animate });
            loadIffImage(message.image, 'iff_canvas', message.animate);
        }
    });
    // Check if we have an old state to restore from
    const previousState = vscode.getState();
    if (previousState) {
        console.log("previous = " + previousState.image + "/   " + previousState.animate);
        image = previousState.image;
        animate = previousState.animate;
        loadIffImage(image, 'iff_canvas', animate);
    }
}());