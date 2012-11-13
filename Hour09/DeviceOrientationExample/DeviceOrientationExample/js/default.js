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

    function init() {

        var gyro = Windows.Devices.Sensors.Gyrometer.getDefault();
        if (gyro) {
            //uncomment to only get updates 60 times a second
            //var reportInterval = gyro.minimumReportInterval > 16 ? gyro.minimumReportInterval : 16;
            //gyro.reportInterval = reportInterval;

            //explicitly setting the reportInterval to 0
            gyro.reportInterval = 0;

            gyro.addEventListener("readingchanged", onGyroReadingChanged);
        }

        var inclinometer = Windows.Devices.Sensors.Inclinometer.getDefault();
        if (inclinometer) {
            inclinometer.reportInterval = 0;

            inclinometer.addEventListener("readingchanged", onInclReadingChanged);
        }

        //set toy5 to the Identity Matrix (no rotation, transformation or scaling)
        document.getElementById('toy5').style.transform = "matrix3d(" +
            "1,0,0,0," +
            "0,1,0,0," +
            "0,0,1,0," +
            "0,0,0,1)";

        var orientationSensor = Windows.Devices.Sensors.OrientationSensor.getDefault();
        if (orientationSensor) {
            orientationSensor.reportInterval = 0;

            orientationSensor.addEventListener("readingchanged",
                                                onOrientationReadingChanged);
        }

        var toggle = 0;
        var accel = Windows.Devices.Sensors.Accelerometer.getDefault();
        if (accel) {
            accel.onshaken = function (evt) {
                toggle++;
                var toys = document.querySelectorAll(".toy");
                var i;
                for (i = 0; i < toys.length; i++) {
                    if (toggle % 2) {
                        toys[i].style.backgroundColor = "blue";
                    } else {
                        toys[i].style.backgroundColor = "green";
                    }
                }
            }
        }

    }

    function onGyroReadingChanged(evt) {
        var lblGyroDetail = document.getElementById("lblGyroDetail");

        lblGyroDetail.innerText = evt.reading.angularVelocityX.toFixed(6) +
            ", " + evt.reading.angularVelocityY.toFixed(6) +
            ", " + evt.reading.angularVelocityZ.toFixed(6);

    }

    function onInclReadingChanged(evt) {
        document.getElementById('toy1').style.transform =
            "rotateX(" + evt.reading.pitchDegrees + "deg)";

        document.getElementById('toy2').style.transform =
            "rotateY(" + evt.reading.rollDegrees + "deg)";

        document.getElementById('toy3').style.transform =
            "rotateZ(" + evt.reading.yawDegrees + "deg)";

        document.getElementById('toy4').style.transform =
            "rotateX(" + evt.reading.pitchDegrees + "deg) " +
            "rotateY(" + evt.reading.rollDegrees + "deg) " +
            "rotateZ(" + evt.reading.yawDegrees + "deg)";
    }

    function onOrientationReadingChanged(evt) {

        var rot = evt.reading.rotationMatrix;
        var q = evt.reading.quaternion;

        lblDetail.innerHTML = toStaticHTML(
            rot.m11.toFixed(6) + " " + rot.m12.toFixed(6) + " " + rot.m13.toFixed(6)
            + "<br>" +
            rot.m21.toFixed(6) + " " + rot.m22.toFixed(6) + " " + rot.m23.toFixed(6)
            + "<br>" +
            rot.m31.toFixed(6) + " " + rot.m32.toFixed(6) + " " + rot.m33.toFixed(6)
            + "<br> " +
            q.w.toFixed(6) + " " + q.x.toFixed(6) + " " + q.y.toFixed(6)
                                                            + " " + q.z.toFixed(6));

        document.getElementById('toy6').style.transform = "matrix3d(" +
            rot.m11 + "," + rot.m12 + "," + rot.m13 + ",0,"
            + rot.m21 + "," + rot.m22 + "," + rot.m23 + ",0,"
            + rot.m31 + "," + rot.m32 + "," + rot.m33 + ",0,"
            + "0,0,0,1)";

    };

})();