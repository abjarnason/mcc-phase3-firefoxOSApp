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

            var oldUl = document.getElementById("contact-list-server-ul");
            oldUl.innerHTML = "";

            var xhr = new XMLHttpRequest({mozSystem: true});
            xhr.open("GET", "http://bjarnason.to:8080/api/contacts", true);
            xhr.onreadystatechange = function () {
                // 200: "OK". 4: request finished and response is ready
                if (xhr.status === 200 && xhr.readyState === 4) {
                    //crossDomainXHRDisplay.innerHTML = xhr.response;
                    var contacts = JSON.parse(xhr.response);
                }

                
                var contactIdArray = [];
                //create list with contacts from sever
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
                    //newAside.setAttribute("id", i);

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
                                //alert("success!");
                                var contact = JSON.parse(xhr.response);
                                alert(contact.name + "\n" + contact.email + "\n" + contact.phone);
                            }
                        };
                        xhr.onerror = function () {
                            alert("Error 2nd API call")
                        };
                        
                        xhr.send();

                        //alert(contactUrl);
                    }

                    // Delete single contact
                    newADelete.onclick = function(){
                        var contactUrl = "http://bjarnason.to:8080/api/contacts/" + contactIdArray[this.id];
                        
                        var xhr = new XMLHttpRequest({mozSystem: true});
                        xhr.open("DELETE", contactUrl, true);
                        xhr.onreadystatechange = function () {
                            if (xhr.status === 200 && xhr.readyState === 4) {
                                alert("Contact deleted");
                                //var contact = JSON.parse(xhr.response);
                                //alert(contact.name + "\n" + contact.email + "\n" + contact.phone);
                            }
                        };
                        xhr.onerror = function () {
                            alert("Error 3rd API call")
                        };
                        
                        xhr.send();
                        
                    }

                    newAAdd.onclick = function(){

                        //alert("contact added..");
                        

                        var contactUrl = "http://bjarnason.to:8080/api/contacts/" + contactIdArray[this.id];
                        
                        var xhr = new XMLHttpRequest({mozSystem: true});
                        xhr.open("GET", contactUrl, true);
                        xhr.onreadystatechange = function () {
                            if (xhr.status === 200 && xhr.readyState === 4) {
                                //alert("success!");
                                var contact = JSON.parse(xhr.response);
                                //alert(contact.name + "\n" + contact.email + "\n" + contact.phone);

                                var person = new mozContact();
                                person.givenName  = [contact.name];
                                person.email = [{type:["personal"], value:contact.email}];
                                person.tel = [{type:["mobile"], value:contact.phone}];

                                // save the new contact
                                var saving = navigator.mozContacts.save(person);

                                saving.onsuccess = function() {
                                  alert("Contact added");
                                  // This update the person as it is stored
                                  // It includes its internal unique ID
                                  // Note that saving.result is null here
                                };

                                saving.onerror = function(err) {
                                  console.error(err);
                                };

                            }
                        };
                        xhr.onerror = function () {
                            alert("Error 2nd API call")
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

            xhr.onerror = function () {
                alert("First API call")
            };
            xhr.send();
        };
    }

    // GET contacts from contact book
    var getAllContacts = document.querySelector("#contacts-phone"),
        getAllContactsDisplay = document.querySelector("#contacts-phone-display");
    if (getAllContacts && getAllContactsDisplay) {
        getAllContacts.onclick = function () {
            var getContacts = window.navigator.mozContacts.getAll({});
            getAllContactsDisplay.style.display = "block";

            getContacts.onsuccess = function () {
                var result = getContacts.result;
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
                    //newAAdd.setAttribute("id", i);

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
                    /*
                    var newLi = document.createElement("li");
                    var newP = document.createElement("p");
                    var contactName = result.givenName;
                    newP.appendChild(contactName);
                    newLi.appendChild(newP);

                    */

                    //getAllContactsDisplay.innerHTML += result.givenName + " " + result.familyName + "<br>";
                    getContacts.continue();
                }
            };

            getContacts.onerror = function () {
                getAllContactsDisplay.innerHTML += "Error";
            };
        };
    }

})();
