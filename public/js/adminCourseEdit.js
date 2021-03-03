/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   February 23, 2021
*/

define (['module'], function (module){

const useLogging = module.config().useLogging;
const baseURL = module.config().baseURL;
const getListOfAllCategoriesAPI = module.config().getListOfAllCategoriesAPI;
const adminLangCoursesTableBody = document.getElementById('adminLangsCoursesTableBody');
const getCategoryNameForCourseAPI = module.config().getCategoryNameForCourseAPI;


// set up event listeners -------------------------------------
if(document.readyState !== 'loading' ) {
  // document is already ready, just execute code
  selectCategoryDropDown();
}

else {
  document.addEventListener('DOMContentLoaded', function () {
      // document wasn't loaded, when it is call function
      selectCategoryDropDown();
  });
}

function selectCategoryDropDown() {
  let categoryId = document.getElementById('selectedItem').value; console.log("cat id: " + categoryId);
  let dropDown = document.getElementById('selectCategory');

  for (let i=0; i < dropDown.options.length; i++) {
    if (dropDown.options[i].value == categoryId) {
        dropDown.options[i].selected = true;
        return;
    }
  }
}


// utility -------------------------------------
function logIt(someMessage) {
  if (useLogging) {
    console.log(someMessage);
  }
}

});
