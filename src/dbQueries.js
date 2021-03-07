/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   February 17, 2021
*/

const mysql = require('./databaseConnection');
const bcrypt = require('bcrypt');
const {logIt} = require('./helperFunctions');

//--------------------------------------------------------
//---------------------- CATEGORIES ----------------------
//--------------------------------------------------------
//get list of categories that are linked to live classes
async function getListOfCategories() {
  return new Promise(function(resolve, reject) {
    mysql.pool.query("SELECT `categoryId`, `categoryName` FROM `Categories` INNER JOIN `Courses` ON `categoryId` = `categoryFk` WHERE `isLive` = 1 ORDER BY `categoryName` ASC;", (err, rows, fields) => {
      if (err) {
        logIt("getListOfCategories() ERROR: " + err);
        reject("ERROR in selecting courses");
      }

      resolve(rows);
    });
  })
}

//gets list of all categories
async function getListOfAllCategories() {
  return new Promise(function(resolve, reject) {
    mysql.pool.query("SELECT `categoryId`, `categoryName` FROM `Categories` ORDER BY `categoryName` ASC;", (err, rows, fields) => {
      if (err) {
        logIt("getListOfCategories() ERROR: " + err);
        reject("ERROR in selecting courses");
      }

      resolve(rows);
    });
  })
}

//--------------------------------------------------------
//---------------------- COURSES -------------------------
//--------------------------------------------------------
//gets list of all live courses
async function getListOfLiveCourses() {
  return new Promise(function(resolve, reject) {
    mysql.pool.query("SELECT `courseId`, `courseName` FROM `Courses` WHERE `isLive` = 1 ORDER BY courseName ASC", (err, rows, fields) => {
      if (err) {
        logIt("getListOfLiveCourses() ERROR: " + err);
        reject("ERROR in selecting courses");
      }

      resolve(rows);
    });
  })
}

//gits list of all courses and who is teaching
async function getListOfAllCoursesAndWhoIsTeaching() {
  return new Promise(function(resolve, reject) {
    mysql.pool.query("SELECT `courseId`, `courseName`, `userId`, `firstName`, `lastName`, `userName`, CONCAT(LEFT(`courseDescription`,25), '...') AS 'description', `dateWentLive`, IF(STRCMP(isLive, 1), 'NO', 'YES') AS isLive, categoryName, GROUP_CONCAT(languageName) AS 'TaughtIn', GROUP_CONCAT(languageId) AS 'TaughtInId' FROM `Courses` INNER JOIN `UsersCourses` ON courseId = courseFk INNER JOIN `Users` ON userFk = userId LEFT OUTER JOIN `LanguagesCourses` ON Courses.courseId = LanguagesCourses.courseFk LEFT OUTER JOIN `Languages` ON LanguagesCourses.languageFk = Languages.languageId LEFT OUTER JOIN `Categories` ON Courses.categoryFk = Categories.categoryId WHERE `userType` = 'INSTRUCTOR' OR `userType` = 'ADMIN' GROUP BY courseId ORDER BY courseId;", (err, rows, fields) => {
      if (err) {
        logIt("getListOfAllCoursesAndWhoIsTeaching() ERROR: " + err);
        reject("ERROR in selecting courses");
      }

      resolve(rows);
    });
  })
}

//returns details on a specific course
async function getSpecificCourse(courseId) {
  return new Promise(function(resolve, reject) {
    mysql.pool.query("SELECT `courseId`, `courseName`, `courseDescription`, `categoryFk`, `userId`, `firstName`, `lastName`, `userName`, CONCAT(LEFT(`courseDescription`,25), '...') AS 'description', `dateWentLive`, IF(STRCMP(isLive, 1), 'NO', 'YES') AS isLive, categoryName, GROUP_CONCAT(languageName) AS 'TaughtIn', GROUP_CONCAT(languageId) AS 'TaughtInId' FROM `Courses` INNER JOIN `UsersCourses` ON courseId = courseFk INNER JOIN `Users` ON userFk = userId LEFT OUTER JOIN `LanguagesCourses` ON Courses.courseId = LanguagesCourses.courseFk LEFT OUTER JOIN `Languages` ON LanguagesCourses.languageFk = Languages.languageId LEFT OUTER JOIN `Categories` ON Courses.categoryFk = Categories.categoryId WHERE `courseId` = ? AND (`userType` = 'INSTRUCTOR' OR `userType` = 'ADMIN') GROUP BY courseId ORDER BY courseId;", courseId, (err, rows, fields) => {
      if (err) {
        logIt("getSpecificCourse() ERROR: " + err);
        reject("ERROR in getSpecificCourse");
      }
      resolve(rows);
    });
  })
}

