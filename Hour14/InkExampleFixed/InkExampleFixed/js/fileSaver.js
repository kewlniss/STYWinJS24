"use strict";
(function () {

    function canShowPicker() {
        var retVal = true;
        // Verify that we are currently not snapped, or that we can unsnap to open the picker
        var currentState = Windows.UI.ViewManagement.ApplicationView.value;
        if (currentState === Windows.UI.ViewManagement.ApplicationViewState.snapped &&
            !Windows.UI.ViewManagement.ApplicationView.tryUnsnap()) {
            // Fail silently if we can't unsnap
            retVal = false;
        }

        return retVal;
    }

    function createFile() {

        if (!canShowPicker())
            return;

        var storageFile;

        var pickers = Windows.Storage.Pickers;

        var fileSavePicker = new pickers.FileSavePicker();
        fileSavePicker.commitButtonText = "Save Image";
        fileSavePicker.suggestedStartLocation =
                                pickers.PickerLocationId.picturesLibrary;

        fileSavePicker.viewMode = pickers.PickerViewMode.thumbnail;

        fileSavePicker.defaultFileExtension = ".png";
        fileSavePicker.fileTypeChoices.insert("PNG File", [".png"]);
        return fileSavePicker.pickSaveFileAsync();
    }

    function writeOutImage(evt) {

        var storageFile;

        createFile().then(function (file) {
            if (file) {
                storageFile = file;

                var canvas = document.getElementById("canvas");
                var blob = canvas.msToBlob();
                var saveStream = null;
                var sto = Windows.Storage;

                storageFile.openAsync(sto.FileAccessMode.readWrite)
                    .then(function (stream) {
                        saveStream = stream;

                        return sto.Streams.RandomAccessStream.copyAsync(
                            blob.msDetachStream(), saveStream);
                    }).then(function () {
                        // since we return the promise, it will be executed
                        //before the following .done
                        return saveStream.flushAsync();
                    },
                    function (e) {
                        // errors occurred during saveAsync are reported as catastrophic.
                        // for us it just means we could not save the file,
                        //so we throw a different error.
                        throw new Error("saveAsync");
                    }).done(function (result) {
                        // print the size of the stream on the screen
                        displayStatus("File saved!", "Success");

                        var appbar = document.getElementById("appbar").winControl;
                        appbar.hide();

                        // output stream is IClosable interface
                        //and requires explicit close
                        saveStream.close();
                    },
                        function (e) {
                            displayStatus("save " + e.toString(), "Error");

                            // if the error occurred after the stream was opened,
                            //close the stream                
                            if (saveStream) {
                                saveStream.close();
                            }
                        });
            }
        });

    }

    function displayStatus(message, state) {

        if (state === "Error") {
            var msg = new Windows.UI.Popups.MessageDialog(message, state);
            msg.showAsync();
        }

        else {

            console.log(message);
        }
    }

    WinJS.Namespace.define("STYWin", {
        writeOutImage: writeOutImage
    });

})();