//example of the helloWorld Control (in global space)
var SimpleCustomControl = WinJS.Utilities.markSupportedForProcessing(
    function (element, options) {

        element = element || document.createElement("div");
        element.textContent = "Global Space Hello World Control!";

        //set the winControl to this control
        element.winControl = this;

        //set the element property of this control to the DOM element
        this.element = element;
    });



function TestIntelliSense(name, number, childObject) {
    /// <signature helpKeyword="TestIntelliSense">
    /// <summary locid="TestIntelliSense">Summary for TestIntelliSense function
    ///</summary>
    /// <param name="name" type="String" locid="TestIntelliSense_p:name">
    /// The name of the thing.
    /// </param>
    /// <param name="number" type="Number" locid="TestIntelliSense_p:number">
    /// The number of stuff for TestIntelliSense to do.
    /// </param>
    /// <param name="childObject" type="Object"
    /// locid="TestIntelliSense_p:childObject">
    /// The child object to passed into the function so stuff can happen.
    /// </param>
    /// <returns type="Number" locid="TestIntelliSense_returnValue">Returns the
    /// number of items in the object that matter.</returns>
    /// </signature>

    return 0;
}