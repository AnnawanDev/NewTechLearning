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
const auth = require('./auth')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
var session = require('client-sessions');

// set up variables ---------------------------------------------------
const app = express();
const port = 3000;
const publicDirectory = path.join(__dirname, '../public');
const partialsPath = path.join(__dirname, '../views/partials');
const useLogging = true;

// handlebars setup ---------------------------------------------------
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Express setup ---------------------------------------------------
app.use(express.static(publicDirectory));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

// public / student page navigation ---------------------------------------------------
app.get('/', (req, res) => {
  res.render('home', {
    title: 'New Tech Learning | Home'
  });
});

app.get('/About', (req, res) => {
  res.render('about', {
    title: 'New Tech Learning | About'
  });
});

app.get('/Login', (req, res) => {
  res.render('login', {
    title: 'New Tech Learning | Login'
  });
});

app.get('/Logout', (req, res) => {
  req.session.reset();
  res.render('logout', {
    title: 'New Tech Learning | Logout'
  });
});

app.get('/CreateAccount', (req, res) => {
  res.render('createAccount', {
    title: 'New Tech Learning | Create Account'
  });
});

app.get('/Courses', (req, res) => {
  res.render('courses', {
    title: 'New Tech Learning | Courses'
  });
});

app.get('/Courses/:id/:courseName/overview', (req, res) => {
  //I mentioned before that courseName could be unique and we could grab the course details
  //using courseName, but I think we should use ID as we may have 2 or more "intro to java"
  //for example.  Still, I like having the courseName as part of the URL because  it gives
  //it a semantic feel and  helps express  what the url does rather than just courses?id=2  or courses/3/overview
  //I'm open if we want to do this differently


  //TODO: get real course details from query
  // let courseName = "Java";  //TODO- replace with real API
  // let htmlContent = "<h1>Java</h1><p>Welcome to an Introduction to Java</p>"; //TODO - get real HTML dump from course overview

  let context = {};
  context.results = "";
  logIt("ID: " + req.params.id)

  mysql.pool.query('SELECT `courseName`, `courseDescription` FROM `Courses` WHERE `courseId` = ?', req.params.id, (err, rows, fields) => {
      if (err) {
        logIt("ERROR FROM /Courses/:id/:courseName/overview: " + err);
        return;
      }

      logIt("/Courses/:id/:courseName/overview query result: " + JSON.stringify(rows[0].courseDescription));

      res.render('courseOverview', {
        title: rows[0].courseName,
        htmlContent: rows[0].courseDescription,
        moduleLink: '/courses/' + req.params.id + '/' + rows[0].courseName + '/module/1'
      });
    });
});


//removed login but I think in reality we'd want to make sure that someone has enrolled in class or is the instructor
app.get('/Courses/:id/:courseName/module/:courseModule?', (req, res) => {
  //if courseModule parameter is missing assume it's equal to 1
  if (!req.params.courseModule) {
    req.params.courseModule = 1;
  }

  // //do sql query to see what course corresponds to req.params.courseName
  // //pretending here that we did a query and it resulted in "assembly-language"
  // //otherwise query resulted in either (1) error (so we say, "oops - sorry") or (2) course not found
  // let courseName = "{ UPDATE WITH COURSE NAME }";  //would get nonHTML name to show from db query
  // let htmlContent; //html dump from db query
  //
  // //would have to  update this with actual sql query
  // if (req.params.courseModule == 1) {
  //   htmlContent = "<h1>Welcome to the class</h1><p>blah.... blah...</p>";  //mocked response from db query based on courseModule == 1
  // } else if (req.params.courseModule == 2){
  //   htmlContent = "<h1>Module 2</h1><p>blah.... blah...</p>";  //mocked response from db query based on courseModule == 1
  // } else {
  //   htmlContent = "<h1>Sorry, that's module can't be found</h1>"; //pretending can't find that module
  // }

  let courseName = "TEMP PLACEHOLDER TEXT";
  let htmlContent = "TEMP PLACEHOLDER TEXT FOR MODULE # " + req.params.courseModule;

  res.render('coursePage', {
    title: courseName,
    htmlContent: htmlContent
  });
});


// admin page navigation ---------------------------------------------------
app.get('/Admin/', (req, res) => {
  res.render('adminHome', {
    title: 'New Tech Learning | Admin Home'
  });
});

app.get('/Admin/Users/', (req, res) => {
  res.render('adminUsers', {
    title: 'New Tech Learning | Admin Users'
  });
});

