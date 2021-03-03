-- CS 340
-- Group 20 Final Project: New Tech Learning
-- Nora Marji, Ed Wied
-- February 13, 2021

-- NOTE REGARDING ALL QUERIES
-- colon : character being used to denote the variables that will have data from NodeJS


-- Table: Users
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

-- Query to see if user exists - if so, details are used to populate session
SELECT `userId`, `firstName`, `lastName`, `email`, `userType` FROM `Users` WHERE `userName` = :someUserName;

-- Query to get a user's type
SELECT `userType` FROM `Users` WHERE `userId` = :someUserId;

-- Query to insert a new user
INSERT INTO `Users` (`firstName`, `lastName`, `userName`, `email`, `password`, `userType`)
VALUES (:userType, :firstName, :lastName, :userName, :email, :password);

-- Query to update a user
UPDATE `Users`
SET `userType` = :userType, `firstName` = :firstName, `lastName` = :lastName, `userName` = :userName, `email` = :email, `password` = :password
WHERE `userId` = :userId;

-- Query to update password
UPDATE `Users` SET `password` = :password WHERE `userId` = :userId;

-- Query to delete a user
DELETE FROM `Users` WHERE `userId` = :userId;

-- Query to get list of users, but break out userType into true/false pairs.  This allows us to pass true/false arguments to handlebars to easily categorize users
SELECT `userId`, `firstName`, `lastName`, `userName`, `email`,
IF(STRCMP(userType, 'STUDENT'), false, true) AS STUDENT,
IF(STRCMP(userType, 'INSTRUCTOR'), false, true) AS INSTRUCTOR,
IF(STRCMP(userType, 'ADMIN'), false, true) AS ADMIN
FROM `Users` ORDER BY `lastName` ASC;

-- query to see if there's a matching user; and if so, grab details to verify credentials
SELECT `userId`, `firstName`, `lastName`, `email`, `userType`, `password` FROM `Users` WHERE `userName` = :someUserName;

-- query to get all users who are instructors or admins
SELECT `userId`, `firstName`, `lastName`, `userName` FROM `Users` WHERE `userType` = 'INSTRUCTOR' OR `userType` = 'ADMIN';


-- Table: Courses
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
SELECT `courseId`, `courseName` FROM `Courses` WHERE `isLive` = 1 ORDER BY courseName ASC;

-- Query to select Courses but this is open ended so we can append on the end extra sql from the business logic side
-- For example, this gets all courses, but on the business logic we could append, " AND CATEGORY ='someValue'"
SELECT DISTINCT courseId, courseName FROM Courses INNER JOIN Categories ON categoryFk = categoryId
INNER JOIN LanguagesCourses ON courseId = courseFk INNER JOIN Languages ON languageFk = languageId WHERE 5=5

-- Query to get details on specific course
SELECT `courseId`, `courseName`, `courseDescription`, `isLive`, `dateWentLive`, `categoryFk` FROM `Courses` WHERE `courseId` = :someCourseId;

-- Query to get category name for a course
SELECT categoryName FROM Categories
INNER JOIN Courses ON categoryId = categoryFk
WHERE courseId = :someCourseId;

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

-- Query to get,
-- (1) all courses, regardless of whether they are live or not
-- (2) associate with who's teaching (could be userType Instrurctor or Admin)
-- (3) limit description string to 150 characters
-- (4) get language (or languages) taught in
-- (5) get category associated with
SELECT `courseId`, `courseName`, `userId`, `firstName`, `lastName`, `userName`,
CONCAT(LEFT(`courseDescription`,25), '...') AS 'description',
`dateWentLive`, IF(STRCMP(isLive, 1), 'NO', 'YES') AS isLive,
categoryName, GROUP_CONCAT(languageName) AS 'TaughtIn'
FROM `Courses`
INNER JOIN `UsersCourses` ON courseId = courseFk
INNER JOIN `Users` ON userFk = userId
LEFT OUTER JOIN `LanguagesCourses` ON Courses.courseId = LanguagesCourses.courseFk
LEFT OUTER JOIN `Languages` ON LanguagesCourses.languageFk = Languages.languageId
LEFT OUTER JOIN `Categories` ON Courses.categoryFk = Categories.categoryId
WHERE `userType` = 'INSTRUCTOR' OR `userType` = 'ADMIN'
GROUP BY courseId
ORDER BY courseId;

