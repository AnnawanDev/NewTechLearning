/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   January 25, 2021
*/

const useLogging = true;
const baseURL = "http://localhost:14567";
//const baseURL = "http://flip3.engr.oregonstate.edu:14567";
const loginAPI = "/api/login";
let feedbackResponse = document.getElementById('feedback');

// set up event listeners -------------------------------------
document.addEventListener("DOMContentLoaded", function(event) {
  document.getElementById('submit').addEventListener('click', logUserIn);
});

// main functions -------------------------------------
function logUserIn() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const userFeedback = document.getElementById("feedback");

  if (username === '' || password === '') {
    userFeedback .innerHTML = "<span style=\"color: #ff0000\">Please make sure you enter a value for the email and password</span>";
    event.preventDefault();
    return;
  }

  //set-up POST payload
  let payload = {};
  payload.username = username;
  payload.password = password;

  let feedbackToUser = "";

  //make ajax request
  let req = new XMLHttpRequest();
  req.open("POST", baseURL + loginAPI, true);
  req.setRequestHeader("Content-type", "application/json");
  req.addEventListener("load", function () {
    if (req.status >=200 && req.status < 400) {
      let data = JSON.parse(req.response);
      //console.log("DATA ---" + JSON.stringify(data))
      location.reload();  //reloading so we can get login/logout context nav reloaded 
    } else {
      userFeedback.innerHTML = "<span style=\"color: #ff0000\">Sorry, we couldn't log you in. Please try again</span>";
    }
  });
  req.send(JSON.stringify(payload));
  event.preventDefault();
}


// utility -------------------------------------
function logIt(someMessage) {
  if (useLogging) {
    console.log(someMessage);
  }
}
