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


            args.setPromise(
                WinJS.UI.processAll().done(function () {
                    WinJS.Binding.processAll();
                })
            );

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

    function groupByFunds(person) {
        var fundRange;

        var fundValue = parseInt(person.funds);
        var groupKey = 1001;

        if (fundValue >= 1000) {
            fundRange = "$1,000.00 and Up";
            groupKey = 1001;
        }
        if (fundValue < 1000) {
            fundRange = "$500.00 to $999.99";
            groupKey = 1000;
        }
        if (fundValue < 500) {
            fundRange = "$100.00 to $499.99";
            groupKey = 500;
        }
        if (fundValue < 100) {
            fundRange = "$50.00 to $99.99";
            groupKey = 100;
        }
        if (fundValue < 50) {
            fundRange = "Under $50.00";
            groupKey = 50;
        }

        return {
            key: groupKey,
            data: {
                headerTitle: fundRange
            }
        };
    }

    function compareGroups(key1, key2) {
        return key1 - key2;
    }

    function groupKeySelector(item) {
        return groupByFunds(item).key.toString();
    }

    function groupDataSelector(item) {
        return {
            headerTitle: groupByFunds(item).data.headerTitle
        };
    }

    WinJS.xhr({ url: "/js/data.js" }).then(function (peeps) {

        var list = new WinJS.Binding.List(JSON.parse(peeps.responseText));
        var groupOfPeople = list.createGrouped(
            groupKeySelector, groupDataSelector, compareGroups
        );

        WinJS.Namespace.define("STYWin.Data", {
            people: groupOfPeople
        });

        var listView = document.getElementById("simpleListView").winControl;

        listView.itemDataSource = STYWin.Data.people.dataSource;
        listView.itemTemplate = document.getElementById("templateDiv");
        listView.groupDataSource = STYWin.Data.people.groups.dataSource;
        listView.groupHeaderTemplate = document.getElementById("headerDiv");

        listView.layout = new WinJS.UI.GridLayout();
        //or
        //  new WinJS.UI.ListLayout();

    });



});
