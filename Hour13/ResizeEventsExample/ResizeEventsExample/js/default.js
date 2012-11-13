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
})();

WinJS.Utilities.ready(function () {

    window.addEventListener("resize", updateLayout, false);

    var w, h;
    function updateLayout(evt) {

        var body = document.querySelector("body");
        body.style.backgroundColor = "red";

        w = evt.view.outerWidth;
        h = evt.view.outerHeight;

        var isSnapped = window.msMatchMedia("(max-width: 320px)").matches;

        if (isSnapped) {
            body.style.backgroundColor = "blue";
        }
    }

    var mq = window.msMatchMedia(
        "(-ms-view-state:fullscreen-landscape) and (min-width: 2560px)");
    mq.addListener(handleHighResolution);
    handleHighResolution(mq);

    function handleHighResolution(mql) {

        //this will get overridden by updateLayout on screen layout changes
        //because the resize is called after this is called
        if (mql.matches) {
            var body = document.querySelector("body");
            body.style.backgroundColor = "green";
        }
    }

});