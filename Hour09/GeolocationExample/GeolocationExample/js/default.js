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

    document.addEventListener("DOMContentLoaded", init, false);

    function init(evt) {

        var results = document.getElementById("results");

        var locator = new Windows.Devices.Geolocation.Geolocator();

        locator.getGeopositionAsync().then(function (pos) {
            var coor = pos.coordinate;

            /*
            var address = pos.civicAddress;

            var accuracy = coor.accuracy;
            var altitude = coor.altitude;
            var altitudeAccuracy = coor.altitudeAccuracy;
            var heading = coor.heading;
            var speed = coor.speed;
            var timestamp = coor.timestamp;
            */

            var lat = coor.latitude;
            var long = coor.longitude;
            var url =
                'http://api.wikilocation.org/articles?radius=10000&limit=20&lat='
                + lat + "&lng=" + long;
            return WinJS.xhr({ url: url });
        }).then(function (xhr) {
            var data = JSON.parse(xhr.response);

            results.innerHTML = "";
            for (var i = 0; i < data.articles.length; i++) {
                results.innerHTML += toStaticHTML("<p>distance: " +
                    data.articles[i].distance + " <a href='" +
                    data.articles[i].url + "'>" +
                    data.articles[i].title + "</a></p>");
            }

            return data;
        }).then(null, function (err) {
            results.innerText = "ERROR:" + err;
        });
    }

})();