-- For a specific course Id, this query will get,
-- (1) all courses, regardless of whether they are live or not
-- (2) associate with who's teaching (could be userType Instrurctor or Admin)
-- (3) limit description string to 150 characters
-- (4) get language (or languages) taught in
-- (5) get category associated with
SELECT `courseId`, `courseName`, `courseDescription`, `categoryFk`, `userId`, `firstName`, `lastName`, `userName`,
CONCAT(LEFT(`courseDescription`,25), '...') AS 'description',
`dateWentLive`, IF(STRCMP(isLive, 1), 'NO', 'YES') AS isLive,
categoryName, GROUP_CONCAT(languageName) AS 'TaughtIn'
FROM `Courses`
INNER JOIN `UsersCourses` ON courseId = courseFk
INNER JOIN `Users` ON userFk = userId
LEFT OUTER JOIN `LanguagesCourses` ON Courses.courseId = LanguagesCourses.courseFk
LEFT OUTER JOIN `Languages` ON LanguagesCourses.languageFk = Languages.languageId
LEFT OUTER JOIN `Categories` ON Courses.categoryFk = Categories.categoryId
WHERE `courseId` = :someCourseId AND (`userType` = 'INSTRUCTOR' OR `userType` = 'ADMIN')
GROUP BY courseId
ORDER BY courseId;


-- Table: UsersCourses
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

-- Query to get list of students and instructors associated with a particular class
SELECT `userId`, `firstName`, `lastName`, `userName`, `email`, `userType`
FROM `Users`
INNER JOIN `UsersCourses` ON `userId` = `userFk`
INNER JOIN `Courses` on `courseFk` = `courseId`
WHERE `courseId` = :someClassId
ORDER BY `userType` DESC, `userName` ASC;

-- Query to get all students who are not associated with a particular class
SELECT `userId`, `firstName`, `lastName`, `userName`, `userType`
FROM `Users` WHERE `userId` NOT IN
	(SELECT `userId` FROM `Users`
	INNER JOIN `UsersCourses` ON `userId` = `userFk`
	INNER JOIN `Courses` ON `courseFk` = `courseId`
	WHERE `courseId` = :someCourseId)
AND `userType` = 'STUDENT' ORDER BY lastName ASC;

-- Table Languages
-- +-----------------+--------------+------+-----+---------+----------------+
-- | Field           | Type         | Null | Key | Default | Extra          |
-- +-----------------+--------------+------+-----+---------+----------------+
-- | languageId      | int(11)      | NO   | PRI | NULL    | auto_increment |
-- | languageName    | varchar(255) | NO   |     | NULL    |                |
-- | languageCountry | varchar(255) | NO   |     | NULL    |                |
-- +-----------------+--------------+------+-----+---------+----------------+

	--Admin: get all languages to populate Admin Langauges
	SELECT `languageName`, `languageCountry` FROM `Languages`

	--Admin: update a language's name based on a submission to the "edit language" form
	UPDATE `Langages` SET `languageName`= :languageNameInput

	--Admin: update a language's country based on a submission to the "edit language" form
	UPDATE `Langages` SET `languageCountry` = :languageCountryInput

	--Admin: delete current language (will cascade to LanguagesCourses)
	DELETE FROM `Languages` WHERE `languageId` = :language_id_selected_from_admin_languages

	--Admin: insert a language
	INSERT INTO `Languages` (`languageName`, `languageCountry`) VALUES (:languageNameInput, :languageCountryInput)

	-- get list of distinct languages that are linked to live classes
SELECT DISTINCT `languageId`, `languageName`, `languageCountry` FROM `Languages`
INNER JOIN `LanguagesCourses` ON `languageId` = `languageFk`
INNER JOIN `Courses` ON `courseFk` = `courseId`
WHERE `isLive` = 1 ORDER BY `languageName` ASC;

-- Table CourseModules
-- +-------------------+------------+------+-----+---------+----------------+
-- | Field             | Type       | Null | Key | Default | Extra          |
-- +-------------------+------------+------+-----+---------+----------------+
-- | courseModuleId    | int(11)    | NO   | PRI | NULL    | auto_increment |
-- | courseFk          | int(11)    | NO   | MUL | NULL    |                |
-- | courseModuleHTML  | mediumtext | YES  |     | NULL    |                |
-- | courseModuleOrder | int(11)    | NO   |     | NULL    |                |
-- +-------------------+------------+------+-----+---------+----------------+

-- Public Pages: Select a single module's HTML by courseFk and courseModuleOrder in order to display to a student
	SELECT `courseModuleHTML` FROM `CourseModules` WHERE `courseFk`= :course_selected and `courseModuleOrder` = :courseModuleOrder_selected

