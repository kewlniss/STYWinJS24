"use strict";
(function () {

    WinJS.Utilities.ready(function () {

        //hook up handler for add rss feed button in flyout
        document.getElementById("addRSSFeed")
            .addEventListener('click', addRSSFeed, false);

    });

    function addRSSFeed(e) {

        var rssFeedUrl = document.getElementById('rssFeedUrl');

        if (rssFeedUrl.value.length > 0) {

            //hide flyout on successful data entry and clicking button
            document.getElementById("addFeedFlyout").winControl.hide();

            var currentNumberOfPosts = Data.items.length;
            Data.addRSSFeed(rssFeedUrl.value)
                .then(function () {

                    var page = WinJS.UI.Pages
                        .get("/pages/groupedItems/groupedItems.html");
                    var listView = document
                        .querySelector(".groupeditemslist").winControl;
                    page.prototype._initializeLayout(listView,
                        Windows.UI.ViewManagement.ApplicationView.value);

                    var nav = WinJS.Navigation;
                    var newPostCount = Data.items.length - currentNumberOfPosts;
                    var ensureVisiblePostIndex = currentNumberOfPosts +
                                        (newPostCount < 7 ? newPostCount : 7);

                    STYWin.SessionState.scrollPosition = 0;
                    nav.navigate("/pages/groupedItems/groupedItems.html", {
                        ensureVisiblePostIndex: ensureVisiblePostIndex
                    });

                    rssFeedUrl.value = '';
                    document.getElementById("appbar").winControl.hide();
                })
                .done(null, function (err) {
                    STYWin.Utility.showNonCriticalError(err.toString());
                });
        }
    }

})();
