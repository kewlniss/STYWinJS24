"use strict";
(function () {

    WinJS.Namespace.define("STYWin.Utility", {
        getNextColor: WinJS.Binding.converter(getNextColor),
        showNonCriticalError: showNonCriticalError,
        viewInBrowser: viewInBrowser
    });

    var colorCount = 0;
    var colors = ["#FFBD87", "#FFE5CE", "linen", "#FFEBE8", "#FFE2B2"];
    function getNextColor() {
        colorCount++;

        return colors[(colorCount - 1) % colors.length];
    }

    function showNonCriticalError(message) {

        var nonCriticalError = document.getElementById("nonCriticalError").winControl;
        document.getElementById("errormessage").innerHTML =
            "<b>An Error Occurred: " + message + "</b>";

        nonCriticalError.show(document.querySelector("header"));
    }

    function viewInBrowser(evt) {
        var uriToLaunch = STYWin.SessionState.postLink;
        var uri = new Windows.Foundation.Uri(uriToLaunch);

        var launcherOptions = new Windows.System.LauncherOptions();
        launcherOptions.treatAsUntrusted = true;

        Windows.System.Launcher.launchUriAsync(uri, launcherOptions).then(
            function (success) {
                if (success) {
                    //good
                } else {
                    //bad
                }
            });
    }


})();
