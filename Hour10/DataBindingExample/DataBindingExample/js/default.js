// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    WinJS.strictProcessing();

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            args.setPromise(WinJS.UI.processAll());

            WinJS.Binding.processAll();

        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    app.start();


    WinJS.Utilities.ready(function () {

        WinJS.Namespace.define("STYWin.Utility", {
            formatCurrency: WinJS.Binding.converter(function (num) {
                // Determine the current user's default currency.
                var userCurrency = Windows.System.UserProfile
                    .GlobalizationPreferences.currencies;

                var currencyFormat = new Windows.Globalization
                    .NumberFormatting.CurrencyFormatter(userCurrency);

                currencyFormat.isGrouped = true;

                return currencyFormat.format(num);
            })
        });


        WinJS.Namespace.define("STYWin.OneTime", {
            source: "Source Data",
            chk: true,
            funds: 45.2
        });

        WinJS.Namespace.define("STYWin", {
            ViewModel: WinJS.Binding.as({
                currentTime: new Date(),
                currentDate: new Date()
            })
        });

        setInterval(function () {
            STYWin.ViewModel.currentTime = new Date();
        }, 500);

        setInterval(function () {
            STYWin.ViewModel.currentDate = new Date();
        }, 5000);

        //pull in data from source (web, local, wherever)
        //for us it is just in data.js (extension could be anything)
        //but this could easily be a web service that returns JSON data
        WinJS.xhr({ url: "/js/data.js" }).done(function (peeps) {

            WinJS.Namespace.define("STYWin.Data", {
                people: JSON.parse(peeps.responseText)
            });

            var templateElement = document.getElementById("templateDiv");
            var target = document.getElementById("renderTarget");
            target.innerHTML = "";

            WinJS.UI.process(templateElement).then(function (templateControl) {

                for (var i = 0; i < STYWin.Data.people.length; i++) {
                    templateControl.render(STYWin.Data.people[i], target);
                }
            });
        });

    });

})();

