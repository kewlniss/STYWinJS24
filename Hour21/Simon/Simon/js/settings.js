"use strict";
(function () {

    WinJS.Application.onsettings = function (e) {
        e.detail.applicationcommands = {
            "about":
               { title: "About", href: "/settings/about/about.html" }
        };
        WinJS.UI.SettingsFlyout.populateSettings(e);
    };
})();