//function adds a new course
async function addNewCourse(courseName, courseDescription, categoryId) {
  if (isNaN(categoryId) || categoryId < 0) {
    reject("The category ID is not correct");
  }

  if (categoryId == 0) { categoryId = null ; }

  let inserts = [courseName, courseDescription, categoryId];
  return new Promise(function(resolve, reject) {
    mysql.pool.query('INSERT INTO `Courses` (`courseName`, `courseDescription`, `categoryFk`) VALUES (?, ?, ?); ', inserts, (err, result) => {
      if (err) {
        logIt("addNewCourse ERROR: " + err)
        reject("Sorry - there was some kind of error.  Please try again.");
      } else {
        resolve(result);
      }
    });
  });
}

//deletes a particular course
async function deleteCourse(courseId) {
  if (isNaN(courseId) || courseId < 0) {
    reject("The category ID is not correct");
  }

  return new Promise(function(resolve, reject) {
    mysql.pool.query('DELETE FROM `Courses` WHERE `courseId` = ? ', [courseId], (err, result) => {
      if (err) {
        logIt("deleteCourse ERROR: " + err + " --- trying to delete course # " + courseId);
        reject("Sorry - there was some kind of error.  Please try again.");
      } else {
        resolve(result);
      }
    });
  });
}

//edits a particular course
async function editCourse(courseId, courseName, courseDescription, isLive, category) {
  return new Promise(function(resolve, reject) {
    //set dateWentLive if isLive=1
    let dateWentLive = (isLive == 1) ? new Date() : null;

    //if category is 0, then user is trying to set it to "none", thus the value stored is null
    const inserts = (category == 0) ? [courseName, courseDescription, isLive, dateWentLive, null, courseId] : [courseName, courseDescription, isLive, dateWentLive, category, courseId];;

    mysql.pool.query('UPDATE `Courses` set `courseName` = ?, `courseDescription` = ?, `isLive` = ?, `dateWentLive` = ?, `categoryFk` = ? WHERE `courseId` = ?', inserts, (err, result) => {
      if (err) {
        logIt("Edit Course ERROR: " + err + " --- trying to edit course # " + courseId);
        reject("Sorry - there was some kind of error while updating the course details.  Please try again.");
      } else {
        resolve("Success - the course has been updated");
      }
    });
  });
}

//--------------------------------------------------------
//---------------------- LANGUAGES -----------------------
//--------------------------------------------------------
//get list of distinct languages that are linked to live classes
async function getListOfLanguages() {
  return new Promise(function(resolve, reject) {
    mysql.pool.query("SELECT DISTINCT `languageId`, `languageName` FROM `Languages`", (err, rows, fields) => {
      if (err) {
        logIt("getListOfLanguages() ERROR: " + err);
        reject("ERROR in selecting courses");
      }
      resolve(rows);
    });
  })
}

//--------------------------------------------------------
//---------------------- LANGUAGESCOURSES ----------------
//--------------------------------------------------------
//add 1 or more languages to a course
async function addLanguagesToCourse(languageIds, newCourseId) {
  if (isNaN(newCourseId) || newCourseId < 1) {
    reject("The course ID is not correct");
  }

  if (!languageIds || languageIds.length == 0 || languageIds[0] == 0) {
    reject("No languages to add")
  }

  //build sql values to add
  let sqlAdd = "";
  for (let i = 0; i < languageIds.length; i++) {
    if (i > 0) {
        sqlAdd += ", ";
    }
    sqlAdd += "(" + languageIds[i] + ", " + newCourseId + ")";
  }

  let inserts = [sqlAdd];
  return new Promise(function(resolve, reject) {
    mysql.pool.query('INSERT INTO `LanguagesCourses` (`languageFk`, `courseFk`) VALUES ' + sqlAdd, (err, result) => {
      if (err) {
        logIt("addLanguagesToCourse ERROR: " + err)
        reject("Sorry - there was some kind of error.  Please try again.");
      } else {
        resolve(result);
      }
    });
  });
}

