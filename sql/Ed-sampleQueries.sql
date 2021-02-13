-- CS 340
-- Group 20 Final Project: New Tech Learning
-- Nora Marji, Ed Wied
-- February 10, 2021

-- SAMPLE FROM CANVAS JUST TO REFER TO BEFORE WE TURN IN
-- Query for add a new character functionality with colon : character being used to
-- denote the variables that will have data from the backend programming language
-- INSERT INTO bsg_people (fname, lname, homeworld, age) VALUES (:fnameInput, :lnameInput, :homeworld_id_from_dropdown_Input, :ageInput);

-- Table: Users (Ed)
-- +-----------+--------------------------------------+------+-----+---------+----------------+
-- | Field     | Type                                 | Null | Key | Default | Extra          |
-- +-----------+--------------------------------------+------+-----+---------+----------------+
-- | userId    | int(11)                              | NO   | PRI | NULL    | auto_increment |
-- | userType  | enum('STUDENT','INSTRUCTOR','ADMIN') | NO   |     | NULL    |                |
-- | firstName | varchar(255)                         | NO   |     | NULL    |                |
-- | lastName  | varchar(255)                         | NO   |     | NULL    |                |
-- | userName  | varchar(255)                         | NO   | UNI | NULL    |                |
-- | email     | varchar(255)                         | NO   |     | NULL    |                |
-- | password  | varchar(255)                         | NO   |     | NULL    |                |
-- +-----------+--------------------------------------+------+-----+---------+----------------+

-- Query to get user id
-- colon : character being used to denote the variables that will have data from NodeJS
SELECT userId FROM Users WHERE userName = :someUserName;

-- Query to see if user exists
SELECT userName FROM Users WHERE userName = :someUserName;

-- Query to get a user's type
SELECT `userType` FROM `Users` WHERE `userId` = :someUserId;

-- Query to insert a new user
-- colon : character being used to denote the variables that will have data from NodeJS
INSERT INTO `Users` (`firstName`, `lastName`, `userName`, `email`, `password`)
VALUES (:firstName, :lastName, :userName, :email, :password);

-- Query to update a use
UPDATE `Users`
SET `firstName` = :firstName, `lastName` = :lastName, `userName` = :userName, `email` = :email, `password` = :password
WHERE `userId` = :userId;

-- Query to update password
UPDATE `Users` SET `password` = :password WHERE `userId` = :userId;

-- Query to delete a user
DELETE FROM `Users` WHERE `userId` = :userId;


-- Table: Courses (Ed)
-- +-------------------+--------------+------+-----+---------+----------------+
-- | Field             | Type         | Null | Key | Default | Extra          |
-- +-------------------+--------------+------+-----+---------+----------------+
-- | courseId          | int(11)      | NO   | PRI | NULL    | auto_increment |
-- | courseName        | varchar(255) | NO   |     | NULL    |                |
-- | courseDescription | mediumtext   | YES  |     | NULL    |                |
-- | isLive            | tinyint(1)   | NO   |     | NULL    |                |
-- | dateWentLive      | date         | YES  |     | NULL    |                |
-- | categoryFk        | int(11)      | YES  | MUL | NULL    |                |
-- +-------------------+--------------+------+-----+---------+----------------+

-- Query to get most recently added classes
SELECT `courseId`, `courseName` FROM Courses ORDER BY `dateWentLive` DESC LIMIT 3;

-- Query to get course name and description for the overview of a particular course
SELECT `courseName`, `courseDescription` FROM `Courses` WHERE `courseId` = ?;

-- Query to get all courses that are currently live
SELECT `courseId`, `courseName` FROM `Courses` WHERE `isLive`=1;

-- Query to insert a new course
INSERT INTO `Courses` (`courseName`, `courseDescription`) VALUES (:someCourse, :someCourseDescription);

-- Query to update a course as being live
UPDATE `Courses` SET `isLive` = 1, dateWentLive = :date WHERE `courseId` = :someCourseId;

-- Query to update a course as no longer being live
UPDATE `Courses` SET `isLive` = 0 WHERE `courseId` = :someCourseId;

-- Query to update a course
UPDATE `Courses` SET `courseName` = :someCourseName, `courseDescription` = :someCourseDescription WHERE `courseId` = :someCourseId;

-- Query to delete a course
DELETE FROM `Courses` WHERE `courseId` = :someCourseId;


-- Table: UsersCourses (Ed)
-- +--------------+---------+------+-----+---------+----------------+
-- | Field        | Type    | Null | Key | Default | Extra          |
-- +--------------+---------+------+-----+---------+----------------+
-- | userCourseId | int(11) | NO   | PRI | NULL    | auto_increment |
-- | userFk       | int(11) | NO   | MUL | NULL    |                |
-- | courseFk     | int(11) | NO   | MUL | NULL    |                |
-- +--------------+---------+------+-----+---------+----------------+

-- Query to see if user is either a student or instructor in a particular class
SELECT COUNT(*) AS count FROM `UsersCourses` WHERE `userFk` = ? AND `courseFk` = ?

-- Query to add a user to a class
INSERT INTO `UsersCourses` (`userFk`, `courseFk`) VALUES (:someUserFk, :someCourseFk);

-- Query to delete a user from a class
DELETE FROM `UsersCourses` WHERE `userFk` = :someUserFk AND `courseFk` = :someCourseFk;


-- Table: Course Modules (Nora)


-- Tables: Categories (Nora)


-- Tables: Languages (Nora)


-- Tables: LanguagesCourses (Nora)
-- +------------------+---------+------+-----+---------+----------------+
-- | Field            | Type    | Null | Key | Default | Extra          |
-- +------------------+---------+------+-----+---------+----------------+
-- | languageCourseId | int(11) | NO   | PRI | NULL    | auto_increment |
-- | languageFk       | int(11) | NO   | MUL | NULL    |                |
-- | courseFk         | int(11) | NO   | MUL | NULL    |                |
-- +------------------+---------+------+-----+---------+----------------+
-- Query to get language that a course is taught in


-- Query to add a language to a class
INSERT INTO `LanguagesCourses` (`userFk`, `courseFk`) VALUES (:someUserFk, :someCourseFk);

-- Query to delete a language from a class
DELETE FROM `LanguagesCourses` WHERE `languageFk` = :someLanguageFk AND `courseFk` = :someCourseFk;
