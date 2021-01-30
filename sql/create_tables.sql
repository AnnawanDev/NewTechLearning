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
  courseDescription MEDIUMTEXT,
	isLive BOOLEAN NOT NULL,
	dateWentLive DATE
) ENGINE=InnoDB;

CREATE TABLE UsersCourses (
	userCourseId INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  userFk INT NOT NULL,
  courseFk INT NOT NULL,
  CONSTRAINT FOREIGN KEY(`userFk`) REFERENCES `Users`(`userId`),
  CONSTRAINT FOREIGN KEY(`courseFk`) REFERENCES `Courses`(`courseId`)
) ENGINE=InnoDB;


CREATE TABLE CourseModules (
  courseModuleId INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  courseFk INT NOT NULL,
  courseModuleHTML MEDIUMTEXT,
  courseModuleOrder INT NOT NULL,
  CONSTRAINT FOREIGN KEY(`courseFk`) REFERENCES `Courses`(`courseId`)
) ENGINE=InnoDB;


CREATE TABLE Categories (
  categoryId INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  categoryName VARCHAR(255) NOT NULL
) ENGINE=InnoDB;


CREATE TABLE CoursesCategories(
  courseCategoryId INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  courseFk INT NOT NULL,
  categoryFk INT NOT NULL,
  CONSTRAINT FOREIGN KEY(`courseFk`) REFERENCES `Courses`(`courseId`),
  CONSTRAINT FOREIGN KEY(`categoryFk`) REFERENCES `Categories`(`categoryId`)
) ENGINE=InnoDB;


CREATE TABLE Languages (
  languageId INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  languageName VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE LanguagesCourses (
	userCourseId INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  userFk INT NOT NULL,
  courseFk INT NOT NULL,
  CONSTRAINT FOREIGN KEY(`userFk`) REFERENCES `Users`(`userId`),
  CONSTRAINT FOREIGN KEY(`courseFk`) REFERENCES `Courses`(`courseId`)
) ENGINE=InnoDB;


CREATE TABLE LanguagesModules (
  languageModuleId INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  languageFk INT NOT NULL,
  moduleFk INT NOT NULL,
  CONSTRAINT FOREIGN KEY(`languageFk`) REFERENCES `Languages`(`languageId`),
  CONSTRAINT FOREIGN KEY(`moduleFk`) REFERENCES `CourseModules`(`courseModuleId`)
) ENGINE=InnoDB;
