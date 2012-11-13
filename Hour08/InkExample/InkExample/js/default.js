// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

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

    var canvas;
    var ctx;
    var w;
    var h;
    var gesture;

    var inkManager = new Windows.UI.Input.Inking.InkManager();
    var currentContactId = -1;

    document.addEventListener("DOMContentLoaded", init, false);

    function init(evt) {
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        w = canvas.attributes['width'].value;
        h = canvas.attributes['height'].value;

        ctx.lineWidth = 5;
        clearCanvas();

        canvas.addEventListener("MSPointerDown", beginWriting, false);
        canvas.addEventListener("MSPointerMove", write, false);
        canvas.addEventListener("MSPointerUp", stopWriting, false);


        canvas.addEventListener("MSGestureTap", recognizeText, false);
        canvas.addEventListener("MSGestureHold", clearStrokes, false);

        gesture = new MSGesture();
        gesture.target = canvas;
    }

    function clearCanvas() {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, w, h);
    }

    function beginWriting(evt) {

        //add pointer id to gesture
        if (evt.pointerType !== evt.MSPOINTER_TYPE_PEN) {
            gesture.addPointer(evt.pointerId);
        }

        //don't allow more than one contact
        if (currentContactId !== -1)
            return;

        if (evt.pointerType === evt.MSPOINTER_TYPE_TOUCH)
            return;

        canvas.msSetPointerCapture(evt.pointerId);

        inkManager.processPointerDown(evt.currentPoint);

        var rawPos = evt.currentPoint.rawPosition;
        ctx.beginPath();
        ctx.moveTo(rawPos.x, rawPos.y);

        currentContactId = evt.pointerId;
    }

    function write(evt) {
        if (evt.pointerId !== currentContactId)
            return;

        inkManager.processPointerUpdate(evt.currentPoint);


        var rawPos = evt.currentPoint.rawPosition;
        ctx.lineTo(rawPos.x, rawPos.y);
        ctx.stroke();

    }

    function stopWriting(evt) {
        if (evt.pointerId !== currentContactId)
            return;

        canvas.msReleasePointerCapture(evt.pointerId);

        inkManager.processPointerUp(evt.currentPoint);

        var rawPos = evt.currentPoint.rawPosition;
        ctx.lineTo(rawPos.x, rawPos.y);
        ctx.stroke();

        drawAllStrokes();

        currentContactId = -1;
    }

    function drawAllStrokes() {

        clearCanvas();

        inkManager.getStrokes().forEach(function (stroke) {
            var first = true;

            stroke.getRenderingSegments().forEach(function (segment) {
                if (first) {
                    ctx.moveTo(segment.position.x, segment.position.y);
                    first = false;
                }
                else {
                    ctx.bezierCurveTo(segment.bezierControlPoint1.x,
                                      segment.bezierControlPoint1.y,
                                      segment.bezierControlPoint2.x,
                                      segment.bezierControlPoint2.y,
                                      segment.position.x,
                                      segment.position.y);
                }
            });
        });
        ctx.stroke();
        ctx.closePath();
    }

    function clearStrokes(evt) {

        // Iterate through each stroke.
        inkManager.getStrokes().forEach(function (stroke) {
            stroke.selected = 1;
        });

        inkManager.deleteSelected();

        results.value = "";

        ctx.beginPath();
        drawAllStrokes();
    }

    var isAsync = false;
    function recognizeText(evt) {

        if (isAsync)
            return;

        if (inkManager.getStrokes().size === 0)
            return;

        isAsync = true;

        var currentText;
        var recognitionTarget;
        recognitionTarget = Windows.UI.Input.Inking.InkRecognitionTarget.all;

        inkManager.recognizeAsync(recognitionTarget).done(
            function (recognitionResults) {
                inkManager.updateRecognitionResults(recognitionResults);

                currentText = "";

                recognitionResults.forEach(function (recognitionResult) {
                    currentText += recognitionResult.getTextCandidates()[0] + " ";
                });

                results.value = currentText;
                isAsync = false;
            },
            function (e) {
                results.value = "recognize error " + e.number.toString();
                isAsync = false;
            }
        );
    }

})();
