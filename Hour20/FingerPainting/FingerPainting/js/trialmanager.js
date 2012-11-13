"use strict";
(function () {

    var addColorsId = "addColors";

    var currentApp = Windows.ApplicationModel.Store.CurrentAppSimulator;
    //var currentProduct = Windows.ApplicationModel.Store.CurrentApp;

    //from sidebar: would allow us to load a custom proxy file from our solution
    //not used in this project
    function loadPurchaseProxyFile() {
        Windows.ApplicationModel.Package.current.installedLocation
            .getFolderAsync("proxies").done(function (folder) {
                folder.getFileAsync("customproxyfile.xml").done(
                    function (file) {
                        Windows.ApplicationModel.Store.CurrentAppSimulator
                            .reloadSimulatorAsync(file).done();

                        currentApp.loadListingInformationAsync().done(
                            function (listing) {
                                var licenseInformation = currentApp.licenseInformation;
                                STYWin.TrialManager.isTrial = licenseInformation.isTrial;
                                STYWin.TrialManager.isAddColorPurchased = licenseInformation
                                        .productLicenses.lookup(addColorsId).isActive;

                                //get listing info
                                price = listing.formattedPrice;
                                STYWin.TrialManager.price = price;

                                addColorPrice = listing.productListings.lookup(addColorsId).formattedPrice;
                                STYWin.TrialManager.addColorPrice = addColorPrice;
                            });
                    });
            });
    }

    WinJS.Utilities.ready(function() 
    {
        loadPurchaseProxyFile();
    });


    var licenseInformation = currentApp.licenseInformation;

    //sometimes it would be helpful to listen for the licensechanged event and act on that.
    //licenseInformation.addEventListener("licensechanged", reloadLicense);

    var isTrial = licenseInformation.isTrial;

    var price;
    var addColorPrice;
    /*
    //if loading from local proxyxml, this can be commented out
    currentApp.loadListingInformationAsync().then(function (listing) {
        price = listing.formattedPrice;

        //IF THIS FAILS it is because the WindowsStoreProxy.xml wasn't setup
        //Make sure to look at the book to set it up correctly.
        //The contents can be copied from the proxies\customproxyfile.xml
        //Another option is uncomment the code above that loads the proxy file.
        //and comment this code instead
    addColorPrice = listing.productListings.lookup(addColorsId).formattedPrice;
    });
    */
    var daysRemainingConverter = WinJS.Binding.converter(function (date) {
        var singleDay = 1000 * 60 * 60 * 24;
        var expiringDate = date.getTime();
        var dateNow = Date.now();
        var diff = (expiringDate - dateNow);
        var daysLeft = Math.round(diff / singleDay);

        return daysLeft.toString();
    });

    function buyApp(callback) {
        if (STYWin.TrialManager.isTrial) {
            var purchaseFlyout = document.getElementById("purchaseFlyout").winControl;

            var btnBuy = document.getElementById("btnBuy");
            btnBuy.onclick = function () {
                //Do Buy function
                currentApp.requestAppPurchaseAsync(true).then(
                    function (receipt) {
                        licenseInformation = currentApp.licenseInformation;
                        STYWin.TrialManager.isTrial = licenseInformation.isTrial;

                        //call the original function
                        //the user was trying to do before they had access
                        //to all the capabilities
                        callback();
                    },
                    function (err) {
                        //ruh roh
                    });
            };

            purchaseFlyout.show(document.querySelector("body"));
        }
    }

    function buyAddColor(callback) {

        if (!STYWin.TrialManager.isAddColorPurchased) {
            var purchaseFlyout = document
                .getElementById("purchaseAddColorFlyout").winControl;

            var btnBuy = document.getElementById("btnBuyColors");
            btnBuy.onclick = function () {

                //Do Buy function
                currentApp.requestProductPurchaseAsync(addColorsId, true).done(
                    function (receipt) {
                        licenseInformation = currentApp.licenseInformation;
                        STYWin.TrialManager.isAddColorPurchased = licenseInformation
                                .productLicenses.lookup(addColorsId).isActive;
                        
                        //call the original function
                        //the user was trying to do before they had access
                        //to all the capabilities
                        callback();

                    },
                    function () {
                        //ruh roh
                    });
            };

            purchaseFlyout.show(document.querySelector("body"));
        }
    }

    WinJS.Namespace.define("STYWin.TrialManager", {
        daysRemaining: licenseInformation.expirationDate,
        daysRemainingConverter: daysRemainingConverter,
        isTrial: isTrial,
        price: price,
        currentApp: currentApp,
        buyApp: buyApp,
        isAddColorPurchased: licenseInformation
                                .productLicenses.lookup(addColorsId).isActive,
        buyAddColor: buyAddColor,
        addColorPrice: addColorPrice,
        addColorExpDate: licenseInformation
                                .productLicenses.lookup(addColorsId).expirationDate.toLocaleDateString()

    });

})();