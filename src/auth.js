/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   January 25, 2021
*/

const projectRoot = require('path').resolve('./')
require('dotenv').config({ path: projectRoot + '/.env'})
//const jwt = require('jsonwebtoken');
const mysql = require('./databaseConnection');

const auth = async (req, res, next) => {



  next()
}

// const auth = async (req, res, next) => {
//   try {
//
//     //user is either going to be sending request via webpage, so token will come from a POST or
//     //user is using Postmand to hit API endpoint itself, so token will bein Auth header
//      let token = "";
//      if (req.header('Authorization')) {
//        console.log("TOKEN FROM AUTH HEADER")
//        token = req.header('Authorization').replace('Bearer ', '')
//      } else {
//        console.log("TOKEN FROM BODY TOKEN")
//        token = req.body.token
//      }
//
//     //make sure token is valid and hasn't expired
//     const decoded = jwt.verify(token, process.env['JWOT_SIGNING'])  //decodes token sent by user against signing secret
//                                                                     //DECODED STRINGIFY: {"_id":1,"iat":1610633066}
//                                                                     //we had previously stored user id in token::: const token = jwt.sign({ _id: userId }, process.env['JWOT_SIGNING'])
//
//     //grab user's id --- decoded will have that property
//     const user = await checkUser(decoded._id, token);
//     console.log("USER: " + user);
//     //make sure user exist
//     if (!user) {
//       throw new Error()
//     }
//
//     //user must be valid
//     req.userId = decoded._id;
//
//     //save reference to token (??)
//     req.token = token;
//
//     next()
//
//   } catch (e) {
//     //redirect user to login page
//     res.render('login', {
//       title: 'JWOT Prototype | Login',
//       message: "<h2 style=\"color: #ff0000\">Please authenticate</h2>"
//     });
//   }
// }

// function checkUser(someId, someToken) {
//   return new Promise(function(resolve, reject) {
//     let result = -1;
//     mysql.pool.query("SELECT * FROM Students WHERE studentId=? AND passwordToken = ?", [[someId], [someToken]], (err, rows, fields) => {
//         if (err) {
//           //next(err);
//           console.log(err)
//           res.status(500).send();
//           return;
//         }
//         result = rows.length;
//         console.log("DB ROWS: " + result);
//
//         if (result >= 1) {
//           resolve(1);
//         } else {
//           reject(new Error("Please authenticate"));
//         }
//       })
//   });
// }

module.exports = auth
