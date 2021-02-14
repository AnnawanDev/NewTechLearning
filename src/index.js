/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   January 25, 2021
*/

const mysql = require('./databaseConnection');
const express = require('express');
const exphbs  = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
var session = require('client-sessions');

// set up variables ---------------------------------------------------
const app = express();
const port = 14567;
const publicDirectory = path.join(__dirname, '../public');
const partialsPath = path.join(__dirname, '../views/partials');
const useLogging = true;
const useSecurity = true;

// handlebars setup ---------------------------------------------------
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Express setup ---------------------------------------------------
app.use(express.static(publicDirectory));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  cookieName: 'session',
  secret: process.env['JWOT_SIGNING'],
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

// public / student page navigation ---------------------------------------------------
app.get('/', async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Home';
  context = await getLoginContext(context, req);
  res.render('home', context);
});

app.get('/About', async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | About';
  context = await getLoginContext(context, req);
  res.render('about', context);
});

app.get('/Login', async (req, res) => {
  let context = {};

  //is user already logged in?
  if (req.session && req.session.user) {
    context.message = "<h1>Welcome back " + req.session.user.firstName + "</h1><br /><br />";
  }

  context.title = 'New Tech Learning | Login';
  context = await getLoginContext(context, req);
  res.render('login',context);
});

app.get('/Logout', requireLogin, async (req, res) => {
  req.session.reset();
  let context = {};
  context.title = 'New Tech Learning | Logout';
  context = await getLoginContext(context, req);
  res.render('logout', context);
});

app.get('/CreateAccount', async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Create Account';
  context = await getLoginContext(context, req);
  res.render('createAccount', context);
});

app.post('/CreateAccount', async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Create Account';

  //verify that all needed values were posted
  if (!req.body['firstName'] || !req.body['lastName'] || !req.body['userName'] || !req.body['email'] || !req.body['password1']) {
    context.feedback = "<div class='formError'>Sorry, required fields not presented when form submitted.  Try again.</div>";
    context = await getLoginContext(context, req);
    res.render('createAccount', context);
  }

  let hashedPassword = await bcrypt.hash(req.body['password1'], 8);
  const inserts = [req.body['firstName'], req.body['lastName'], req.body['userName'], req.body['email'], [hashedPassword], 'STUDENT'];  // Since call is being made from /CreateAccount, must be a student account

  try {
    let result = await addNewUser(inserts);
    context.feedback = "<div class='formSuccess'>Welcome to New Tech Learning!</div>";
  } catch(e) {
    context.feedback = "<div class='formError'>" + e + "</div>";
    context.firstName = req.body['firstName'];
    context.lastName = req.body['lastName'];
    context.userName = req.body['userName'];
    context.email = req.body['email'];
  }

  let user = await doesUserExist(req.body['userName'], req.body['password1']);

  //NOTE: Not sure if we'll need this.  Keeping for now
  //user.token = await generateAuthToken(user.userId); //log user in with credentials supplied to create account
  //await updateUserToken(user.token, user.userId); // update db with user token

  req.session.user = user; //store user object in session
  context = await getLoginContext(context, req); //get user context and save in session
  res.render('createAccount', context);
});

app.get('/Courses', async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Courses';
  context = await getLoginContext(context, req);
  context.categories = await getListOfCategories();
  context.languages = await getListOfLanguages();
  res.render('courses', context);
});

app.get('/Courses/:id/:courseName/overview', async (req, res) => {
  let context = {};
  context.results = "";
  context = await getLoginContext(context, req);

  mysql.pool.query('SELECT `courseName`, `courseDescription` FROM `Courses` WHERE `courseId` = ?', req.params.id, async (err, rows, fields) => {
      if (err) {
        logIt("ERROR FROM /Courses/:id/:courseName/overview: " + err);
        return;
      }
      context.title = rows[0].courseName;
      context.htmlContent = rows[0].courseDescription;
      context.moduleLink = '/courses/' + req.params.id + '/' + rows[0].courseName + '/module/1';

      //if admin then show link to go to class module
      //if instructor then see if instructor is teaching that class.  If teaching, then show link. If not, then don't show anything
      //if student, then see if enrolled.  if enrolled, then show link to course module.  if not enrolled, then show link to sign up
      //if not logged in, then show prompt to login in order to enroll
      if (!req.session || !req.session.user) {
        context.notLoggedIn = true;
      } else if (req.session.user.userType == "STUDENT") {
        let isUserEnrolled = await isInstructorOrStudentInClass(context, req);
        context.isEnrolled = isUserEnrolled.enrolled;
        context.isStudent = true;
      } else if (req.session.user.userType == "INSTRUCTOR") {
        let isUserEnrolled = await isInstructorOrStudentInClass(context, req);
        context.isEnrolled = isUserEnrolled.enrolled;
        context.isInstructor = true;
      } else if (req.session.user.userType == "ADMIN") {
        context.isAdmin = true;
      } else {
        logIt ("ERROR - SHOULD NOT GET HERE in /Courses/:id/:courseName/overview")
      }

      res.render('courseOverview', context);
    });
});

