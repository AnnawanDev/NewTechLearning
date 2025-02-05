/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   March 6, 2021
*/

const express = require('express');
const router = new express.Router();
const mysql = require('../databaseConnection');
const bcrypt = require('bcrypt');
const {doesUserExist} = require('../dbQueries');
const {logIt} = require('../helperFunctions');
const {requireAdminLogin,requireLogin} = require('../middleware/auth');

//--------------------------------------------------------
//---------------------- AUTHENTICATION ----------------------
//--------------------------------------------------------
// API endpoint to check login
router.post('/api/login', async (req, res, next) => {
    if (!req.body['username'] || !req.body['password']) {
      logIt('ERROR! username and/or password not in POST body');
      res.status(401).send();
      return;
    }

    let username = req.body['username'];
    let password = req.body['password'];

    try {
      // see if there exists a user with email and if password passed equals hashed password
      let user = await doesUserExist(username, password);

      if (!user) {
        logIt('ERROR! bad email and/or password');
        throw new Error('Unable to login');
      }

      // must be good user, generate auth token for user
      //store user object in session
      req.session.user = user;

      //send back object to greet user
      res.send({"userName": user.userName, "firstName": user.firstName});

    } catch(e) {
      logIt("/api/login ERROR: " + e)
      res.status(401).send()
    }
});


//--------------------------------------------------------
//---------------------- CATEGORIES ----------------------
//--------------------------------------------------------
// API endpoint to get list of available categories
router.get('/api/getListOfAvailableCategories', async (req,res,next) => {
  try {
    let context = {};
    mysql.pool.query("SELECT DISTINCT `categoryId`, `categoryName` FROM `Categories` INNER JOIN `Courses` ON `categoryId` = `categoryFk` WHERE `isLive` = 1 ORDER BY `categoryName` ASC;", (err, rows, fields) => {
      if (err) {
        next(err);
        res.status(500).send();
      }
      context.results = rows;
      res.send(context);
    });

  } catch(e) {
    logIt("ERROR: " + e)
    res.status(401).send()
  }
});

// API endpoint to get list of all categories
router.get('/api/getListOfAllCategories', async (req,res,next) => {
  try {
    let context = {};
    mysql.pool.query("SELECT `categoryId`, `categoryName` FROM `Categories`", (err, rows, fields) => {
      if (err) {
        next(err);
        res.status(500).send();
      }
      context.results = rows;
      res.send(context);
    });

  } catch(e) {
    logIt("ERROR: " + e)
    res.status(401).send()
  }
});

// API endpoint to delete a category from DB
router.get('/api/deleteCategory/:categoryId', async (req,res,next) => {
  let context = {};
  mysql.pool.query("DELETE FROM `Categories` WHERE `categoryId` = ?", req.params.categoryId, (error, results, fields) => {
    if (error) {
      res.status(500).send();
    }
    else {
      logIt('deleted ' + results.affectedRows + ' rows');
      let context = {};
      context.results = results.affectedRows;
      res.send(context);
    }

  })
});

// API endpoint to insert a particular category
router.get('/api/insertCategory/:categoryName', async (req,res,next) => {
  let context = {};
  mysql.pool.query("INSERT INTO `Categories` (`categoryName`) VALUES (?)", req.params.categoryName, (error, results, fields) => {
    if (error) {
      res.status(500).send
    };

    let context= {};
    context.results = results.affectedRows;
    res.send(context)
  });
});

// API endpoint to get list of all categories
router.get('/api/getListOfAllCategories', async (req,res,next) => {
  let context = {};

  mysql.pool.query("SELECT `categoryId`, `categoryName` FROM `Categories` ORDER BY `categoryName` ASC; ", (err, rows, fields) => {
      if (err) {
        logIt("ERROR FROM /api/getListOfAllCategories: " + err);
        return;
      }

      context.results = rows;
      res.send(context);
    });

    return context;
});

// API endpoint to get a particular category that's set for a course
router.get('/api/getCategoryNameForCourse/:courseId', async (req,res,next) => {
  let context = {};

  mysql.pool.query("SELECT categoryName FROM Categories INNER JOIN Courses ON categoryId = categoryFk WHERE courseId = ?;", req.params.courseId, (err, rows, fields) => {
      if (err) {
        logIt("ERROR FROM /api/getCategoryNameForCourse/:courseId: " + err);
        return;
      }

      context.results = rows;
      res.send(context);
    });

    return context;
});

// API endpoint to update a category name
router.post('/api/updateCategory/', async(req,res,next) => {
  let context = {};
  let filter = [req.body.categoryName, req.body.categoryId]
  //get the current mySQL content (if it exists)
  mysql.pool.query("UPDATE Categories SET categoryName = ? where categoryId = ?", filter, (err, results, fields) => {
    if(err){
      res.status(500).send
    }
  context.results = results.affectedRows;
  res.send(context)
  });
});


