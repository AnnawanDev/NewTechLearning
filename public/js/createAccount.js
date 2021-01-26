/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   January 25, 2021
*/

const baseURL = "http://localhost:3000";
const createAccountAPI = "/api/createUser"

//make sure page elements have loaded
document.addEventListener('DOMContentLoaded', () => {
  bindSubmitButton();
});

function bindSubmitButton() {
  document.getElementById("createAccountSubmit").addEventListener("click", addNewUser);
}

function addNewUser() {
  //run validation checks
  if (document.getElementById("firstName").value == "") {
    statusUpdate("First name cannot be empty", true);
    event.preventDefault();
    return;
  }

  if (document.getElementById("lastName").value == "") {
    statusUpdate("Last name cannot be empty", true);
    event.preventDefault();
    return;
  }

  if (document.getElementById("userName").value == "") {
    statusUpdate("User name cannot be empty", true);
    event.preventDefault();
    return;
  }

  if (document.getElementById("email").value == "") {
    statusUpdate("Email cannot be empty", true);
    event.preventDefault();
    return;
  }

  if (document.getElementById("password1").value == "" || document.getElementById("password2").value == "") {
    statusUpdate("Password fields cannot be empty", true);
    event.preventDefault();
    return;
  }

  if (document.getElementById("password1").value != document.getElementById("password2").value) {
    statusUpdate("Password fields are different", true);
    event.preventDefault();
    return;
  }

  //send user details
  //set-up POST payload
  let payload = setUpPayLoad();

  //make ajax request
  let req = new XMLHttpRequest();
  req.open("POST", baseURL + createAccountAPI, true);
  req.setRequestHeader("Content-type", "application/json");
  req.addEventListener("load", function () {
    let response = JSON.parse(req.response);
    if (req.status >=200 && req.status < 400) {
      feedbackToUser = "Success! " + response.results;
      statusUpdate(feedbackToUser, false);
    } else {
      if (response.result == "DUPLICATE") {
        feedbackToUser = "Sorry, that user name is already taken.  Please choose another.";
        statusUpdate(feedbackToUser, true);
      } else {
        feedbackToUser = "Sorry, there was an error. Try again";
        statusUpdate(feedbackToUser, true);
      }
    }
  });
  req.send(JSON.stringify(payload));
  event.preventDefault();
}


function checkField(element, message) {
  console.log(element)
  if (element == "") {
    statusUpdate(message, true);
    return false;
  };
}

function verifyPasswordFieldsAreEqual(password1, password2) {
  if (document.getElementById(password1).value != document.getElementById(password2).value) {
    statusUpdate("Password fields do not match", true);
    event.preventDefault();
    return;
  };
}

function statusUpdate(message, error) {
  let displayMessage = "";
  if (error) {
    displayMessage += "<span style=\"color: #ff0000;\">" + message + "</span><br /><br />";
  } else {
    displayMessage = message + "<br /><br />";
  }

  document.getElementById("feedback").innerHTML = displayMessage;
}

function setUpPayLoad() {
  //get values to POST
  let firstName = document.getElementById("firstName").value;
  let lastName = document.getElementById("lastName").value;
  let userName = document.getElementById("userName").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password1").value;

  //set-up POST payload
  let payload = {};
  payload.firstName = firstName;
  payload.lastName = lastName;
  payload.userName = userName;
  payload.email = email;
  payload.password = password;

  return payload;
}
