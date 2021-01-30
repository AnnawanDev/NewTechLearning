/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   January 25, 2021
*/

define (['domReady', 'module'],function (domReady, module){ 

const useLogging = module.config().useLogging;
const baseURL = module.config().baseURL;
const logoutAPI = module.config().logoutAPI;
let feedbackResponse = document.getElementById('feedback');

// set up event listeners -------------------------------------
domReady(function(){
  let token = localStorage.getItem("token");
  logUserOut(token);
  localStorage.setItem('token', null);
})

// main functions -------------------------------------
function logUserOut(token) {
  const userFeedback = document.getElementById("feedback");

  if (token == null) {
    userFeedback .innerHTML = "<span style=\"color: #ff0000\">You're already logged out</span>";
    return;
  }

  //set-up POST payload
  let payload = {};
  payload.token = token;

  let feedbackToUser = "";

  //make ajax request
  let req = new XMLHttpRequest();
  req.open("POST", baseURL + logoutAPI, true);
  req.setRequestHeader("Content-type", "application/json");
  req.addEventListener("load", function () {
    if (req.status >=200 && req.status < 400) {
      userFeedback.innerHTML = "<h2>You've been logged out</h2>";
    } else {
      userFeedback.innerHTML = "<span style=\"color: #ff0000\">You've been logged out locally, but there was an error logging you out on the system.</span>";
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

});