//removed login but I think in reality we'd want to make sure that someone has enrolled in class or is the instructor
app.get('/Courses/:id/:courseName/module/:courseModule?', (req, res) => {
  //if courseModule parameter is missing assume it's equal to 1
  if (!req.params.courseModule) {
    req.params.courseModule = 1;
  }

  let context = {};
  let query1= 'SELECT COUNT(*) as moduleCount FROM `CourseModules` WHERE `courseFk` = ?'
  let query2 = 'SELECT `courseModuleHTML` FROM `CourseModules` WHERE `courseFk`= ? and `courseModuleOrder` = ?';
  let filter= [req.params.id, req.params.courseModule]

  //query for number of course modules
  mysql.pool.query(query1, req.params.id, (err,rows1,fields)=> {
    if (err) {
      logIt("ERROR FROM /module/:courseModule : " + err);
      return;
    }
    //query for course module HTML given course and order
    mysql.pool.query(query2, filter, async (err, rows2, fields) => {
      //error handling
      if (err) {
        logIt("ERROR FROM /module/:courseModule : " + err);
        return;
      }

      let moduleLinks ={}
      //set up links for the other modules
      for (let i =1; i<= rows1[0].moduleCount; i++){
        moduleLinks[i] = '/courses/' + req.params.id + '/' + req.params.courseName + '/module/'+ i
      }

      //add objects to context
      context.moduleLinks = moduleLinks
      context.courseTitle = req.params.courseName;
      context.moduleNo = req.params.courseModule
      context.htmlContent = rows2[0].courseModuleHTML
      context = await getLoginContext(context, req);
      res.render('coursePage', context);
    });

  });
});

// admin page navigation ---------------------------------------------------
app.get('/Admin/', requireLogin, async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Admin Home';
  context = await getLoginContext(context, req);
  res.render('adminHome', context);
});

app.get('/Admin/Users/', requireLogin, async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Admin Users';
  context = await getLoginContext(context, req);
  context.courses = await getListOfLiveCourses();
  context.userListing = await getListOfUsersWithUserTypes();
  res.render('adminUsers', context);
});

app.post('/Admin/Users/', requireLogin, async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Admin Users';
  context.courses = await getListOfLiveCourses();
  context = await getLoginContext(context, req);

  if (req.body['addUserForm']) {  //user is trying to add a new user

    //TODO: add form validation!

    let hashedPassword = await bcrypt.hash(req.body['addPassword1'], 8);
    const inserts = [req.body['addFirstName'], req.body['addLastName'], req.body['addUserName'], req.body['addEmail'], [hashedPassword], req.body['addUserType']];

    try {
      let result = await addNewUser(inserts);
      context.addUserFeedback = "<div class='formSuccess'>User added!</div>";
    } catch(e) {
      logIt("ERROR: " + e);
      context.addUserFeedback = "<div class='formError'>" + e + "</div>";
      context.addFirstName = req.body['addFirstName'];
      context.addLastName = req.body['addLastName'];
      context.addUserName = req.body['addUserName'];
      context.addEmail = req.body['addEmail'];
    }
  }

  res.render('adminUsers', context);
});

app.get('/Admin/Languages/', requireLogin, async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Admin Languages';
  context = await getLoginContext(context, req);
  res.render('adminLanguages', context);
});

app.get('/Admin/Categories/', requireLogin, async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Admin Categories';
  context = await getLoginContext(context, req);
  res.render('adminCategories', context);
});

app.get('/Admin/Courses/', requireLogin, async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Admin Courses';
  context = await getLoginContext(context, req);
  res.render('adminCourses', context);
});

app.get('/Admin/CourseModules/', requireLogin, async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Admin CourseModules';
  context = await getLoginContext(context, req);
  res.render('adminCourseModules', context);
});

