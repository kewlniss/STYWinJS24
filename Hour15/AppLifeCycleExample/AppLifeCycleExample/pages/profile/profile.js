// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/profile/profile.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.

            var data = options;
            if (data) {
                var name = document.getElementById("name");
                var phone = document.getElementById("phone");
                var email = document.getElementById("email");
                var homepage = document.getElementById("homepage");
                var favoritenumber = document.getElementById("favoritenumber");
                var password = document.getElementById("password");

                name.value = data.name;
                phone.value = data.phone;
                email.value = data.email;
                homepage.value = data.homepage;
                favoritenumber.value = data.favoritenumber;


                var passwordVault = new Windows.Security.Credentials.PasswordVault();

                var creds = passwordVault.retrieveAll();
                if (creds.length > 0) {
                    var cred = passwordVault.retrieve(creds[0].resource, creds[0].userName);
                    password.value = cred.password;
                }
            }


            document.addEventListener("change", function() {
                WinJS.Application.sessionState.profile = getProfileInfo();
            }, false);

        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });

    function getProfileInfo() {
        var roamingSettings = Windows.Storage.ApplicationData.current.roamingSettings;

        var name = document.getElementById("name").value;
        var phone = document.getElementById("phone").value;
        var email = document.getElementById("email").value;
        var homepage = document.getElementById("homepage").value;
        var favoritenumber = document.getElementById("favoritenumber").value;
        var password = document.getElementById("password").value;

        var data = {
            name: name,
            phone: phone,
            email: email,
            homepage: homepage,
            favoritenumber: favoritenumber
        };


        if (password) {
            var passwordVault = new Windows.Security.Credentials.PasswordVault();
            var cred = new Windows.Security.Credentials.PasswordCredential(
                                                "profile", "password", password);
            passwordVault.add(cred);
        }

        roamingSettings.values["HighPriority"] = JSON.stringify(data);
    }

})();
