﻿(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var profilePage = document.getElementById("profilePage");

            profilePage.addEventListener("click", function (event) {
                WinJS.Navigation.navigate("/pages/profile/profile.html");
            }, false);

        }
    });
})();