//deletes all languages associated with a particular course
async function deleteAllLanguagesForCourse(courseId) {
  return new Promise(function(resolve, reject) {
    mysql.pool.query("DELETE FROM `LanguagesCourses` WHERE `courseFk` = ?", [courseId], (err, rows, fields) => {
      if (err) {
        logIt("deleteAllLanguagesForCourse() ERROR: " + err);
        reject("ERROR in deleting courses: " + err);
      }
      resolve("success");
    });
  })
}

//--------------------------------------------------------
//---------------------- USERS ------------------
//--------------------------------------------------------
//returns the user type for a particular userId
async function getUserType(someUserId) {
  return new Promise(function(resolve, reject) {
    mysql.pool.query("SELECT `userType` FROM `Users` WHERE `userId` = ?", someUserId, (err, rows, fields) => {
        if (err) {
          logIt("isUserAStudent ERROR: " + err);
          reject(new Error("Bad query"))
        }

        if (rows[0].userType == "INSTRUCTOR") {
          resolve("INSTRUCTOR");
        } else if (rows[0].userType == "ADMIN") {
          resolve("ADMIN");
        } else if (rows[0].userType == "STUDENT") {
          resolve("STUDENT");
        } else {
          reject(new Error("ERROR: isUserAStudent"));
        }
      });
    });
};

//adds a new user
async function addNewUser(inserts) {
  return new Promise(function(resolve, reject) {
    mysql.pool.query('INSERT INTO `Users` (`firstName`, `lastName`, `userName`, `email`, `password`, `userType`) VALUES (?, ?, ?, ?, ?, ?);', inserts, (err, result) => {
      if (err) {
        logIt("/api/createUser ERROR: " + err)
        if (err.toString().includes("ER_DUP_ENTRY")) {
          reject("Sorry - that user name is already taken.  Please try another one");
        } else {
          reject("Sorry - there was some kind of error.  Please try again.");
        }
      } else {
        resolve("Welcome to New Tech Learning!");
      }
    });
  });
}

//updates who the instructor is for a particular course
async function updateInstructorForCourse(courseId, oldInstructor, newInstructor) {
  return new Promise(function(resolve, reject) {
    const inserts = [newInstructor, courseId, oldInstructor, courseId];
    mysql.pool.query('UPDATE `UsersCourses` SET `userFk` = ?, `courseFk` = ? WHERE `userFk`=? AND `courseFk`=?', inserts, (err, result) => {
      if (err) {
        logIt("changeInstructorForCourse ERROR: " + err)
        reject("ERROR: " + err);
      } else {
        resolve("success");
      }
    });
  });
}

//returns a list of all users and breaks out their user type into TRUE/FALSE pairs for whether they are a STUDENT, INSTRUCTOR or ADMIN
async function getListOfUsersWithUserTypes() {
  return new Promise(function(resolve, reject) {
    mysql.pool.query("SELECT userId, firstName, lastName, userName, email, IF(STRCMP(userType, 'STUDENT'), false, true) AS STUDENT, IF(STRCMP(userType, 'INSTRUCTOR'), false, true) AS INSTRUCTOR, IF(STRCMP(userType, 'ADMIN'), false, true) AS ADMIN FROM Users ORDER BY lastName ASC;", (err, rows, fields) => {
      if (err) {
        logIt("getListOfUsers() ERROR: " + err);
        reject("ERROR in selecting courses");
      }

      resolve(rows);
    });
  })
}

//gets list of users associated with a class
async function getListOfUsersAssociatedWithAClass(someClassId) {
  return new Promise(function(resolve, reject) {

    if (!Number.isInteger(someClassId)) {
      reject("Passed class id argument that is not a number")
    }

    mysql.pool.query("SELECT `userId`, `firstName`, `lastName`, `userName`, `email`, `userType` FROM `Users` INNER JOIN `UsersCourses` ON `userId` = `userFk` INNER JOIN `Courses` on `courseFk` = `courseId` WHERE `courseId` = ? ORDER BY `userType`, `userName` ASC;", someClassId, (err, rows, fields) => {
      if (err) {
        logIt("getListOfUsersAssociatedWithAClass() ERROR: " + err);
        reject("ERROR in selecting users associatd with a course");
      }

      resolve(rows);
    });
  })
}

