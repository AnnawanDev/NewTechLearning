/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   January 25, 2021
*/

const useLogging = true;
const baseURL = "http://localhost:14567";
//const baseURL = "http://flip3.engr.oregonstate.edu:14567";
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


      if (data.results.length == 0) {
        feedbackToUser = "<p>Sorry, we currently don't have any available classes.</p>";
      } else {
        for (let someClass of data.results) {
          let fakeCourseID = someClass.courseId;
          let classURL = baseURL + coursesURLString + "/" + fakeCourseID + "/" + someClass.courseName + courseOverviewLandingpage;
          feedbackToUser += "<div>";
          feedbackToUser += "<a href=\"" + classURL + "\"><img src=\"/images/courseImage1.jpg\" width=\"150\" height=\"150\" /></a>";
          feedbackToUser += "<a href=\"" + classURL + "\">" + someClass.courseName + "</a>";
          feedbackToUser += "</div>";
        }
        feedbackToUser += "<div style=\"clear: both;\"></div>";
      }

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
