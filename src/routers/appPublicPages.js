/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   March 8, 2021
*/

const express = require('express');
const router = new express.Router();
const {getLoginContext, requireLogin} = require('../middleware/auth');
const helper = require ('../helperFunctions');
const {doesUserExist, addNewUser, getListOfCategories, getListOfLanguages, isInstructorOrStudentInClass, addUserToClass} = require('../dbQueries');
const mysql = require('../databaseConnection');
const bcrypt = require('bcrypt');
const useLogging = true;

//route handler for homepage
router.get('/', async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Home';
  context = await getLoginContext(context, req);
  res.render('home', context);
});

//route handler for about page
router.get('/About', async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | About';
  context = await getLoginContext(context, req);
  res.render('about', context);
});

//route handler for logging the user in
router.get('/Login', async (req, res) => {
  let context = {};

  //is user already logged in?
  if (req.session && req.session.user) {
    context.message = "<h1>Welcome back " + req.session.user.firstName + "</h1><br /><br />";
  }

  context.title = 'New Tech Learning | Login';
  context = await getLoginContext(context, req);
  res.render('login',context);
});

//route handler for logging the usre out
router.get('/Logout', requireLogin, async (req, res) => {
  req.session.reset();  //resets user session
  let context = {};
  context.title = 'New Tech Learning | Logout';
  context = await getLoginContext(context, req);
  res.render('logout', context);
});

//route handler for Create Account when user lands on page
router.get('/CreateAccount', async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Create Account';
  context = await getLoginContext(context, req);
  res.render('createAccount', context);
});

//route handler for creating an account after user does a POST back to the page
router.post('/CreateAccount', async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Create Account';

  //verify that all needed values were posted
  if (!req.body['firstName'] || !req.body['lastName'] || !req.body['userName'] || !req.body['email'] || !req.body['password1']) {
    context.feedback = "<div class='formError'>Sorry, required fields not presented when form submitted.  Try again.</div>";
    context = await getLoginContext(context, req);
    res.render('createAccount', context);
  }

  let hashedPassword = await bcrypt.hash(req.body['password1'], 8);
  const inserts = [req.body['firstName'], req.body['lastName'], req.body['userName'], req.body['email'], [hashedPassword], 'STUDENT'];  // Since call is being made from /CreateAccount, must be a student account

  try {
    let result = await addNewUser(inserts);
    context.feedback = "<div class='formSuccess'>Welcome to New Tech Learning!</div>";
  } catch(e) {
    context.feedback = "<div class='formError'>" + e + "</div>";
    context.firstName = req.body['firstName'];
    context.lastName = req.body['lastName'];
    context.userName = req.body['userName'];
    context.email = req.body['email'];
  }

  let user = await doesUserExist(req.body['userName'], req.body['password1']);

  //NOTE: Not sure if we'll need this.  Keeping for now
  //user.token = await generateAuthToken(user.userId); //log user in with credentials supplied to create account
  //await updateUserToken(user.token, user.userId); // update db with user token

  req.session.user = user; //store user object in session
  context = await getLoginContext(context, req); //get user context and save in session
  res.render('createAccount', context);
});

router.get('/Courses', async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Courses';
  context = await getLoginContext(context, req);
  context.languages = await getListOfLanguages();
  res.render('courses', context);
});

//route handler for displaying the course overview page for a particualr course ID 
router.get('/Courses/:id/:courseName/overview', async (req, res) => {
  let context = {};
  context.results = "";
  context = await getLoginContext(context, req);

  mysql.pool.query('SELECT `courseName`, `courseDescription` FROM `Courses` WHERE `courseId` = ?', req.params.id, async (err, rows, fields) => {
      if (err) {
        logIt("ERROR FROM /Courses/:id/:courseName/overview: " + err);
        return;
      }
      context.title = rows[0].courseName;
      context.htmlContent = rows[0].courseDescription;
      context.moduleLink = '/courses/' + req.params.id + '/' + rows[0].courseName + '/module/1';

      //if admin then show link to go to class module
      //if instructor then see if instructor is teaching that class.  If teaching, then show link. If not, then don't show anything
      //if student, then see if enrolled.  if enrolled, then show link to course module.  if not enrolled, then show link to sign up
      //if not logged in, then show prompt to login in order to enroll
      if (!req.session || !req.session.user) {
        context.notLoggedIn = true;
      } else if (req.session.user.userType == "STUDENT") {
        let isUserEnrolled = await isInstructorOrStudentInClass(context, req);
        context.isEnrolled = isUserEnrolled.enrolled;
        context.isStudent = true;
      } else if (req.session.user.userType == "INSTRUCTOR") {
        let isUserEnrolled = await isInstructorOrStudentInClass(context, req);
        context.isEnrolled = isUserEnrolled.enrolled;
        context.isInstructor = true;
      } else if (req.session.user.userType == "ADMIN") {
        context.isAdmin = true;
      } else {
        logIt ("ERROR - SHOULD NOT GET HERE in /Courses/:id/:courseName/overview")
      }

      res.render('courseOverview', context);
    });
});

