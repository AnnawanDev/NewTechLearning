/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   March 8, 2021
*/

const express = require('express');
const router = new express.Router();
const {getLoginContext, requireLogin} = require('../middleware/auth');
const logIt = require('../helperFunctions');

//route handler for admin home page
router.get('/Admin/', requireLogin, async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Admin Home';
  context = await getLoginContext(context, req);
  res.render('adminHome', context);
});

module.exports = router;
