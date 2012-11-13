(function() {

    //This code demonstrates that
    //we can call into the Windows Runtime
    //through the projection the OS provides.

    //This is not using the added Windows Library
    //for JavaScript (WinJS).  We should definitely
    //use WinJS, but this is to show it is indeed
    //separate from the projection layer
    document.addEventListener("DOMContentLoaded", function (event) {
        var btn = document.getElementById("btn");
        btn.onclick = showMessage;
    });


    function showMessage() {
        var messageDialog =
            new Windows.UI.Popups.MessageDialog("My message dialog");

        messageDialog.showAsync();
    }

})();


/*

alert("my message");

window.alert = function (message) {
    var messageDialog =
        new Windows.UI.Popups.MessageDialog(message);

    return messageDialog.showAsync();
};
*/