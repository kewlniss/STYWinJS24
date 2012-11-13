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

})();

WinJS.Utilities.ready(function () {

    var btnSave = document.getElementById("btnSave");
    btnSave.addEventListener("click", writeOutImage, false);


    var storageFile = "temp.png";
    function writeOutImage(evt) {

        var canvas = document.getElementById("canvas");
        var blob = canvas.msToBlob();
        var saveStream = null;

        var sto = Windows.Storage;
        var cco = sto.CreationCollisionOption;
        var appData = sto.ApplicationData.current;
        var folder = appData.localFolder;
                    //appData.temporaryFolder;
                    //appData.roamingFolder;

        folder.createFolderAsync("temp", cco.openIfExists)
            .then(function (createdFolder) {
                return createdFolder.createFileAsync(storageFile, cco.generateUniqueName);
            })
            .then(function (file) {

                return file.openAsync(sto.FileAccessMode.readWrite);

            }).then(function (stream) {
                saveStream = stream;

                return sto.Streams.RandomAccessStream.copyAsync(
                    blob.msDetachStream(), saveStream);
            }).then(function () {
                // since we return the promise, it will be executed
                //before the following .done
                return saveStream.flushAsync();
            },
            function (e) {
                // errors occurred during saveAsync are reported as catastrophic.
                // for us it just means we could not save the file,
                //so we throw a different error.
                throw new Error("saveAsync");
            }).done(function (result) {
                // print the size of the stream on the screen
                displayStatus("File saved!", "Success");

                // output stream is IClosable interface
                //and requires explicit close
                saveStream.close();
            },
                function (e) {
                    displayStatus("save " + e.toString(), "Error");

                    // if the error occurred after the stream was opened,
                    //close the stream                
                    if (saveStream) {
                        saveStream.close();
                    }
                });
    }

    function displayStatus(message, state) {

        if (state === "Error") {
            var msg = new Windows.UI.Popups.MessageDialog(message, state);
            msg.showAsync();
        }

        else {

            console.log(message);
        }
    }

    var canvas;
    var ctx;
    var w;
    var h;
    var gesture;

    var inkManager = new Windows.UI.Input.Inking.InkManager();
    var currentContactId = -1;

    init();

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



    //var x, y;

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

        // NOTE: check that we have some ink to recognize before calling RecognizerContainer::RecognizeAsync()
        if (inkManager.getStrokes().size === 0)
            return;

        isAsync = true;

        var currentText;
        var recognitionTarget;
        recognitionTarget = Windows.UI.Input.Inking.InkRecognitionTarget.all;

        // handwriting recognition call is made here, we use current default handwriting recognizer
        inkManager.recognizeAsync(recognitionTarget).done(
            function (recognitionResults) {
                // after we are done we can update the recognition results stored by the inkManager
                inkManager.updateRecognitionResults(recognitionResults);

                // update recognition text based on new recognition results
                currentText = "";

                // get updated recognition text
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

});