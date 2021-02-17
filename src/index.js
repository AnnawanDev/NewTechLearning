/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   February 17, 2021
*/

const express = require('express');
const exphbs  = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('client-sessions');
const mysql = require('./databaseConnection');


// set up variables ---------------------------------------------------
const app = express();
const port = 14567;
const publicDirectory = path.join(__dirname, '../public');
const partialsPath = path.join(__dirname, '../views/partials');

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

// Set up & register routers -----------------------------------------------
const appPublicPages = require('./routers/appPublicPages');
const appAdminPages = require('./routers/appAdminPages');
const apiEndpoints = require('./routers/apiEndpoints');
app.use(appPublicPages);
app.use(appAdminPages);
app.use(apiEndpoints);

// serve 404 on anything else ------------------------------------------
app.get('*', (req, res) => {
  res.render('404', {
    title: '404 - Page not found'
  });
});

// start up Express ----------------------------------------------------
app.listen(port, () => {
  console.log("Server has started on port " + port);
});
