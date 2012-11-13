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

    var formatter = new Windows.Globalization.DateTimeFormatting
                                             .DateTimeFormatter("longtime");

    WinJS.Application.sessionState["abc"] = "123";
    WinJS.Application.local.writeText("MyFile.txt", "What? My Text");
    WinJS.Application.roaming.writeText("RoamingFile.txt", "More Roaming Text");
    WinJS.Application.temp.writeText("TempFile.txt", "Extra Temp Text");

    var applicationData = Windows.Storage.ApplicationData.current;
    var localFolder = applicationData.localFolder;
    var roamingFolder = applicationData.roamingFolder;
    var temporaryFolder = applicationData.temporaryFolder;

    var roamingStorageQuota = applicationData.roamingStorageQuota;

    //Write file out using WinJS
    var file1Promise = WinJS.Application.local
        .writeText("anotherFile.txt", formatter.format(new Date())).then(
            function () {
                displayData("anotherFile.txt - Wrote by WinJS");
            }
        );

    
    // Write data to a file using WinRT
    var file2Promise = writeData(localFolder).then(
            function () {
                displayData("dataFile.txt - Wrote by WinRT");
            }
        );

    //join both promises of writing the files together
    //since we want both completed before we try to read them
    WinJS.Promise.join([file1Promise, file2Promise]) 
        .then(function () {

            WinJS.Application.local.readText("anotherFile.txt", "nothing found in anotherFile.txt").then(
        function (data) {
            displayData("anotherFile.txt: Read by WinJS: " + data);
        });

            var p = document.querySelector("p");
            WinJS.Application.local.readText("dataFile.txt", "nothing to see here").then(
                function (data) {
                    displayData("dataFile.txt: Read by WinJS: " + data);
                });

            readData(localFolder, "dataFile.txt");

            readData(localFolder, "anotherFile.txt");
        });

    function writeData(folder) {
       return folder.createFileAsync("dataFile.txt",
                    Windows.Storage.CreationCollisionOption.replaceExisting)
           .then(function (sampleFile) {
               var timestamp = formatter.format(new Date());

               return Windows.Storage.FileIO.writeTextAsync(sampleFile, timestamp);
           });
    }

    // Read data from a file

    function readData(folder, fileName) {
        folder.getFileAsync(fileName)
           .then(function (sampleFile) {
               return Windows.Storage.FileIO.readTextAsync(sampleFile);
           }).done(function (data) {
               
               displayData(fileName + ": Read by WinRT: " + data);

           }, function () {
               // Timestamp not found
           });
    }


    function displayData(data) {
        var d = document.createElement("div");
        d.innerText = data;

        document.querySelector("body").appendChild(d);
    }
});