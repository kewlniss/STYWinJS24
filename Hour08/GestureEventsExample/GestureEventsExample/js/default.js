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

    document.addEventListener("DOMContentLoaded", init, false);

    var image;
    var actualSize = true;
    var imageW, imageH;
    function init(evt) {
        image = document.getElementById("image");
        imageW = image.width;
        imageH = image.height;

        image.addEventListener("MSGestureTap", toggleDimensions, false);
        image.addEventListener("MSGestureHold", handleHold, false);

        var gesture = new MSGesture();
        gesture.target = image;

        image.addEventListener("MSPointerDown", function (evt) {
            gesture.addPointer(evt.pointerId);
        }, false);

        image.addEventListener("MSGestureChange", handleChange, false);
    }

    var transform;
    function toggleDimensions(evt) {

        if (actualSize) {
            //fit the image into the window
            image.width = window.outerWidth;
            image.height = window.outerHeight;
            actualSize = false;

            //store current transform
            transform = evt.target.style.msTransform;
            evt.target.style.msTransform = new MSCSSMatrix();
        }
        else {
            //make it the actual size of the image
            image.width = imageW;
            image.height = imageH;
            actualSize = true;

            //reset to transform
            evt.target.style.msTransform = transform;
        }
    }

    function handleHold(evt) {
        evt.preventDefault();

        if (evt.detail & evt.MSGESTURE_FLAG_BEGIN) {
            toggleDimensions(evt);
        }

        if (evt.detail & evt.MSGESTURE_FLAG_END) {
            toggleDimensions(evt);
        }
    }

    var rotatingOrScaling = false;
    function handleChange(evt) {

        if (evt.rotation > 0 || evt.scale !== 1)
            rotatingOrScaling = true;
        else
            rotatingOrScaling = false;

        var MIN_SCALE = .25;
        var MAX_SCALE = 2;

        var scale = evt.scale;
        if (evt.scale > MAX_SCALE)
            scale = 1;

        else if (evt.scale < MIN_SCALE)
            scale = 1;

        // Get the latest CSS transform on the element
        var matrix = new MSCSSMatrix(evt.target.style.transform);

        if (rotatingOrScaling) {

            if (evt.detail == evt.MSGESTURE_FLAG_INERTIA)
                scale = 1;


            evt.target.style.transform = matrix
                    // Apply Scale
                .scale(scale)
                    // Apply Rotation
                .rotate(evt.rotation * 180 / Math.PI);
        }
        else {

            //no inertia allowed on translation
            if (evt.detail == evt.MSGESTURE_FLAG_INERTIA)
                return;

            evt.target.style.transform = matrix
                // Apply Translation
                .translate(evt.translationX, evt.translationY);
        }
    }

})();
