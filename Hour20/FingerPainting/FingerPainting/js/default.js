// For an introduction to the Split template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=232447
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;
    WinJS.strictProcessing();

    var shareOperation;

    app.addEventListener("activated", function (args) {

        if (args.detail.kind === activation.ActivationKind.launch) {

            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }

            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.

                STYWin.SessionState.brushSize = app.sessionState.brushSize;

                STYWin.SessionState.selectedColor = app.sessionState.selectedColor;
                STYWin.SessionState.unsavedImage = app.sessionState.unsavedImage;

            }

            args.setPromise(WinJS.UI.processAll().then(function () {
                if (nav.location) {
                    nav.history.current.initialPlaceholder = true;
                    return nav.navigate(nav.location, nav.state);
                } else {
                    return nav.navigate(Application.navigator.home);
                }
            }).then(function () {

                WinJS.Binding.processAll();

                STYWin.AppBar.init();
            }));
        }
    });

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;

        app.sessionState.brushSize = STYWin.SessionState.brushSize;

        app.sessionState.selectedColor = STYWin.SessionState.selectedColor;
        app.sessionState.unsavedImage = STYWin.SessionState.unsavedImage;

        //on artboard and have an unsaved Image?
        if (STYWin.SessionState.unsavedImage && document.getElementById("artboard")) {

            var sto = Windows.Storage;
            var cco = sto.CreationCollisionOption;
            var appData = sto.ApplicationData.current;
            var folder = appData.localFolder;
            var storageFile = "wip.png";


            return folder.createFileAsync(storageFile, cco.replaceExisting)
                .then(function (file) {
                    return STYWin.FileSaver.writeOutImage(file, false);
                });
        }

    };

    app.start();
})();
