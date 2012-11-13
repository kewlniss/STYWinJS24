(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var ui = WinJS.UI;
    var fileData;

    ui.Pages.define("/pages/items/items.html", {

        // This function updates the ListView with new layouts
        initializeLayout: function (listView, viewState) {
            /// <param name="listView" value="WinJS.UI.ListView.prototype" />

            if (viewState === appViewState.snapped) {
                listView.layout = new ui.ListLayout();
            } else {
                listView.layout = new ui.GridLayout();
            }
        },

        itemInvoked: function (args) {
            var sto = Windows.Storage;
            var appPerms = sto.AccessCache.StorageApplicationPermissions;
            var token;
            token = fileData[args.detail.itemIndex].token;

            if (token != "wip" && STYWin.SessionState.unsavedImage) {

                var self = this;
                var msg = new Windows.UI.Popups.MessageDialog(
                    "Cancel to go back and recover unsaved painting. " +
                    "Confirm to start a new painting. " +
                    "Changes to the unsaved painting will be lost.");
                msg.commands.append(new Windows.UI.Popups.UICommand("Confirm",
                    function (cmd) { self.openPainting(token); }));

                msg.commands.append(new Windows.UI.Popups.UICommand("Cancel",
                    undefined));

                msg.showAsync();
            } else {
                this.openPainting(token);
            }
        },

        openPainting: function (token) {
            WinJS.Navigation.navigate("/pages/artboard/artboard.html",
                                        token ? { token: token } : null);
        },

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var listView = element.querySelector(".itemslist").winControl;

            var sto = Windows.Storage;
            var appPerms = sto.AccessCache.StorageApplicationPermissions;
            var appView = Windows.UI.ViewManagement.ApplicationView;
            var data = appPerms.mostRecentlyUsedList.entries;

            if (data.length === 0) {
                WinJS.Navigation.navigate("/pages/artboard/artboard.html", null);
                return;
            }

            var promiseArray = [];
            fileData = [];

            sto.ApplicationData.current.localFolder.getFileAsync("received.png").then(
                function (file) {
                    fileData.push({
                        displayName: "Load Received Image",
                        dateCreated: new Date(),
                        displayType: "",
                        thumbnail: "ms-appx:///images/transparent.png",
                        //"ms-appdata:///local/received.png",
                        token: "received",
                        backgroundcolor: "blue"
                    });
                },
                function (err) {
                    //don't worry about it...
                    //file doesn't exist
                });


            if (STYWin.SessionState.unsavedImage) {
                fileData.push({
                    displayName: "Recover Unsaved Painting",
                    dateCreated: new Date(),
                    displayType: "",
                    thumbnail: "ms-appx:///images/transparent.png",
                            //"ms-appdata:///local/wip.png",
                    token: "wip",
                    backgroundcolor: "red"
                });
            }

            fileData.push({

                displayName: "Start a New Painting",
                dateCreated: new Date(),
                displayType: "",
                thumbnail: "ms-appx:///images/transparent.png",
                token: "",
                backgroundcolor: STYWin.Settings.backgroundColor

            });
            var self = this;

            data.forEach(function (d) {

                promiseArray.push(appPerms.mostRecentlyUsedList.getFileAsync(d.token)
                    .then(function (retrievedFile) {

                        // Process retrieved file
                        fileData.push({
                            displayName: retrievedFile.displayName,
                            dateCreated: retrievedFile.dateCreated,
                            displayType: retrievedFile.displayType,
                            thumbnail: URL.createObjectURL(retrievedFile),
                            token: d.token,
                            backgroundcolor: ""
                        });
                        URL.revokeObjectURL(retrievedFile);
                    },
                    function (error) {
                        // Handle errors 
                        appPerms.mostRecentlyUsedList.remove(d.token);
                    }));
            })

            WinJS.Promise.join(promiseArray)
                .then(function () {

                    fileData.sort(function (a, b) {
                        if (b.dateCreated > a.dateCreated) return 1;
                        if (b.dateCreated < a.dateCreated) return -1;
                        return 0;
                    });
                    fileData[0].dateCreated = "";
                    if (fileData[1].token == "")
                        fileData[1].dateCreated = "";

                    var list = new WinJS.Binding.List(fileData);

                    listView.itemDataSource = list.dataSource;
                    listView.itemTemplate = element.querySelector(".itemtemplate");
                    listView.oniteminvoked = self.itemInvoked.bind(self);

                    self.initializeLayout(listView, appView.value);
                    listView.element.focus();
                });
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />
            /// <param name="viewState" value="Windows.UI.ViewManagement.ApplicationViewState" />
            /// <param name="lastViewState" value="Windows.UI.ViewManagement.ApplicationViewState" />

            var listView = element.querySelector(".itemslist").winControl;
            if (lastViewState !== viewState) {
                if (lastViewState === appViewState.snapped || viewState === appViewState.snapped) {
                    var handler = function (e) {
                        listView.removeEventListener("contentanimating", handler, false);
                        e.preventDefault();
                    }
                    listView.addEventListener("contentanimating", handler, false);
                    var firstVisible = listView.indexOfFirstVisible;
                    this.initializeLayout(listView, viewState);
                    listView.indexOfFirstVisible = firstVisible;
                }
            }
        }
    });
})();
