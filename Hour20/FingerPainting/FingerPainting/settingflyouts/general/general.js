(function () {
    "use strict";

    WinJS.UI.Pages.define("/settingFlyouts/general/general.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.

            var ddlBrushSize = document.getElementById("ddlBrushSize");
            ddlBrushSize.value = STYWin.Settings.brushSize;
            ddlBrushSize.onchange = function (evt) {
                STYWin.Settings.brushSize = evt.target.value;
            }

            //hook up colors
            var element = document.getElementById("settingsPalette");
            var divs = element.getElementsByClassName("color");
            var idx;
            for (idx = 0; idx < divs.length; idx++) {
                divs[idx].addEventListener("click", colorSelected, false);
            }

            document.getElementById("settingsSelectedColor")
                .style.backgroundColor = STYWin.Settings.color;

            //hook up background colors
            element = document.getElementById("backgroundPalette");
            divs = element.getElementsByClassName("color");
            for (idx = 0; idx < divs.length; idx++) {
                divs[idx].addEventListener("click", backgroundColorSelected, false);
            }

            document.getElementById("settingsSelectedBackgroundColor")
                .style.backgroundColor = STYWin.Settings.backgroundColor;


        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />
            /// <param name="viewState" value="Windows.UI.ViewManagement.ApplicationViewState" />
            /// <param name="lastViewState" value="Windows.UI.ViewManagement.ApplicationViewState" />

            // TODO: Respond to changes in viewState.
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        }
    });

    function colorSelected(evt) {
        STYWin.Settings.color = evt.srcElement.id;

        var element = document.getElementById("settingsSelectedColor");
        element.style.backgroundColor = STYWin.Settings.color;
    }

    function backgroundColorSelected(evt) {
        STYWin.Settings.backgroundColor = evt.srcElement.id.replace("x", "");

        var element = document.getElementById("settingsSelectedBackgroundColor");
        element.style.backgroundColor = STYWin.Settings.backgroundColor;
    }

})();
