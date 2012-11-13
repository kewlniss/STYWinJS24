"use strict";
(function () {

    WinJS.Namespace.define("STYWin.Camera", {
        takePicture: takePicture
    });

    function takePicture() {

        if (STYWin.Utilities.asyncFlag) {
            return;
        }

        var canvas = STYWin.ArtBoard.canvas;

        var dialog = new Windows.Media.Capture.CameraCaptureUI();
        var aspectRatio = { width: canvas.width, height: canvas.height };
        dialog.photoSettings.croppedAspectRatio = aspectRatio;
        dialog.captureFileAsync(Windows.Media.Capture.CameraCaptureUIMode.photo)
           .then(STYWin.ArtBoard.setBackgroundImage, STYWin.Utilities.asyncError);
    }

})();