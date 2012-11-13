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
})();

WinJS.Utilities.ready(function () {


    WinJS.xhr({ url: "http://www.microsoft.com", responseType: "arraybuffer" })
    .done(function (result) {
        var arrayResponse = result.response;
        var dataview = new DataView(arrayResponse);
        var ints = new Uint32Array(arrayResponse.byteLength / 4);

        xhrDiv1.innerText = "Array is " + ints.length + " uints long";
    });



    //Video being displayed from: http://www.w3.org/2010/05/video/mediaevents.html
    WinJS.xhr({
        url: "http://media.w3.org/2010/05/sintel/trailer.mp4",
        responseType: "blob"
    })
    .done(function (request) {
        var videoBlob = URL.createObjectURL(request.response, { oneTimeOnly: true });
        var video = document.getElementById("vid");
        video.src = videoBlob;
    },
    function (err) {
        video.innerHTML = err;
    });

    WinJS.xhr({ url: "http://www.msdn.microsoft.com/library", responseType: "text" })
    .done(
        function (request) {
            var text = request.responseText;
            var subText = text.substring(text.indexOf("Welcome"), text.indexOf("services.") + 9);
            xhrDiv3.innerHTML = subText;
        });


    var btnGet = document.getElementById("btnGet");
    btnGet.addEventListener("click", loadMicrosoftdotcom, false);

    loadMicrosoftdotcom();

    function loadMicrosoftdotcom(evt) {
        WinJS.xhr({ url: "http://www.microsoft.com" })
            .done(function complete(result) {
                xhrDiv4.innerText = "Downloaded the page";
            });

    }

    WinJS.xhr({
        url: "http://api.geonames.org/citiesJSON?" +
            "north=44.1&south=-9.9&east=-22.4&west=55.2&lang=de&username=demo",
        responseType: "json"
    })
    .done(
        function (request) {
            var geo = JSON.parse(request.responseText);

            var geoname = geo.geonames[0];
            xhrDiv5.innerHTML = geoname.toponymName + ", " + geoname.countrycode;
            xhrDiv6.innerHTML = request.responseText;
        });

});