//route handler for when a user signs up for a course - it will post back to this page and then provide
//the user with links to go to course modules
router.post('/Courses/:id/:courseName/overview', async (req, res) => {
  //if user is not logged in then reroute to GET version of page
  if (!req.session || !req.session.user) {
    const returnURL = '/Courses/' + req.params.id + "/" + req.params.courseName + "/overview";
    return res.redirect(returnURL);
  }

  let context = {};
  context.results = "";
  context = await getLoginContext(context, req);

  //add user to class
  const inserts = [req.session.user.userId, req.params.id];
  context.addingClass = await addUserToClass(inserts);

  mysql.pool.query('SELECT `courseName`, `courseDescription` FROM `Courses` WHERE `courseId` = ?', req.params.id, async (err, rows, fields) => {
      if (err) {
        logIt("ERROR FROM /Courses/:id/:courseName/overview: " + err);
        return;
      }
      context.title = rows[0].courseName;
      context.htmlContent = rows[0].courseDescription;
      context.moduleLink = '/courses/' + req.params.id + '/' + rows[0].courseName + '/module/1';

      //if admin then show link to go to class module
      //if instructor then see if instructor is teaching that class.  If teaching, then show link. If not, then don't show anything
      //if student, then see if enrolled.  if enrolled, then show link to course module.  if not enrolled, then show link to sign up
      //if not logged in, then show prompt to login in order to enroll
      if (!req.session || !req.session.user) {
        context.notLoggedIn = true;
      } else if (req.session.user.userType == "STUDENT") {
        let isUserEnrolled = await isInstructorOrStudentInClass(context, req);
        context.isEnrolled = isUserEnrolled.enrolled;
        context.isStudent = true;
      } else if (req.session.user.userType == "INSTRUCTOR") {
        let isUserEnrolled = await isInstructorOrStudentInClass(context, req);
        context.isEnrolled = isUserEnrolled.enrolled;
        context.isInstructor = true;
      } else if (req.session.user.userType == "ADMIN") {
        context.isAdmin = true;
      } else {
        logIt ("ERROR - SHOULD NOT GET HERE in /Courses/:id/:courseName/overview")
      }

      res.render('courseOverview', context);
    });
});

//route handler for course module
router.get('/Courses/:id/:courseName/module/:courseModule?', (req, res) => {
  //if courseModule parameter is missing assume it's equal to 1
  if (!req.params.courseModule) {
    req.params.courseModule = 1;
  }

  let context = {};
  let query1= 'SELECT COUNT(*) as moduleCount FROM `CourseModules` WHERE `courseFk` = ?'
  let query2 = 'SELECT `courseModuleHTML` FROM `CourseModules` WHERE `courseFk`= ? and `courseModuleOrder` = ?';
  let filter= [req.params.id, req.params.courseModule]

  //query for number of course modules
  mysql.pool.query(query1, req.params.id, (err,rows1,fields)=> {
    if (err) {
      logIt("ERROR FROM /module/:courseModule : " + err);
      return;
    }
    //query for course module HTML given course and order
    mysql.pool.query(query2, filter, async (err, rows2, fields) => {
      //error handling
      if (err) {
        logIt("ERROR FROM /module/:courseModule : " + err);
        return;
      }

      let moduleLinks ={}
      //set up links for the other modules
      for (let i =1; i<= rows1[0].moduleCount; i++){
        moduleLinks[i] = '/courses/' + req.params.id + '/' + req.params.courseName + '/module/'+ i
      }

      //add objects to context
      context.moduleLinks = moduleLinks
      context.courseTitle = req.params.courseName;
      context.moduleNo = req.params.courseModule
      context.htmlContent = rows2[0].courseModuleHTML
      context = await getLoginContext(context, req);
      res.render('coursePage', context);
    });

  });
});

//utility function to log messages to console based on whether use logging is enabled
function logIt(someMessage) {
  if (useLogging) {
    console.log(someMessage);
  }
}

module.exports = router;
