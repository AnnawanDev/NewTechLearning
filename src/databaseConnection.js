/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   January 11, 2021
*/

require('dotenv').config({path: __dirname + '../.env'})
let mysql = require('mysql');

let pool = mysql.createPool({
  connectionLimit : 10,
  host            : process.env['DATABASE_HOST'],
  port            : process.env['DATABASE_PORT'],
  user            : process.env['DATABASE_USER'],
  password        : process.env['DATABASE_PASSWORD'],
  database        : process.env['DATABASE_NAME']
});

module.exports.pool = pool;
