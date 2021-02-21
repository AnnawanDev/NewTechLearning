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

router.get('/Admin/Courses/', requireLogin, async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Admin Courses';
  context = await getLoginContext(context, req);
  res.render('adminCourses', context);
});


module.exports = router;