//gets a userID for a particular user name
async function getUserId(userName) {
  return new Promise(function(resolve, reject) {

    mysql.pool.query("SELECT userId FROM Users WHERE userName = ?", [userName], (err, rows, fields) => {
        if (err) {
          //next(err);
          logIt("userName: " + userName)
          logIt("SELECT ERROR FROM getUserId: " + err);
          reject(new Error("Bad query"))
        }

        if (rows[0] != undefined) {
          resolve(rows[0].userId);
        } else {
          reject(new Error("User ID not found"));
        }
      });
  });
}

//maybe change to getUser since we're now returning user object
async function doesUserExist(someUserName, somePassword) {
  return new Promise(function(resolve, reject) {
    let user = {};
    mysql.pool.query("SELECT `userId`, `firstName`, `lastName`, `email`, `userType`, `password` FROM `Users` WHERE `userName` = ?", [someUserName], (err, rows, fields) => {
        if (err) {
          logIt("doesUserExist ERROR: " + err);
          return -1;
        }

        if (rows[0] == undefined) {
          reject(new Error("User ID not found"));
          return;
        }

        const storedHashPassword = rows[0].password;

        if (bcrypt.compareSync(somePassword, storedHashPassword)) {
          user.firstName = rows[0].firstName;
          user.lastName = rows[0].lastName;
          user.email = rows[0].email;
          user.userId = rows[0].userId;
          user.userType = rows[0].userType;
          resolve(user);
        } else {
          reject(new Error("User password not correct"));
        }
      });
  });
}

//gets a list of all instructors or admins
async function getAllInstructorsOrAdmins() {
  return new Promise(function(resolve, reject) {

    mysql.pool.query("SELECT `userId`, `firstName`, `lastName`, `userName` FROM `Users` WHERE `userType` = 'INSTRUCTOR' OR `userType` = 'ADMIN';", (err, rows, fields) => {
        if (err) {
          reject(new Error("getAllInstructorsOrAdmins Bad query: " + err))
        }

        if (rows) {
          resolve(rows);
        } else {
          reject(new Error("User ID not found"));
        }
      });
  });
}

//--------------------------------------------------------
//---------------------- USERSCOURSES --------------------
//--------------------------------------------------------
//checks if a particular user is either an instructor or student in a class
async function isInstructorOrStudentInClass(someContextObject, req) {
  return new Promise(function(resolve, reject) {
    if (!req.session || !req.session.user || req.params.id == "") {
      resolve({"enrolled": false });
    }

    const queryParams = [req.session.user.userId, req.params.id];
    mysql.pool.query("SELECT COUNT(*) AS count FROM `UsersCourses` WHERE `userFk` = ? AND `courseFk` = ?", queryParams, (err, rows, fields) => {
        if (err) {
          logIt("isUserAStudent ERROR: " + err);
          resolve({"enrolled": false });
        }

        if (rows[0].count == undefined) {
          resolve({"enrolled": false });
        } else if (rows[0].count == 1) {
          resolve({"enrolled": true });
        } else {
          resolve({"enrolled": false });
        }
      });
    })
}

//adds a user to a class 
async function addUserToClass(inserts) {
  return new Promise(function(resolve, reject) {
    mysql.pool.query('INSERT INTO `UsersCourses` (`userFk`, `courseFk`) VALUES (?, ?);', inserts, (err, result) => {
      if (err) {
        logIt("addUserToClass ERROR: " + err)
        reject("Sorry - there was some kind of error.  Please try again.");
      } else {
        resolve("Congratulations! You've been added to the class.");
      }
    });
  });
}


module.exports = {
  addLanguagesToCourse,
  addNewCourse,
  addNewUser,
  addUserToClass,
  deleteCourse,
  deleteAllLanguagesForCourse,
  doesUserExist,
  editCourse,
  getAllInstructorsOrAdmins,
  getUserType,
  getListOfAllCoursesAndWhoIsTeaching,
  getListOfAllCategories,
  getListOfCategories,
  getListOfLanguages,
  getListOfLiveCourses,
  getListOfUsersAssociatedWithAClass,
  getListOfUsersWithUserTypes,
  getSpecificCourse,
  getUserId,
  isInstructorOrStudentInClass,
  updateInstructorForCourse
}
