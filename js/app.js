/* global MozActivity, alert, console, Notification */
"use strict";
(function () {

    // Add contact to server
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

    // Get all contacts from server
    var crossDomainXHR = document.querySelector("#contacts-server");
    if (crossDomainXHR) {
        crossDomainXHR.onclick = function () {

            // clear contact list
            var oldUl = document.getElementById("contact-list-server-ul");
            oldUl.innerHTML = "";

            var xhr = new XMLHttpRequest({mozSystem: true});
            xhr.open("GET", "http://bjarnason.to:8080/api/contacts", true);
            xhr.onreadystatechange = function () {
                // 200: "OK". 4: request finished and response is ready
                if (xhr.status === 200 && xhr.readyState === 4) {
                    var contacts = JSON.parse(xhr.response);
                }

                var contactIdArray = [];
                //create list with contacts from sever (with add and delete buttons)
                for(var i = 0; i < contacts.length; i++){

                    var newLi = document.createElement("li");
                    var newP = document.createElement("p");
                    var newA = document.createElement("a");
                    var newADelete = document.createElement("a");
                    var newAAdd = document.createElement("a");
                    var newAside = document.createElement("aside");

                    newAside.setAttribute("class", "pack-end");
                    newADelete.setAttribute("data-icon", "delete");
                    newAAdd.setAttribute("data-icon", "add");

                    newADelete.setAttribute("id", i);
                    newA.setAttribute("id", i);
                    newAAdd.setAttribute("id", i);

                    var contactName = document.createTextNode(contacts[i].name);
                    contactIdArray.push(contacts[i]._id);

                    newP.appendChild(contactName);
                    newA.appendChild(newP);

                    // Get all information about a single contact
                    newA.onclick = function(){

                        var contactUrl = "http://bjarnason.to:8080/api/contacts/" + contactIdArray[this.id];
                        
                        var xhr = new XMLHttpRequest({mozSystem: true});
                        xhr.open("GET", contactUrl, true);
                        xhr.onreadystatechange = function () {
                            if (xhr.status === 200 && xhr.readyState === 4) {
                                var contact = JSON.parse(xhr.response);
                                alert(contact.name + "\n" + contact.email + "\n" + contact.phone);
                            }
                        };
                        xhr.onerror = function (err) {
                            alert(err)
                        };
                        
                        xhr.send();

                    }

                    // Delete single contact
                    newADelete.onclick = function(){
                        var contactUrl = "http://bjarnason.to:8080/api/contacts/" + contactIdArray[this.id];
                        
                        var xhr = new XMLHttpRequest({mozSystem: true});
                        xhr.open("DELETE", contactUrl, true);
                        xhr.onreadystatechange = function () {
                            if (xhr.status === 200 && xhr.readyState === 4) {
                                alert("Contact deleted");
                            }
                        };
                        xhr.onerror = function (err) {
                            alert(err)
                        };
                        
                        xhr.send();
                        
                    }

                    // Add contact from server to phone
                    newAAdd.onclick = function(){
                        
                        var contactUrl = "http://bjarnason.to:8080/api/contacts/" + contactIdArray[this.id];
                        
                        var xhr = new XMLHttpRequest({mozSystem: true});
                        xhr.open("GET", contactUrl, true);
                        xhr.onreadystatechange = function () {
                            if (xhr.status === 200 && xhr.readyState === 4) {
                                var contact = JSON.parse(xhr.response);

                                var person = new mozContact();
                                person.givenName  = [contact.name];
                                person.email = [{type:["personal"], value:contact.email}];
                                person.tel = [{type:["mobile"], value:contact.phone}];

                                var saving = navigator.mozContacts.save(person);

                                saving.onsuccess = function() {
                                  alert("Contact added to phone");

                                };

                                saving.onerror = function(err) {
                                  console.error(err);
                                };

                            }
                        };
                        xhr.onerror = function () {
                            alert("Error, getAllContacts")
                        };
                        
                        xhr.send();

                    }

                    newAside.appendChild(newAAdd);
                    newAside.appendChild(newADelete);

                    newLi.appendChild(newAside);
                    newLi.appendChild(newA);

                    var newUl = document.getElementById("contact-list-server-ul");
                    newUl.appendChild(newLi);
                }

            };

            xhr.onerror = function (err) {
                alert(err)
            };
            xhr.send();
        };
    }

    // GET contacts from contact book
    var getAllContacts = document.querySelector("#contacts-phone");
    if (getAllContacts) {
        getAllContacts.onclick = function () {

            var getContacts = window.navigator.mozContacts.getAll({});

            // clear the contacts list
            var oldUl = document.getElementById("contact-list-phone-ul");
            oldUl.innerHTML = "";

            getContacts.onsuccess = function () {
                var result = getContacts.result;
                // Build a list with contacts from phone
                if (result) {

                    var newLi = document.createElement("li");
                    var newP = document.createElement("p");
                    var newA = document.createElement("a");

                    var newAAdd = document.createElement("a");
                    var newAside = document.createElement("aside");

                    var listName = document.createTextNode(result.givenName + " " + result.familyName);
                    newP.appendChild(listName);
                    newA.appendChild(newP);

                    newAside.setAttribute("class", "pack-end");
                    newAAdd.setAttribute("data-icon", "add");

                    var fullName = result.givenName + " " + result.familyName;
                    var phoneNumber = result.tel[0].value;

                    newAAdd.onclick = function(){                        
                        var xhr = new XMLHttpRequest({mozSystem: true});
                        xhr.open("POST", "http://bjarnason.to:8080/api/contacts",true);
                        xhr.setRequestHeader("Content-Type", "application/json");
                        xhr.send(JSON.stringify({
                            "name": fullName,
                            "email": "",
                            "phone": phoneNumber}));
                        alert("Contact added to server");
                    };

                    newAside.appendChild(newAAdd);


                    var newLi = document.createElement("li");
                    newLi.appendChild(newAside);
                    newLi.appendChild(newA);
                    var newUl = document.getElementById("contact-list-phone-ul");
                    newUl.appendChild(newLi);

                    getContacts.continue();
                }
            };

            getContacts.onerror = function (err) {
                alert(err);
            };
        };
    }

})();
