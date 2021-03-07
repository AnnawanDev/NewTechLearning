/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   March 6, 2021
*/

const express = require('express');
const router = new express.Router();
const {getLoginContext, requireLogin} = require('../middleware/auth');
const {addLanguagesToCourse, addNewCourse, addUserToClass, deleteCourse, deleteAllLanguagesForCourse, editCourse, getCategoryNameForCourse, getAllInstructorsOrAdmins, getListOfAllCoursesAndWhoIsTeaching, getListOfAllCategories, getListOfLanguages, getSpecificCourse, updateInstructorForCourse } = require('../dbQueries');
const bcrypt = require('bcrypt');
const {logIt} = require('../helperFunctions');

//route handler for GET when going to /Admin/Courses/
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

//route handler for POSTs to /Admin/Courses/
router.post('/Admin/Courses/', requireLogin, async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Admin Courses';
  context = await getLoginContext(context, req);

  //user has POSTed back to back to add a course
  if (req.body['addNewCourseForm']) {
    let courseName = req.body['courseName'];
    let courseDescription = req.body['courseDescription'];
    let categoryId = req.body['categorySelectorForNewCourse'];
    let languageIds = req.body['languageSelectorForNewCourse'];

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
      context.addNewCourseResult = "<script>document.addEventListener('DOMContentLoaded', function(event) { alert('New course added.\\n\\nYour next step is to add course modules and then make it live.');});</script>";
    }
  }

  context.instructorsOrAdmins = await getAllInstructorsOrAdmins();
  context.courses = await getListOfAllCoursesAndWhoIsTeaching();
  context.categories = await getListOfAllCategories();
  context.languages = await getListOfLanguages();
  res.render('adminCourses', context);
});

//route handler when user is landing on page details to edit a course
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
  context.userId = courseInfo[0].userId;
  context.courseId = courseInfo[0].courseId;
  context.courseName = courseInfo[0].courseName;
  context.courseDescription = courseInfo[0].courseDescription;
  context.isLive = (courseInfo[0].isLive == 'NO') ? false : true;
  context.dateWentLive = courseInfo[0].dateWentLive;
  context.taughtById = courseInfo[0].userId;

  if (courseInfo[0].categoryFk === null) {
    context.categoryFk = 0;
  } else {
    context.categoryFk = courseInfo[0].categoryFk;
  }

  if (courseInfo[0].TaughtInId === null) {
    context.TaughtInId = '';
  } else {
    context.TaughtInId = courseInfo[0].TaughtInId;
  }

  res.render('adminCourseEdit', context);
});

//route handler when user has posted changed to edit a specific course
router.post('/Admin/Courses/Edit/:id', requireLogin, async (req, res) => {

  if (!req.params.id || isNaN(req.params.id)) {
    res.redirect("/Admin/Courses/");
  }

  if (
    !req.body['courseId'] || !req.body['courseName'] || !req.body['selectInstructor'] ||
    !req.body['courseDescription'] || !req.body['selectCategory'] ||
    !req.body['selectLanguage']) {
    res.redirect("/Admin/Courses/");
  }

  //set up updates to pass
  let courseId = req.params.id;
  let courseName = req.body['courseName'];
  let oldInstructor = req.body['selectedInstructorId'];
  let newInstructor = req.body['selectInstructor'];
  let courseDescription = req.body['courseDescription'];
  let isLive = (req.body['isLive'] == null) ? 0 : 1; //if isLive is checked it will have a value posted; otherwise, will be null
  let category = req.body['selectCategory'];
  let oldLanguageIds = req.body['languageSelectedItem'];
  let newLanguageIds = req.body['selectLanguage'];

  //pass on edits to course
  let result = await editCourse(courseId, courseName, courseDescription, isLive, category);
  let updateInstructorResult = await updateInstructorForCourse(courseId, oldInstructor, newInstructor);
  let deleteLanguageResult = await deleteAllLanguagesForCourse(courseId);
  let insertNewLanguageResult = await addLanguagesToCourse(newLanguageIds, courseId);

  // set up return context object
  let context = {};
  context.EditResult = result + "<br /><br />";
  context.mainContentStyle = "display: none;"

  //show result of page
  context.title = 'New Tech Learning | Edit Course | Result';
  context = await getLoginContext(context, req);

  res.render('adminCourseEdit', context);
});

//route handler when user wants to delete a specific course - shows user all the fields before they actually delete
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
  context.languages = await getListOfLanguages();
  context.courseId = courseInfo[0].courseId;
  context.courseName = courseInfo[0].courseName;
  context.courseDescription = courseInfo[0].courseDescription;
  context.isLive = (courseInfo[0].isLive == 'NO') ? false : true;
  context.dateWentLive = courseInfo[0].dateWentLive;
  context.instructor = courseInfo[0].lastName + ", " + courseInfo[0].firstName + " (" + courseInfo[0].userName + ")";

  if (courseInfo[0].categoryFk === null) {
    context.categoryFk = 0;
  } else {
    context.categoryFk = courseInfo[0].categoryFk;
  }

  if (courseInfo[0].TaughtInId === null) {
    context.TaughtInId = '';
  } else {
    context.TaughtInId = courseInfo[0].TaughtInId;
  }

  res.render('adminCourseDelete', context);
});

//route handler when user deletes a class and POSTs back to page
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