//--------------------------------------------------------
//---------------------- COURSES ------------------
//--------------------------------------------------------
// API endpoint to get distinct list of courses
router.get('/api/getCourses', async (req,res,next) => {
  let context = {};

  let sqlQuery = "SELECT DISTINCT courseId, courseName FROM Courses LEFT OUTER JOIN Categories ON categoryFk = categoryId INNER JOIN LanguagesCourses ON courseId = courseFk INNER JOIN Languages ON languageFk = languageId WHERE isLive=1 AND 5=5 ";
  if (req.query.categoryFilter && req.query.categoryFilter != "ALL") {
    sqlQuery += "AND categoryId = " + req.query.categoryFilter;

  }
  else if (req.query.languageFilter && req.query.languageFilter != 'ALL'){
    sqlQuery += "AND languageId = " + req.query.languageFilter;
  }

  mysql.pool.query(sqlQuery, (err, rows, fields) => {
      if (err) {
        logIt("ERROR FROM /api/getCourses: " + err);
        return;
      }
      //logIt("/api/getCourses query result: " + JSON.stringify(rows));
      context.results = rows;
      res.send(context);
    });

    return context;
});

// API endpoint to get the 3 most recently added classes
router.get('/api/selectMostRecentAddedClasses', async (req,res,next) => {
  try {
    let context = {};
    mysql.pool.query("SELECT `courseId`, `courseName` FROM Courses ORDER BY `dateWentLive` DESC LIMIT 3;", (err, rows, fields) => {
      if (err) {
        next(err);
        res.status(500).send();
      }

      context.results = rows;
      // logIt("/api/selectMostRecentAddedClasses query result: " + JSON.stringify(rows));
      res.send(context);
    });

  } catch(e) {
    logIt("ERROR: " + e)
    res.status(401).send()
  }
});

// API endpoint to get students enrolled in a particular class
router.get('/api/getStudentsInClasses/:someClassId', requireLogin, async (req,res,next) => {
  try {
    let context = {};
    mysql.pool.query("SELECT `userId`, `firstName`, `lastName`, `userName`, `email`, `userType` FROM `Users` INNER JOIN `UsersCourses` ON `userId` = `userFk` INNER JOIN `Courses` on `courseFk` = `courseId` WHERE `courseId` = ? AND `userType` = 'STUDENT' ORDER BY `userName` ASC", req.params.someClassId, (err, rows, fields) => {
      if (err) {
        next(err);
        res.status(500).send();
      }

      context.results = rows;
      res.send(context);
    });

  } catch(e) {
    logIt("ERROR: " + e)
    res.status(401).send()
  }
});


//--------------------------------------------------------
//---------------------- COURSE MODULES ------------------
//--------------------------------------------------------
// API endpoint to get course modules for a particular course ID
router.get('/api/getModulesForCourse/:courseId', async (req,res,next) => {
  let context = {};

  mysql.pool.query("SELECT courseModuleId, courseModuleHTML, courseModuleOrder FROM `CourseModules` WHERE `courseFk` = ?", req.params.courseId, (err, rows, fields) => {
      if (err) {
        logIt("ERROR FROM /api/getNumberOfModules/:courseId " + err);
        return;
      }
      context.results = rows;
      res.send(context);
    });

    return context;
})

// API endpoint to get the HTML for a particular course module
router.get('/api/getModuleHTMLForCourseAndOrder/:courseId/:courseModuleId', async (req,res,next) => {
  let context = {};
  let filter = [req.params.courseId, req.params.courseModuleId]

  mysql.pool.query('SELECT `courseModuleHTML` FROM `CourseModules` WHERE `courseFk`= ? and `courseModuleId` = ?', filter, (err, rows, fields) => {
      if (err) {
        logIt("ERROR FROM /api/getModuleHTMLForCourseAndOrder/" + err);
        return;
      }
      context.results = rows;
      res.send(context);
    });
    return context;
})

// API endpoint to add a course module
router.post('/api/addCourseModule/', async (req,res) => {
  let context = {};
  let filter= [req.body.moduleOrder, req.body.moduleHTML, req.body.courseId]

  mysql.pool.query("INSERT into `CourseModules` (`courseModuleOrder`, `courseModuleHTML`, `courseFk`) VALUES (?,?,?)", filter, (error, results, fields) => {
    if (error) {
      res.status(500).send
    };

    context.results = results.affectedRows;
    res.send(context)
  });
});

