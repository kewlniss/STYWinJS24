(function () {
    WinJS.UI.Pages.define("/customhtmlcontrol/customhtmlcontrol.html", {
        ready: function (element, options) {
            var nodeList = document.querySelectorAll(".htmlcontrol_content");
            for (var n = 0; n < nodeList.length; n++) {
                nodeList[n].innerHTML = "Creating custom controls is easy.";
            }
        }
    });
})();
