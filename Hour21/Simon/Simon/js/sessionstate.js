"use strict";
(function () {

    var SessionState = {};
    SessionState.gameState = STYWin.Utility.gameStates.menu;
    SessionState.colors = [];
    SessionState.simonColorIndex;
    SessionState.pickedNewColor;
    SessionState.playerColorIndex;
    SessionState.score = 0;

    WinJS.Namespace.define("STYWin.SessionState", SessionState);

})();
