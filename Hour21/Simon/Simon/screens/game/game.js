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
            STYWin.SessionState.gameState = STYWin.Utility.gameStates.menu;

            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = 0;
            }
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });

    var ss = STYWin.SessionState;

    var timeoutId = 0;
    var timeDelayBetweenColors = 1000;
    var easyScore = 50;

    function init() {
        ss.gameState = STYWin.Utility.gameStates.playing;

        //came in from suspend ...
        if (!ss.colors.length > 0) {
            ss.colors = [];
            ss.pickedNewColor = false;
        }
        ss.simonColorIndex = 0;

        //Wait 1.2 seconds after page load to kick off Simon's first move
        timeoutId = setTimeout(simonSelectColor, 1200);
    }

    function simonSelectColor() {
        if (ss.pickedNewColor) {
            ss.pickedNewColor = false;

            //reset pos for player count
            ss.playerColorIndex = 0;

            startPlayerTurn();
            return;
        }

        var color;
        if (ss.colors.length == ss.simonColorIndex) {
            var newColor = generateRandomColor();
            ss.colors.push(newColor);
            ss.pickedNewColor = true;
        }

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(colorSelectedBySimon, timeDelayBetweenColors);
    }

    function colorSelectedBySimon() {
        var color = ss.colors[ss.simonColorIndex];
        lightUpColorAndPlaySound(color);

        //need to increment the position for next color
        ss.simonColorIndex++;

        //Let simon know the color has been selected and he can pick another one
        //or give control back to the user
        simonSelectColor();
    }

    function generateRandomColor() {
        var randomnumber = Math.floor(Math.random() * 4);
        var color;

        switch (randomnumber) {
            case 0:
                color = "blue";
                break;
            case 1:
                color = "red";
                break;
            case 2:
                color = "green";
                break;
            case 3:
                color = "yellow";
                break;
        }

        return color;
    }

    function startPlayerTurn() {
        addButtonEventListeners();
    }

    function addButtonEventListeners() {
        document.getElementById("blue")
            .addEventListener("click", buttonHander, false);
        document.getElementById("red")
            .addEventListener("click", buttonHander, false);
        document.getElementById("green")
            .addEventListener("click", buttonHander, false);
        document.getElementById("yellow")
            .addEventListener("click", buttonHander, false);
    }

    function removeButtonEventListeners() {
        document.getElementById("blue")
            .removeEventListener("click", buttonHander, false);
        document.getElementById("red")
            .removeEventListener("click", buttonHander, false);
        document.getElementById("green")
            .removeEventListener("click", buttonHander, false);
        document.getElementById("yellow")
            .removeEventListener("click", buttonHander, false);
    }

    function buttonHander(evt) {
        var color = evt.srcElement.id;

        if (color == ss.colors[ss.playerColorIndex]) {
            playerChoseWisely(color);
        } else {
            playerChosePoorly();
        }
    }

    function lightUpColorAndPlaySound(color) {
        document.getElementById(color + 'Sound').play();

        return WinJS.UI.Animation.fadeOut(
                    document.querySelector("#" + color)).then(function () {
                        return WinJS.UI.Animation.fadeIn(document.querySelector("#" + color));
                    });
    }

    function playerChoseWisely(color) {
        lightUpColorAndPlaySound(color);

        //increase score
        ss.score += 10;

        ss.playerColorIndex++;

        //player has finished Simon's sequence
        if (ss.playerColorIndex == ss.colors.length) {

            //stop listening for taps
            removeButtonEventListeners();

            //reset Simon's color index
            ss.simonColorIndex = 0;

            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            //hand control back to Simon
            timeoutId = setTimeout(simonSelectColor, 800);
        }
    }

    function playerChosePoorly() {
        removeButtonEventListeners();
        document.getElementById("wrongSound").play();

        var body = document.querySelector("body");
        var bodyColor = body.style.backgroundColor;
        body.style.backgroundColor = "darkred";

        WinJS.UI.Animation.fadeOut(document.querySelectorAll("div"))
            .then(function () {
                return WinJS.UI.Animation.fadeIn(document.querySelectorAll("div"));
            }).then(function () {
                body.style.backgroundColor = bodyColor;

                if (ss.score > easyScore) {
                    STYWin.SessionState.gameState = STYWin.Utility.gameStates.won;
                } else {
                    STYWin.SessionState.gameState = STYWin.Utility.gameStates.lost;
                }
                endGame();
            });
    }

    function endGame() {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = 0;
        }

        ss.colors = [];
        ss.playerColorIndex = 0;
        ss.simonColorIndex = 0;

        if (ss.gameState == STYWin.Utility.gameStates.won) {
            displayWon();
        } else {
            displayLost();
        }
    }

    function displayWon() {

        //do stuff like display fireworks  or some other congrats gesture

        //save high score
        saveScore().then(function (isHighScore) {

            if (isHighScore) {

                //navigate to high scores screen
                WinJS.Navigation.navigate("/screens/scores/scores.html");
            }
            else {
                goToMenu();
            }

        });
    }

    function displayLost() {

        //do stuff

        //navigate to the menu page
        goToMenu();
    }

    function goToMenu() {
        if (WinJS.Navigation.canGoBack) {
            WinJS.Navigation.back();
        } else {
            WinJS.Navigation.navigate("/screens/menu/menu.html");
        }
    }

    function saveScore() {
        var appData = Windows.Storage.ApplicationData.current;
        var roamingSettings = appData.roamingSettings;

        var highScores;

        var name;
        return Windows.System.UserProfile.UserInformation.getDisplayNameAsync()
            .then(function (displayName) {
                name = displayName;

                if (!roamingSettings.values["hs"]) {
                    roamingSettings.values["hs"] =
                        JSON.stringify([{
                            name: displayName,
                            score: ss.score,
                            date: new Date()
                        }]);
                    return true;
                } else {
                    highScores = JSON.parse(roamingSettings.values["hs"]);

                    var d = new Date();
                    highScores.push({ name: displayName, score: ss.score, date: d });

                    highScores.sort(function (a, b) {
                        return b.score - a.score;
                    });

                    //store added high score
                    roamingSettings.values["hs"] = JSON.stringify(highScores);

                    if (highScores.length > 10) {
                        //lowest score removed
                        var droppedScore = highScores.splice(10, 1);
                        //store update list
                        roamingSettings.values["hs"] = JSON.stringify(highScores);
                        if (droppedScore[0].date == d) {
                            return false;
                        } else {
                            //high score!
                            return true;
                        }
                    }
                    else {
                        //high score (hardly any high scores present...)
                        return true;
                    }

                }
            });
    }



})();
