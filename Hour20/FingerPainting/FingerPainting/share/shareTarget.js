"use strict";
(function () {

    var app = WinJS.Application;
    var share;
    WinJS.strictProcessing();

    WinJS.Application.addEventListener("shareready", shareReady, false);

    // This function responds to all application activations.
    app.onactivated = function (args) {
        if (args.detail.kind === Windows.ApplicationModel.Activation
                                                .ActivationKind.shareTarget) {

            args.setPromise(WinJS.UI.processAll());

            share = args.detail.shareOperation;

            document.querySelector(".shared-title").innerText =
                         share.data.properties.title;
            document.querySelector(".shared-description").innerText =
                                     share.data.properties.description;

            document.querySelector(".shared-status").innerText =
                                    "Receiving Image ... ";

            WinJS.Application.queueEvent({ type: "shareready" });
        }
    };

    app.start();

    function shareReady(evt) {

        if (share.data.contains(Windows.ApplicationModel.DataTransfer
                                            .StandardDataFormats.bitmap)) {
            share.data.getBitmapAsync()
                .done(function (bitmapStreamReference) {
                    bitmapStreamReference.openReadAsync()
                        .done(function (bitmapStream) {
                            if (bitmapStream) {
                                var blob = MSApp.createBlobFromRandomAccessStream(
                                                bitmapStream.contentType, bitmapStream);
                                document.querySelector(".shared-thumbnail").src =
                                        URL.createObjectURL(bitmapStream,
                                                        { oneTimeOnly: true });

                                var sto = Windows.Storage;
                                var cco = sto.CreationCollisionOption;
                                var appData = sto.ApplicationData.current;
                                var folder = appData.localFolder;
                                var storageFile = "received.png";

                                var saveStream = null;

                                return folder.createFileAsync(storageFile,
                                    cco.replaceExisting)
                                .then(function (file) {
                                    return file.openAsync(sto.FileAccessMode.readWrite);

                                }).then(function (stream) {
                                    saveStream = stream;

                                    return sto.Streams.RandomAccessStream.copyAsync(
                                        blob.msDetachStream(), saveStream);
                                }).then(function () {
                                    // since we return the promise, it will be executed
                                    //before the following .done
                                    return saveStream.flushAsync();
                                },
                                function (e) {
                                    reportCompleted("Couldn't Save " + e.toString(), "Error");
                                }).done(function (result) {
                                    saveStream.close();

                                    setTimeout(function () {
                                        reportCompleted("Successfully Received Image!");
                                    }, 1500);

                                },
                                    function (e) {
                                        if (saveStream) {
                                            saveStream.close();
                                        }

                                        reportCompleted("Couldn't Save " + e.toString(),
                                                                                    "Error");

                                    });

                            }
                        });
                });
        }
        else {
            reportCompleted("Item Being Shared is Not an Image", "Error");
        }
    }

    function reportCompleted(status, error) {
        document.querySelector(".sharecontrols").style.display = "none";
        document.querySelector(".shared-status").innerText = status;

        setTimeout(function () {
            if (error == "Error") {
                share.reportError(status);
            } else {
                share.reportCompleted();
            }
        }, 1500);
    }


})();
