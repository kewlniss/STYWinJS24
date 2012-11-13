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

    //listen for a message
    window.addEventListener("message", function (evt) {

        //This is good ...
        //we are making sure we are only accepting messages from
        //a source we know (ourselves in this case)
        if (evt.origin !== "ms-appx://" +
         Windows.ApplicationModel.Package.current.id.name.toLowerCase()) {
            return;
        }

        //now that we have received the message we are going to
        //turn around and send it to the web context
        //there is no security benefit to have both the localcontext iframe
        //and the main default.html.  The code could have been combined
        //but wanted to show multiple iframes as well
        var target = "ms-appx-web://" +
            Windows.ApplicationModel.Package.current.id.name;

        //get the message data passed to us
        var data = evt.data;

        var webContext = document.getElementById("webContext");
        //call postMessage on the webContext iFrame
        webContext.contentWindow.postMessage(data, target);

        //this is good ... do this.
        var content = document.getElementById("content");
        content.innerHTML = window.toStaticHTML(data);

        /************************************************************/
        //Windows helps us by throwing an exception if it
        //sees a script injection attempt.  However, this
        //is bad as we should do the above to protect ourselves
        //against the bad data and against an exception
        //uncomment to throw an exception
        /************************************************************/
        /*
        var exceptionContent = document.getElementById("content");
        exceptionContent.innerHTML = data;
        */

        /************************************************************/
        //This is bad ...
        //uncomment to get hacked
        //this does show that if we need to inject script
        //that Windows allows us to do so.  We just have to be
        //very careful that we don't allow any bad script through
        //if this is uncommented, roll the mouse over the span
        //at the very top of the page
        /************************************************************/
        /*
        MSApp.execUnsafeLocalFunction(function () {
            var unsafeContent = document.getElementById("content");
            unsafeContent.innerHTML = data;
        });
        */

        //in general, if HTML isn't needed, 
        //then innerText should be used instead
        //but if it is needed, but no scripts, then
        //toStaticHTML should be used.  If both
        //HTML and Scripts are needed then it is
        //vitally important to sanitize the scripts

    }, false);
})();
