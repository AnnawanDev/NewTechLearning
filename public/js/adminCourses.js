/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   February 23, 2021
*/

define (['module'], function (module){

const useLogging = module.config().useLogging;
const baseURL = module.config().baseURL;
const getCategoryNameForCourseAPI = module.config().getCategoryNameForCourseAPI;
// const getCategoriesAPI = module.config().getCategoriesAPI;
// const getLanguagesAPI = module.config().getLanguagesAPI;
// const coursesURLString = module.config().coursesURLString;
// const courseOverviewLandingpage = module.config().courseOverviewLandingpage;
// let feedbackResponse = document.getElementById('feedback');
// let categoriesDropDownList = document.getElementById('categoriesDropDownList');


// set up event listeners -------------------------------------
if( document.readyState !== 'loading' ) {
  // document is already ready, just execute code
  getCategoryForCourse(document.getElementById('selectCourseCategoryToEdit').value);
}
else {
  document.addEventListener('DOMContentLoaded', function () {
      // document wasn't loaded, when it is call function
      getCategoryForCourse(document.getElementById('selectCourseCategoryToEdit').value);
  });
}

document.getElementById('selectCourseCategoryToEdit').addEventListener('change',function(){
    //clear all classes
    document.getElementById('categoryThatIsAssociatedWithClass').innerHTML = "";

    //re-populate classes based on category selection
    getCategoryForCourse(document.getElementById('selectCourseCategoryToEdit').value);
});

// main functions -------------------------------------
function getCategoryForCourse(courseId) {
  let url = "http://localhost:14567/api/getCategoryNameForCourse/" + courseId; console.log("URL: " + url);

  //make ajax request
  let req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.setRequestHeader("Content-type", "application/json");
  req.addEventListener("load", function () {
    if (req.status >=200 && req.status < 400) {
      let data = JSON.parse(req.response);
      // console.log("DATA ---" + JSON.stringify(data))
      if (data.results.length == 0) {
        feedbackToUser = "No category assigned";
      } else {
        feedbackToUser = data.results[0].categoryName;
      }
    } else {
      feedbackToUser = "<p>Sorry, there was an error in getting the available classes.</p>";
    }

    document.getElementById('categoryThatIsAssociatedWithClass').innerHTML = feedbackToUser;
  });
  req.send(null);
  event.preventDefault();
}



function getCategoriesList() {
  //let populateCategoriesList = "<select name=\"categoriesList\" id=\"categoriesList\"><option value=\"all\">All</option>";

  let editCategoriesList = document.createElement("select");
  editCategoriesList.setAttribute("name", "editCategoriesList");
  editCategoriesList.setAttribute("id", "editCategoriesList");

  //make ajax request
  let req = new XMLHttpRequest();
  req.open("GET", baseURL + getListOfAllCategoriesAPI, true);
  req.setRequestHeader("Content-type", "application/json");
  req.addEventListener("load", function () {
    if (req.status >=200 && req.status < 400) {
      let data = JSON.parse(req.response);
      //console.log("DATA ---" + JSON.stringify(data))

      if (data.results.length == 0) {
        //populateCategoriesList += "</select>";
      } else {
        for (let someCategory of data.results) {
          let option = document.createElement("option");
          option.setAttribute("value", someCategory.categoryId);
          option.text = someCategory.categoryName;
          editCategoriesList.appendChild(option);
        }
      }

    } else {
      //log error?
    }
    document.getElementById('selectCourseCategoryToEditSpan').appendChild(editCategoriesList);
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
