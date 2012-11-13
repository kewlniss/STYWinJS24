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
        var soSensor = Windows.Devices.Sensors.SimpleOrientationSensor;
        var simpleOrientationSensor = soSensor.getDefault();

        if (simpleOrientationSensor) {
            displayOrientation(simpleOrientationSensor.getCurrentOrientation());
            simpleOrientationSensor.addEventListener("orientationchanged",
                                                            onOrientationChanged);
        }
    }

    function onOrientationChanged(evt) {
        displayOrientation(evt.orientation);
    }

    function displayOrientation(orientation) {
        var orientationResults = document.getElementById("orientationResults");
        var so = Windows.Devices.Sensors.SimpleOrientation;
        switch (orientation) {
            case so.notRotated:
                orientationResults.innerText = "Not Rotated";
                break;
            case so.rotated90DegreesCounterclockwise:
                orientationResults.innerText = "Rotated 90";
                break;
            case so.rotated180DegreesCounterclockwise:
                orientationResults.innerText = "Rotated 180";
                break;
            case so.rotated270DegreesCounterclockwise:
                orientationResults.innerText = "Rotated 270";
                break;
            case so.faceup:
                orientationResults.innerText = "Face Up";
                break;
            case so.facedown:
                orientationResults.innerText = "Face Down";
                break;
            default:
                orientationResults.innerText = "Unknown: " + evt.orientation;
                break;
        }
    }

})();
