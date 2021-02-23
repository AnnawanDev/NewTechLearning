/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   February 17, 2021
*/

const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const mysql = require('../databaseConnection');
const {doesUserExist} = require('../dbQueries');
const {logIt} = require('../helperFunctions');

router.get('/api/getCourses', async (req,res,next) => {
  let context = {};

  let sqlQuery = "SELECT DISTINCT courseId, courseName FROM COURSES INNER JOIN Categories ON categoryFk = categoryId INNER JOIN LanguagesCourses ON courseId = courseFk INNER JOIN Languages ON languageFk = languageId WHERE 5=5 ";
  if (req.query.categoryFilter && req.query.categoryFilter != "ALL") {
    sqlQuery += "AND categoryId = " + req.query.categoryFilter;
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

router.get('/api/getCourseOverview/:courseName', async (req,res,next) => {
  let context = {};

  if (!req.params.courseName) {
    logIt('ERROR! No courseName sent to /api/getCourseOverview/:courseName');
    res.status(400).send();
    return;
  }

  mysql.pool.query('SELECT `courseName` FROM `Courses`;', (err, rows, fields) => {
      if (err) {
        logIt("ERROR FROM /api/getCourseOverview/:courseName: " + err);
        return;
      }

      logIt("/api/getCourseOverview/:courseName: " + JSON.stringify(rows));
      context.results = rows;
      res.send(context);
    });

    return context;
});



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

//TODO: add security
router.get('/api/getStudentsInClasses/:someClassId', async (req,res,next) => {
  try {
    let context = {};
    mysql.pool.query("SELECT `userId`, `firstName`, `lastName`, `userName`, `email`, `userType` FROM `Users` INNER JOIN `UsersCourses` ON `userId` = `userFk` INNER JOIN `Courses` on `courseFk` = `courseId` WHERE `courseId` = ? ORDER BY `userType` DESC, `userName` ASC", req.params.someClassId, (err, rows, fields) => {
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

//TODO: add security
router.get('/api/getStudentsNotInClass/:someClassId', async (req,res,next) => {
  try {
    let context = {};
    mysql.pool.query("SELECT `userId`, `firstName`, `lastName`, `userName` FROM `Users` WHERE `userId` NOT IN (SELECT `userId` FROM `USERS` INNER JOIN `UsersCourses` ON `userId` = `userFk` INNER JOIN `Courses` ON `courseFk` = `courseId` WHERE `courseId` = ?) AND `userType` != 'ADMIN'", req.params.someClassId, (err, rows, fields) => {
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

router.get('/api/getListOfAvailableCategories', async (req,res,next) => {
  try {
    let context = {};
    mysql.pool.query("SELECT `categoryId`, `categoryName` FROM `Categories` INNER JOIN `Courses` ON `categoryId` = `categoryFk` WHERE `isLive` = 1 ORDER BY `categoryName` ASC;", (err, rows, fields) => {
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

//deletes a category from DB
//not sure if it's working right now
// router.delete('/api/deleteCategory:categoryId', async (req,res,next) => {
//   let context = {};
//   mysql.pool.query("DELETE FROM `Categories` WHERE `categoryId` = ?", req.params.categoryId, (error, results, fields) => {
//     if (error) {
//       res.status(500).send();
//     };

//     logIt('deleted ' + results.affectedRows + ' rows');
//     let context = {};
//     context.results = results.affectedRows;
//     res.send(context);
//   })
// });

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


//TODO: add security
router.delete('/api/deleteUser/:userId', async (req,res,next) => {
  let context = {};
  mysql.pool.query("DELETE FROM `Users` WHERE `userId` = ?", req.params.userId, (error, results, fields) => {
    if (error) {
      res.status(500).send();
    };

    logIt('deleted ' + results.affectedRows + ' rows');
    let context = {};
    context.results = results.affectedRows;
    res.send(context);
  })
});

//TODO: add security
router.patch('/api/editUser/:userId', async (req,res,next) => {
  let hashedPassword = await bcrypt.hash(password, 8);
  const updates = [req.body['userType'], req.body['firstName'], req.body['lastName'], req.body['userName'], req.body['email'], hashedPassword, userId];

  mysql.pool.query("UPDATE `Users` SET `userType` = ?, `firstName` = ?, `lastName` = ?, `userName` = ?, `email` = ?, `password` = ? WHERE `userId` = ?;", updates, (err, result) => {
      if (err) {
        reject(new Error("editUser Bad query: " + err))
      }

      if (result.affectedRows) {
        resolve(result.affectedRows);
      } else {
        reject(new Error("Could not delete"));
      }
    });
});

module.exports = router;
