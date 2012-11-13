// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    WinJS.strictProcessing();

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            if (args.detail.arguments) {
                var info = document.createElement("div");
                info.innerHTML = toStaticHTML("<p>Launched from secondary tile " +
                        args.detail.tileId + " with the following activation arguments : " +
                        args.detail.arguments + "</p>");
                document.querySelector("body").appendChild(info);
            }
            
            args.setPromise(WinJS.UI.processAll().then(function () {
                STYWin.initAppBar();

                Windows.UI.Notifications.TileUpdateManager
                    .createTileUpdaterForApplication().clear();

                STYWin.sendTileUpdate();

                Windows.UI.Notifications.TileUpdateManager
                    .createTileUpdaterForApplication()
                    .enableNotificationQueue(true);
            }));

        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    app.start();
})();


(function () {
    var secondaryTileId = "LiveTileExample.TileId1";
    var count = 0;

    WinJS.Namespace.define("STYWin", {
        initAppBar: initAppBar,
        sendTileUpdate: sendTileUpdate
    });

    function initAppBar() {
        var btnPinAction = document.getElementById("btnPinAction").winControl;
        if (Windows.UI.StartScreen.SecondaryTile.exists(secondaryTileId)) {
            btnPinAction.label = "Unpin from Start";
            btnPinAction.icon = "unpin";
            btnPinAction.tooltip = "Unpin from Start";
            btnPinAction.element.onclick = unpinSecondaryTile;
        } else {
            btnPinAction.label = "Pin to Start";
            btnPinAction.icon = "pin";
            btnPinAction.tooltip = "Pin to Start";
            btnPinAction.element.onclick = pinSecondaryTile;
        }
    }

    function pinSecondaryTile() {

        count++;
        sendBadgeUpdate();

        var found = Windows.Foundation;
        var uriLogo = new found.Uri("ms-appx:///images/logo.png");
        var uriSmallLogo = new found.Uri("ms-appx:///images/smalllogo.png");
        var uriWideLogo = new found.Uri("ms-appx:///images/widelogo.png");

        var currentTime = new Date();

        var newTileActivationArguments = "timeTileWasPinned=" + currentTime;

        var tile = new Windows.UI.StartScreen.SecondaryTile(secondaryTileId,
            "Awesome Secondary Tile Text",
            "LiveTileExample | Content 123",
            newTileActivationArguments,
            Windows.UI.StartScreen.TileOptions.showNameOnWideLogo,
            uriLogo,
            uriWideLogo);

        tile.smallLogo = uriSmallLogo;
        tile.foregroundText = Windows.UI.StartScreen.ForegroundText.dark;

        var btnPinAction = document.getElementById("btnPinAction");
        var selectionRect = btnPinAction.getBoundingClientRect();
        selectionRect.x = selectionRect.left;
        selectionRect.y = selectionRect.top;

        tile.requestCreateForSelectionAsync(selectionRect).done(function (isCreated) {
            if (isCreated) {
                console.log("Secondary tile was pinned successfully.");
            } else {
                console.log("Secondary tile was not pinned.");
            }
            initAppBar();
        });
    }

    function unpinSecondaryTile() {

        var start = Windows.UI.StartScreen;
        var tileToGetDeleted = new start.SecondaryTile(secondaryTileId);
        tileToGetDeleted.requestDeleteAsync().done(function (isCreated) {
            if (isCreated) {
                console.log("Secondary tile was unpinned successfully.");
            } else {
                console.log("Secondary tile was not unpinned.");
                notifications.BadgeUpdateManager.createBadgeUpdaterForApplication().clear();

            }
            initAppBar();
        });
    }

    function sendBadgeUpdate() {
        var notifications = Windows.UI.Notifications;
    
        var badgeType = notifications.BadgeTemplateType.badgeNumber;
        //var badgeType = notifications.BadgeTemplateType.badgeGlyph;
        var badgeXml = notifications.BadgeUpdateManager.getTemplateContent(badgeType);

        var badge = badgeXml.getElementsByTagName("badge");

        badge[0].setAttribute("value", count);
        //badge[0].setAttribute("value", "newMessage");

        var badgeNotification = new notifications.BadgeNotification(badgeXml);
        notifications.BadgeUpdateManager
                .createBadgeUpdaterForApplication()
                .update(badgeNotification);
    }

    function sendTileUpdate() {
        var notifications = Windows.UI.Notifications;

        var template = notifications.TileTemplateType.tileWidePeekImage05;
        var tileXml = notifications.TileUpdateManager.getTemplateContent(template);


        var tileTextElements = tileXml.getElementsByTagName("text");
        tileTextElements[0].appendChild(tileXml.createTextNode("Text Header Field 1"));
        tileTextElements[1].appendChild(tileXml.createTextNode("Text Field 2"));

        var tileImages = tileXml.getElementsByTagName("image");
        tileImages[0].setAttribute("src", "ms-appx:///images/imageWide1.png");
        tileImages[0].setAttribute("alt", "wide image text");
        tileImages[1].setAttribute("src", "ms-appx:///images/imageSmall1.png");
        tileImages[1].setAttribute("alt", "small image text");

        var squareTemplate = notifications.TileTemplateType.tileSquarePeekImageAndText01;
        var squareTileXml = notifications.TileUpdateManager
                                    .getTemplateContent(squareTemplate);

        var squareTileTextElements = squareTileXml.getElementsByTagName("text");
        squareTileTextElements[0].appendChild(squareTileXml
            .createTextNode("Text Header Field 1"));
        squareTileTextElements[1].appendChild(squareTileXml
            .createTextNode("Text Field 2"));
        squareTileTextElements[2].appendChild(squareTileXml
            .createTextNode("Text Field 3"));
        squareTileTextElements[3].appendChild(squareTileXml
            .createTextNode("Text Field 4"));

        var squareTileImages = squareTileXml.getElementsByTagName("image");
        squareTileImages[0].setAttribute("src", "ms-appx:///images/imageSmall1.png");
        squareTileImages[0].setAttribute("alt", "small image text");

        //combine them
        var node = tileXml.importNode(squareTileXml
                        .getElementsByTagName("binding").item(0), true);
        tileXml.getElementsByTagName("visual").item(0).appendChild(node);


        var tileNotification = new notifications.TileNotification(tileXml);

        //var currentTime = new Date();
        //1.5 minutes (60*1000*1.5)
        //tileNotification.expirationTime = new Date(currentTime.getTime() + 90000);
        notifications.TileUpdateManager.createTileUpdaterForApplication()
                                                        .update(tileNotification);

        sendSecondTileUpdate();
        sendThirdTileUpdate();
    }


    function sendSecondTileUpdate() {
        var notifications = Windows.UI.Notifications;

        var template = notifications.TileTemplateType.tileWideSmallImageAndText01;
        var tileXml = notifications.TileUpdateManager.getTemplateContent(template);


        var tileTextElements = tileXml.getElementsByTagName("text");
        tileTextElements[0].appendChild(tileXml.createTextNode("Text Header Field 1"));

        var tileImages = tileXml.getElementsByTagName("image");
        tileImages[0].setAttribute("src", "ms-appx:///images/imageWide2.png");
        tileImages[0].setAttribute("alt", "wide image text");

        var squareTemplate = notifications.TileTemplateType.tileSquareText02;
        var squareTileXml = notifications.TileUpdateManager
                                    .getTemplateContent(squareTemplate);

        var squareTileTextElements = squareTileXml.getElementsByTagName("text");
        squareTileTextElements[0].appendChild(squareTileXml
            .createTextNode("Text Header Field 1"));
        squareTileTextElements[1].appendChild(squareTileXml
            .createTextNode("Text Field 2"));

        //combine them
        var node = tileXml.importNode(squareTileXml
                        .getElementsByTagName("binding").item(0), true);
        tileXml.getElementsByTagName("visual").item(0).appendChild(node);


        var tileNotification = new notifications.TileNotification(tileXml);
        tileNotification.tag = "tileUpdate2";

        notifications.TileUpdateManager.createTileUpdaterForApplication()
                                                        .update(tileNotification);

    }



    function sendThirdTileUpdate() {
        var notifications = Windows.UI.Notifications;

        var template = notifications.TileTemplateType.tileWidePeekImage05;
        var tileXml = notifications.TileUpdateManager.getTemplateContent(template);


        var tileTextElements = tileXml.getElementsByTagName("text");
        tileTextElements[0].appendChild(tileXml.createTextNode("Text Header Field 1"));
        tileTextElements[1].appendChild(tileXml.createTextNode("Text Field 2"));

        var tileImages = tileXml.getElementsByTagName("image");
        tileImages[0].setAttribute("src", "ms-appx:///images/imageWide3.png");
        tileImages[0].setAttribute("alt", "wide image text");
        tileImages[1].setAttribute("src", "ms-appx:///images/imageSmall3.png");
        tileImages[1].setAttribute("alt", "small image text");

        var squareTemplate = notifications.TileTemplateType.tileSquarePeekImageAndText01;
        var squareTileXml = notifications.TileUpdateManager
                                    .getTemplateContent(squareTemplate);

        var squareTileTextElements = squareTileXml.getElementsByTagName("text");
        squareTileTextElements[0].appendChild(squareTileXml
            .createTextNode("Text Header Field 1"));
        squareTileTextElements[1].appendChild(squareTileXml
            .createTextNode("Text Field 2"));
        squareTileTextElements[2].appendChild(squareTileXml
            .createTextNode("Text Field 3"));
        squareTileTextElements[3].appendChild(squareTileXml
            .createTextNode("Text Field 4"));

        var squareTileImages = squareTileXml.getElementsByTagName("image");
        squareTileImages[0].setAttribute("src", "ms-appx:///images/imageSmall3.png");
        squareTileImages[0].setAttribute("alt", "small image text");

        //combine them
        var node = tileXml.importNode(squareTileXml
                        .getElementsByTagName("binding").item(0), true);
        tileXml.getElementsByTagName("visual").item(0).appendChild(node);


        var tileNotification = new notifications.TileNotification(tileXml);

        tileNotification.tag = "tileUpdate3";

        notifications.TileUpdateManager.createTileUpdaterForApplication()
                                                        .update(tileNotification);

    }


})();

