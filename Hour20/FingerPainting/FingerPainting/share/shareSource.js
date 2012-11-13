"use strict";
(function () {

    WinJS.Namespace.define("STYWin.Share", {
        registerForShareSourceContract: registerForShareSourceContract,
        unregisterForShareSourceContract: unregisterForShareSourceContract
    });

    var dataTransferManager = Windows.ApplicationModel.DataTransfer
                                .DataTransferManager.getForCurrentView();


    function registerForShareSourceContract() {
        dataTransferManager.addEventListener(
            "datarequested", dataRequested);
    }

    function unregisterForShareSourceContract() {
        dataTransferManager.removeEventListener(
            "datarequested", dataRequested);
    }

    var imageFile;
    function dataRequested(evt) {
        var request = evt.request;

        // Title is required
        var dataPackageTitle = "FingerPainting Artwork";
        request.data.properties.title = dataPackageTitle;

        // The description is optional.
        var dataPackageDescription = "Look at this cool painting I created with "
                + "the FingerPainting app on Windows!";
        request.data.properties.description = dataPackageDescription;

        var sdf = Windows.ApplicationModel.DataTransfer.StandardDataFormats;
        request.data.setDataProvider(sdf.bitmap, onDeferredImageRequested);
    }

    function onDeferredImageRequested(request) {

        var deferral = request.getDeferral();

        var sto = Windows.Storage;
        var cco = sto.CreationCollisionOption;
        var appData = sto.ApplicationData.current;
        var folder = appData.localFolder;
        var storageFile = "share.png";
        var imageFile;

        folder.createFileAsync(storageFile, cco.replaceExisting)
        .then(function (file) {
            imageFile = file;

            return STYWin.FileSaver.writeOutImage(file, false);

        }).then(function () {
            if (imageFile) {

                var streamReference = sto.Streams.RandomAccessStreamReference
                                                        .createFromFile(imageFile);

                request.setData(streamReference);
                deferral.complete();
            }

        }, function (err) {
            deferral.complete();
        });
    }

})();
