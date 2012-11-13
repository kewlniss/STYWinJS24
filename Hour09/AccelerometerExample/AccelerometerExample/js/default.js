// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    WinJS.strictProcessing();

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            args.setPromise(WinJS.UI.processAll());
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    app.start();

    document.addEventListener("DOMContentLoaded", init, false);

    function init(evt) {
        var accelerometer = Windows.Devices.Sensors.Accelerometer.getDefault();
        if (accelerometer) {
            accelerometer.addEventListener("readingchanged", onReadingChanged);
            accelerometer.addEventListener("shaken", onShaken);
        }
    }

    function onShaken(evt) {
        var shakenResults = document.getElementById("shakenResults");
        shakenResults.innerText = "Shaken at " + evt.timestamp.toLocaleTimeString();
    }

    function onReadingChanged(evt) {
        var accelX = evt.reading.accelerationX;
        var accelY = evt.reading.accelerationY;
        var accelZ = evt.reading.accelerationZ;

        var results = document.getElementById("results");
        results.innerText = accelX.toFixed(6) + ", " + accelY.toFixed(6) + ", " + accelZ.toFixed(6);
    }

})();


