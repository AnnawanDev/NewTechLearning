/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   March 6, 2021
*/

define (['module'], function (module){

// set up event listeners -------------------------------------
if(document.readyState !== 'loading' ) {
  // document is already ready, just execute code
  selectCategoryDropDown();
  selectLanguageDropDown();
  selectInstructorDropDown();
}

else {
  document.addEventListener('DOMContentLoaded', function () {
      // document wasn't loaded, when it is call function
      selectCategoryDropDown();
      selectLanguageDropDown();
      selectInstructorDropDown();
  });
}

//sets the selected category in the category select element
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

//sets the selected language in the language select element
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

//sets the selected instructor in the instructor select element
function selectInstructorDropDown() {
  let instructorId = document.getElementById('selectedInstructorId');
  if (instructorId != null) {
    let dropDown = document.getElementById('selectInstructor');

    for (let i=0; i < dropDown.options.length; i++) {
      if (dropDown.options[i].value == instructorId.value) {
          dropDown.options[i].selected = true;
          return;
      }
    }
  }
}



// utility -------------------------------------
//utility function to load messages if logging is turned on
function logIt(someMessage) {
  if (useLogging) {
    console.log(someMessage);
  }
}

});
