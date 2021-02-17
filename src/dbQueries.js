/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   February 17, 2021
*/

const mysql = require('./databaseConnection');
const bcrypt = require('bcrypt');

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

//get list of distinct languages that are linked to live classes
async function getListOfLanguages() {
  return new Promise(function(resolve, reject) {
    mysql.pool.query("SELECT DISTINCT `languageId`, `languageName` FROM `Languages` INNER JOIN `LanguagesCourses` ON `languageId` = `languageFk` INNER JOIN `Courses` ON `courseFk` = `courseId` WHERE `isLive` = 1 ORDER BY `languageName` ASC;", (err, rows, fields) => {
      if (err) {
        logIt("getListOfLanguages() ERROR: " + err);
        reject("ERROR in selecting courses");
      }

      resolve(rows);
    });
  })
}

async function getListOfUsersWithUserTypes() {
  return new Promise(function(resolve, reject) {
    mysql.pool.query("SELECT userId, firstName, lastName, userName, email, IF(STRCMP(userType, 'STUDENT'), false, true) AS STUDENT, IF(STRCMP(userType, 'INSTRUCTOR'), false, true) AS INSTRUCTOR, IF(STRCMP(userType, 'ADMIN'), false, true) AS ADMIN FROM USERS ORDER BY lastName ASC;", (err, rows, fields) => {
      if (err) {
        logIt("getListOfUsers() ERROR: " + err);
        reject("ERROR in selecting courses");
      }

      resolve(rows);
    });
  })
}

async function getUserId(userName) {
  return new Promise(function(resolve, reject) {
    let context = {};

    mysql.pool.query("SELECT userId FROM Users WHERE userName = ?", [userName], (err, rows, fields) => {
        if (err) {
          //next(err);
          logIt("userName: " + userName)
          logIt("SELECT ERROR FROM getUserId: " + err);
          reject(new Error("Bad query"))
        }

        if (rows[0] != undefined) {
          logIt("getUserId ROWS: " + JSON.stringify(rows))
          logIt("GET USER ID: ROWS RESULT: " + rows[0].userId);
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
    mysql.pool.query("SELECT * FROM Users WHERE userName = ? ", [someUserName], (err, rows, fields) => {
        if (err) {
          logIt("doesUserExist ERROR: " + err);
          return -1;
        }
        //logIt("TRYING TO LOGIN WITH USERNAME: " + someUserName);
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

module.exports.getUserType = getUserType;
module.exports.isInstructorOrStudentInClass = isInstructorOrStudentInClass;
module.exports.addNewUser = addNewUser;
module.exports.getListOfLiveCourses = getListOfLiveCourses;
module.exports.getListOfCategories = getListOfCategories;
module.exports.getListOfLanguages = getListOfLanguages;
module.exports.getListOfUsersWithUserTypes = getListOfUsersWithUserTypes;
module.exports.getUserId = getUserId;
module.exports.doesUserExist = doesUserExist;