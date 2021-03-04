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
  selectLanguageDropDown();
}

else {
  document.addEventListener('DOMContentLoaded', function () {
      // document wasn't loaded, when it is call function
      selectCategoryDropDown();
      selectLanguageDropDown();
  });
}

function selectCategoryDropDown() {
  let categoryId = document.getElementById('selectedItem').value;
  let dropDown = document.getElementById('selectCategory');

  for (let i=0; i < dropDown.options.length; i++) {
    if (dropDown.options[i].value == categoryId) {
        dropDown.options[i].selected = true;
        return;
    }
  }
}

function selectLanguageDropDown() {
  const languages = document.getElementById('languageSelectedItem').value;
  const languageArray = languages.split(',');
  const dropDown = document.getElementById('selectLanguage');

  for (let i=0; i < languageArray.length; i++) {
    for (let j=0; j < dropDown.options.length; j++) {
      if (languageArray[i].includes(dropDown.options[j].value)) {
          dropDown.options[j].selected = true;
      }
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
