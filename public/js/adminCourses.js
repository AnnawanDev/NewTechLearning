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
  bindSubmitButtons();
  document.getElementById('languageSelectorForNewCourse').selectedIndex = 0;
}

else {
  document.addEventListener('DOMContentLoaded', function () {
      // document wasn't loaded, when it is call function
      bindSubmitButtons();
      document.getElementById('languageSelectorForNewCourse').selectedIndex = 0;
  });
}

//binds click listener to validate course submission when button is clicked
function bindSubmitButtons() {
  document.getElementById("addButton").addEventListener("click", validateNewCourse);
}


// main functions -------------------------------------
//validates form when adding a new course
function validateNewCourse() {
  //make sure course name is not blank
  if (document.getElementById("courseName").value == "") {
    alert('You need to enter a course name');
    event.preventDefault();
    return;
  }

  //make sure there is a course description
  if (document.getElementById("courseDescription").value == "") {
    alert('You need to enter a course description');
    event.preventDefault();
    return;
  }

  //make sure there's at least one language selected
  if (document.getElementById("languageSelectorForNewCourse").length > 0 && document.getElementById("languageSelectorForNewCourse")[0] == 0) {
    alert("You can't select both no languages and languages");
    event.preventDefault();
    return;
  }
}

// utility -------------------------------------
//utility function to log messages if logging is turned on
function logIt(someMessage) {
  if (useLogging) {
    console.log(someMessage);
  }
}

});
