(function () {
    "use strict";

    //Example of hello world control inside the STYWin.UI namespace
    //By using WinJS.Namespace.define we get access to processAll functionality
    WinJS.Namespace.define("STYWin.UI", {
        NameSpaceCustomControl: WinJS.Utilities.markSupportedForProcessing(
            function (element, options) {

                element = element || document.createElement("div");
                element.textContent = "Namespace Hello World Control!";

                element.winControl = this;
                this.element = element;
            })
    });
})();
