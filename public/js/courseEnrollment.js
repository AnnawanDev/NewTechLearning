/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   March 3, 2021
*/

define (['module'], function(module){

const useLogging = module.config().useLogging;
const baseURL = module.config().baseURL;
const getStudentsEnrolledAPI = module.config().getStudentsEnrolledAPI;
const getStudentsNotInClassAPI = module.config().getStudentsNotEnrolledAPI;
const dropStudentFromClassAPI = module.config().dropStudentFromClassAPI;
let addStudentListing = document.getElementById('addUserToCourseSelectElement');

// set up event listeners -------------------------------------
if(document.readyState !== 'loading' ) {
  getListOfUsersEnrolled(document.getElementById('courseToDropUserFrom').value);
  getUsersNotEnrolled(document.getElementById('courseToAddSelectElement').value);
}

else {
  document.addEventListener('DOMContentLoaded', async function () {
      getListOfUsersEnrolled(document.getElementById('courseToDropUserFrom').value);
      getUsersNotEnrolled(document.getElementById('courseToAddSelectElement').value);
  });
}

//dyanamically change users to add based on the class
document.getElementById('courseToAddSelectElement').addEventListener('change',function(){
    //remove select element
    addStudentListing.removeChild(addStudentListing.firstChild);

    //populate with new rows
    getUsersNotEnrolled(document.getElementById('courseToAddSelectElement').value);
});

//dynamically change users to drop based on the class
document.getElementById('courseToDropUserFrom').addEventListener('change',function(){
    //remove all result rows
    removeAllTableRows(feedbackResponse);

    //populate with new rows
    getListOfUsersEnrolled(document.getElementById('courseToDropUserFrom').value);
});

// main functions -------------------------------------
function dropUserFromCourse(e) {
  const fullButtonID = e.target.id;
  const buttonID = fullButtonID.substring(8);
  console.log("Dropping: " + buttonID);


  //make ajax request
  let req = new XMLHttpRequest();
  req.open("GET", baseURL + dropStudentFromClassAPI + buttonID, true);
  req.setRequestHeader("Content-type", "application/json");
  req.addEventListener("load", function () {
    if (req.status >=200 && req.status < 400) {
      let data = JSON.parse(req.response);
      console.log(JSON.stringify(data));
      // if (data.results.length == 0) {
      //   selectElement  = "There are no students to add";
      // } else {
      //   selectElement += "<select name=\"userIdToAddToCourse\" id=\"userIdToAddToCourse\">";
      //   for (let someUser of data.results) {
      //     selectElement += "<option value=\"" + someUser.userId + "\">" + someUser.lastName + ", " + someUser.firstName + "(" + someUser.userName + ") - " + someUser.userType + "</option>";
      //   }
      //   selectElement += "</select>";
      // }

      document.getElementById('dropuserFromCourseFeedback').innerHTML = "Student dropped";
    } else {
      //selectElement  = "Sorry, there was an error in getting the available classes.";
      document.getElementById('dropuserFromCourseFeedback').innerHTML = "Error";
    }


  });
  req.send(null);
  event.preventDefault();
}


function getListOfUsersEnrolled(someClassId) {
  let tbody = document.getElementById('userListingTbody');

  //make ajax request
  let req = new XMLHttpRequest();
  req.open("GET", baseURL + getStudentsEnrolledAPI + someClassId, true);
  req.setRequestHeader("Content-type", "application/json");
  req.addEventListener("load", function () {
    if (req.status >=200 && req.status < 400) {
      let data = JSON.parse(req.response);
      if (data.results.length == 0) {
        addMessageToDropStudent(tbody, "No one enrolled");
      } else {
        for (let someUser of data.results) {
          let tr = document.createElement('tr');
          let td1 = document.createElement('td');
          let td2 = document.createElement('td');
          let td3 = document.createElement('td');
          let td4 = document.createElement('td');
          let td5 = document.createElement('td');
          let td6 = document.createElement('td');
          let button = document.createElement('button');

          button.setAttribute('id', 'dropUser' + someUser.userId);
          button.setAttribute('name', 'dropUser' + someUser.userId);
          button.textContent= "Drop Student";
          button.addEventListener('click', dropUserFromCourse);

          td1.innerHTML = someUser.firstName;
          td2.innerHTML = someUser.lastName;
          td3.innerHTML = someUser.userName;
          td4.innerHTML = someUser.email;
          td5.innerHTML = someUser.userType;
          td6.appendChild(button);

          tr.appendChild(td1);
          tr.appendChild(td2);
          tr.appendChild(td3);
          tr.appendChild(td4);
          tr.appendChild(td5);
          tr.appendChild(td6);

          tbody.appendChild(tr);
        }
      }
    } else {
      addMessageToDropStudent(tbody, "Sorry, there was an error in getting the available classes");
    }
  });
  req.send(null);
  event.preventDefault();
}

function addMessageToDropStudent(tbody, message) {
  let tr = document.createElement('tr');
  let td = document.createElement('td');
  td.setAttribute('colspan', 6);
  td.innerHTML = message;
  tr.appendChild(td);
  tbody.appendChild(tr);
}

function getUsersNotEnrolled(someClassId) {
  let selectElement = "";

  //make ajax request
  let req = new XMLHttpRequest();
  req.open("GET", baseURL + getStudentsNotInClassAPI + someClassId, true);
  req.setRequestHeader("Content-type", "application/json");
  req.addEventListener("load", function () {
    if (req.status >=200 && req.status < 400) {
      let data = JSON.parse(req.response);
      if (data.results.length == 0) {
        selectElement  = "There are no students to add";
      } else {
        selectElement += "<select name=\"userIdToAddToCourse\" id=\"userIdToAddToCourse\">";
        for (let someUser of data.results) {
          selectElement += "<option value=\"" + someUser.userId + "\">" + someUser.lastName + ", " + someUser.firstName + "(" + someUser.userName + ") - " + someUser.userType + "</option>";
        }
        selectElement += "</select>";
      }
    } else {
      selectElement  = "Sorry, there was an error in getting the available classes.";
    }

    addStudentListing.innerHTML = selectElement;
  });
  req.send(null);
  event.preventDefault();
}


// utility -------------------------------------
function logIt(someMessage) {
  if (useLogging) {
    console.log(someMessage);
  }
}

function removeAllTableRows(tbody) {
  let tableRow = tbody.firstChild;
  while (tableRow) {
    tbody.removeChild(tableRow);
    tableRow = tbody.firstChild;
  }
}

});
