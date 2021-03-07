/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   March 6, 2021
*/

define (['module'], function (module){

const useLogging = module.config().useLogging;
const baseURL = module.config().baseURL;
const deleteUsersAPI = module.config().deleteUsersAPI;
const getUserIDsAPI = module.config().getUserIDsAPI;
const getUsersWithTypesAPI = module.config().getUsersWithTypesAPI;
const editUserAPI = module.config().editUserAPI;
const tbodyID = "tbodyToEditDelete";


// set up event listeners -------------------------------------

//rebuilds all modify/delete table rows when DOM is ready, applies click event listener on button for adding a user
if(document.readyState !== 'loading' ) {
  removeAllTableRows();
  buildEditDeleteUserTable();
  document.getElementById('addUserButton').addEventListener('click', validateAddUser);
}

else {
  document.addEventListener('DOMContentLoaded', function () {
    removeAllTableRows();
    buildEditDeleteUserTable();
    document.getElementById('addUserButton').addEventListener('click', validateAddUser);
  });
}



// main functions -------------------------------------
//dynamically builds out table rows of users for the edit/delete table
async function buildEditDeleteUserTable() {
  let tbody = document.getElementById(tbodyID);

  //get all users
  let tableData = await getUsers();

  for (let i = 0; i < tableData.length; i++) {
    let tr = document.createElement('tr');

    //create table cells for new row
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let td3 = document.createElement('td');
    let td4 = document.createElement('td');
    let td5 = document.createElement('td');
    let td6 = document.createElement('td');
    let td7 = document.createElement('td');
    let td8 = document.createElement('td');
    let td9 = document.createElement('td');

    //create input element for each table cell
    let firstNameInput = document.createElement('input');
    let lastNameInput = document.createElement('input');
    let userNameInput = document.createElement('input');
    let emailInput = document.createElement('input');
    let passwordInput = document.createElement('input');
    let passwordInput2 = document.createElement('input');
    let userTypeInput = document.createElement('select');
    let editButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    //set table cell input length
    firstNameInput.setAttribute("size", 12);
    lastNameInput.setAttribute("size", 12);
    userNameInput.setAttribute("size", 12);
    passwordInput.setAttribute("size", 12);
    passwordInput2.setAttribute("size", 12);

    //set password inputs to type password
    passwordInput.setAttribute("type", "password");
    passwordInput2.setAttribute("type", "password");

    //set attribute names and IDs
    applyInputConfiguration(firstNameInput, "editFirstName", tableData[i].userId, tableData[i].firstName);
    applyInputConfiguration(lastNameInput, "editLastName", tableData[i].userId, tableData[i].lastName);
    applyInputConfiguration(userNameInput, "editUserName", tableData[i].userId, tableData[i].userName);
    applyInputConfiguration(emailInput, "editEmail", tableData[i].userId, tableData[i].email);
    applyInputConfiguration(passwordInput, "editPassword", tableData[i].userId, '');
    applyInputConfiguration(passwordInput2, "editPassword2", tableData[i].userId, '');

    //set attribute for userType based on db result
    userTypeInput.setAttribute("name", "editUserType" + tableData[i].userId);
    userTypeInput.setAttribute("id", "editUserType" + tableData[i].userId);
    let optionStudent = document.createElement('option');
    let optionInstructor = document.createElement('option');
    let optionAdmin = document.createElement('option');
    optionStudent.setAttribute("value", "STUDENT");
    optionStudent.text = "STUDENT";
    if (tableData[i].STUDENT) { optionStudent.setAttribute("selected", "selected"); }
    optionInstructor.setAttribute("value", "INSTRUCTOR");
    optionInstructor.text = "INSTRUCTOR";
    if (tableData[i].INSTRUCTOR) { optionInstructor.setAttribute("selected", "selected"); }
    optionAdmin.setAttribute("value", "ADMIN");
    optionAdmin.text = "ADMIN";
    if (tableData[i].ADMIN) { optionAdmin.setAttribute("selected", "selected"); }
    userTypeInput.appendChild(optionStudent);
    userTypeInput.appendChild(optionInstructor);
    userTypeInput.appendChild(optionAdmin);

    //set up edit button
    editButton.setAttribute('id', 'editButton' + tableData[i].userId);
    editButton.setAttribute('name', 'editButton' + tableData[i].userId);
    editButton.textContent= "Save Edit";
    editButton.addEventListener('click', editUser);

    //set up delete button
    deleteButton.setAttribute('id', 'deleteButton' + tableData[i].userId);
    deleteButton.setAttribute('name', 'deleteButton' + tableData[i].userId);
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener('click', deleteUser);

    //add input elements to table cell
    td1.appendChild(firstNameInput);
    td2.appendChild(lastNameInput);
    td3.appendChild(userNameInput);
    td4.appendChild(emailInput);
    td5.appendChild(passwordInput);
    td6.appendChild(passwordInput2);
    td7.appendChild(userTypeInput);
    td8.appendChild(editButton);
    td9.appendChild(deleteButton);

    //add table cells to table row
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);
    tr.appendChild(td7);
    tr.appendChild(td8);
    tr.appendChild(td9);

    //add table row to tbody in table
    tbody.appendChild(tr);
  }
}

//applies name, id, value attributes on input text boxes when dynamically creating edit/delete table rows on screen
function applyInputConfiguration(element, idName, id, value) {
  element.setAttribute("name", idName + id);
  element.setAttribute("id", idName + id);
  element.setAttribute("value", value);
}

//ajax call to get all users in the database
async function getUsers() {
  return new Promise(function(resolve, reject) {
    //get all users
    let req = new XMLHttpRequest();
    req.open("GET", baseURL + getUsersWithTypesAPI, true);
    req.setRequestHeader("Content-type", "application/json");
    req.addEventListener("load", function () {
      if (req.status >=200 && req.status < 400) {
        let data = JSON.parse(req.response);
        resolve( data.results);
      } else {
        reject('error')
      }
    });
    req.send(null);
  });
}

//click handler for deleting a user
function deleteUser(e) {
  const fullButtonID = e.target.id;
  const buttonID = fullButtonID.substring(12);

  if (!buttonID || isNaN(buttonID)) {
    throw new Error("No user id passed");
  }

  //make ajax request
  let req = new XMLHttpRequest();
  req.open("DELETE", baseURL + deleteUsersAPI + buttonID, true);
  req.setRequestHeader("Content-type", "application/json");
  req.addEventListener("load", function () {
    if (req.status >=200 && req.status < 400) {
      let data = JSON.parse(req.response);
      document.getElementById('editDeleteFeedbackResponse').innerHTML = "";
      alert("User deleted");
      removeAllTableRows();
      buildEditDeleteUserTable();
    } else {
      document.getElementById('editDeleteFeedbackResponse').innerHTML = "ERROR: " + req.responseText;
    }

  });
  req.send(null);
  event.preventDefault();
}

//click handler when the edit user button is pressed - calls validation, and if good, calls ajax method to post update
function editUser(e) {
  const fullButtonID = e.target.id;
  const buttonID = fullButtonID.substring(10);

  let goodToEditUser = false;

  try{
    validateEditContents(buttonID);
    goodToEditUser = true;
  } catch(e) {
    document.getElementById('editDeleteFeedbackResponse').innerHTML = '<p style="color: #ff0000">Sorry, there was an error</p>';
    logIt("ERROR: " + e);
  }

  if (goodToEditUser) {
    let payload = setUpPayLoad(buttonID);
    uploadEdit(buttonID, payload);
  }
  event.preventDefault();
}

//validates user input when editing a user
function validateEditContents(userId) {
  if (isNaN(userId)) {
    throw new Error("User ID is not a number");
  }

  let firstName = document.getElementById("editFirstName"+userId).value;
  let lastName = document.getElementById("editLastName"+userId).value;
  let userName = document.getElementById("editUserName"+userId).value;
  let email = document.getElementById("editEmail"+userId).value;
  let password = document.getElementById("editPassword"+userId).value;
  let password2 = document.getElementById("editPassword2"+userId).value;
  let userType = document.getElementById("editUserType"+userId).value;

  if (firstName == "") {
    throw new Error("First name cannot be blank");
  }

  if (lastName == "") {
    throw new Error("Last name cannot be blank");
  }

  if (userName == "") {
    throw new Error("Last name cannot be blank");
  }

  if (email == "") {
    throw new Error("Last name cannot be blank");
  }

  if (userType == "") {
    throw new Error("User Type cannot be blank")
  }

  if (password != password2) {
    throw new Error("The new passwords must match");
  }
}

//Ajax call to modify user
function uploadEdit(buttonID, payload) {
  //make ajax request
  let req = new XMLHttpRequest();
  req.open("PATCH", baseURL + editUserAPI, true);
  req.setRequestHeader("Content-type", "application/json");
  req.addEventListener("load", function () {
    if (req.status >=200 && req.status < 400) {
      let data = JSON.parse(req.response);
      if (data.result == "DUPLICATE") {
        alert('Sorry, that user name is taken please choose another');
        document.getElementById('editUserName' + buttonID).style.backgroundColor = "yellow";
      } else if (data.result == "ERROR") {
        alert('Sorry, there was an error.  Please try again');
      } else {
        document.getElementById('editUserName' + buttonID).style.backgroundColor = "white";
        document.getElementById('editUserName' + buttonID).style.border = "1px solid #000000";
        alert("User edit saved");
      }
    } else {
      document.getElementById('editDeleteFeedbackResponse').innerHTML = '<p style="color: #ff0000">Sorry, there was an error.  Please try again</p>';
      logIt("ERROR: " + JSON.stringify(req));
    }
  });
  document.getElementById('editDeleteFeedbackResponse').innerHTML = "";
  req.send(JSON.stringify(payload));
}

//sets up payload to post when modifying a user
function setUpPayLoad(userId) {
  //get values to PATCH
  let firstName = document.getElementById("editFirstName"+userId).value;
  let lastName = document.getElementById("editLastName"+userId).value;
  let userName = document.getElementById("editUserName"+userId).value;
  let email = document.getElementById("editEmail"+userId).value;
  let password = document.getElementById("editPassword"+userId).value;
  let password2 = document.getElementById("editPassword2"+userId).value;
  let userType = document.getElementById("editUserType"+userId).value;

  //set-up POST payload
  let payload = {};
  payload.firstName = firstName;
  payload.lastName = lastName;
  payload.userName  = userName;
  payload.email  = email;
  payload.password = password;
  payload.userId = userId;
  payload.userType = userType;

  return payload;
}

// removes all table rows from the edit/delete user table on the page
function removeAllTableRows() {
  const tbody = document.getElementById(tbodyID);
  let tableRow = tbody.firstChild;
  while (tableRow) {
    tbody.removeChild(tableRow);
    tableRow = tbody.firstChild;
  }
}

// validates user input when adding a user
function validateAddUser() {
  let goodInput = false; //assume bad input

  //get input box fields and trim value to remove whitespace
  let firstName = document.getElementById('addFirstName').value.trim();
  let lastName = document.getElementById('addLastName').value.trim();
  let userName = document.getElementById('addUserName').value.trim();
  let email = document.getElementById('addEmail').value.trim();
  let password1 = document.getElementById('addPassword1').value.trim();
  let password2 = document.getElementById('addPassword2').value.trim();

  //validate input fields - continue to check input fields only if good input. Stop when bad input is found
  goodInput = validateAddUserInput(firstName, "FIRST NAME", true);
  if (goodInput) {
    goodInput = validateAddUserInput(lastName, "LAST NAME", true);
  }

  if (goodInput) {
    goodInput = validateAddUserInput(userName, "USER NAME", false);
  }

  if (goodInput) {
    goodInput = validateEmailIsNotBlank(email);
  }

  if (goodInput) {
    goodInput = validatePasswords(password1, password2);
  }

  //if bad input, stop from adding to db, otherwise, let in
  if (!goodInput) {
    event.preventDefault();
    return;
  }
  return;
}

//validates user input and returns true or false based on whether value has more than one characters, is an alpha string and is not blank
function validateAddUserInput(value, inputType, runRegex) {
  let goodValue = false; //assume bad input

  //regex formula taken from https://stackoverflow.com/questions/3073176/javascript-regex-only-english-letters-allowed
  //user post: Shawn Moore
  //taken on 3/6/21
  let regexForCharactersOnly = /^[a-z]+$/i;

  if (value == "") {
    alert (inputType + ' cannot be blank');
  } else if (value.length == 1) {
    alert ('Cannot have just one letter for ' + inputType)
  } else if (runRegex && !regexForCharactersOnly.test(value)) {
    alert('Can only have alphabet characters for ' + inputType)
  } else {
    goodValue = true;
  }

  return goodValue;
}

//validates that user has some value for email
function validateEmailIsNotBlank(email) {
  let goodValue = false; //assume bad input

  if (email == "") {
    alert ('EMAIL cannot be blank');
  } else {
    goodValue = true;
  }

  return goodValue;
}

//validates that password fields match, are not blank, and have at least 3 characters
function validatePasswords(password1, password2) {
  let goodValue = false; //assume bad input

  if (password1 == "" || password2 == "") {
    alert ('PASSWORD fields cannot be blank');
  } else if (password1 !== password2) {
    alert ('Both PASSWORD fields have to match')
  } else if (password1.length < 3 || password2.length < 3) {
    alert ('You have to use at least 3 characters for PASSWORD')
  } else {
    goodValue = true;
  }

  return goodValue;
}


});
