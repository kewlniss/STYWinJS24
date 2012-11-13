(function () {
    "use strict";

    window.addEventListener("message",
        function (evt) {
            var wcData = document.getElementById("wcData");

            wcData.innerHTML = window.toStaticHTML(evt.data);

            //this is bad, but doesn't throw an exception
            //because it is in the web context
            //uncomment to see the iframe get hacked when rolled over
            //wcData.innerHTML = evt.data;

        }, false);
})();
