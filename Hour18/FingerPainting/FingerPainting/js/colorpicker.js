"use strict";
(function () {

    function pickColor() {
        //activate the images
        var element = document.getElementById("palette");
        var divs = element.getElementsByClassName("color");
        for (var idx = 0; idx < divs.length; idx++) {
            divs[idx].addEventListener("click", colorSelected, false);
        }

        //display the flyout
        var flyOut = document.getElementById("pickColorFlyout").winControl;
        flyOut.show(cmdPickColor, "bottom");
    }

    var selectedColor = "#000000";

    function setColor(color) {

        var canvas = document.getElementById("artboard");
        var ctx = canvas.getContext("2d");

        selectedColor = color;

        var element = document.getElementById("selectedColor");
        element.style.backgroundColor = selectedColor;

        ctx.strokeStyle = selectedColor;

        //need to style the appbar icon ...
        var cmdPickColor = document.getElementById("cmdPickColor");
        cmdPickColor.children[0].style.backgroundColor = selectedColor;
    }

    function getColor() {
        return selectedColor;
    }

    var restrictedColors = [
        "#ffffff", "#c0c0c0", "#955a5a", "#ffc0cb",
        "#ffd700", "#adff2f", "#00dd00", "#ff00ff"
    ];

    function colorSelected(evt) {
        evt.preventDefault();

        if (!STYWin.TrialManager.isAddColorPurchased &&
                restrictedColors.indexOf(evt.srcElement.id) >= 0) {
            STYWin.TrialManager.buyAddColor(function () { colorSelected(evt);  });
            return;
        }

        setColor(evt.srcElement.id);

        document.getElementById("pickColorFlyout").winControl.hide();
        STYWin.AppBar.hide();
    }

    WinJS.Namespace.define("STYWin.ColorPicker", {
        pickColor: pickColor
    });

})();