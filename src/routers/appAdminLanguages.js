/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   March 9, 2021
*/

const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const {getListOfLiveCourses} = require('../dbQueries');
const bcrypt = require('bcrypt');
const logIt = require('../helperFunctions');


router.get('/Admin/Languages/', auth.requireLogin, async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Admin Languages';
  context = await auth.getLoginContext(context, req);
  res.render('adminLanguages', context);
});

module.exports = router;