"use strict";
(function () {

    WinJS.Namespace.define("STYWin.Utilities", {
        asyncFlag: asyncFlag,
        asyncError: asyncError
    });

    var asyncFlag = false;

    function asyncError(e) {
        STYWin.Messages.displayError("Async error: " + e.toString());
    }

})();