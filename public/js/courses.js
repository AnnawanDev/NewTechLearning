/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   January 25, 2021
*/

define (['module'], function (module){

const useLogging = module.config().useLogging;
const baseURL = module.config().baseURL;
const getCoursesAPI= module.config().getCoursesAPI;
const getCategoriesAPI = module.config().getCategoriesAPI;
const coursesURLString = module.config().coursesURLString;
const courseOverviewLandingpage = module.config().courseOverviewLandingpage;
let feedbackResponse = document.getElementById('feedback');
let categoriesDropDownList = document.getElementById('categoriesDropDownList');

// set up event listeners -------------------------------------

if( document.readyState !== 'loading' ) {
  // document is already ready, just execute code
  getCategoriesList();
  getAvailableClasses('');
} else {
  document.addEventListener('DOMContentLoaded', function () {
    // document wasn't loaded, when it is call functions
    getCategoriesList();
    getAvailableClasses('');
  });
}

categoriesDropDownList.addEventListener('change',function(){
    //clear all classes
    document.getElementById('availableClasses').innerHTML = "";
    //reset language select to ALL
    document.getElementById('languagesList').selectedIndex=0;
    let queryFilter = "?categoryFilter="
    queryFilter += document.getElementById('categoriesList').value;
    //re-populate classes based on category selection
    getAvailableClasses(queryFilter);
});

document.getElementById('languagesList').addEventListener('change', function(){
  document.getElementById('categoriesList').selectedIndex=0;
  document.getElementById('availableClasses').innerHTML = "";
  let queryFilter = "?languageFilter="
  queryFilter += document.getElementById('languagesList').value;
  getAvailableClasses(queryFilter)
})

// ----------------main functions -------------------

function getAvailableClasses(filter) {
  let feedbackToUser = "";
  let queryURL = baseURL + getCoursesAPI + filter;

  //make ajax request
  let req = new XMLHttpRequest();
  req.open("GET", queryURL, true);
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

function getCategoriesList() {
  //let populateCategoriesList = "<select name=\"categoriesList\" id=\"categoriesList\"><option value=\"all\">All</option>";

  let populateCategoriesList = document.createElement("select");
  populateCategoriesList.setAttribute("name", "categoriesList");
  populateCategoriesList.setAttribute("id", "categoriesList");

  let allOptionForDropDown = document.createElement("option");
  allOptionForDropDown.setAttribute("value", "ALL");
  allOptionForDropDown.text = "ALL";
  populateCategoriesList.appendChild(allOptionForDropDown);

  //make ajax request
  let req = new XMLHttpRequest();
  req.open("GET", baseURL + getCategoriesAPI, true);
  req.setRequestHeader("Content-type", "application/json");
  req.addEventListener("load", function () {
    if (req.status >=200 && req.status < 400) {
      let data = JSON.parse(req.response);
      //console.log("DATA ---" + JSON.stringify(data))

      if (data.results.length == 0) {
        //populateCategoriesList += "</select>";
      } else {
        for (let someCategory of data.results) {
          //populateCategoriesList += "<option value=\"" + someCategory.categoryId + "\">" + someCategory.categoryName + "</option>"
          let option = document.createElement("option");
          option.setAttribute("value", someCategory.categoryId);
          option.text = someCategory.categoryName;
          populateCategoriesList.appendChild(option);
        }
      }

    } else {
      //populateCategoriesList += "</select>";
    }
    categoriesDropDownList.appendChild(populateCategoriesList);
    //categoriesDropDownList.innerHTML = populateCategoriesList;
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