-- 	Admin: Select modules to populate Admin Modules with modules from a selected courses
	SELECT `courseModuleOrder`, `courseModuleHTML` FROM `courseModules` WHERE `courseFk` = :course_selected

-- 	Admin: Update a module's order
	UPDATE `courseModules` SET `courseModuleOrder` = :courseModuleOrderInput,

-- 	Admin: Update a module's HTML
	UPDATE `courseModules` SET `courseModuleHTML` = :courseModuleHTMLInput

-- 	Admin: Delete current module
	DELETE FROM `courseModules` WHERE `courseModuleId` = :courseModuleId_selected_from_admin_course_modules

-- 	Admin: Insert new module
	INSERT into `Modules` (`courseModuleOrder`, `courseModuleHTML`) VALUES (:courseModuleOrderInput, :courseModuleHTMLInput)


-- Table Categories
-- +--------------+--------------+------+-----+---------+----------------+
-- | Field        | Type         | Null | Key | Default | Extra          |
-- +--------------+--------------+------+-----+---------+----------------+
-- | categoryId   | int(11)      | NO   | PRI | NULL    | auto_increment |
-- | categoryName | varchar(255) | NO   |     | NULL    |                |
-- +--------------+--------------+------+-----+---------+----------------+

-- Categories Queries
	--Public: select category of a given course based on courseId to display to user
	SELECT `categoryName` FROM `Categories` WHERE `courseFk` = :courseFkInput

	--Admin: select all categories to display on Categories Admin page
	SELECT `categoryName` FROM `Categories`

	-- Admin: update category selected on Categories Admin Page
	UPDATE `Categories` SET `categoryName`= :categoryNameInput

	-- Admin: delete category selected on Categories Admin page
	DELETE FROM `Categories` WHERE `categoryId` = :category_id_selected_from_admin_categories

	-- Admin: insert category based on values input in the "add category" form on Categories Admin age
	INSERT INTO `Categories` (`categoryName`) VALUES (:categoryNameInput)

	-- Courses overview page: Query to select courses based on categoryId
	SELECT `courseName`, `categoryName`
	FROM `Courses`
	INNER JOIN `Categories` ON `Courses`.`categoryFk` = `Categories`.`categoryId`
	WHERE `categoryId` = :someCategoryId;

	-- Query to get list of categories that are linked to live classes
	SELECT `categoryId`, `categoryName` FROM `Categories`
	INNER JOIN `Courses` ON `categoryId` = `categoryFk`
	WHERE `isLive` = 1 ORDER BY `categoryName` ASC;


-- Table LanguagesCourses
-- +------------------+---------+------+-----+---------+----------------+
-- | Field            | Type    | Null | Key | Default | Extra          |
-- +------------------+---------+------+-----+---------+----------------+
-- | languageCourseId | int(11) | NO   | PRI | NULL    | auto_increment |
-- | languageFk       | int(11) | NO   | MUL | NULL    |                |
-- | courseFk         | int(11) | NO   | MUL | NULL    |                |
-- +------------------+---------+------+-----+---------+----------------+

	--Public: Get all courses associated with a specific language (use for "courses page" search filter)
	SELECT `courseId`, `courseName`, `languageName` FROM `Courses`
	INNER JOIN `LanguagesCourses` ON Courses.courseId = LanguagesCourses.courseFk
	INNER JOIN `Languages` ON Languages.languageId = LanguagesCourses.languageFk
	WHERE Languages.languageId = :languageId_from_dropdown_input
	ORDER BY `courseName`, `languageName`


	-- Admin/Public: Get all languages associated with a specific course
	SELECT `languageName`, `languageCountry` AS `country`
	FROM `Languages`
	INNER JOIN `LanguagesCourses` ON Languages.languageId = LanguagesCourses.languageFk
	INNER JOIN `Courses` ON Courses.courseId = LanguagesCourses.courseFk
	WHERE Courses.courseId = :courseId_from_dropdown_input
	ORDER BY `languageName`, `country`

	---Admin: Associate a language with a course (M-to-M relationship addition)
	INSERT INTO `LanguagesCourses` (`languageFk`, `courseFk`) VALUES (:languageId_from_dropdown_input, :courseId_from_dropdown_input)

	--Admin: Disassociate a language with a course (M-to-M relationship deletion)
	DELETE FROM `LanguagesCourses` WHERE `languageId` = :languageId_selected_from_LanguagesCourses_table AND `courseId` = :courseId_from_dropdown_input
