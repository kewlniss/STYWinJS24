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
            args.setPromise(WinJS.UI.processAll());
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

WinJS.Utilities.ready(function () {

    var customerList = new WinJS.Binding.List();
    var customers = [];
    var db = null;
    var databaseName = "CustomerDatabase";
    var objectStoreName = "customer";
    var objectStore = null;
    var version = 1;

    initData();
    initDatabase();

    function initDatabase() {
        var request = window.indexedDB.open(databaseName, version);
        request.onsuccess = function (evt) {
            db = request.result;
        };

        request.onerror = function (evt) {
            handleError(evt);
        };

        request.onupgradeneeded = function (evt) {
            db = evt.currentTarget.result;
            var objectStore = db.createObjectStore(objectStoreName, {
                keyPath: "id",
                autoIncrement: true
            });

            objectStore.createIndex( "customerNumber", "customerNumber",
                { unique: true });
            objectStore.createIndex("fullName", "fullName",
                { unique: false });
            objectStore.createIndex("firstName", "firstName",
                { unique: false });
            objectStore.createIndex("lastName", "lastName",
                { unique: false });
            objectStore.createIndex("email", "email",
                { unique: true });
            objectStore.createIndex("invoiceDate", "invoiceDate",
                { unique: false });
        }
    };

    function handleError(evt) {
        var output = document.getElementById("printOutput");

        output.innerHTML = evt.target.error.name;
    };


    function addCustomers() {
        var output = document.getElementById("printOutput");
        for (i in customers) {
            var request = objectStore.add(customers[i]);

            request.onsuccess = function (evt) {
                // do something after the add succeeded
            };

            request.onerror = function (evt) {
                output.innerHTML += toStaticHTML(evt.target.error.name + "<br />");
            };
        }

    }

    function initData() {
        for (var i = 0; i < 100; i++) {
            var fn = "First" + i.toString();
            var ln = "Last" + i.toString();
            customers.push(
                {
                    customerNumber: "AB12DE" + i.toString(),
                    firstName: fn,
                    lastName: ln,
                    fullName: fn + " " + ln,
                    invoiceDate: new Date(2012, i % 12, i % 28),
                    email: fn + "." + ln + "@emailaddy.com"
                });
        }
    }

    hookUpButtons();
    function hookUpButtons() {
        var btnAdd = document.getElementById("btnAdd");
        var btnDelete = document.getElementById("btnDelete");
        var btnPrint = document.getElementById("btnPrint");
        var btnAddAll = document.getElementById("btnAddAll");
        var btnGet = document.getElementById("btnGet");

        btnGet.addEventListener("click", function () {
            var id = document.getElementById("txtID").value;

            var transaction = db.transaction(objectStoreName, "readonly");
            objectStore = transaction.objectStore(objectStoreName);
            var request = objectStore.get(parseInt(id));

            request.onsuccess = function (evt) {
                // show it
                var record = evt.target.result;

                var firstName = document.getElementById("txtFirstName");
                var lastName = document.getElementById("txtLastName");
                var fullName = firstName.value + " " + lastName.value;
                var customerNumber = document.getElementById("txtCustomerNumber");
                var invoiceDate = document.getElementById("InvoiceDate");
                var email = document.getElementById("txtEmail");

                if (record === undefined) {
                    document.getElementById("printOutput").innerHTML = "No Record Found";
                    return;
                }

                firstName.value = record.firstName;
                lastName.value = record.lastName;
                customerNumber.value = record.customerNumber;
                invoiceDate.winControl =
                    new WinJS.UI.DatePicker(invoiceDate, {
                        current: record.invoiceDate
                    });
                email.value = record.email;

                var id = document.getElementById("txtID");
                id.value = record.id;
            };

            request.onerror = handleError;

        }, false);

        btnAddAll.addEventListener("click", function () {

            var transaction = db.transaction(objectStoreName, "readwrite");
            objectStore = transaction.objectStore(objectStoreName);

            addCustomers();
        }, false);

        btnAdd.addEventListener("click", function () {
            var firstName = document.getElementById("txtFirstName");
            var lastName = document.getElementById("txtLastName");
            var fullName = firstName.value + " " + lastName.value;
            var customerNumber = document.getElementById("txtCustomerNumber");
            var invoiceDate = document.getElementById("InvoiceDate");
            var email = document.getElementById("txtEmail");

            var id = document.getElementById("txtID");

            var update = false;
            var recordId = parseInt(id.value);
            if (recordId > 0) {
                update = true;
            }

            var transaction = db.transaction(objectStoreName, "readwrite");
            objectStore = transaction.objectStore(objectStoreName);

            var obj = {
                customerNumber: customerNumber.value,
                fullName: fullName,
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                invoiceDate: invoiceDate.winControl.current
            };
            var request;
            if (update) {
                obj.id = recordId;
                request = objectStore.put(obj);
            } else {
                request = objectStore.add(obj);
            }

            request.onsuccess = function (evt) {
                // clear controls

                firstName.value = "";
                lastName.value = "";
                fullName.value = "";
                customerNumber.value = "";
                email.value = "";
            };

            request.onerror = handleError;

        }, false);

        btnDelete.addEventListener("click", function () {
            var id = document.getElementById("txtID");

            var transaction = db.transaction(objectStoreName, "readwrite");
            objectStore = transaction.objectStore(objectStoreName);
            var request = objectStore.delete (parseInt(id.value));
            request.onsuccess = function (evt) {
                // It's gone!  
                var output = document.getElementById("printOutput");
                output.textContent = "Row Deleted!";

                id.value = "";
            };

            request.onerror = handleError;

        }, false);

        btnPrint.addEventListener("click", function () {
            var output = document.getElementById("printOutput");
            output.textContent = "";

            var transaction = db.transaction(objectStoreName, "readonly");
            objectStore = transaction.objectStore(objectStoreName);

            var request = objectStore.openCursor();
            request.onsuccess = function (evt) {
                var cursor = evt.target.result;
                if (cursor) {
                    output.innerHTML += toStaticHTML("id: " + cursor.key + " is "
                        + cursor.value.customerNumber + " " + "("
                        + cursor.value.firstName + "; " + cursor.value.lastName
                        + "; " + cursor.value.fullName + "; "
                        + cursor.value.customerNumber + "; "
                        + cursor.value.invoiceDate + "; " + cursor.value.email
                        + ")" + "<br />");
                    cursor.continue();
                }
                else {
                    console.log("No more entries!");
                }
            };
        }, false);
    }

    function deleteDatabase() {
        db.close();
        indexedDB.deleteDatabase(databaseName);
    }

});