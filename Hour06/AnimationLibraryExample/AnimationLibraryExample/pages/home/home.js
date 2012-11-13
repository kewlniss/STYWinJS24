(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            WinJS.Utilities.query("a").listen("click", STYWin.linkClickEventHandler, false);

            WinJS.UI.Animation.enterPage([document.querySelector("section")], null);
        }
    });
})();
