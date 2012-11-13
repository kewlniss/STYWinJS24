"use strict";
(function () {

    function canShowPicker() {
        var retVal = true;
        var viewManagement = Windows.UI.ViewManagement;
        var currentState = viewManagement.ApplicationView.value;
        if (currentState === viewManagement.ApplicationViewState.snapped &&
            !viewManagement.ApplicationView.tryUnsnap()) {
            // Fail silently if we can't unsnap
            retVal = false;
        }

        return retVal;
    }

    function saveImage() {
        if (!canShowPicker())
            return;

        try {
            var pickers = Windows.Storage.Pickers;
            var picker = new pickers.FileSavePicker();
            picker.suggestedStartLocation =
                pickers.PickerLocationId.picturesLibrary;
            picker.viewMode = pickers.PickerViewMode.thumbnail;

            picker.fileTypeChoices.insert("GIF file", [".gif"]);
            picker.fileTypeChoices.insert("PNG file", [".png"]);
            picker.fileTypeChoices.insert("BMP file", [".bmp"]);
            picker.fileTypeChoices.insert("JPG file", [".jpg"]);
            picker.defaultFileExtension = ".png";
            picker.pickSaveFileAsync()
                .done(writeOutImage, STYWin.Utilities.asyncError);
        }
        catch (e) {
            STYWin.Messages.displayError("save" + e.toString());
        }
    }


    function writeOutImage(storageFile, store) {

        if (!storageFile)
            return;

        if (store == null)
            store = true;

        if (store) {
            Windows.Storage.AccessCache.StorageApplicationPermissions
                .mostRecentlyUsedList.add(storageFile, storageFile.name);
        }

        var canvas = document.getElementById("artboard");
        var blob = canvas.msToBlob();
        var saveStream = null;
        var sto = Windows.Storage;

        return storageFile.openAsync(sto.FileAccessMode.readWrite)
            .then(function (stream) {
                saveStream = stream;

                return sto.Streams.RandomAccessStream.copyAsync(
                    blob.msDetachStream(), saveStream);
            }).then(function () {

                if (store) {
                    STYWin.SessionState.unsavedImage = false;
                }

                // since we return the promise, it will be executed
                //before the following .done
                return saveStream.flushAsync();
            },
            function (e) {
                // errors occurred during saveAsync are reported as catastrophic.
                // for us it just means we could not save the file,
                //so we throw a different error.
                throw new Error("saveAsync");
            }).then(function (result) {
                STYWin.Messages.displayStatus("File saved!", "Success");

                var appbar = document.getElementById("appbar").winControl;
                appbar.hide();

                // output stream is IClosable interface
                //and requires explicit close
                saveStream.close();

                return result;
            },
                function (e) {
                    STYWin.Messages.displayStatus("save " + e.toString(), "Error");

                    // if the error occurred after the stream was opened,
                    //close the stream                
                    if (saveStream) {
                        saveStream.close();
                    }
                });

    }

    WinJS.Namespace.define("STYWin.FileSaver", {
        saveImage: saveImage,
        writeOutImage: writeOutImage
    });

})();
