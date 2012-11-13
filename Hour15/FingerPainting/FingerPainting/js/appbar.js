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

    WinJS.Namespace.define("STYWin.AppBar", {
        hide: hideAppBar
    });

})();