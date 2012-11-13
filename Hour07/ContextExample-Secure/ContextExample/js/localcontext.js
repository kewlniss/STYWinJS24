(function () {
    "use strict";

    //we obtained this data from somewhere -- maybe a database
    //maybe from some service over the interwebs
    //bad code was injected into the data
    var data = "<span onmouseover='(function (event) { " +
                "var div = document.createElement(\"div\");" +
                "div.innerText = \"Hacked!!!\"; " +
                "div.style.width = \"100%\"; div.style.height = \"100%\"; " +
                "div.style.backgroundColor = \"#F00\"; " +
                "div.style.fontSize = \"120px\"; " +
                "document.getElementsByTagName(\"body\")[0].innerText = \"\"; " +
                "document.getElementsByTagName(\"body\")[0].appendChild(div); " +
            "})()'>Data set in <b>local context</b></span>";

    addEventListener("DOMContentLoaded",
        function (evt) {
            var lcData = document.getElementById("lcData");
            lcData.innerHTML = window.toStaticHTML(data);

            var target = "ms-appx://" +
                Windows.ApplicationModel.Package.current.id.name;

            window.parent.window.postMessage(data, target);
        }
        , false);
})();
