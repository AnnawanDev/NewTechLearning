/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   January 25, 2021
*/

define (['domReady', 'module'],function (domReady, module){ 

const useLogging = module.config().useLogging;
const baseURL = module.config().baseURL;
const loginAPI = module.config().loginAPI;
let feedbackResponse = document.getElementById('feedback');

// set up event listeners with domReady -------------------------------------

domReady(function(){
  document.getElementById('submit').addEventListener('click', logUserIn);
})

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
      console.log("DATA ---" + JSON.stringify(data))
      //localStorage.setItem('token', data.token);
      userFeedback.innerHTML = "<h2>Welcome back " + data.firstName + "</h2>";
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

});