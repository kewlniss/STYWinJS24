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

    function selectFile() {

        if (!canShowPicker())
            return;

        var pickers = Windows.Storage.Pickers;

        var fileOpenPicker = new pickers.FileOpenPicker();
        fileOpenPicker.commitButtonText = "View Photo";
        fileOpenPicker.suggestedStartLocation =
                                pickers.PickerLocationId.picturesLibrary;

        fileOpenPicker.viewMode = pickers.PickerViewMode.thumbnail;

        fileOpenPicker.fileTypeFilter.replaceAll([".jpg", ".bmp", ".gif", ".png"]);
        fileOpenPicker.pickSingleFileAsync().then(function (file) {
            if (file) {
                displayFile(file);
            }
        });
    }

    function displayFile(file) {
        var img = document.querySelector("img");
        img.style.visibility = "hidden";

        var imageBlob = URL.createObjectURL(file, { oneTimeOnly: true });

        img.addEventListener("load", function () {
            img.style.visibility = "visible";
        }, false);

        img.src = imageBlob;
    }

    WinJS.Namespace.define("STYWin", {
        selectFile: selectFile
    });

})();