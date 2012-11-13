(function () {
    "use strict";

    function displayDate(fullYear) {
        var d = new Date();
        return addPrefix() +
            (d.getMonth() + 1) + "-" +
            d.getDate() + "-" +
            (fullYear ? d.getFullYear() : d.getYear()-100);
    }

    //private function
    function addPrefix() { return "Current Date is "; }

    var myUtilityClass = WinJS.Class.define(null,
        { },
        { displayDate: displayDate });

    WinJS.Namespace.defineWithParent(STYWin, "Utility", myUtilityClass);
})();

