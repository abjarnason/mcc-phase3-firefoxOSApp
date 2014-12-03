/* global MozActivity, alert, console, Notification */
"use strict";
(function () {

    //Add contact to REST server
    var addContact = document.querySelector("#add-contact")
    if(addContact){
        addContact.onclick = function(){

            var name = document.getElementById("name").value,
                phone = document.getElementById("phone").value,
                email = document.getElementById("email").value;

            var xhr = new XMLHttpRequest({mozSystem: true});
            xhr.open("POST", "http://bjarnason.to:8080/api/contacts",true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify({"name": name, "email": email, "phone": phone}));

            document.getElementById("name").value = "";
            document.getElementById("phone").value = "";
            document.getElementById("email").value = "";
        }
    }

    // GET all contacts from server
    var crossDomainXHR = document.querySelector("#contacts-server"),
        crossDomainXHRDisplay = document.querySelector("#contacts-server-display");
    if (crossDomainXHR && crossDomainXHRDisplay) {
        crossDomainXHR.onclick = function () {
            var xhr = new XMLHttpRequest({mozSystem: true});
            xhr.open("GET", "http://bjarnason.to:8080/api/contacts", true);
            xhr.onreadystatechange = function () {
                // 200: "OK". 4: request finished and response is ready
                if (xhr.status === 200 && xhr.readyState === 4) {
                    //crossDomainXHRDisplay.innerHTML = xhr.response;
                    var contactInfoFromServer = JSON.parse(xhr.response);
                }

                
                var contactIdArray = [];
                //create list with contacts from sever
                for(var i = 0; i < contactInfoFromServer.length; i++){

                    var newLi = document.createElement("li");
                    var newP = document.createElement("p");
                    var newA = document.createElement("a");

                    newA.setAttribute("id", i);

                    var contactName = document.createTextNode(contactInfoFromServer[i].name);
                    contactIdArray.push(contactInfoFromServer[i]._id);

                    newP.appendChild(contactName);
                    newA.appendChild(newP);

                    newA.onclick = function(){
                        //alert(contactIdArray[this.id]);
                        
                        var contactUrl = "http://bjarnason.to:8080/api/contacts/" + contactIdArray[this.id];
                        
                        var xhr = new XMLHttpRequest({mozSystem: true});
                        xhr.open("GET", contactUrl, true);
                        xhr.onreadystatechange = function () {
                            if (xhr.status === 200 && xhr.readyState === 4) {
                                //crossDomainXHRDisplay.innerHTML = "<h4>Result from Cross-domain XHR</h4>" + xhr.response;
                                //crossDomainXHRDisplay.style.display = "block";
                                alert("success!");
                            }
                        };
                        xhr.send();

                        alert(contactUrl);
                    }

                    newLi.appendChild(newA);

                    var newUl = document.getElementById("contact-list-ul");
                    newUl.appendChild(newLi);
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
