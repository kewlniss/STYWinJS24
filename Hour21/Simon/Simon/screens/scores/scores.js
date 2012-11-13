// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/screens/scores/scores.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            getHighScores();
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });

    function getHighScores() {

        var appData = Windows.Storage.ApplicationData.current;
        var roamingSettings = appData.roamingSettings;

        var highScores;

        var p = document.querySelector("p");
        var highscoreContainer = document.getElementById("highscorecontainer");

        if (roamingSettings.values["hs"]) {
            highscoreContainer.style.visibility = "visible";
            p.style.visibility = "hidden";

            var template = document.getElementById("highScoreTemplate");

            highScores =
                JSON.parse(roamingSettings.values["hs"]);

            var i, hs, row;
            for (i = 0; i < highScores.length; i++) {
                hs = highScores[i];
                template.winControl.render(hs).then(function (result) {
                    row = result.querySelector("tr");
                    highscoreContainer.appendChild(row);
                });
            }
        } else {
            p.style.visibility = "visible";
            highscoreContainer.style.visibility = "hidden";
        }
    }

})();
