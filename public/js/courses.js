/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   January 25, 2021
*/

const useLogging = true;
const baseURL = "http://localhost:3000";
const getCoursesAPI = "/api/getCourses";
const coursesURLString = "/courses";
const courseOverviewLandingpage = "/overview";
let feedbackResponse = document.getElementById('feedback');

// set up event listeners -------------------------------------
document.addEventListener("DOMContentLoaded", function(event) {
  getAvailableClasses();
});

// main functions -------------------------------------
function getAvailableClasses() {
  let feedbackToUser = "";

  //make ajax request
  let req = new XMLHttpRequest();
  req.open("GET", baseURL + getCoursesAPI, true);
  req.setRequestHeader("Content-type", "application/json");
  req.addEventListener("load", function () {
    if (req.status >=200 && req.status < 400) {
      let data = JSON.parse(req.response);
      console.log("DATA ---" + JSON.stringify(data))
      feedbackToUser = "<ul>";

      if (data.results.length == 0) {
        feedbackToUser = "<p>Sorry, we currently don't have any available classes.</p>";
      } else {
        for (let someClass of data.results) {
          let fakeCourseID = 3; //TODO: REPLACE
          let classURL = baseURL + coursesURLString + "/" + fakeCourseID + "/" + someClass.courseName + courseOverviewLandingpage;
          feedbackToUser += "<li><a href=\"" + classURL + "\">" + someClass.courseName + "</a></li>";
        }
      }
      feedbackToUser += "</ul>";
    } else {
      feedbackToUser = "<p>Sorry, there was an error in getting the available classes.</p>";
    }

    document.getElementById("availableClasses").innerHTML = feedbackToUser;
  });
  req.send(JSON.stringify(null));
  event.preventDefault();
}


// utility -------------------------------------
function logIt(someMessage) {
  if (useLogging) {
    console.log(someMessage);
  }
}
