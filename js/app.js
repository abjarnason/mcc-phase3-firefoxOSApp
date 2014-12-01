/* global MozActivity, alert, console, Notification */
"use strict";
(function () {

    //Add contact to REST server
    var addContact = document.querySelector("#add-contact")
    if(addContact){
        addContact.onclick = function(){
            //alert("hello!");
            var name = document.getElementById("name").value,
                phone = document.getElementById("phone").value,
                email = document.getElementById("email").value;
            //alert(name);

            //var basicUrl = "http://bjarnason.to:8080/api/contacts";
            var xhr = new XMLHttpRequest({mozSystem: true});
            xhr.open("POST", "http://bjarnason.to:8080/api/contacts",true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify({"name": name, "email": email, "phone": phone}));
        }
    }

    // GET Contacts from server
    var crossDomainXHR = document.querySelector("#contacts-server"),
        crossDomainXHRDisplay = document.querySelector("#contacts-server-display");
    if (crossDomainXHR && crossDomainXHRDisplay) {
        crossDomainXHR.onclick = function () {
            var xhr = new XMLHttpRequest({mozSystem: true});
            xhr.open("GET", "http://bjarnason.to:8080/api/contacts", true);
            xhr.onreadystatechange = function () {
                // 200: "OK". 4: request finished and response is ready
                if (xhr.status === 200 && xhr.readyState === 4) {
                    crossDomainXHRDisplay.innerHTML = xhr.response;
                    var contactInfoFromServer = JSON.parse(xhr.response);
                    
                        var newLi = document.createElement("li");
                        var contactEmail = document.createTextNode(contactInfoFromServer[0].email);
                        newLi.appendChild(contactEmail);
                        var newUl = document.getElementById("contact-list-ul");
                        newUl.appendChild(newLi);

                    /*
                    for(var i = 0; i < contactInfoFromServer.length, i++){
  
                    }
                    */
                    

                    //alert(obj[0].email);
                    //crossDomainXHRDisplay.style.display = "block";
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
    var getAllContacts = document.querySelector("#contacts-phone"),
        getAllContactsDisplay = document.querySelector("#contacts-phone-display");
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
