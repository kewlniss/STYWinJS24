"use strict";
(function () {

    var Settings = {};
    //set default incase nothing is in settings
    Settings.brushSize = 5;
    Settings.color = "black";
    Settings.backgroundColor = "white";


    var appData = Windows.Storage.ApplicationData.current;
    var roamingSettings = appData.roamingSettings;
    if (roamingSettings.values["brushSize"]) {
        //override app default with settings default
        Settings.brushSize = roamingSettings.values["brushSize"];
        Settings.color = roamingSettings.values["color"];
        Settings.backgroundColor = roamingSettings.values["backgroundColor"];
    }

    Settings.saveSettings = WinJS.Utilities.markSupportedForProcessing(
        function () {
            roamingSettings.values["brushSize"] = STYWin.Settings.brushSize;
            roamingSettings.values["color"] = STYWin.Settings.color;
            roamingSettings.values["backgroundColor"] = STYWin.Settings.backgroundColor;
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