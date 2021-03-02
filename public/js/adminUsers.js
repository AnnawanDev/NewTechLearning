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


// set up event listeners -------------------------------------


if(document.readyState !== 'loading' ) {
  //getUserIdsToApplyClickEvents();
  buildEditDeleteUserTable();
}

else {
  document.addEventListener('DOMContentLoaded', function () {
    //getUserIdsToApplyClickEvents();
    buildEditDeleteUserTable();
  });
}



// main functions -------------------------------------
async function buildEditDeleteUserTable() {
  let tbody = document.getElementById('tbodyToEditDelete');

  //destroy existing rows
  removeAllTableRows(tbody);

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

    let firstNameInput = document.createElement('input');
    let lastNameInput = document.createElement('input');
    let userNameInput = document.createElement('input');
    let emailInput = document.createElement('input');
    let passwordInput = document.createElement('input');
    let userTypeInput = document.createElement('select');
    let editButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    applyInputConfiguration(firstNameInput, "editFirstName", tableData[i].userId, tableData[i].firstName);
    applyInputConfiguration(lastNameInput, "editLastName", tableData[i].userId, tableData[i].lastName);
    applyInputConfiguration(userNameInput, "editUserName", tableData[i].userId, tableData[i].userName);
    applyInputConfiguration(emailInput, "editEmail", tableData[i].userId, tableData[i].email);
    applyInputConfiguration(passwordInput, "editPassword", tableData[i].userId, '');

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
    editButton.textContent= "Edit";
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
    td6.appendChild(userTypeInput);
    td7.appendChild(editButton);
    td8.appendChild(deleteButton);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);
    tr.appendChild(td7);
    tr.appendChild(td8);

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
        //console.log("DATA: " + JSON.stringify(data.results));
        resolve( data.results);
        // data.results.forEach(user => {
        //   applyOnClickEvents(user.userId);
        // });

      } else {
        //log error?
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
  console.log("TRYING TO DELETE USER ID : " + buttonID);
  //make ajax request
  let req = new XMLHttpRequest();
  req.open("DELETE", baseURL + deleteUsersAPI + buttonID, true);
  req.setRequestHeader("Content-type", "application/json");
  req.addEventListener("load", function () {
    if (req.status >=200 && req.status < 400) {
      let data = JSON.parse(req.response);
      document.getElementById('editDeleteFeedbackResponse').innerHTML = "user deleted";
      buildEditDeleteUserTable();
    } else {
      document.getElementById('editDeleteFeedbackResponse').innerHTML = "ERROR: " + req.responseText;
    }

  });
  req.send(null);
  event.preventDefault();
}

function editUser(e) {
  console.log('edit user');
  event.preventDefault();
}

function removeAllTableRows(tbody) {
  let tableRow = tbody.firstChild;
  while (tableRow) {
    tbody.removeChild(tableRow);
    tableRow = tbody.firstChild;
  }
}


});
