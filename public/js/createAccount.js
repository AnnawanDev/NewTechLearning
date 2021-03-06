/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   March 6, 2021
*/

define (['module'],function (module){
  const baseURL = module.config().baseURL;
  const createAccountAPI = module.config().createAccountAPI;

// set up event listeners -------------------------------------
if(document.readyState !== 'loading' ) {
  bindSubmitButton();
} else {
  document.addEventListener('DOMContentLoaded', function () {
  bindSubmitButton();
  });
}
  //binds event listener to button when adding user
  function bindSubmitButton() {
    document.getElementById("createAccountSubmit").addEventListener("click", addNewUser);
  }

  //validate new user form fields
  function addNewUser() {
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
  }

  //checks if a passed in input element is blank
  function checkField(element, message) {
    if (element == "") {
      statusUpdate(message, true);
      return false;
    };
  }

  //function to verify that passwords are the same
  function verifyPasswordFieldsAreEqual(password1, password2) {
    if (document.getElementById(password1).value !== document.getElementById(password2).value) {
      statusUpdate("Password fields do not match", true);
      event.preventDefault();
      return;
    };
  }

  //sets status error message
  function statusUpdate(message, error) {
    let displayMessage = "";
    if (error) {
      displayMessage += "<span style=\"color: #ff0000;\">" + message + "</span><br /><br />";
    } else {
      displayMessage = message + "<br /><br />";
    }

    document.getElementById("feedback").innerHTML = displayMessage;
  }
});