app.get('/Admin/AddUsersCourses/', requireLogin, async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Admin Add Users to Courses';
  context = await getLoginContext(context, req);
  res.render('adminAddUsersCourses', context);
});

app.get('/Admin/DropUsersCourses/', requireLogin, async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Admin Drop Users from Courses';
  context = await getLoginContext(context, req);
  res.render('adminDropUsersCourses', context);
});

app.get('/Admin/AddDropCoursesCategories/', requireLogin, async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Admin Add/Drop Categories to/from Courses';
  context = await getLoginContext(context, req);
  res.render('adminAddDropCoursesCategories', context);
});

app.get('/Admin/AddDropLanguagesCourses/', requireLogin, async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Admin Add/Drop Languages to/from Courses';
  context = await getLoginContext(context, req);
  res.render('adminAddDropLanguagesCourses',context);
});

app.get('/Admin/AddDropLanguagesModules/', requireLogin, async (req, res) => {
  let context = {};
  context.title = 'New Tech Learning | Admin Add/Drop Languages to/from Course Modules';
  context = await getLoginContext(context, req);
  res.render('adminAddDropLanguagesModules', context);
});

// APIs ----------------------------------------------------------------

//TODO: Add security eventually, but leave alone for now to create test users via Postman
//this create user is used publicly to create
// app.post('/api/createUser', requireLogin, async (req,res,next) => {
//   let context = {};
//
//   //verify user posted name, email, password
//   if (!req.body['firstName'] || !req.body['lastName'] || !req.body['userName'] || !req.body['email'] || !req.body['password']) {
//     logIt('ERROR! Required values not in POST body');
//     res.status(400).send();
//     return;
//   }
//
//   //TODO: ideally make sure email is valid, use some kind of validation on first and last name
//
//   let hashedPassword = await bcrypt.hash(req.body['password'], 8);  //hash password sent in with bcrypt
//   const inserts = [req.body['firstName'], req.body['lastName'], req.body['userName'], req.body['email'], [hashedPassword]];  //set up variables to insert into db
//
//   mysql.pool.query('INSERT INTO `Users` (`firstName`, `lastName`, `userName`, `email`, `password`) VALUES (?, ?, ?, ?, ?);', inserts, (err, result) => {
//     if (err) {
//       // next(err);
//       console.log("/api/createUser ERROR: " + err)
//
//
//       if (err.toString().includes("ER_DUP_ENTRY")) {
//         context.result = "DUPLICATE"
//         res.status(400).send(context);
//         return;
//       } else {
//         res.status(400).send()
//         return;
//       }
//     }
//
//     context.results = "Inserted ID " + result.insertId;
//     res.send(context);
//     });
// });


// app.post('/api/adminCreateUser', requireLogin, async (req,res,next) => {
//   let context = {};
//
//   //verify user posted name, email, password
//   if (!req.body['firstName'] || !req.body['lastName'] || !req.body['userName'] || !req.body['email'] || !req.body['password']) {
//     logIt('ERROR! Required values not in POST body');
//     res.status(400).send();
//     return;
//   }
//
//   //TODO: ideally make sure email is valid, use some kind of validation on first and last name
//
//   let hashedPassword = await bcrypt.hash(req.body['password'], 8);  //hash password sent in with bcrypt
//   const inserts = [req.body['firstName'], req.body['lastName'], req.body['userName'], req.body['email'], [hashedPassword]];  //set up variables to insert into db
//
//   mysql.pool.query('INSERT INTO `Users` (`firstName`, `lastName`, `userName`, `email`, `password`) VALUES (?, ?, ?, ?, ?);', inserts, (err, result) => {
//     if (err) {
//       // next(err);
//       console.log("/api/createUser ERROR: " + err)
//
//
//       if (err.toString().includes("ER_DUP_ENTRY")) {
//         context.result = "DUPLICATE"
//         res.status(400).send(context);
//         return;
//       } else {
//         res.status(400).send()
//         return;
//       }
//
//     }
//
//       context.results = "Inserted ID " + result.insertId;
//       res.send(context);
//     });
// });

