/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   February 17, 2021
*/

const dbQueries = require('../dbQueries');
const useSecurity = true;

//middleware function to that makes sure that user is logged in as either Instructor or Admin
const requireLogin = (req, res, next) => {
  if (useSecurity) {
    if (!req.session.user) {
      res.redirect('/login');
    } else {
      if (req.session.user.userType == "STUDENT" && req.path.toLowerCase().substring(0,7) !== "/logout" ) {
        res.redirect('/');
      } else {
        next();
      }
    }
  } else {
    next();
  }
};

//middleware function that checks if user is logged in as Admin
const requireAdminLogin = (req, res, next) => {
  if (useSecurity) {
    if (!req.session.user) {
      res.redirect('/login');
    } else {
      if (req.session.user.userType != "ADMIN") {
        res.redirect('/');
      } else {
        next();
      }
    }
  } else {
    next();
  }
};

//adds to context object whether or not user is logged in; and if so, what kind of userType they are
async function getLoginContext(someContextObject, req) {
  someContextObject.isNotLoggedIn = await isNotLoggedIn(req);
  someContextObject.isLoggedInAsStudent = await isLoggedInAs(req, "STUDENT");
  someContextObject.isLoggedInAsInstructor = await isLoggedInAs(req, "INSTRUCTOR");
  someContextObject.isLoggedInAsAdmin = await isLoggedInAs(req, "ADMIN");

  if (someContextObject.isLoggedInAsInstructor || someContextObject.isLoggedInAsAdmin) {
    someContextObject.isInstructorOrAdmin = true;
  } else {
    someContextObject.isInstructorOrAdmin = false;
  }

  if (!someContextObject.isNotLoggedIn) {
    someContextObject.firstName = req.session.user.firstName;
  }

  return someContextObject;
}

//checks if user is at least logged in
async function isNotLoggedIn(req) {
  if (!req.session || !req.session.user) {
    return true;
  }
  return false;
}

//verifies that user is logged in as some type
async function isLoggedInAs(req, someType) {
  if (!req.session || !req.session.user) {
    return false;
  }
  let userType = await dbQueries.getUserType(req.session.user.userId);
  if (userType == someType) {
    return true;
  }
  return false;
}

//makes sure that user session is set to verify if user is at least logged in
function checkIfLoggedIn(req) {
  if (!req.session.user) {
    return true;
  }
  return false;
}

module.exports = {
  requireLogin,
  requireAdminLogin,
  getLoginContext
}
