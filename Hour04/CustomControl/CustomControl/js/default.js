(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    WinJS.strictProcessing();

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {

            var simpleControl = new SimpleCustomControl(
                        document.getElementById("placeholder"));

            //call the namespace control without an element
            var anotherSimpleControl = new STYWin.UI.NameSpaceCustomControl();

            //style it the way we want
            anotherSimpleControl.element.classList.add("mystyle");

            //now that the element has been created for us,
            //dynamically add it to the end of the body
            document.querySelector("body").appendChild
                        (anotherSimpleControl.element);

            var htmlControl = WinJS.UI
                .Pages.get("/customhtmlcontrol/customhtmlcontrol.html");
            var div = document.createElement("div");

            var hc = new htmlControl(div,
                { uri: "/customhtmlcontrol/customhtmlcontrol.html" },
                function (ctl) {
                    ctl.element.id = "mynewhtmlcontrol";
                    document.querySelector("body").appendChild(ctl.element);
                }, null);

            args.setPromise(WinJS.UI.processAll());
        }
    };

    app.start();
})();
