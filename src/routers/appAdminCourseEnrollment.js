/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   March 6, 2021
*/

const express = require('express');
const router = new express.Router();
const {getLoginContext, requireLogin} = require('../middleware/auth');
const {addUserToClass, getListOfLiveCourses, addNewUser, getListOfUsersWithUserTypes, getListOfUsersAssociatedWithAClass} = require('../dbQueries');
const bcrypt = require('bcrypt');
const logIt = require('../helperFunctions');

//route handler when landing on /Admin/CourseEnrollment from a GET request
router.get('/Admin/CourseEnrollment/', requireLogin, async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Admin Course Enrollment';
  context = await getLoginContext(context, req);
  context.courses = await getListOfLiveCourses();
  context.usersAssociatedWithAParticularClass = await getListOfUsersAssociatedWithAClass(context.courses[0].courseId);
  res.render('adminCourseEnrollment', context);
});

//route handler when POST to /Admin/CourseEnrollment page
router.post('/Admin/CourseEnrollment/', requireLogin, async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Admin Course Enrollment';
  context = await getLoginContext(context, req);

  if (req.body['addUserToCourse']) {
    let userId = req.body['userIdToAddToCourse'];
    let courseId = req.body['courseToAddSelectElement'];
    const inserts = [userId, courseId ];
    let result = await addUserToClass(inserts);
    context.addUserToClassResult =   "<script>document.addEventListener('DOMContentLoaded', function(event) { alert('User added to course');});</script>";
  }

  context.courses = await getListOfLiveCourses();
  context.usersAssociatedWithAParticularClass = await getListOfUsersAssociatedWithAClass(context.courses[0].courseId);
  res.render('adminCourseEnrollment', context);
});

module.exports = router;
