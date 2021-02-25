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
const adminLangCoursesTableBody = document.getElementById('adminLangsCoursesTableBody');

// const getCategoriesAPI = module.config().getCategoriesAPI;
// const getLanguagesAPI = module.config().getLanguagesAPI;
// const coursesURLString = module.config().coursesURLString;
// const courseOverviewLandingpage = module.config().courseOverviewLandingpage;
// let feedbackResponse = document.getElementById('feedback');
// let categoriesDropDownList = document.getElementById('categoriesDropDownList');


// set up event listeners -------------------------------------

if(document.readyState !== 'loading' ) {
  // document is already ready, just execute code
  getCategoryForCourse(document.getElementById('selectCourseCategoryToEdit').value);
  getLanguagesForCourse(document.getElementById('selectCourseCategoryToEdit2').value)
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


document.getElementById('selectCourseCategoryToEdit2').addEventListener('change', function() {
  //clear all languages
  adminLangCoursesTableBody.innerHTML= ""
  //re populate languages based on course selection
  getLanguagesForCourse(document.getElementById('selectCourseCategoryToEdit2').value)
})


let addLangToCourseButton = document.getElementById('addLangToCourseButton');
  addLangToCourseButton.addEventListener('click', function(){
    let courseInput = document.getElementById('selectCourseCategoryToEdit2').value
    let languageInput = document.getElementById('selectLanguage').value
    addLanguageToCourse(courseInput,languageInput)
    })

// main functions -------------------------------------

  function getLanguagesForCourse (courseId){
    let url = baseURL+ "/api/getLanguagesForCourse/" + courseId;
    let req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.setRequestHeader("Content-type", "application/json");
    req.addEventListener("load", function () {
      if (req.status >=200 && req.status < 400) {
        let data = JSON.parse(req.response);
        // console.log("DATA ---" + JSON.stringify(data))
        if (data.results.length == 0) {
          logIt( "No languages assigned")
        } else {
          for (let someLang of data.results) {
            let newRow = adminLangCoursesTableBody.insertRow(-1);
            let cell1 = newRow.insertCell(0);
            cell1.innerHTML = someLang.languageName
            let cell2 = newRow.insertCell(1);
            cell2.innerHTML = someLang.country
            var cell3 = document.createElement('input')
            cell3.type="button";
            cell3.value = "delete"
            cell3.name= 'delete'
            cell3.addEventListener("click", function() {
                deleteLanguage(someLang.languageId);
            });
            newRow.appendChild(cell3)
          }
          
        }
      }else{
        logIt('sorry, there was a problem in getting the available languages.')
      }
    })
    
    req.send(null);
    event.preventDefault();
  }

function addLanguageToCourse(courseId, languageId){
  let url = baseURL+ "/api/addLanguageToCourse/" + courseId + '/' + languageId;
  let req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.setRequestHeader("Content-type", "application/json");
  req.addEventListener("load", function (){
    if (req.status >=200 && req.status < 400){
      let data = JSON.parse(req.response);
      if (data.results.length== 0){
        alert("Oops! You tried to add a language that is already available for the selected course.")
      } else{
        logIt('Category successfully inserted')
        //re-populates table with updated data
        adminLangCoursesTableBody.innerHTML = ''
        getLanguagesForCourse(courseId);
      }
    }
  })
  req.send(null);
  event.preventDefault();
}


function getCategoryForCourse(courseId) {
  let url = "http://localhost:14567/api/getCategoryNameForCourse/" + courseId; //console.log("URL: " + url);

  //make ajax request
  let req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.setRequestHeader("Content-type", "application/json");
  req.addEventListener("load", function () {
    if (req.status >=200 && req.status < 400) {
      let data = JSON.parse(req.response);
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
