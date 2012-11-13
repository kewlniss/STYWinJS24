"use strict";
(function () {


    WinJS.Namespace.define("STYWin.Print", {
        registerForPrintContract: registerForPrintContract,
        unregisterForPrintContract: unregisterForPrintContract
    });

    var printManager = Windows.Graphics.Printing.PrintManager.getForCurrentView();

    function registerForPrintContract() {
        printManager.addEventListener(
            "printtaskrequested", onPrintTaskRequested);
    }

    function unregisterForPrintContract() {
        printManager.removeEventListener(
            "printtaskrequested", onPrintTaskRequested);
    }

    /// <summary>
    /// Print event handler for printing via the PrintManager API. The user has to manually invoke
    /// the print charm after this function is executed.
    /// </summary>
    /// <param name="printEvent" type="Windows.Graphics.Printing.PrintTaskRequest">
    /// The event containing the print task request object.
    /// </param>
    function onPrintTaskRequested(printEvent) {
        var printTask = printEvent.request.createPrintTask("FingerPainting", function (args) {
            args.setSource(MSApp.getHtmlPrintDocumentSource(document));
        });

        printTask.options.orientation =
            Windows.Graphics.Printing.PrintOrientation.landscape;
    }

})();