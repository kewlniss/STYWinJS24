(function () {
    "use strict";
    //Example of creating namespace in one go
    WinJS.Namespace.define("STYWin.Option1", {
        Messaging: {
            sayHello: function () {
                return "Hello today is " +
                    Windows.Globalization.DateTimeFormatting
                        .constructor(new Date()).toLocaleDateString(); + ".";
            }
        },
        Math: {
            add: function (a, b) { return a + b; },
            subtract: function (a, b) { return a - b; }
        }
    });
})();

(function () {
    "use strict";
    //Example of creating namespace that includes private functions
    WinJS.Namespace.define("STYWin.Option2", {
        Messaging: {
            sayHello: sayHello
        },
        Math: {
            add: function (a, b) { return a + b; },
            subtract: function (a, b) { return a - b; }
        }
    });

    function sayHello() {
        return "Hello today is " + privateFunction() + ".";
    }

    function privateFunction() {

        return Windows.Globalization.DateTimeFormatting
            .constructor(new Date()).toLocaleDateString();
    }
})();

(function () {
    "use strict";
    //Example of creating namespace with a parent namespace
    WinJS.Namespace.define("STYWin");
    WinJS.Namespace.defineWithParent(STYWin, "Utility", {
        //public method
        padLeft: function (str, len, pad) {
            str = Array(len + 1 - str.length).join(pad) + str;

            return str;
        }
    });
})();

(function () {
    "use strict";
    WinJS.Namespace.defineWithParent(STYWin, "Utility", {
        Math : WinJS.Class.define( ctor,
            { add: add, subtract: subtract },
            { TAU: function () { return Math.PI * 2; } }
        ),
        Date : WinJS.Class.define( function() {},
            { displayDate: displayDate },
            {}
        ),
        displayFullDate: function () { return displayDate(true); }
    });

    var a, b;

    //typically wouldn't do a math class
    //like this, but demoing the constructor...
    function ctor(num1, num2) {
        a = num1;
        b = num2;
    }

    function add() { return a + b; }

    function subtract() { return a - b; }

    function displayDate(fullYear) {
        var d = new Date();
        return privateWelcomeFunction() +
            (d.getMonth() + 1) + "-" +
            d.getDate() + "-" +
            (fullYear ? d.getFullYear() : d.getYear() - 100);
    }

    function privateWelcomeFunction() { return "Current Date is "; }
})();
