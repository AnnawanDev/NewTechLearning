/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   February 17, 2021
*/

const express = require('express');
const router = new express.Router();
const {getLoginContext, requireLogin} = require('../middleware/auth');
const {addNewCourse, addUserToClass, getCategoryNameForCourse, getAllInstructorsOrAdmins, getListOfAllCoursesAndWhoIsTeaching, getListOfAllCategories, getListOfLanguages } = require('../dbQueries');
const bcrypt = require('bcrypt');
const {logIt} = require('../helperFunctions');

router.get('/Admin/Courses/', requireLogin, async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Admin Courses';
  context.languages = await getListOfLanguages();
  context = await getLoginContext(context, req);
  context.instructorsOrAdmins = await getAllInstructorsOrAdmins();
  context.courses = await getListOfAllCoursesAndWhoIsTeaching();
  context.categories = await getListOfAllCategories();
  // let categoryNameResult = await getCategoryNameForCourse(context.courses[0].courseId);
  // context.categoryForFirstCourse = categoryNameResult[0];
  res.render('adminCourses', context);
});

router.post('/Admin/Courses/', requireLogin, async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Admin Courses';
  context = await getLoginContext(context, req);
  console.log(JSON.stringify(req.body))
  if (req.body['addNewCourseForm']) {
    let courseName = req.body['courseName'];
    let courseDescription = req.body['courseDescription'];
    let result = await addNewCourse(courseName, courseDescription);

    //TODO: ADD ERROR CHECKING/HANDLING

    //get new course id
    let newCourseId = result.insertId;

    //insert userId, courseId into UsersCourses
    let courseInstructorId = req.body['selectForClassInstructor'];
    const inserts = [courseInstructorId, newCourseId];
    let addToUsersCoursesResult = await addUserToClass(inserts);
    context.addNewCourseResult = addToUsersCoursesResult;  //TODO: GET NEW SUCCESS MESSAGE
  }

  context.instructorsOrAdmins = await getAllInstructorsOrAdmins();
  context.courses = await getListOfAllCoursesAndWhoIsTeaching();
  context.categories = await getListOfAllCategories();
  // let categoryNameResult = await getCategoryNameForCourse(context.courses[0].courseId);
  // context.categoryForFirstCourse = categoryNameResult[0];
  res.render('adminCourses', context);
});


module.exports = router;