app.get('/api/getCourses', async (req,res,next) => {
  let context = {};

  mysql.pool.query('SELECT `courseId`, `courseName` FROM `Courses`;', (err, rows, fields) => {
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

app.get('/api/getCourseOverview/:courseName', async (req,res,next) => {
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



app.post('/api/login', async (req, res, next) => {
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

// app.get('/api/UserListing', requireLogin, async (req,res,next) => {
//   try {
//     let context = {};
//     mysql.pool.query("SELECT * FROM Users", (err, rows, fields) => {
//       if (err) {
//         next(err);
//         res.status(500).send();
//       }
//
//       context.results = rows;
//       res.send(context);
//     });
//
//   } catch(e) {
//     logIt("ERROR: " + e)
//     res.status(401).send()
//   }
// });

app.get('/api/selectMostRecentAddedClasses', async (req,res,next) => {
  try {
    let context = {};
    mysql.pool.query("SELECT `courseId`, `courseName` FROM Courses ORDER BY `dateWentLive` DESC LIMIT 3;", (err, rows, fields) => {
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

// serve 404 on anything else ------------------------------------------
app.get('*', (req, res) => {
  res.render('404', {
    title: '404 - Page not found'
  });
});

// start up Express ----------------------------------------------------
app.listen(port, () => {
  if (!verifyEnvironmentVariablesLoaded()) {
    throw new Error('BROKEN')
  }
  logIt("Server has started on port " + port);
});


// helper functions ----------------------------------------------------
//verify environment variables loaded
function verifyEnvironmentVariablesLoaded() {
  if (process.env['DATABASE_HOST'] &&
      process.env['DATABASE_USER'] &&
      process.env['DATABASE_PASSWORD'] &&
      process.env['DATABASE_NAME'] &&
      process.env['DATABASE_PORT'] &&
      process.env['JWOT_SIGNING']) {
    return true;
  }
  return false;
}

//common function to log messages to console rather than use console.log for everyone
//if we want to universally turn off messages when we submit project, there's only one spot in file to do so
function logIt(someMessage) {
  if (useLogging) {
    console.log(someMessage);
  }
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

// Authorization ------------------------------------------------------
function requireLogin (req, res, next) {
  if (useSecurity) {
    if (!req.session.user) {
      res.redirect('/login');
    } else {
      next();
    }
  } else {
    next();
  }
};

function checkIfLoggedIn(req) {
  if (!req.session.user) {
    return true;
  }
  return false;
}

async function isLoggedInAs(req, someType) {
  if (!req.session || !req.session.user) {
    return false;
  }
  let userType = await getUserType(req.session.user.userId);
  if (userType == someType) {
    return true;
  }
  return false;
}

async function isNotLoggedIn(req) {
  if (!req.session || !req.session.user) {
    return true;
  }
  return false;
}

//generate Bearer token
async function generateAuthToken(userId) {
  return new Promise(function(resolve, reject) {
    const token = jwt.sign({ _id: userId }, process.env['JWOT_SIGNING'])
    logIt("TOKEN GENERATED: " + token)
    if (token) {
      resolve(token);
    } else {
      reject(new Error("Unable to generate token"));
    }
  });
}

async function updateUserToken(token, userId) {
  return new Promise(function(resolve, reject) {
    let context = {};
    logIt("TOKEN PASSED TO updateUserToken: " + token);
    logIt("USERID PASSED TO updateUserToken: " + userId);
    mysql.pool.query('UPDATE `Users` SET passwordToken = ? WHERE userId = ?', [[token], [userId]], (err, result) => {
      if (err) {
        next(err);
        return;
      }

        if (result != undefined) {
          logIt("updateUserToken result: " + JSON.stringify(result));
          context.results = "Affected rows " + result.affectedRows;
          logIt("Affected rows " + result.affectedRows);
          resolve(context.results);
        } else {
          reject(new Error("Unable to update token"));
        }
      });
  });
}

//adds to context object whether or not user is logged in; and if so, what kind of userType they are
async function getLoginContext(someContextObject, req) {
  someContextObject.isNotLoggedIn = await isNotLoggedIn(req);
  someContextObject.isLoggedInAsStudent = await isLoggedInAs(req, "STUDENT");
  someContextObject.isLoggedInAsInstructor = await isLoggedInAs(req, "INSTRUCTOR");
  someContextObject.isLoggedInAsAdmin = await isLoggedInAs(req, "ADMIN");

  if (someContextObject.isLoggedInAsInstructor || someContextObject.isLoggedInAsAdmin) {
    someContextObject.isInstructorOrAdmin = true;
  } else {
    someContextObject.isInstructorOrAdmin = false;
  }

  if (!someContextObject.isNotLoggedIn) {
    someContextObject.firstName = req.session.user.firstName;
  }

  return someContextObject;
}


// DB Functions ------------------------------------------------------
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
