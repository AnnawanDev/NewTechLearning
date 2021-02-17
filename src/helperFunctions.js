/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   February 17, 2021
*/

const useLogging = true;  //move to common config object?

//common function to log messages to console rather than use console.log for everyone
//if we want to universally turn off messages when we submit project, there's only one spot in file to do so
function logIt(someMessage) {
  if (useLogging) {
    console.log(someMessage);
  }
}

module.exports = logIt;
