/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   February 17, 2021
*/

const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const dbQueries = require('../dbQueries');
const bcrypt = require('bcrypt');
const logIt = require('../helperFunctions');

router.get('/Admin/', auth.requireLogin, async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Admin Home';
  context = await auth.getLoginContext(context, req);
  res.render('adminHome', context);
});

// router.get('/Admin/Users/', auth.requireLogin, async (req, res) => {
//   let context = {};
//   context.title = 'New Tech Learning | Admin Users';
//   context = await auth.getLoginContext(context, req);
//   context.courses = await dbQueries.getListOfLiveCourses();
//   context.userListing = await dbQueries.getListOfUsersWithUserTypes();
//   res.render('adminUsers', context);
// });

// router.post('/Admin/Users/', auth.requireLogin, async (req, res) => {
//   let context = {};
//   context.title = 'New Tech Learning | Admin Users';
//   context.courses = await dbQueries.getListOfLiveCourses();
//   context = await auth.getLoginContext(context, req);
//
//   if (req.body['addUserForm']) {  //user is trying to add a new user
//
//     //TODO: add form validation!
//
//     let hashedPassword = await bcrypt.hash(req.body['addPassword1'], 8);
//     const inserts = [req.body['addFirstName'], req.body['addLastName'], req.body['addUserName'], req.body['addEmail'], [hashedPassword], req.body['addUserType']];
//
//     try {
//       let result = await dbQueries.addNewUser(inserts);
//       context.addUserFeedback = "<div class='formSuccess'>User added!</div>";
//     } catch(e) {
//       logIt("ERROR: " + e);
//       context.addUserFeedback = "<div class='formError'>" + e + "</div>";
//       context.addFirstName = req.body['addFirstName'];
//       context.addLastName = req.body['addLastName'];
//       context.addUserName = req.body['addUserName'];
//       context.addEmail = req.body['addEmail'];
//     }
//   }
//
//   res.render('adminUsers', context);
// });

router.get('/Admin/Languages/', auth.requireLogin, async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Admin Languages';
  context = await auth.getLoginContext(context, req);
  res.render('adminLanguages', context);
});

router.get('/Admin/Categories/', auth.requireLogin, async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Admin Categories';
  context = await auth.getLoginContext(context, req);
  res.render('adminCategories', context);
});

// router.get('/Admin/Courses/', auth.requireLogin, async (req, res) => {
//   let context = {};
//   context.title = 'New Tech Learning | Admin Courses';
//   context = await auth.getLoginContext(context, req);
//   res.render('adminCourses', context);
// });

router.get('/Admin/CourseModules/', auth.requireLogin, async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Admin CourseModules';
  context = await auth.getLoginContext(context, req);
  res.render('adminCourseModules', context);
});


module.exports = router;
