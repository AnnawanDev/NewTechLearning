USE cs340_wiede; -- customize to local environment

CREATE TABLE Users (
	userId INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    userType ENUM('STUDENT', 'INSTRUCTOR', 'ADMIN') NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    userName VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) not null,
    passwordToken VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE Courses (
	courseId INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    courseName VARCHAR(255) NOT NULL,
    courseDescription MEDIUMTEXT
) ENGINE=InnoDB;

CREATE TABLE UsersCourses (
	userCourseId INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    userFk INT NOT NULL,
    courseFk INT NOT NULL,
    FOREIGN KEY(`userFk`) REFERENCES `Users`(`userId`),
    FOREIGN KEY(`courseFk`) REFERENCES `Courses`(`courseId`)
) ENGINE=InnoDB;

-- CourseModules: learning modules within a course that provides information to students
-- courseModuleId: INT, AUTO_INCREMENT, UNIQUE, NOT NULL, PK
-- courseFk: INT, NOT NULL, FK
-- courseModuleHTML: MEDIUMTEXT
-- courseModuleOrder: INT, NOT NULL
-- Developer responsible: Nora

-- Categories: Types of category types that a course could be tagged or searched
-- categoryId: INT, AUTO_INCREMENT, UNIQUE, NOT NULL, PK
-- categoryName: VARCHAR(255), NOT NULL
-- Developer: Nora

-- CoursesCategories: an intersection between Courses and Categories
-- courseCategoryId: INT, AUTO_INCREMENT, UNIQUE, NOT NULL, PK
-- courseFk: INT, NOT NULL, FK
-- categoryFk: INT, NOT NULL, FK
-- Developer: Nora 

-- Languages: Different languages that a course is available in 
-- languageId: INT, AUTO_INCREMENT, UNIQUE, NOT NULL, PK
-- languageName: VARCHAR(255), NOT NULL
-- Developer: Nora

CREATE TABLE LanguagesCourses (
	userCourseId INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    userFk INT NOT NULL,
    courseFk INT NOT NULL,
    FOREIGN KEY(`userFk`) REFERENCES `Users`(`userId`),
    FOREIGN KEY(`courseFk`) REFERENCES `Courses`(`courseId`)
) ENGINE=InnoDB;

-- LanguagesModules: an intersection between Languages and CourseModules
-- languageModuleId: INT, AUTO_INCREMENT, UNIQUE, NOT NULL, PK
-- languageFk: INT, NOT NULL, FK
-- moduleFk: INT, NOT NULL, FK
-- Developer: Nora

