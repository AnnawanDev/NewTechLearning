USE Jan20DB;
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
