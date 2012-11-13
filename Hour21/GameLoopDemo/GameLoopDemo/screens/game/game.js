// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/screens/game/game.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            init();
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.

            STYWin.SessionState.gameState = STYWin.Utility.gameStates.menu;
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });

    var count = 0;

    function init() {
        STYWin.SessionState.gameState = STYWin.Utility.gameStates.playing;

        //could initilize count, if we wanted to reset the game from menu state
        //count = 0;

        update();

        drawLoop();
    }

    function update() {

        if (STYWin.SessionState.gameState == STYWin.Utility.gameStates.menu)
            return;

        //do stuff (like call AI, or physics, and handle non event input)
        count++;

        //call update ~30 times a second for a fixed time step
        setTimeout(update, 33);

        //alternatively, could call update as soon as possible
        //msSetImmediate(function () { update(currentTime); });
        //would want to keep track of timing to handle
        //things like physics and AI appropriately
    }
    
    function drawLoop() {

        //could check for other things - may want to display the last frame but 
        //"grayed out"
        //for this, we are navigating away from the page, so we are just not drawing 
        //any more.
        if (STYWin.SessionState.gameState != STYWin.Utility.gameStates.playing)
            return;

        window.requestAnimationFrame(drawLoop);

        draw();
    }

    function draw() {
        document.querySelector("p").innerText = count.toString();
    }

})();
