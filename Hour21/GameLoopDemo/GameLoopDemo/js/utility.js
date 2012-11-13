"use strict";
(function () {

    var gameStates = {
        paused: 0,
        playing: 1,
        menu: 2,
        scores: 3,
        won: 4,
        lost: 5
    }

    WinJS.Namespace.define("STYWin.Utility", {
        gameStates: gameStates
    });
})();
