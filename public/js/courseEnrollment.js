/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   February 21, 2021
*/

define (['module'], function(module){

const useLogging = module.config().useLogging;
const baseURL = module.config().baseURL;
const getStudentsEnrolledAPI = module.config().getStudentsEnrolledAPI;
const getStudentsNotInClass = module.config().getStudentsNotEnrolledAPI;
let feedbackResponse = document.getElementById('userListingTbody');
let addStudentListing = document.getElementById('addUserToCourseSelectElement');

// set up event listeners -------------------------------------
if( document.readyState !== 'loading' ) {
  // document is already ready, just execute code
  getListOfUsersEnrolled(document.getElementById('courseToDropUserFrom').value);
  getUsersNotEnrolled(document.getElementById('courseToAddSelectElement').value);
} else {
  document.addEventListener('DOMContentLoaded', function () {
    // document wasn't loaded, when it is call function
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
function getListOfUsersEnrolled(someClassId) {
  let feedbackToUser = "";

  //make ajax request
  let req = new XMLHttpRequest();
  req.open("GET", baseURL + getStudentsEnrolledAPI + someClassId, true);
  req.setRequestHeader("Content-type", "application/json");
  req.addEventListener("load", function () {
    if (req.status >=200 && req.status < 400) {
      let data = JSON.parse(req.response);
      if (data.results.length == 0) {
        feedbackToUser = "<tr><td colspan=\"6\">No one enrolled</td></tr>";
      } else {

        for (let someUser of data.results) {
          feedbackToUser += "<tr>";
          feedbackToUser += "<td>" + someUser.firstName + "</td>";
          feedbackToUser += "<td>" + someUser.lastName + "</td>";
          feedbackToUser += "<td>" + someUser.userName + "</td>";
          feedbackToUser += "<td>" + someUser.email + "</td>";
          feedbackToUser += "<td>" + someUser.userType + "</td>";
          feedbackToUser += "<td><button id=\"drop" + someUser.userId + "\">drop user</td>";
          feedbackToUser += "</tr>";
        }

      }
    } else {
      feedbackToUser = "<tr><td>Sorry, there was an error in getting the available classes.</td></tr>";
    }

    feedbackResponse.innerHTML = feedbackToUser;
  });
  req.send(null);
  event.preventDefault();
}

function getUsersNotEnrolled(someClassId) {
  let selectElement = "";

  //make ajax request
  let req = new XMLHttpRequest();
  req.open("GET", baseURL + getStudentsNotInClass + someClassId, true);
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
