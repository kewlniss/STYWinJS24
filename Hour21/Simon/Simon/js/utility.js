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

    function formatDate(date) {
        var dateFormatter = new Windows.Globalization
            .DateTimeFormatting.DateTimeFormatter("year month day dayofweek");

        var timeFormatter = new Windows.Globalization
            .DateTimeFormatting.DateTimeFormatter("hour minute second");

        var d = new Date(date);
        return dateFormatter.format(d) + " @ " + timeFormatter.format(d);
    }


    WinJS.Namespace.define("STYWin.Utility", {
        gameStates: gameStates,
        formatDate: WinJS.Binding.converter(formatDate)
    });
})();
