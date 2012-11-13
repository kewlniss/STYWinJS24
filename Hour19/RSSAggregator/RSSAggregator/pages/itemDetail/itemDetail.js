(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/itemDetail/itemDetail.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var item = options && options.item ? Data.resolveItemReference(options.item) : Data.items.getAt(0);
            element.querySelector(".titlearea .pagetitle").textContent = item.group.title;
            element.querySelector("article .item-title").textContent = item.title;
            element.querySelector("article .item-subtitle").textContent =
                                        "by " + item.author + " on " + item.postDate;
            element.querySelector("article .item-content").innerHTML = item.content;
            element.querySelector(".content").focus();

            STYWin.SessionState.postLink = item.link;

            var appbar = document.getElementById("appbar").winControl;
            appbar.showCommands(["cmdView"]);

            document.getElementById("cmdView")
                .addEventListener('click', STYWin.Utility.viewInBrowser, false);
        },
        unload: function () {
            var appbar = document.getElementById("appbar").winControl;
            appbar.hideCommands(["cmdView"]);

            document.getElementById("cmdView")
                .removeEventListener('click', STYWin.Utility.viewInBrowser, false);
        }

    });
})();
