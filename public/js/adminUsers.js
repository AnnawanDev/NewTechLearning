/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   March 1, 2021
*/

define (['module'], function (module){

const useLogging = module.config().useLogging;
const baseURL = module.config().baseURL;
const deleteUsersAPI = "/api/deleteUser/";
const getUserIDsAPI = "/api/getUserIds";
const getUsersWithTypesAPI = "/api/getUsersWithTypes";
const tbodyID = "tbodyToEditDelete";
const editUserAPI = "/api/editUser/";

// set up event listeners -------------------------------------


if(document.readyState !== 'loading' ) {
  removeAllTableRows();
  buildEditDeleteUserTable();
}

else {
  document.addEventListener('DOMContentLoaded', function () {
    removeAllTableRows();
    buildEditDeleteUserTable();
  });
}



// main functions -------------------------------------
async function buildEditDeleteUserTable() {
  let tbody = document.getElementById(tbodyID);

  //get all users
  let tableData = await getUsers();

  for (let i = 0; i < tableData.length; i++) {
    let tr = document.createElement('tr');
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let td3 = document.createElement('td');
    let td4 = document.createElement('td');
    let td5 = document.createElement('td');
    let td6 = document.createElement('td');
    let td7 = document.createElement('td');
    let td8 = document.createElement('td');
    let td9 = document.createElement('td');

    let firstNameInput = document.createElement('input');
    let lastNameInput = document.createElement('input');
    let userNameInput = document.createElement('input');
    let emailInput = document.createElement('input');
    let passwordInput = document.createElement('input');
    let passwordInput2 = document.createElement('input');
    let userTypeInput = document.createElement('select');
    let editButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    firstNameInput.setAttribute("size", 12);
    lastNameInput.setAttribute("size", 12);
    userNameInput.setAttribute("size", 12);
    passwordInput.setAttribute("size", 12);
    passwordInput2.setAttribute("size", 12);

    passwordInput.setAttribute("type", "password");
    passwordInput2.setAttribute("type", "password");

    applyInputConfiguration(firstNameInput, "editFirstName", tableData[i].userId, tableData[i].firstName);
    applyInputConfiguration(lastNameInput, "editLastName", tableData[i].userId, tableData[i].lastName);
    applyInputConfiguration(userNameInput, "editUserName", tableData[i].userId, tableData[i].userName);
    applyInputConfiguration(emailInput, "editEmail", tableData[i].userId, tableData[i].email);
    applyInputConfiguration(passwordInput, "editPassword", tableData[i].userId, '');
    applyInputConfiguration(passwordInput2, "editPassword2", tableData[i].userId, '');

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

    editButton.setAttribute('id', 'editButton' + tableData[i].userId);
    editButton.setAttribute('name', 'editButton' + tableData[i].userId);
    editButton.textContent= "Save Edit";
    editButton.addEventListener('click', editUser);

    deleteButton.setAttribute('id', 'deleteButton' + tableData[i].userId);
    deleteButton.setAttribute('name', 'deleteButton' + tableData[i].userId);
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener('click', deleteUser);

    td1.appendChild(firstNameInput);
    td2.appendChild(lastNameInput);
    td3.appendChild(userNameInput);
    td4.appendChild(emailInput);
    td5.appendChild(passwordInput);
    td6.appendChild(passwordInput2);
    td7.appendChild(userTypeInput);
    td8.appendChild(editButton);
    td9.appendChild(deleteButton);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);
    tr.appendChild(td7);
    tr.appendChild(td8);
    tr.appendChild(td9);

    tbody.appendChild(tr);
  }
}

function applyInputConfiguration(element, idName, id, value) {
  element.setAttribute("name", idName + id);
  element.setAttribute("id", idName + id);
  element.setAttribute("value", value);
}

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
      document.getElementById('editDeleteFeedbackResponse').innerHTML = "user deleted";
      removeAllTableRows();
      buildEditDeleteUserTable();
    } else {
      document.getElementById('editDeleteFeedbackResponse').innerHTML = "ERROR: " + req.responseText;
    }

  });
  req.send(null);
  event.preventDefault();
}

function editUser(e) {
  const fullButtonID = e.target.id;
  const buttonID = fullButtonID.substring(10);

  let goodToEditUser = false;

  try{
    validateEditContents(buttonID);
    goodToEditUser = true;
  } catch(e) {
    document.getElementById('editDeleteFeedbackResponse').innerHTML = '<p style="color: #ff0000">' + e + '</p>'
  }

  if (goodToEditUser) {
    //set-up PATCH payload
    let payload = setUpPayLoad(buttonID);

    //make ajax request
    let req = new XMLHttpRequest();
    req.open("PATCH", 'http://localhost:14567/api/editUser', true);
    //req.open("PATCH", baseURL + editUserAPI, true);
    req.setRequestHeader("Content-type", "application/json");
    req.addEventListener("load", function () {
      if (req.status >=200 && req.status < 400) {
        let data = JSON.parse(req.response);
        if (data.result == "DUPLICATE") {
          document.getElementById('editDeleteFeedbackResponse').innerHTML = '<p style="color: #ff0000">Sorry, that user name is taken please choose another</p>';
          document.getElementById('editUserName' + buttonID).style.backgroundColor = "yellow";
        } else if (data.result == "ERROR") {
          document.getElementById('editDeleteFeedbackResponse').innerHTML = '<p style="color: #ff0000">Sorry, there was an error.  Please try again</p>';
        } else {
          document.getElementById('editUserName' + buttonID).style.backgroundColor = "white";
          document.getElementById('editUserName' + buttonID).style.border = "1px solid #000000";
          document.getElementById('editDeleteFeedbackResponse').innerHTML = '<p style="font-weight: bold">User edit saved</p>';
        }
      } else {
        document.getElementById('editDeleteFeedbackResponse').innerHTML = '<p style="color: #ff0000">Sorry, there was an error.  Please try again</p>';
        console.log("ERROR: " + JSON.stringify(req));
      }
    });
    req.send(JSON.stringify(payload));
  }
  event.preventDefault();
}

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

async function updloadEdit(buttonID) {
  return new Promise(function(resolve, reject) {
    //set-up PATCH payload
    let payload = setUpPayLoad(buttonID);

    //make ajax request
    let req = new XMLHttpRequest();
    req.open("PATCH", baseURL + editUserAPI, true);
    req.setRequestHeader("Content-type", "application/json");
    req.addEventListener("load", function () {
      if (req.status >=200 && req.status < 400) {
        let data = JSON.parse(req.response);
        resolve(data);
      } else {
        reject(req.responseText);
      }
    });

    req.send(payload);
  });
}

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

function removeAllTableRows() {
  const tbody = document.getElementById(tbodyID);
  let tableRow = tbody.firstChild;
  while (tableRow) {
    tbody.removeChild(tableRow);
    tableRow = tbody.firstChild;
  }
}


});
