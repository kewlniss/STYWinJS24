(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    WinJS.strictProcessing();

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {

            args.setPromise(
                WinJS.UI.processAll().done(function () {
                    addDateControls();
                    hookUpEventHandlers();
                })
            );
        }
    };

    app.start();

    var purchasedItem = false;

    function addDateControls() {
        //create div to hold our date control
        var independenceDayDiv = document.createElement("div");

        //store the date in a variable (not required, could use a string)
        //Month is 0 based
        var date = new Date(1776, 7-1, 4);

        //since year is 1776, need to set min and max year as the defaults
        //(1912-2111: 100 years past and 99 years in the future)
        //doesn't include 1776
        var independenceDay = new WinJS.UI.DatePicker(independenceDayDiv,
                                { current: date, minYear: 1607, maxYear: 1807 });

        //append this child to end of the body element
        document.getElementById("dates").appendChild(independenceDayDiv);
    }


    function hookUpEventHandlers() {
        //Hook up the main buy item button on the page
        var btnBuyItem = document.getElementById("btnBuyItem");
        btnBuyItem.addEventListener("click", showConfirmPurchaseFlyout, false);

        //hook up the confirm purchase button in the flyout control
        var btnConfirmPurchase = document.getElementById("btnConfirmPurchase");
        btnConfirmPurchase.addEventListener("click", completeItemPurchase, false);

        //hook up context menu
        var btnShowMenu = document.getElementById("btnShowMenu");
        btnShowMenu.addEventListener("click", showOptionsMenu, false);

        //hook up menu options
        document.getElementById("cmdOption1")
            .addEventListener("click", handleSelectedOption, false);
        document.getElementById("cmdOption2")
            .addEventListener("click", handleSelectedOption, false);
        document.getElementById("cmdOption3")
            .addEventListener("click", handleSelectedOption, false);

        //before the tooltip opens notify us so we can set the text
        var toggleTooltip = document.getElementById("toggleTooltip");
        toggleTooltip.addEventListener("beforeopen", setTooltip, false);
    }

    //called when the buy item button on the main page is clicked
    function showConfirmPurchaseFlyout(event) {
        var btnBuyItem = document.getElementById("btnBuyItem");
        document.getElementById("confirmPurchaseFlyout")
            .winControl.show(btnBuyItem);
    }

    //called when the purchase button in the flyout control is clicked
    function completeItemPurchase() {
        var purchaseItemMessage = document.getElementById("purchaseItemMessage");

        if (!purchasedItem) {
            purchasedItem = true;

            purchaseItemMessage.innerText = "Purchased! Thank you, please enjoy.";
        }
        else
            purchaseItemMessage.innerText = "Duplicate. Ignoring request.";

        document.getElementById("confirmPurchaseFlyout").winControl.hide();
    }

    function showOptionsMenu(event) {
        var btnShowMenu = document.getElementById("btnShowMenu");
        document.getElementById("contextMenu").winControl.show(btnShowMenu);
    }

    function handleSelectedOption(evt) {
        var data = evt.currentTarget.getAttribute("data-option");
        var menuMessage = document.getElementById("menuMessage");

        menuMessage.innerText = data + " was selected";
    }

    function setTooltip(event) {
        var toggleSwitch = document.getElementById("toggleSwitch");

        var toggleTooltip = document.getElementById("toggleTooltip");

        toggleTooltip.winControl.innerHTML = "Tap to turn Autosave " +
                            (toggleSwitch.winControl.checked ? "off" : "on");
    }

})();
