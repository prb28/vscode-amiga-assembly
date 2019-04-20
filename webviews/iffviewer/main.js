(function () {
    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent
        if (message.command === 'showImage') {
            loadIffImage(message.image, 'iff_canvas', message.animate);
        }
    });
}());