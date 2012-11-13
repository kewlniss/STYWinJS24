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
            args.setPromise(WinJS.UI.processAll());
        }

        doNumberTest();
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

    function doNumberTest() {
        var b = new WinRTHighPrecisionNumberComponent.HighPrecisionNumber();

        var val1 = b.largeNumber;
        var val2 = b.largeNumber;

        var body = document.querySelector("body");

        var div1 = document.createElement("div");
        var div2 = document.createElement("div");
        var div3 = document.createElement("div");
        var div4 = document.createElement("div");
        var div5 = document.createElement("div");
        var div6 = document.createElement("div");

        div1.innerText = "b.largeNumber as string " + b.myString;

        div2.innerText = "val1: " + val1 + " -- b.largeNumber: " + b.largeNumber;

        //stored locally, but not changed
        //passed back to C# for comparison
        var areEqual = b.compare(val1, val2);
        div3.innerText = "Are val1 and val2 Equal? " + areEqual;

        //added 0 to val1 (makes it lose precision)
        //compares modified val1 with unmodified val2
        val1 = val1 + 0;
        areEqual = b.compare(val1, val2);
        div4.innerText = "Are val1 + 0 and val2 Equal? " + areEqual;

        //compares modified val1 with unmodified val2
        //with JavaScript compare
        areEqual = (val1 === val2);
        div5.innerText = "Does val1 === val2? " + areEqual;

        //compares unmodified val2 with
        //C# large Number
        areEqual = b.compare(val2, b.largeNumber);
        div6.innerText = "Are val2 and b.largeNumber Equal? " + areEqual;

        body.appendChild(div1);
        body.appendChild(div2);
        body.appendChild(div3);
        body.appendChild(div4);
        body.appendChild(div5);
        body.appendChild(div6);
    }
})();

