"use strict";
(function () {

    var SessionState = {};
    SessionState.brushSize = STYWin.Settings.brushSize;
    SessionState.selectedColor = STYWin.Settings.color;
    SessionState.unsavedImage = false;

    WinJS.Namespace.define("STYWin.SessionState", SessionState);

})();