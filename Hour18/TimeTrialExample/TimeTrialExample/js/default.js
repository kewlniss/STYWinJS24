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
            args.setPromise(WinJS.UI.processAll().then(function () {

                WinJS.Binding.processAll();

                if (STYWin.isTrial) {
                    var purchaseFlyout = document.getElementById("purchaseFlyout").winControl;

                    var btnBuy = document.getElementById("btnBuy");
                    btnBuy.addEventListener("click", function () {

                        //Do Buy function
                        STYWin.currentApp.requestAppPurchaseAsync(true).then(
                            function (receipt) {
                                //would enable functionality here
                                //but all functionality is already available
                                //just a time trial

                                //could display a receipt for the user to print
                                //or send it to our cloud service

                            },
                            function (err) {
                                //ruh roh
                            });

                    }, false);

                    purchaseFlyout.show(document.querySelector("body"));
                }

            }));
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
})();


WinJS.Utilities.ready(function () {

    var currentApp = Windows.ApplicationModel.Store.CurrentAppSimulator;
    //var currentProduct = Windows.ApplicationModel.Store.CurrentApp;

    var licenseInformation = currentApp.licenseInformation;
    
    var isTrial = licenseInformation.isTrial;

    var price;

    currentApp.loadListingInformationAsync().then(function (listing) {
        var listingInfo = listing;

        price = listingInfo.formattedPrice;

    });

    var daysRemainingConverter = WinJS.Binding.converter(function (date) {
        var singleDay = 1000 * 60 * 60 * 24;
        var expiringDate = date.getTime();
        var dateNow = Date.now();
        var diff = (expiringDate - dateNow);
        var daysLeft = Math.round(diff / singleDay);

        return daysLeft.toString();
    });

    WinJS.Namespace.define("STYWin", {
        daysRemaining: licenseInformation.expirationDate,
        daysRemainingConverter: daysRemainingConverter,
        isTrial: isTrial,
        price: price,
        currentApp: currentApp
    });

});