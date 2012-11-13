(function () {
    "use strict";

    //Example of hello world control inside the STYWin.UI namespace
    //By using WinJS.Namespace.define we get access to processAll functionality
    WinJS.Namespace.define("STYWin.UI", {
        /// <summary locid="STYWin.UI.CustomDateControl">Displays the date for today.</summary>
        /// <name locid="STYWin.UI.CustomDateControl_name">Date Picker</name>
        /// <icon src="ui_winjs.ui.datepicker.12x12.png" width="12" height="12" />
        /// <icon src="ui_winjs.ui.datepicker.16x16.png" width="16" height="16" />
        /// <htmlSnippet><![CDATA[<div data-win-control="STYWin.UI.CustomDateControl"></div>]]></htmlSnippet>
        /// <resource type="javascript" src="/customdatecontrol/customdatecontrol.js" />
        /// <resource type="css" src="/customdatecontrol/customdatecontrol.css" />
        CustomDateControl: WinJS.Utilities.markSupportedForProcessing(
            function (element, options) {
                /// <signature helpKeyword="STYWin.UI.CustomDateControl.CustomDateControl">
                /// <summary locid="STYWin.UI.CustomDateControl.constructor">Initializes a new instance of the DatePicker control</summary>
                /// <param name="element" type="HTMLElement" domElement="true" locid="STYWin.UI.CustomDateControl.constructor_p:element">
                /// The DOM element associated with the CustomDate control.
                /// </param>
                /// <param name="options" type="Object" locid="STYWin.UI.CustomDateControl.constructor_p:options">
                /// The set of options to be applied initially to the CustomDate control.
                /// </param>
                /// <returns type="STYWin.UI.CustomDateControl" locid="STYWin.UI.CustomDateControl.constructor_returnValue">A constructed CustomDate control.</returns>
                /// </signature>

                //create an element if one wasn't passed to us
                element = element || document.createElement("div");

                //Use WinJS setOptions helper to turn options
                //into actual objects
                WinJS.UI.setOptions(this, options);

                //dynamically create div we need to work with
                var ctl = document.createElement("div");
                ctl.classList.add("customdatecontrol");

                //check option passed in to see how we should 
                //effect this control
                if (options.yearFormat === 4) {
                    ctl.textContent = STYWin.Utility.displayDate(true);
                }
                else {
                    ctl.textContent = STYWin.Utility.displayDate(false);
                }

                //add the div to the element
                element.appendChild(ctl);

                //create a two-way reference so
                //we can access this control from the div
                //or acecss the div from the actual control itself
                element.winControl = this;
                this.element = element;
            })
    });
})();
