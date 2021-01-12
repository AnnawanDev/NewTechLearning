/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   January 11, 2021
*/

const express = require('express');
const exphbs  = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
//const mysql = require('./databaseConnection');  //TODO: Setup DB
// const auth = require('./src/middleware/auth')  //TODO: Needs implementation

const app = express();
const port = 3000;
const publicDirectory = path.join(__dirname, '../public');
const partialsPath = path.join(__dirname, '../views/partials');
const useLogging = true;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static(publicDirectory));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// page navigation ---------------------------------------------------
app.get('/', (req, res) => {
  res.render('home', {
    title: 'New Tech Learning | Home'
  });
});

app.get('/Classes/', (req, res) => {
  res.render('classes', {
    title: 'New Tech Learning | Classes'
  });
});

app.get('/About/', (req, res) => {
  res.render('about', {
    title: 'New Tech Learning | About'
  });
});

app.get('/Admin/Instructors/', (req, res) => {
  res.render('adminInstructorLanding', {
    title: 'New Tech Learning | Instructor Admin'
  });
});

app.get('/Login/', (req, res) => {
  res.render('login', {
    title: 'New Tech Learning | Login'
  });
});

app.get('/Logout/', (req, res) => {
  res.render('logout', {
    title: 'New Tech Learning | Logout'
  });
});


// APIs ----------------------------------------------------------------



// serve 404 on anything else ------------------------------------------
app.get('*', (req, res) => {
  res.render('404', {
    title: '404 - Page not found'
  });
});

// start up Express ----------------------------------------------------
app.listen(port, () => {
  //TODO: Set up once db is up and running -- ensures that environment variables are present
  // if (!verifyEnvironmentVariablesLoaded()) {
  //   throw new Error('BROKEN')
  // }
  console.log("Server has started on port " + port);
});

// helper functions ----------------------------------------------------
//verify environment variables loaded
function verifyEnvironmentVariablesLoaded() {
  if (process.env['DATABASE_HOST'] &&
      process.env['DATABASE_USER'] &&
      process.env['DATABASE_PASSWORD'] &&
      process.env['DATABASE_NAME'] &&
      process.env['JWOT_SIGNING']) {
    return true;
  }
  return false;
}

//helper function used to log messages to console. This uses a variable to determine whether we
//want to log to console window or not.
function logIt(someMessage) {
  if (useLogging) {
    console.log(someMessage);
  }
}
