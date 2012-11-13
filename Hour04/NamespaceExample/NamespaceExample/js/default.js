(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    WinJS.strictProcessing();

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {

            document.getElementById("greeting").innerText =
                STYWin.Option1.Messaging.sayHello();

            document.getElementById("answer").innerText =
                "The answer is " + STYWin.Option2.Math.add(40, 2) + ".";

            document.getElementById("add").innerText =
                STYWin.Option1.Math.add(40, 40);
            document.getElementById("subtract").innerText =
                STYWin.Option2.Math.subtract(80, 40);
            document.getElementById("padLeft").innerText =
                STYWin.Utility.padLeft("123", 5, "0");

            //Get full date from static method on Utility
            document.getElementById("displayFullDate").innerText =
                STYWin.Utility.displayFullDate();

            //get 2 year digit display date from instance of Date class
            var dateInfo = new STYWin.Utility.Date();
            document.getElementById("displayDate").innerText =
                dateInfo.displayDate(false);

            //Not doing anything with result, but showing how
            //to instantiate weird math constructor to then add
            var math = new STYWin.Utility.Math(2,3);            
            var result = math.add();

            var tau = STYWin.Utility.Math.TAU();
            document.getElementById("tau").innerText = tau.toString();

            args.setPromise(WinJS.UI.processAll());
        }
    };

    app.start();
})();
