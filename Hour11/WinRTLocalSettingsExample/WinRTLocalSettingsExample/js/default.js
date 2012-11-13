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

    var appData = Windows.Storage.ApplicationData.current;
    var localSettings = appData.localSettings;

    localSettings.values["d"] = "this was stored directly on localSettings";

    var div = document.createElement("div");
    div.innerText = "Data read from local settings: " + localSettings.values["d"];
    document.querySelector("body").appendChild(div);

    var roamingSettings = appData.roamingSettings;
    if (!roamingSettings.values["d"]) {
        roamingSettings.values["d"] =
            "this was stored directly on roamingSettings" + new Date();
    }
    var rdiv = document.createElement("div");
    rdiv.innerText = "Data read from roaming settings: " + roamingSettings.values["d"];
    document.querySelector("body").appendChild(rdiv);

    var sampleContainer = "userPreferences";

    displayData(sampleContainer);

    function displayData(container) {

        //read setting
        var hasContainer = localSettings.containers.hasKey(container);
        if (hasContainer) {
            if (localSettings.containers.lookup(container)
                                        .values.hasKey("data")) {

                var setting = localSettings.containers.lookup(container)
                    .values["data"];

                var p = document.querySelector("p");
                p.innerHTML = toStaticHTML(setting);
            }
        }
    };

    var btnSave = document.getElementById("btnSave");

    btnSave.onclick = function (evt) {
        var dataToSave = document.getElementById("dataToSave");


        createData(sampleContainer);

        displayData(sampleContainer);
    };

    function createData(container) {

        if (localSettings.containers.hasKey(container)) {
            localSettings.containers.lookup(container)
                .values["data"] = dataToSave.value;
        }
        else {

            var createdContainer = localSettings.createContainer(container,
                Windows.Storage.ApplicationDataCreateDisposition.always);

            localSettings.containers[container].values["data"] = dataToSave.value;
        }
    }


    var btnDelete = document.getElementById("btnDelete");

    btnDelete.onclick = function (evt) {
        //delete container
        localSettings.deleteContainer(sampleContainer);
    }

});