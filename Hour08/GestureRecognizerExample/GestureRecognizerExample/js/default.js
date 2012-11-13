// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

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

        var results = document.getElementById("results");

        var gr = new Windows.UI.Input.GestureRecognizer();

        gr.gestureSettings =
            Windows.UI.Input.GestureSettings.manipulationTranslateRailsX |
            Windows.UI.Input.GestureSettings.holdWithMouse |
            Windows.UI.Input.GestureSettings.crossSlide |
            Windows.UI.Input.GestureSettings.rightTap |
            Windows.UI.Input.GestureSettings.hold |
            Windows.UI.Input.GestureSettings.drag |
            Windows.UI.Input.GestureSettings.tap;

        gr.addEventListener('manipulationstarted', manipulationStartedHandler, false);
        gr.addEventListener('manipulationupdated', manipulationDeltaHandler, false);
        gr.addEventListener('manipulationcompleted', manipulationEndHandler, false);

        gr.addEventListener('tapped', function (evt) {
            results.value += "\ntapped";
        }, false);

        gr.addEventListener('crosssliding', function (evt) {
            results.value += "\ncross sliding";
        }, false);

        gr.addEventListener('righttapped', function (evt) {
            results.value = "";
        }, false);

        var pointerSink = document.getElementById("PointerSink");

        pointerSink.addEventListener("MSPointerDown", function (evt) {
            gr.processDownEvent(evt.currentPoint);
        }, false);

        pointerSink.addEventListener("MSPointerMove", function (evt) {
            gr.processMoveEvents(evt.intermediatePoints);
        }, false);

        pointerSink.addEventListener("MSPointerUp", function (evt) {
            gr.processUpEvent(evt.currentPoint);
        }, false);

        pointerSink.addEventListener("MSPointerCancel", function (evt) {
            gr.processUpEvent(evt.currentPoint);
        }, false);

    }

    var manipulating;

    function manipulationStartedHandler(evt) {
        manipulating = true;
        results.value = "started manipulating";
    };

    function manipulationDeltaHandler(evt) {
        results.value += "\nmanipulating";
    };

    function manipulationEndHandler(evt) {
        manipulating = false;
        results.value += "\nstopped manipulating";
    };

})();
