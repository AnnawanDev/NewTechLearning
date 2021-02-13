-- CS 340
-- Group 20 Final Project: New Tech Learning
-- Nora Marji, Ed Wied
-- February 13, 2021

-- NOTE REGARDING ALL QUERIES
-- colon : character being used to denote the variables that will have data from NodeJS


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
SELECT userId FROM Users WHERE userName = :someUserName;

-- Query to see if user exists
SELECT userName FROM Users WHERE userName = :someUserName;

-- Query to get a user's type
SELECT `userType` FROM `Users` WHERE `userId` = :someUserId;

-- Query to insert a new user
INSERT INTO `Users` (`userType`, `firstName`, `lastName`, `userName`, `email`, `password`)
VALUES (:userType, :firstName, :lastName, :userName, :email, :password);

-- Query to update a user
UPDATE `Users`
SET `userType` = :userType, `firstName` = :firstName, `lastName` = :lastName, `userName` = :userName, `email` = :email, `password` = :password
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
SELECT `courseId`, `courseName` FROM Courses WHERE `isLive`=1 ORDER BY `dateWentLive` DESC LIMIT 3;

-- Query to get course name and description for the overview of a particular course
SELECT `courseName`, `courseDescription` FROM `Courses` WHERE `courseId` = ?;

-- Query to get all courses that are currently live
SELECT `courseId`, `courseName` FROM `Courses` WHERE `isLive`=1;

-- Query to insert a new course
INSERT INTO `Courses` (`courseName`, `courseDescription`) VALUES (:someCourse, :someCourseDescription);

-- Set of queries to both insert a new course as well as associate a userId as an instructor
-- takes the last auto incremented id and use that to insert into UserCourses
-- This is all wrapped in a transaction so they either all pass or all fail
START TRANSACTION;
INSERT INTO `Courses` (`courseName`, `courseDescription`) VALUES (:someCourse, :someCourseDescription);
INSERT INTO `UsersCourses` (`userFk`, `courseFk`) VALUES (:someUserId, (SELECT LAST_INSERT_ID()));
COMMIT;

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

-- Query to see if user has access to a particular class.  If count > 0, then must be a user must be either a student or instructor with access to a course
SELECT COUNT(*) AS count FROM `UsersCourses` WHERE `userFk` = ? AND `courseFk` = ?

-- Query to add a user to a class
INSERT INTO `UsersCourses` (`userFk`, `courseFk`) VALUES (:someUserFk, :someCourseFk);

-- Query to delete (drop) a user from a class
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
