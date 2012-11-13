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

    function displayData(data) {
        var d = document.createElement("div");
        d.innerText = data;

        document.querySelector("body").appendChild(d);
    }

    var pkg = Windows.ApplicationModel.Package.current;
    var installedLocation = pkg.installedLocation;

    displayData("Installed Location: " + installedLocation.path);

    //Load text file from our local app package
    installedLocation.getFileAsync("textfile.txt")
    .then(function (textFileBlob) {
        var reader = new FileReader();
        reader.readAsText(textFileBlob);
        reader.onload = function (evt) {
            var fileString = evt.target.result;
            displayData(fileString);
        }
    });


    installedLocation.getFileAsync("images\\logo.png")
        .then(function (logoFile) {
            //work with logoFile
            readInImage(logoFile);
        });  

    // Reads in an image file
    function readInImage(storageFile) {
        if (storageFile) {

            var loadStream = null;
            var imageProperties = null;
            storageFile.openAsync(Windows.Storage.FileAccessMode.read).then(
                function (stream) {

                    loadStream = stream;

                    // since we return the promise, 
                    //it will be executed before the following .done
                    return storageFile.properties.getImagePropertiesAsync();
                }
            ).done(
                function (imageProperties) {

                    var canvas = document.createElement("canvas");
                    //size of image is 150 plus we want 2px image around all sides
                    var w = 154;
                    var h = 154;

                    canvas.width = w;
                    canvas.height = h;

                    var url = URL.createObjectURL(storageFile, { oneTimeOnly: true });

                    displayData("url: " + url);

                    var imageObj = new Image(150, 150);
                    imageObj.onload = function () {

                        //clear canvas to an orange background and white border
                        var ctx = canvas.getContext("2d");

                        ctx.fillStyle = "white";
                        ctx.fillRect(0, 0, w, h);

                        ctx.fillStyle = "orange";
                        ctx.fillRect(2, 2, w-4, h-4);

                        //draw the image on the canvas
                        ctx.drawImage(imageObj, 2, 2, w-4, h-4);
                    };

                    imageObj.src = url;

                    // input stream is IClosable interface and requires explicit close
                    loadStream.close();

                    document.querySelector("body").appendChild(canvas);
                },
                function (e) {
                    displayData("Load failed.");

                    // if the error occurred after the stream was opened,
                    //close the stream
                    if (loadStream) {
                        loadStream.close();
                    }
                }
            );
        }
    }

    addImage();

    function addImage() {

        var i = document.createElement("img");

        var image = "ms-appx://CustomAppPackageName/images/logo.png";

        displayData("image from: " + image);

        i.src = image;
        i.style.border = "solid 2px blue";

        document.querySelector("body").appendChild(i);
    }
});