// API endpoint to delete a particular course module
router.get('/api/deleteCourseModule/:courseModuleId', async (req,res,next) => {
  let context = {};
  mysql.pool.query("DELETE FROM `CourseModules` WHERE `courseModuleId` = ?", req.params.courseModuleId, (error, results, fields) => {
    if (error) {
      res.status(500).send();
    }
    else {
      logIt('deleted ' + results.affectedRows + ' rows');
      let context = {};
      context.results = results.affectedRows;
      res.send(context);
    }
  })
});

// API endpoint to update a particular course module
router.post('/api/updateCourseModule/', async(req,res,next) => {
  let context = {};
  let filter = [req.body.newHTML, req.body.courseModuleId]
  //get the current mySQL content (if it exists)
  mysql.pool.query("UPDATE CourseModules SET courseModuleHTML = ? WHERE courseModuleId = ?", filter, (err, results, fields) => {
    if(err){
      res.status(500).send
    }
  context.results = results.affectedRows;
  console.log(context)
  res.send(context)
  });
});


//--------------------------------------------------------
//---------------------- LANGUAGES ----------------------
//--------------------------------------------------------

//gets all languages in DB
router.get('/api/getListOfAllLanguages', async (req,res,next) => {
  try {
    let context = {};
    mysql.pool.query("SELECT `languageId`, `languageName`, `languageCountry` FROM `Languages`", (err, rows, fields) => {
      if (err) {
        next(err);
        res.status(500).send();
      }
      context.results = rows;
      res.send(context);
    });

  } catch(e) {
    logIt("ERROR: " + e)
    res.status(401).send()
  }
});

// API endpoint to add a new language
router.get('/api/insertLanguage/:languageName/:languageCountry', async (req,res,next) => {
  let context = {};
  let filter= [req.params.languageName, req.params.languageCountry]

  mysql.pool.query("INSERT INTO `Languages` (`languageName`, `languageCountry`) VALUES (?,?)", filter, (error, results, fields) => {
    if (error) {
      res.status(500).send
    };
    if(results) {
      context.results = results.affectedRows;
    }
    res.send(context)
  });
});

// API endpoint to get languages assigned to a particular course
router.get('/api/getLanguagesForCourse/:courseId', async (req,res,next) => {
  let context = {};
  mysql.pool.query(
    "SELECT `languageName`, `languageCountry` AS `country` FROM `Languages` INNER JOIN `LanguagesCourses` ON Languages.languageId = LanguagesCourses.languageFk INNER JOIN `Courses` ON Courses.courseId = LanguagesCourses.courseFk WHERE Courses.courseId = ? ORDER BY `languageName`, `country`",
     req.params.courseId, (err, rows, fields) => {
      if (err) {
        logIt("ERROR FROM /api/getLanguagesForCourse/:courseId" + err);

        return;
      }
      context.results = rows;
      res.send(context);
    });

    return context;
});

// API endpoint to add a particular language to a particular course
router.get('/api/addLanguageToCourse/:courseId/:languageId', async (req,res,next) => {
  let context = {};
  let filter = [req.params.courseId, req.params.languageId]
  mysql.pool.query(
    "INSERT INTO `LanguagesCourses` (`courseFk`, `languageFk`) VALUES (?,?)",
     filter, (err, results, fields) => {
      if (err) {
        logIt("ERROR: that language is already associated with that course. " + err);
        return
      }
      logIt("The addition was successful!")
      context.results = results.affectedRows;
      res.send(context);
    });

    return context;
});

// API endpoint to delete a particular language
router.get('/api/deleteLanguage/:languageId', async (req,res,next) => {
  let context = {};
  mysql.pool.query("DELETE FROM `Languages` WHERE `languageId` = ?", req.params.languageId, (error, results, fields) => {
    if (error) {
      res.status(500).send();
    }
    else {
      logIt('deleted ' + results.affectedRows + ' rows');
      let context = {};
      context.results = results.affectedRows;
      res.send(context);
    }

  })
});

// API endpoint to update a particular language
router.post('/api/updateLanguage/', async(req,res,next) => {
  let context = {};
  let filter = [req.body.languageName, req.body.languageCountry, req.body.languageId]
  //get the current mySQL content (if it exists)
  mysql.pool.query("UPDATE Languages SET languageName = ?, languageCountry = ? WHERE languageId = ?", filter, (err, results, fields) => {
    if(err){
      res.status(500).send
    }
  context.results = results.affectedRows;
  res.send(context)
  });
});


