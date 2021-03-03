/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   February 17, 2021
*/

const express = require('express');
const router = new express.Router();
const {getLoginContext, requireLogin} = require('../middleware/auth');
const {addNewCourse, addUserToClass, getCategoryNameForCourse, getAllInstructorsOrAdmins, getListOfAllCoursesAndWhoIsTeaching, getListOfAllCategories, getListOfLanguages, getSpecificCourse } = require('../dbQueries');
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
  res.render('adminCourses', context);
});

router.post('/Admin/Courses/', requireLogin, async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Admin Courses';
  context = await getLoginContext(context, req);

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
  res.render('adminCourses', context);
});

router.get('/Admin/Courses/Edit/:id', requireLogin, async (req, res) => {

  if (!req.params.id || isNaN(req.params.id)) {
    res.redirect("/Admin/Courses/");
  }

  //get course details
  let courseInfo = await getSpecificCourse(req.params.id);

  let context = {};
  context.title = 'New Tech Learning | Admin Course | ' + courseInfo[0].courseName;
  context = await getLoginContext(context, req);
  context.instructorsOrAdmins = await getAllInstructorsOrAdmins();
  context.courses = await getListOfAllCoursesAndWhoIsTeaching();
  context.categories = await getListOfAllCategories();
  context.courseId = courseInfo[0].courseId;
  context.courseName = courseInfo[0].courseName;
  context.courseDescription = courseInfo[0].courseDescription;
  context.isLive = courseInfo[0].isLive;
  context.dateWentLive = courseInfo[0].dateWentLive;
  console.log("VALUE: " + courseInfo[0].categoryFk);
  if (courseInfo[0].categoryFk === null) {
    context.categoryFk = 0;
  } else {
    context.categoryFk = courseInfo[0].categoryFk;
  }

  res.render('adminCourseEdit', context);
});


module.exports = router;
