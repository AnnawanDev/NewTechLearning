/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   January 25, 2021
*/

define (['module'],function(module){

const useLogging = module.config().useLogging;
const baseURL = module.config().baseURL;
const loginAPI = module.config().loginAPI;
let feedbackResponse = document.getElementById('feedback');

// set up event listeners  -------------------------------------
if(document.readyState !== 'loading' ) {
  document.getElementById('submit').addEventListener('click', logUserIn);
} else {
  document.addEventListener('DOMContentLoaded', function () {
      document.getElementById('submit').addEventListener('click', logUserIn);
  });
}


// main functions -------------------------------------
//function to log the user in
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
//utility function to log messages to console window if logging is turned on
function logIt(someMessage) {
  if (useLogging) {
    console.log(someMessage);
  }
}

});
