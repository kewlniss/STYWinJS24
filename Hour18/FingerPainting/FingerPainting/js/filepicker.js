"use strict";
(function () {

    WinJS.Namespace.define("STYWin.FilePicker", {
        selectFile: selectFile
    });

    function canShowPicker() {
        var retVal = true;
        var vm = Windows.UI.ViewManagement;
        // Verify that we are currently not snapped,
        // or that we can unsnap to open the picker
        var currentState = vm.ApplicationView.value;
        if (currentState === vm.ApplicationViewState.snapped &&
            !Windows.UI.ViewManagement.ApplicationView.tryUnsnap()) {
            // Fail silently if we can't unsnap
            retVal = false;
        }

        return retVal;
    }

    function selectFile() {

        if (STYWin.Utilities.asyncFlag) {
            return;
        }

        if (!canShowPicker())
            return;

        var pickers = Windows.Storage.Pickers;

        var fileOpenPicker = new pickers.FileOpenPicker();
        fileOpenPicker.commitButtonText = "Set Background";
        fileOpenPicker.suggestedStartLocation =
                                pickers.PickerLocationId.picturesLibrary;

        fileOpenPicker.viewMode = pickers.PickerViewMode.thumbnail;

        fileOpenPicker.fileTypeFilter.replaceAll([".jpg",".bmp",".gif",".png"]);
        fileOpenPicker.pickSingleFileAsync().then(function (file) {
            if (file) {
                STYWin.ArtBoard.setBackgroundImage(file);
            }
        }, STYWin.Utilities.asyncError);
    }

})();