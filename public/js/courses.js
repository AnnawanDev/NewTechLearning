/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   January 25, 2021
*/
define (['module'],function (module){

const useLogging = module.config().useLogging;
const baseURL = module.config().baseURL;
const getCoursesAPI= module.config().getCoursesAPI;
const coursesURLString = module.config().coursesURLString;
const courseOverviewLandingpage = module.config().courseOverviewLandingpage;
let feedbackResponse = document.getElementById('feedback');

// set up event listeners -------------------------------------
if( document.readyState !== 'loading' ) {
  // document is already ready, just execute code 
  getAvailableClasses();
} else {
  document.addEventListener('DOMContentLoaded', function () {
      // document wasn't loaded, when it is call function
      getAvailableClasses();
  });
}

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

});
