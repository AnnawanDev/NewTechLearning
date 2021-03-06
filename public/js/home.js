/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   January 30, 2021
*/

define (['module'], function(module){

const useLogging = module.config().useLogging;
const baseURL = module.config().baseURL;
const getRecentlyAddedCoursesAPI = module.config().getRecentlyAddedCoursesAPI;
const coursesURLString = module.config().coursesURLString;
const courseOverviewLandingpage = module.config().courseOverviewLandingpage;
let feedbackResponse = document.getElementById('recentlyAddedClasses');

// set up event listeners -------------------------------------


if( document.readyState !== 'loading' ) {
  // document is already ready, just execute code
  getRecentlyAddedClasses()
} else {
  document.addEventListener('DOMContentLoaded', function () {
      // document wasn't loaded, when it is call function
      getRecentlyAddedClasses();
  });
}

// main functions -------------------------------------
//gets the 3 most recently added classes to display on home page
function getRecentlyAddedClasses() {
  let feedbackToUser = "";
  //make ajax request
  let req = new XMLHttpRequest();
  req.open("GET", baseURL + getRecentlyAddedCoursesAPI, true);
  req.setRequestHeader("Content-type", "application/json");
  req.addEventListener("load", function () {
    if (req.status >=200 && req.status < 400) {
      let data = JSON.parse(req.response);
      if (data.results.length == 0) {
        feedbackToUser = "<p>Sorry, we currently don't have any available classes.</p>";
      } else {
        feedbackToUser += "<ul>";
        for (let someClass of data.results) {
          let classURL = baseURL + coursesURLString + "/" + someClass.courseId + "/" + someClass.courseName + courseOverviewLandingpage;
          feedbackToUser += "<li><a href=\"" + classURL + "\">" + someClass.courseName + "</a></li>";
        }
        feedbackToUser += "</ul>";
      }
    } else {
      feedbackToUser = "<p>Sorry, there was an error in getting the available classes.</p>";
    }

    feedbackResponse.innerHTML = feedbackToUser;
  });
  req.send(JSON.stringify(null));
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
