/* global MozActivity, alert, console, Notification */
"use strict";
(function () {

    // Cross domain XHR
    var crossDomainXHR = document.querySelector("#cross-domain-xhr"),
        crossDomainXHRDisplay = document.querySelector("#cross-domain-xhr-display");
    if (crossDomainXHR && crossDomainXHRDisplay) {
        crossDomainXHR.onclick = function () {
            var xhr = new XMLHttpRequest({mozSystem: true});
            xhr.open("GET", "http://bjarnason.to:8080/api/contacts", true);
            xhr.onreadystatechange = function () {
                if (xhr.status === 200 && xhr.readyState === 4) {
                    crossDomainXHRDisplay.innerHTML = "<h4>Result from Cross-domain XHR</h4>" + xhr.response;
                    crossDomainXHRDisplay.style.display = "block";
                }
            };

            xhr.onerror = function () {
                crossDomainXHRDisplay.innerHTML = "<h4>Result from Cross-domain XHR</h4><p>Cross-domain XHR failed</p>";
                crossDomainXHRDisplay.style.display = "block";
            };
            xhr.send();
        };
    }

    // List contacts
    var getAllContacts = document.querySelector("#get-all-contacts"),
        getAllContactsDisplay = document.querySelector("#get-all-contacts-display");
    if (getAllContacts && getAllContactsDisplay) {
        getAllContacts.onclick = function () {
            var getContacts = window.navigator.mozContacts.getAll({});
            getAllContactsDisplay.style.display = "block";

            getContacts.onsuccess = function () {
                var result = getContacts.result;
                if (result) {
                    getAllContactsDisplay.innerHTML += result.givenName + " " + result.familyName + "<br>";
                    getContacts.continue();
                }
            };

            getContacts.onerror = function () {
                getAllContactsDisplay.innerHTML += "Error";
            };
        };
    }

})();
