(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;

    ui.Pages.define("/pages/groupedItems/groupedItems.html", {
        // Navigates to the groupHeaderPage. Called from the groupHeaders,
        // keyboard shortcut and iteminvoked.
        navigateToGroup: function (key) {
            nav.navigate("/pages/groupDetail/groupDetail.html", { groupKey: key });
        },

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var listView = element.querySelector(".groupeditemslist").winControl;
            listView.groupHeaderTemplate = element.querySelector(".headertemplate");
            listView.itemTemplate = element.querySelector(".itemtemplate");
            listView.oniteminvoked = this._itemInvoked.bind(this);

            // Set up a keyboard shortcut (ctrl + alt + g) to navigate to the
            // current group when not in snapped mode.
            listView.addEventListener("keydown", function (e) {
                if (appView.value !== appViewState.snapped && e.ctrlKey && e.keyCode === WinJS.Utilities.Key.g && e.altKey) {
                    var data = listView.itemDataSource.list.getAt(listView.currentItem.index);
                    this.navigateToGroup(data.group.key);
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
            }.bind(this), true);

            this._initializeLayout(listView, appView.value);
            listView.element.focus();

            listView.addEventListener("selectionchanged", selectItem);

            /*
            //commented code shows how to dynamically hide specific controls
            //within an app bar based on the extraClass assigned or the element of the control
            var appBarDiv = document.getElementById("appbar");
            var appBar = appBarDiv.winControl;
            appBar.hideCommands(appBarDiv.querySelectorAll(".warn"));
            appBar.hideCommands(appBarDiv.querySelector("hr"));
            */

            //hooking up to the flyout control isn't needed
            //since the app bar has a flyout type
            //var btnRemove = document.getElementById("btnRemove");
            //btnRemove.onclick = showConfirmRemoveFlyout;

            var btnConfirmRemove = document.getElementById("btnConfirmRemove");
            btnConfirmRemove.addEventListener("click", completeItemPurchase, false);

        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            var listView = element.querySelector(".groupeditemslist").winControl;
            if (lastViewState !== viewState) {
                if (lastViewState === appViewState.snapped || viewState === appViewState.snapped) {
                    var handler = function (e) {
                        listView.removeEventListener("contentanimating", handler, false);
                        e.preventDefault();
                    }
                    listView.addEventListener("contentanimating", handler, false);
                    this._initializeLayout(listView, viewState);
                }
            }
        },

        // This function updates the ListView with new layouts
        _initializeLayout: function (listView, viewState) {
            /// <param name="listView" value="WinJS.UI.ListView.prototype" />

            if (viewState === appViewState.snapped) {
                listView.itemDataSource = Data.groups.dataSource;
                listView.groupDataSource = null;
                listView.layout = new ui.ListLayout();
            } else {
                listView.itemDataSource = Data.items.dataSource;
                listView.groupDataSource = Data.groups.dataSource;
                listView.layout = new ui.GridLayout({ groupHeaderPosition: "top" });
            }
        },

        _itemInvoked: function (args) {
            if (appView.value === appViewState.snapped) {
                // If the page is snapped, the user invoked a group.
                var group = Data.groups.getAt(args.detail.itemIndex);
                this.navigateToGroup(group.key);
            } else {
                // If the page is not snapped, the user invoked an item.
                var item = Data.items.getAt(args.detail.itemIndex);
                nav.navigate("/pages/itemDetail/itemDetail.html", { item: Data.getItemReference(item) });
            }
        }
    });

    function selectItem() {
        var appBarDiv = document.getElementById("appbar");
        var appBar = appBarDiv.winControl;
        var listView = document.querySelector(".groupeditemslist").winControl;
        var count = listView.selection.count();

        if (count > 0) {
            listView.selection.getItems().then(function (items) {
                var firstSelected = items[0].data.subtitle;
            });
            appBar.sticky = true;
            appBar.show();
        } else {
            appBar.hide();
            appBar.sticky = false;
        }
    }

    /*
    //Not needed since setting a command to a type of flyout
    //provides this functionality automatically
    function showConfirmRemoveFlyout(evt) {
        var btnRemove = document.getElementById("btnRemove");

        document.getElementById("confirmRemoveFlyout")
            .winControl.show(btnRemove);

    }
    */

    function completeItemPurchase(evt) {
        //hide flyout
        document.getElementById("confirmRemoveFlyout").winControl.hide();

        //hide app bar
        var appBarDiv = document.getElementById("appbar");
        var appBar = appBarDiv.winControl;
        appBar.hide();
    }


})();
