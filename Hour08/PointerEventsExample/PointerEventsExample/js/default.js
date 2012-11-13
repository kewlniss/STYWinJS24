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
        var area = document.getElementById("area");

        area.addEventListener("MSPointerDown", pointerDown, false);
        area.addEventListener("MSPointerUp", pointerUp, false);
        area.addEventListener("MSPointerMove", pointerMove, false);
    }

    var inMouseClick = false;
    function pointerDown(evt) {

        if (evt.pointerType === evt.MSPOINTER_TYPE_MOUSE
            && (evt.button !== 0 || inMouseClick))
            return;
        else if (evt.pointerType === evt.MSPOINTER_TYPE_MOUSE)
            inMouseClick = true;

        var results = document.getElementById("results");

        area.msSetPointerCapture(evt.pointerId);

        area.style.backgroundColor = "blue";

        var pointerPoint = evt.getCurrentPoint(evt.target);
        var rp = pointerPoint.rawPosition;
        results.value = "Down: (" + rp.x.toFixed(2) + "," + rp.y.toFixed(2) + ")";
    }


    function pointerMove(evt) {

        //don't process if it is a mouse, but not a left click
        if (evt.pointerType === evt.MSPOINTER_TYPE_MOUSE && !inMouseClick)
            return;

        var results = document.getElementById("results");

        area.style.backgroundColor = "green";

        var pointerPoint = evt.getCurrentPoint(evt.target);
        var rp = pointerPoint.rawPosition;
        results.value = "Move: (" + rp.x.toFixed(2) + "," + rp.y.toFixed(2) + ")";
    }

    function pointerUp(evt) {
        var results = document.getElementById("results");

        area.style.backgroundColor = "red";

        results.value = "Up";

        area.msReleasePointerCapture(evt.pointerId);

        inMouseClick = false;
    }



})();
