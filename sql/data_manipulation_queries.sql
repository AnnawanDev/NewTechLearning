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



-- Table Languages (Nora) 
-- +-----------------+----------------------------------------+--------+------+---------+----------+
-- |	Field	  	 |	Type								  | Null   | Key  |Default	| Extra	   | 
-- +-----------------+----------------------------------------+--------+------+---------+----------+
-- | languageId    	 |	int(11)								  | No	   | PRI  | NULL	| auto_inc |
-- | languageName  	 |	varchar(255)						  | No	   | 	  | NULL	| 	   	   |
-- | languageCountry |	varchar(255)						  | No	   | 	  | NULL	| 	   	   |
-- +-----------------+----------------------------------------+--------+------+---------+----------+

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



-- Table CourseModules (Nora) 
-- +-----------------+----------------------------------------+--------+------+---------+----------+
-- |	Field	  	 |	Type								  | Null   | Key  |Default	| Extra	   | 
-- +-----------------+----------------------------------------+--------+------+---------+----------+
-- | courseModuleId  |	int(11)								  | No	   | PRI  | NULL	| auto_inc |
-- | courseFk	  	 |	int(11)								  | No	   | MUL  | NULL	| 	   	   |
-- | courseModuleHTML|	MEDIUMTEXT							  | No	   | 	  | NULL	| 	   	   |
-- |courseModuleOrder|	int(11)								  | No	   | 	  | NULL	| 	   	   |
-- +-----------------+----------------------------------------+--------+------+---------+----------+

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


-- Table Categories (Nora) 
-- +-----------------+----------------------------------------+--------+------+---------+----------+
-- |	Field	  	 |	Type								  | Null   | Key  |Default	| Extra	   | 
-- +-----------------+----------------------------------------+--------+------+---------+----------+
-- | categoryId    	 |	int(11)								  | No	   | PRI  | NULL	| auto_inc |
-- | categoryName  	 |	varchar(255)						  | No	   | 	  | NULL	| 	   	   |
-- +-----------------+----------------------------------------+--------+------+---------+----------+

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

	--Still need: select courses based on categoryId (Ed)


-- Table LanguagesCourses (Nora) 
-- +-----------------+----------------------------------------+--------+------+---------+----------+
-- |	Field	  	 |	Type								  | Null   | Key  |Default	| Extra	   | 
-- +-----------------+----------------------------------------+--------+------+---------+----------+
-- | languageCourseId|	int(11)								  | No	   | PRI  | NULL	| auto_inc |
-- | languageFk  	 |	int(11)								  | No	   | MUL  | NULL	| 	   	   |
-- | courseFk		 |	int(11)								  | No	   | MUL  | NULL	| 	   	   |
-- +-----------------+----------------------------------------+--------+------+---------+----------+


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