//--------------------------------------------------------
//---------------------- USERS ---------------------------
//--------------------------------------------------------
// API endpoint to delete a particular user
router.delete('/api/deleteUser/:userId', requireAdminLogin, async (req,res,next) => {
  let context = {};

  //prevent someone from deleting their own account
  if (req.params.userId == req.session.user.userId) {
    res.status(400).send("Can't delete your own account")
  } else {
    mysql.pool.query("DELETE FROM `Users` WHERE `userId` = ?", req.params.userId, (error, results, fields) => {
      if (error) {
        res.status(500).send();
      };

      logIt('deleted ' + results.affectedRows + ' rows');
      let context = {};
      context.results = results.affectedRows;
      res.send(context);
    })
  }
});

// API endpoint to edit a user
router.patch('/api/editUser', requireAdminLogin, async (req,res,next) => {
  let updates = "";
  let sql = "";
  let hashedPassword = "";

  if (req.body['password'] && req.body['password'] != "") {
    hashedPassword = await bcrypt.hash(req.body['password'], 8);
    updates = [req.body['userType'], req.body['firstName'], req.body['lastName'], req.body['userName'], req.body['email'], hashedPassword, req.body['userId']];
    sql = "UPDATE `Users` SET `userType` = ?, `firstName` = ?, `lastName` = ?, `userName` = ?, `email` = ?, `password` = ? WHERE `userId` = ?";
  } else {
    updates = [req.body['userType'], req.body['firstName'], req.body['lastName'], req.body['userName'], req.body['email'], req.body['userId']];
    sql = "UPDATE `Users` SET `userType` = ?, `firstName` = ?, `lastName` = ?, `userName` = ?, `email` = ? WHERE `userId` = ?";
  }

  mysql.pool.query(sql, updates, (err, result) => {
    let context = {};
    if (err && err.code == "ER_DUP_ENTRY" ) {
      context.result = "DUPLICATE";
    } else if (err) {
      context.result = "ERROR";
    } else {
      context.result = result;
    }
    res.send(context);
  });
});

// API endpoint to get all users and their associated type separated out into true/false values for STUDENT, INSTRUCTOR, or ADMIN
router.get('/api/getUsersWithTypes', async (req,res,next) => {
  let context = {};
  let sqlQuery = "SELECT userId, firstName, lastName, userName, email, IF(STRCMP(userType, 'STUDENT'), false, true) AS STUDENT, IF(STRCMP(userType, 'INSTRUCTOR'), false, true) AS INSTRUCTOR, IF(STRCMP(userType, 'ADMIN'), false, true) AS ADMIN FROM Users ORDER BY lastName ASC;";


  mysql.pool.query(sqlQuery, (err, rows, fields) => {
      if (err) {
        logIt("ERROR FROM /api/getUsersWithTypes: " + err);
        return;
      }

      context.results = rows;
      res.send(context);
    });

    return context;
});

// API endpoint to get students *not* enrolled in a particular class
router.get('/api/getStudentsNotInClass/:someClassId', requireLogin, async (req,res,next) => {
  try {
    let context = {};
    mysql.pool.query("SELECT `userId`, `firstName`, `lastName`, `userName`, `userType` FROM `Users` WHERE `userId` NOT IN (SELECT `userId` FROM `Users` INNER JOIN `UsersCourses` ON `userId` = `userFk` INNER JOIN `Courses` ON `courseFk` = `courseId` WHERE `courseId` = ?) AND `userType` = 'STUDENT' ORDER BY lastName ASC", req.params.someClassId, (err, rows, fields) => {
      if (err) {
        next(err);
        res.status(500).send();
      }

      context.results = rows;
      res.send(context);
    });

  } catch(e) {
    logIt("ERROR: " + e)
    res.status(401).send()
  }
});

//--------------------------------------------------------
//---------------------- USERSCOURSES --------------------
//--------------------------------------------------------
// API endpoint to delete a user from a course 
router.delete('/api/deleteUserFromCourse/:userId', requireAdminLogin, async (req,res,next) => {
  let context = {};

  //prevent someone from deleting their own account
  if (!req.params.userId || isNaN(req.params.userId) || req.params.userId == "") {
    res.status(400).send("User ID sent not valid")
  } else if (!req.body['courseId'] || isNaN(req.body['courseId']) || req.body['courseId'] == "") {
    res.status(400).send("Course ID sent not valid")
  } else {
    let inserts = [req.params.userId, req.body['courseId']];
    mysql.pool.query("DELETE FROM `UsersCourses` WHERE `userFk` = ? AND `courseFk` = ?", inserts, (error, results, fields) => {
      if (error) {
        res.status(500).send();
      };

      logIt('deleted ' + results.affectedRows + ' rows');
      let context = {};
      context.results = results.affectedRows;
      res.send(context);
    })
  }
});

module.exports = router;
