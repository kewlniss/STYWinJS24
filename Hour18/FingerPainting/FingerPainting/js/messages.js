"use strict";
(function () {

    WinJS.Namespace.define("STYWin.Messages", {
        displayError: displayError,
        displayStatus: displayStatus,
    });


    function showMessage(message, state) {

        if (state && state.toLowerCase() === "error") {
            var msg = new Windows.UI.Popups.MessageDialog(message, state);
            msg.showAsync();
        }

        else {
            console.log(message);
        }
    }

    function displayStatus(message) {
        showMessage(message);
    }

    function displayError(message) {
        showMessage(message, "Error");
    }

})();