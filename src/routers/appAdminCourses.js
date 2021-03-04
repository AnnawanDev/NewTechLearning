/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   February 17, 2021
*/

const express = require('express');
const router = new express.Router();
const {getLoginContext, requireLogin} = require('../middleware/auth');
const {addLanguagesToCourse, addNewCourse, addUserToClass, deleteCourse, getCategoryNameForCourse, getAllInstructorsOrAdmins, getListOfAllCoursesAndWhoIsTeaching, getListOfAllCategories, getListOfLanguages, getSpecificCourse } = require('../dbQueries');
const bcrypt = require('bcrypt');
const {logIt} = require('../helperFunctions');

router.get('/Admin/Courses/', requireLogin, async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Admin Courses';
  context = await getLoginContext(context, req);
  context.instructorsOrAdmins = await getAllInstructorsOrAdmins();
  context.courses = await getListOfAllCoursesAndWhoIsTeaching();
  context.categories = await getListOfAllCategories();
  context.languages = await getListOfLanguages();
  res.render('adminCourses', context);
});

router.post('/Admin/Courses/', requireLogin, async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Admin Courses';
  context = await getLoginContext(context, req);

  if (req.body['addNewCourseForm']) {
    let courseName = req.body['courseName'];
    let courseDescription = req.body['courseDescription'];
    let categoryId = req.body['categorySelectorForNewCourse'];
    let languageIds = req.body['languageSelectorForNewCourse'];

    //TODO: ADD MORE ERROR CHECKING/HANDLING
    if (courseName == "" || courseDescription == "") {
      context.errorInAddingCourse = "<p style=\"color: #ff0000;\">You must enter both a course name and description</p>";
    } else if (languageIds[0] == 0 && languageIds.length > 1) {
      context.errorInAddingCourse = "<p style=\"color: #ff0000;\">Select language(s) or none, but not both</p>";
    } else {
      let result = await addNewCourse(courseName, courseDescription, categoryId);

      //get new course id
      let newCourseId = result.insertId;

      //add language(s) if present
      if (languageIds.length != 0 && languageIds[0] != 0) {
        let addLanguageResult = await addLanguagesToCourse(languageIds, newCourseId);
      }

      //insert userId, courseId into UsersCourses
      let courseInstructorId = req.body['selectForClassInstructor'];
      const inserts = [courseInstructorId, newCourseId];
      let addToUsersCoursesResult = await addUserToClass(inserts);

      //show result
      //TODO: GET NEW SUCCESS MESSAGE
      context.addNewCourseResult = addToUsersCoursesResult;
    }
  }

  context.instructorsOrAdmins = await getAllInstructorsOrAdmins();
  context.courses = await getListOfAllCoursesAndWhoIsTeaching();
  context.categories = await getListOfAllCategories();
  context.languages = await getListOfLanguages();
  res.render('adminCourses', context);
});

router.get('/Admin/Courses/Edit/:id', requireLogin, async (req, res) => {

  if (!req.params.id || isNaN(req.params.id)) {
    res.redirect("/Admin/Courses/");
  }

  //get course details
  let courseInfo = await getSpecificCourse(req.params.id);

  let context = {};
  context.title = 'New Tech Learning | Edit Course | ' + courseInfo[0].courseName;
  context = await getLoginContext(context, req);
  context.instructorsOrAdmins = await getAllInstructorsOrAdmins();
  context.courses = await getListOfAllCoursesAndWhoIsTeaching();
  context.categories = await getListOfAllCategories();
  context.languages = await getListOfLanguages();
  context.courseId = courseInfo[0].courseId;
  context.courseName = courseInfo[0].courseName;
  context.courseDescription = courseInfo[0].courseDescription;
  context.isLive = courseInfo[0].isLive;
  context.dateWentLive = courseInfo[0].dateWentLive;

  if (courseInfo[0].categoryFk === null) {
    context.categoryFk = 0;
  } else {
    context.categoryFk = courseInfo[0].categoryFk;
  }

  res.render('adminCourseEdit', context);
});

router.get('/Admin/Courses/Delete/:id', requireLogin, async (req, res) => {

  if (!req.params.id || isNaN(req.params.id)) {
    res.redirect("/Admin/Courses/");
  }

  //get course details
  let courseInfo = await getSpecificCourse(req.params.id);

  let context = {};
  context.title = 'New Tech Learning | Delete Course | ' + courseInfo[0].courseName;
  context = await getLoginContext(context, req);
  context.instructorsOrAdmins = await getAllInstructorsOrAdmins();
  context.courses = await getListOfAllCoursesAndWhoIsTeaching();
  context.categories = await getListOfAllCategories();
  context.courseId = courseInfo[0].courseId;
  context.courseName = courseInfo[0].courseName;
  context.courseDescription = courseInfo[0].courseDescription;
  context.isLive = courseInfo[0].isLive;
  context.dateWentLive = courseInfo[0].dateWentLive;

  if (courseInfo[0].categoryFk === null) {
    context.categoryFk = 0;
  } else {
    context.categoryFk = courseInfo[0].categoryFk;
  }

  res.render('adminCourseDelete', context);
});







router.post('/Admin/Courses/Delete/:id', requireLogin, async (req, res) => {

  if (!req.params.id || isNaN(req.params.id)) {
    res.redirect("/Admin/Courses/");
  }

  // set up return context object
  let context = {};

  //delete course
  let result = await deleteCourse(req.params.id);
  context.DeleteResult = "SUCCESS! Course deleted<br /><br />";
  context.mainContentStyle = "display: none;"

  //show result of page
  context.title = 'New Tech Learning | Delete Course | Result';
  context = await getLoginContext(context, req);


  res.render('adminCourseDelete', context);
});


module.exports = router;
