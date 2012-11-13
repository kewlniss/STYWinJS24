(function () {
    "use strict";

    window.addEventListener("message",
        function (evt) {
            var wcData = document.getElementById("wcData");

            wcData.innerHTML = window.toStaticHTML(evt.data);

        }, false);
})();
