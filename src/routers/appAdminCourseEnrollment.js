/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   February 17, 2021
*/

const express = require('express');
const router = new express.Router();
const {getLoginContext, requireLogin} = require('../middleware/auth');
const {getListOfLiveCourses, addNewUser, getListOfUsersWithUserTypes, getListOfUsersAssociatedWithAClass} = require('../dbQueries');
const bcrypt = require('bcrypt');
const logIt = require('../helperFunctions');


router.get('/Admin/CourseEnrollment/', requireLogin, async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Admin Course Enrollment';
  context = await getLoginContext(context, req);
  context.courses = await getListOfLiveCourses();
  //context.userListing = await getListOfUsersWithUserTypes();
  context.usersAssociatedWithAParticularClass = await getListOfUsersAssociatedWithAClass(context.courses[0].courseId);
  res.render('adminCourseEnrollment', context);
});



module.exports = router;
