"use strict";
(function () {

    var Settings = {};
    //set default incase nothing is in settings
    Settings.brushSize = 5;

    var appData = Windows.Storage.ApplicationData.current;
    var roamingSettings = appData.roamingSettings;
    if (roamingSettings.values["brushSize"]) {
        //override app default with settings default
        Settings.brushSize = roamingSettings.values["brushSize"];
    }

    Settings.saveSettings = WinJS.Utilities.markSupportedForProcessing(
        function () {
            roamingSettings.values["brushSize"] = STYWin.Settings.brushSize;
    });

    WinJS.Namespace.define("STYWin.Settings", Settings);

    WinJS.Application.onsettings = function (e) {
        e.detail.applicationcommands = {
            "general":
               { title: "General", href: "/settingflyouts/general/general.html" },
            "about":
               { title: "About", href: "/settingflyouts/about/about.html" }
        };
        WinJS.UI.SettingsFlyout.populateSettings(e);
    };

})();