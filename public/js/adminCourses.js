/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   February 23, 2021
*/

define (['module'], function (module){

// set up event listeners -------------------------------------
if(document.readyState !== 'loading' ) {
  // document is already ready, just execute code
  bindSubmitButtons()
}

else {
  document.addEventListener('DOMContentLoaded', function () {
      // document wasn't loaded, when it is call function
      bindSubmitButtons()
  });
}

function bindSubmitButtons() {
  document.getElementById("addButton").addEventListener("click", validateNewCourse);
}


// main functions -------------------------------------
function validateNewCourse() {
  if (document.getElementById("courseName").value == "") {
    document.getElementById("addCourseError").innerHTML = "<p style=\"color: #ff0000;\">You need to enter a course name</p>";
    document.getElementById("addCourseSuccess").innerHTML = "";
    event.preventDefault();
    return;
  }

  if (document.getElementById("courseDescription").value == "") {
    document.getElementById("addCourseError").innerHTML = "<p style=\"color: #ff0000;\">You need to enter a course description</p>";
    document.getElementById("addCourseSuccess").innerHTML = "";
    event.preventDefault();
    return;
  }

  if (document.getElementById("languageSelectorForNewCourse").length > 1 && document.getElementById("languageSelectorForNewCourse")[0] == 0) {
    document.getElementById("addCourseError").innerHTML = "<p style=\"color: #ff0000;\">You can't select both no languages and languages</p>";
    document.getElementById("addCourseSuccess").innerHTML = "";
    event.preventDefault();
    return;
  }
}

// utility -------------------------------------
function logIt(someMessage) {
  if (useLogging) {
    console.log(someMessage);
  }
}

});
