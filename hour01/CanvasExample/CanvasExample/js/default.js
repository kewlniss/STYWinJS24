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

            drawOnCanvas();

            args.setPromise(WinJS.UI.processAll());
        }
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

    function drawOnCanvas() {
        var canvas = document.getElementById("surface");
        var context = canvas.getContext("2d");

        //clear canvas to all blue
        context.fillStyle = "#0000FF";
        context.fillRect(0, 0, 500, 500);

        //offset and clear large section to red
        context.fillStyle = "#FF0000";
        context.fillRect(50, 50, 400, 400);

        //offset some more and clear section to white
        context.fillStyle = "#FFFFFF";
        context.fillRect(100, 100, 300, 300);

        //create a purple circle with a black outline
        context.fillStyle = "purple";
        context.strokeStyle = "black";
        context.lineWidth = 2;
        context.arc(250, 250, 100, 0, Math.PI * 2);
        context.fill();
        context.stroke();

        //set line width to 15
        context.lineWidth = 15;

        //set stroke style (for our line) to yellow
        context.strokeStyle = "yellow";

        //begin path and move (without drawing) to 100,100
        //then draw a line from 100,100 to 400,400
        context.beginPath();
        context.moveTo(100, 100);
        context.lineTo(400, 400);
        context.stroke();

        //set stroke style to green
        context.strokeStyle = "green";

        //begin path and move (without drawing) to 400,100
        //then draw a line from 400,100 to 100,400
        context.beginPath();
        context.moveTo(400, 100);
        context.lineTo(100, 400);
        context.stroke();
    }
})();
