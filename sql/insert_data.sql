USE Jan20DB;

INSERT INTO `Users` (`userType`, `firstName`, `lastName`, `userName`, `email`, `password`) VALUES 
 ("ADMIN", "Ed", "Wied", "wiede", "wiede@oregonstate.edu", "wiede"),
 ("INSTRUCTOR", "Teacher", "A", "teacherA", "teacherA@somedomain.com", "teacherA"),
 ("INSTRUCTOR", "Teacher", "B", "teacherB", "teacherB@somedomain.com", "teacherB"),
 ("INSTRUCTOR", "Teacher", "C", "teacherC", "teacherC@somedomain.com", "teacherC"),
 ("STUDENT", "Student", "1", "student1", "student1@somedomain.com", "student1"),
 ("STUDENT", "Student", "2", "student2", "student1@somedomain.com", "student2"),
 ("STUDENT", "Student", "3", "student3", "student2@somedomain.com", "student3"),
 ("STUDENT", "Student", "4", "student4", "student3@somedomain.com", "student4"),
 ("STUDENT", "Student", "5", "student5", "student4@somedomain.com", "student5"),
 ("STUDENT", "Student", "6", "student6", "student5@somedomain.com", "student6"),
 ("STUDENT", "Student", "7", "student7", "student6@somedomain.com", "student7");

INSERT INTO `Courses` (`courseName`) VALUES 
('Java'),
('Assembly-Language'),
('Advanced-SQL'),
('NoSQL-with-DynamoDB'),
('C++');

-- TeacherA teaches Java
-- TeacherB teaches Assembly, AdvancedSQL
-- TeacherC teaches NoSQL, C++
INSERT INTO `UsersCourses` (`userFk`, `courseFk`) VALUES 
(2, 1),
(3, 2),
(3, 3),
(4, 4),
(4, 5);


