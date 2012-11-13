"use strict";
(function () {

    function hideAppBar() {
        var appBar = document.getElementById("appbar").winControl;
        appBar.hide();

        var customAppBarDiv = document.getElementById("customLayoutAppBar");
        if (customAppBarDiv !== undefined) {
            var customAppBar = customAppBarDiv.winControl;
            customAppBar.hide();
        }
    }

    function init() {

        document.getElementById("cmdLoad")
            .addEventListener("click", STYWin.FilePicker.selectFile, false);

        document.getElementById("cmdTakePicture")
            .addEventListener("click", STYWin.Camera.takePicture, false);
        
    }

    WinJS.Namespace.define("STYWin.AppBar", {
        hide: hideAppBar,
        init: init
    });

})();