app.get('/Admin/Courses/', (req, res) => {
  res.render('adminCourses', {
    title: 'New Tech Learning | Admin Courses'
  });
});

// APIs ----------------------------------------------------------------

//TODO: Add security eventually, but leave alone for now to create test users via Postman
app.post('/api/createUser', async (req,res,next) => {
  let context = {};

  //verify user posted name, email, password
  if (!req.body['firstName'] || !req.body['lastName'] || !req.body['email'] || !req.body['password']) {
    logIt('ERROR! Required values not in POST body');
    res.status(400).send();
    return;
  }

  //TODO: ideally make sure email is valid, use some kind of validation on first and last name

  let hashedPassword = await bcrypt.hash(req.body['password'], 8);  //hash password sent in with bcrypt
  const inserts = [req.body['firstName'], req.body['lastName'], req.body['email'], [hashedPassword]];  //set up variables to insert into db

  mysql.pool.query('INSERT INTO `Users` (`firstName`, `lastName`, `email`, `password`) VALUES (?, ?, ?, ?);', inserts, (err, result) => {
    if (err) {
      // next(err);
      res.status(400).send()
      return;
    }

      context.results = "Inserted ID " + result.insertId;
      res.send(context);
    });
});

app.get('/api/getCourses', async (req,res,next) => {
  let context = {};

  mysql.pool.query('SELECT `courseId`, `courseName` FROM `Courses`;', (err, rows, fields) => {
      if (err) {
        logIt("ERROR FROM /api/getCourses: " + err);
        return;
      }

      logIt("/api/getCourses query result: " + JSON.stringify(rows));
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
    //TODO: reject if email or password not sent in POST
    // if (!req.body['email'] || !req.body['password']) {
    //   logIt('ERROR! Name or email not in POST body');
    //   res.status(401).send();
    //   return;
    // }

    let email = req.body['email'];
    let password = req.body['password'];

    try {
      // see if there exists a user with email and if password passed equals hashed password
      let user = await doesUserExist(email, password);

      if (!user) {
        logIt('ERROR! bad email and/or password');
        throw new Error('Unable to login');
      }

      // must be good user, generate auth token for user
      const userId = user.userId; //await getUserId(email);
      const firstName = user.firstName
      const token = await generateAuthToken(userId);
      user.token = token;
      await updateUserToken(token, userId);

      //store user object in session
      req.session.user = user;

      //send back Bearer token and user email to user
      await res.send({email, firstName})


    } catch(e) {
      logIt("ERROR: " + e)
      res.status(401).send()
    }
});


//THIS IS JUST A TEST API TO TEST SECURITY
app.get('/api/UserListing', auth, async (req,res,next) => {
  try {
    let context = {};
    mysql.pool.query("SELECT * FROM Users", (err, rows, fields) => {
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

async function getUserId(someEmail) {
  return new Promise(function(resolve, reject) {
    let context = {};

    mysql.pool.query("SELECT userId FROM Users WHERE email = ?", [someEmail], (err, rows, fields) => {
        if (err) {
          //next(err);
          logIt("EMAIL: " + someEmail)
          logIt("SELECT ERROR FROM getUserId: " + err);
          reject(new Error("Bad query"))
        }

        if (rows[0] != undefined) {
          logIt("getUserId ROWS: " + JSON.stringify(rows))
          logIt("GET USER ID: ROWS RESULT: " + rows[0].studentId);
          resolve(rows[0].studentId);
        } else {
          reject(new Error("User ID not found"));
        }
      });
  });
}

//maybe change to getUser since we're now returning user object
async function doesUserExist(someEmail, somePassword) {
  return new Promise(function(resolve, reject) {
    // let context = {};
    let user = {};
    mysql.pool.query("SELECT * FROM Users WHERE email = ? ", [someEmail], (err, rows, fields) => {
        if (err) {
          logIt("doesUserExist ERROR: " + err);
          return -1;
        }
        console.log(someEmail);
        if (rows[0] == undefined) {
          reject(new Error("User ID not found"));
          return;
        }

        const storedHashPassword = rows[0].password;

        if (bcrypt.compareSync(somePassword, storedHashPassword)) {
          user.firstName = rows[0].firstName;
          user.lastName = rows[0].lastName;
          user.email = rows[0].email;
          user.userId = rows[0].studentId;
          resolve(user);
        } else {
          reject(new Error("User password not correct"));
        }
      });
  });
}


function requireLogin (req, res, next) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    //verify session cookie
    next();
  }
};
