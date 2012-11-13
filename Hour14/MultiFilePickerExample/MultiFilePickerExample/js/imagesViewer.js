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

function loadImages(files) {
    var list = [];
    var i;
    for (i = 0; i < files.length; i++) {
        var imageBlob = URL.createObjectURL(files[i], { oneTimeOnly: true });

        Windows.Storage.AccessCache.StorageApplicationPermissions.futureAccessList.add(files[i]);

        list.push({
            path: imageBlob,
            name: files[i].name,
            displayName: files[i].displayName
        });
    }

    var dataList = new WinJS.Binding.List(list);

    var flipView = document.getElementById("flipView").winControl;
    flipView.itemDataSource = dataList.dataSource;
}

    function selectMultipleFiles(files) {
        var pickers = Windows.Storage.Pickers;

        if (!canShowPicker())
            return;

        var fileOpenPicker = new pickers.FileOpenPicker();
        fileOpenPicker.commitButtonText = "View Photos";
        fileOpenPicker.suggestedStartLocation =
                            pickers.PickerLocationId.picturesLibrary;

        fileOpenPicker.viewMode = pickers.PickerViewMode.thumbnail;

        fileOpenPicker.fileTypeFilter.replaceAll(
                                        [".jpg", ".bmp", ".gif", ".png"]);
        fileOpenPicker.pickMultipleFilesAsync().then(function (files) {
            if (files && files.length > 0) {
                loadImages(files);
            }
        });
    }

    WinJS.Namespace.define("STYMetro", {
        selectMultipleFiles: selectMultipleFiles
    });

})();
