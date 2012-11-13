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

    var btnGetContact = document.getElementById("btnGetContact");
    btnGetContact.addEventListener("click", getContact, false);
    function getContact() {
        // Verify that we are unsnapped or can unsnap to open the picker
        var viewState = Windows.UI.ViewManagement.ApplicationView.value;
        if (viewState === Windows.UI.ViewManagement.ApplicationViewState.snapped &&
            !Windows.UI.ViewManagement.ApplicationView.tryUnsnap()) {
            // Fail silently if we can't unsnap
            return;
        };

        // Create the picker
        var picker = new Windows.ApplicationModel.Contacts.ContactPicker();
        picker.commitButtonText = "Select";

        // Open the picker for the user to select contacts
        picker.pickMultipleContactsAsync().done(function (contacts) {
            if (contacts.length > 0) {
                var ouput = document.getElementById("output");
                var li;

                contacts.forEach(function (contact) {

                    li = document.createElement("li");
                    li.innerText = contact.name;

                    output.appendChild(li);
                });


            } else {
                // The picker was dismissed without selecting any contacts
                console.log("No contacts were selected");
            }
        });
    }

});