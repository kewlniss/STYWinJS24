// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    WinJS.strictProcessing();

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch ||
            args.detail.kind === activation.ActivationKind.contactPicker) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            if (args.detail.kind === activation.ActivationKind.contactPicker) {
                STYWin.Utility.contactPickerUI = args.detail.contactPickerUI;
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

    var contactPickerUI;

    WinJS.Namespace.define("STYWin.Utility", {
        contactPickerUI: contactPickerUI,
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

        var ppl = JSON.parse(peeps.responseText);
        ppl.sort(function (a, b) { return a.funds - b.funds; });
        var list = new WinJS.Binding.List(ppl);
        var groupOfPeople = list.createGrouped(
            groupKeySelector, groupDataSelector, compareGroups
        );

        WinJS.Namespace.define("STYWin.Data", {
            people: groupOfPeople
        });

        initLayout();

        window.addEventListener("resize", updateLayout);
    });

    function initLayout() {
        var currViewState = Windows.UI.ViewManagement.ApplicationView.value;
        var viewStates = Windows.UI.ViewManagement.ApplicationViewState;

        var semanticZoom = document.getElementById("semantic").winControl;

        var zoomedOutView = document.getElementById("zoomedOutView").winControl;

        zoomedOutView.itemDataSource = STYWin.Data.people.groups.dataSource;
        zoomedOutView.itemTemplate = document.getElementById("zoomedOutDiv");

        var listView = document.getElementById("simpleListView").winControl;
        if (STYWin.Utility.contactPickerUI) {
            listView.addEventListener("iteminvoked", addContact, false);
        }

        listView.itemDataSource = STYWin.Data.people.dataSource;
        listView.itemTemplate = document.getElementById("templateDiv");
        listView.groupDataSource = STYWin.Data.people.groups.dataSource;
        listView.groupHeaderTemplate = document.getElementById("headerDiv");


        if (currViewState !== viewStates.snapped) {
            zoomedOutView.layout = new WinJS.UI.GridLayout({ maxRows: 1 });

            listView.layout = new WinJS.UI.GridLayout();

            semanticZoom.locked = false;
        } else {
            zoomedOutView.layout = new WinJS.UI.ListLayout();

            listView.layout = new WinJS.UI.ListLayout();

            semanticZoom.locked = true;
        }

    }

    function addContact(evt) {

        var contactToAdd = evt.detail.itemPromise._value.data;
        var contact = new Windows.ApplicationModel.Contacts.Contact();
        contact.name = contactToAdd.name;

        var result = STYWin.Utility.contactPickerUI
                                .addContact(contactToAdd.name, contact);
        Windows.ApplicationModel.Contacts.Provider.AddContactResult
    }

    function updateLayout() {

        var currViewState = Windows.UI.ViewManagement.ApplicationView.value;
        var viewStates = Windows.UI.ViewManagement.ApplicationViewState;

        var semanticZoom = document.getElementById("semantic").winControl;

        var listView = document.getElementById("simpleListView").winControl;

        listView.itemDataSource = STYWin.Data.people.dataSource;
        listView.itemTemplate = document.getElementById("templateDiv");
        listView.groupDataSource = STYWin.Data.people.groups.dataSource;
        listView.groupHeaderTemplate = document.getElementById("headerDiv");

        if (currViewState !== viewStates.snapped) {
            listView.layout = new WinJS.UI.GridLayout();

            semanticZoom.locked = false;
        } else {
            listView.layout = new WinJS.UI.ListLayout();
            listView.groupDataSource = null;
            semanticZoom.zoomedOut = false;
            semanticZoom.locked = true;
        }
    }

});
