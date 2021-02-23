/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   February 17, 2021
*/

const express = require('express');
const router = new express.Router();
const {getLoginContext, requireLogin} = require('../middleware/auth');
const {getAllInstructorsOrAdmins, getListOfAllCoursesAndWhoIsTeaching, getListOfAllCategories} = require('../dbQueries');
const bcrypt = require('bcrypt');
const logIt = require('../helperFunctions');

router.get('/Admin/Courses/', requireLogin, async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Admin Courses';
  context = await getLoginContext(context, req);
  context.instructorsOrAdmins = await getAllInstructorsOrAdmins();
  context.courses = await getListOfAllCoursesAndWhoIsTeaching();
  context.categories = await getListOfAllCategories();
  res.render('adminCourses', context);
});


module.exports = router;
