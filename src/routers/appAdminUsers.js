/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   March 6, 2021
*/

const express = require('express');
const router = new express.Router();
const {getLoginContext, requireLogin} = require('../middleware/auth');
const {getListOfLiveCourses, addNewUser, getListOfUsersWithUserTypes, getListOfUsersAssociatedWithAClass} = require('../dbQueries');
const bcrypt = require('bcrypt');
const {logIt} = require('../helperFunctions');

// sets route for /Admin/Users/ on GET call
router.get('/Admin/Users/', requireLogin, async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Admin Users';
  context = await getLoginContext(context, req);
  context.courses = await getListOfLiveCourses();
  context.userListing = await getListOfUsersWithUserTypes();

  res.render('adminUsers', context);
});

// sets route for /Admin/Users/ on POST call
router.post('/Admin/Users/', requireLogin, async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Admin Users';
  context = await getLoginContext(context, req);
  context.courses = await getListOfLiveCourses();

  if (req.body['addUserForm']) {  //user is trying to add a new user
    let hashedPassword = await bcrypt.hash(req.body['addPassword1'], 8);
    const inserts = [req.body['addFirstName'], req.body['addLastName'], req.body['addUserName'], req.body['addEmail'], [hashedPassword], req.body['addUserType']];

    try {
      let result = await addNewUser(inserts);
      context.addEditUserFeedback = "<script>document.addEventListener('DOMContentLoaded', function(event) { alert('User added');});</script>";

    } catch(e) {
      logIt("ERROR: " + e);
      context.addEditUserFeedback = "<script>document.addEventListener('DOMContentLoaded', function(event) { alert('" + e + "');});</script>";
      context.addFirstName = req.body['addFirstName'];
      context.addLastName = req.body['addLastName'];
      context.addUserName = req.body['addUserName'];
      context.addEmail = req.body['addEmail'];
    }

    //show listing of students to drop for first class
    context.usersAssociatedWithAParticularClass = await getListOfUsersAssociatedWithAClass(context.courses[0].courseId);
  }

  context.userListing = await getListOfUsersWithUserTypes();
  res.render('adminUsers', context);
});

module.exports = router;
