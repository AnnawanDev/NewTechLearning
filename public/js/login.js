/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   January 25, 2021
*/

const useLogging = true;
const baseURL = "http://localhost:3000";
const loginAPI = "/api/login";
let feedbackResponse = document.getElementById('feedback');

// set up event listeners -------------------------------------
document.addEventListener("DOMContentLoaded", function(event) {
  document.getElementById('submit').addEventListener('click', logUserIn);
});

// main functions -------------------------------------
function logUserIn() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const userFeedback = document.getElementById("feedback");

  if (email === '' || password === '') {
    userFeedback .innerHTML = "<span style=\"color: #ff0000\">Please make sure you enter a value for the email and password</span>";
    event.preventDefault();
    return;
  }

  //set-up POST payload
  let payload = {};
  payload.email = email;
  payload.password = password;

  let feedbackToUser = "";

  //make ajax request
  let req = new XMLHttpRequest();
  req.open("POST", baseURL + loginAPI, true);
  req.setRequestHeader("Content-type", "application/json");
  req.addEventListener("load", function () {
    if (req.status >=200 && req.status < 400) {
      let data = JSON.parse(req.response);
      console.log("DATA ---" + JSON.stringify(data))
      //localStorage.setItem('token', data.token);
      userFeedback.innerHTML = "<h2>Welcome back " + data.firstName + "</h2>";
    } else {
      feedbackToUser = "<span style=\"color: #ff0000\">Sorry, we couldn't log you in. Please try again</span>";
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
