
-- colon : character being used to denote the variables that will have data from NodeJS

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







