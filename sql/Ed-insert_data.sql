-- SAMPLE USER NAMES AND PASSWORDS --
-- ADMINS --
-- user/pass ed
-- user/pass nora

-- INSTRUCTORS --
-- user/pass teacherA
-- user/pass teacherB
-- user/pass teacherC

-- STUDENTS --
-- user/pass student1


-- Table: Users
INSERT INTO `Users` (`userType`, `firstName`, `lastName`, `userName`, `email`, `password`) VALUES
 ("ADMIN", "Ed", "Wied", "ed", "wied@wied.com", "$2b$08$PDVw3i.IkTnf5tR.zlueTuwCyYDwlUWzOSr6e901dCrB39jZcOc1y"),
 ("ADMIN", "Nora", "Marji", "nora", "nora@nora.com", "$2b$08$yQ9cnErp8mcB.EA8gtLDpufos3JXSYEGbLyUc2kdh4UKo7gwSMIEO"),
 ("INSTRUCTOR", "teacher", "A", "teacherA", "teacherA@teacher.com", "$2b$08$NwZbIlbwBLBX2oQossTJaO5I7axMPjbxPFuIU.1YEJgDgg4tkhbOO"),
 ("INSTRUCTOR", "teacher", "B", "teacherB", "teacherB@teacher.com", "$2b$08$8lYw7lxdxrHbwkhw8KkYS.s3/ylLm2fk0p7NvD5YlFw0kTEYjzXNm"),
 ("INSTRUCTOR", "teacher", "C", "teacherC", "teacherC@teacher.com", "$2b$08$Vw4UZZiukXrGJq.iuf54muYCny5/HKFIglrjLsLEHN2LhmXhJQObe"),
 ("STUDENT", "student", "1", "student1", "student1@student.com", "$2b$08$GdCEICyppmlGH16hD15CPuLc1ULe0QaTjeRWcS7l5lh1cAHOOouZW");

 -- Table: Categories



-- Table: Courses
 INSERT INTO `Courses` (`courseName`, `courseDescription`, `isLive`, `dateWentLive`, `categoryFk`) VALUES
 ('Java', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec varius ipsum quam, vitae fermentum dui ultrices sed. Aenean vulputate eleifend blandit. Proin viverra imperdiet risus molestie accumsan. Donec dapibus est varius tortor convallis, eu ornare tellus malesuada. Curabitur sed orci orci. Sed condimentum ex at turpis tincidunt auctor. Curabitur tristique mi turpis, ut tempus mi vulputate quis. Nulla semper erat quis fermentum semper. Proin lacinia dolor pharetra velit posuere, ut accumsan tellus fringilla. Mauris nec lacus arcu. Aliquam ut interdum sem. Phasellus rutrum pellentesque est, non tincidunt nisl posuere vel. Sed aliquam feugiat viverra. Praesent nulla leo, semper sit amet vestibulum vel, scelerisque id nunc.</p><p>Nullam placerat quam et leo molestie mattis. Mauris et tincidunt dolor. Nam sit amet sollicitudin diam. Maecenas eleifend non sapien id venenatis. Sed ligula purus, lobortis et tellus ac, lacinia blandit diam. Nullam ac efficitur nulla. Quisque nec porttitor orci. Sed arcu lacus, vulputate vel porttitor sit amet, dictum at sapien. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;</p>', 1, '2021-01-01', NULL),
 ('Assembly-Language', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec varius ipsum quam, vitae fermentum dui ultrices sed. Aenean vulputate eleifend blandit. Proin viverra imperdiet risus molestie accumsan. Donec dapibus est varius tortor convallis, eu ornare tellus malesuada. Curabitur sed orci orci. Sed condimentum ex at turpis tincidunt auctor. Curabitur tristique mi turpis, ut tempus mi vulputate quis. Nulla semper erat quis fermentum semper. Proin lacinia dolor pharetra velit posuere, ut accumsan tellus fringilla. Mauris nec lacus arcu. Aliquam ut interdum sem. Phasellus rutrum pellentesque est, non tincidunt nisl posuere vel. Sed aliquam feugiat viverra. Praesent nulla leo, semper sit amet vestibulum vel, scelerisque id nunc.</p><p>Nullam placerat quam et leo molestie mattis. Mauris et tincidunt dolor. Nam sit amet sollicitudin diam. Maecenas eleifend non sapien id venenatis. Sed ligula purus, lobortis et tellus ac, lacinia blandit diam. Nullam ac efficitur nulla. Quisque nec porttitor orci. Sed arcu lacus, vulputate vel porttitor sit amet, dictum at sapien. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;</p>',1, '2021-01-02', NULL),
 ('Advanced-SQL', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec varius ipsum quam, vitae fermentum dui ultrices sed. Aenean vulputate eleifend blandit. Proin viverra imperdiet risus molestie accumsan. Donec dapibus est varius tortor convallis, eu ornare tellus malesuada. Curabitur sed orci orci. Sed condimentum ex at turpis tincidunt auctor. Curabitur tristique mi turpis, ut tempus mi vulputate quis. Nulla semper erat quis fermentum semper. Proin lacinia dolor pharetra velit posuere, ut accumsan tellus fringilla. Mauris nec lacus arcu. Aliquam ut interdum sem. Phasellus rutrum pellentesque est, non tincidunt nisl posuere vel. Sed aliquam feugiat viverra. Praesent nulla leo, semper sit amet vestibulum vel, scelerisque id nunc.</p><p>Nullam placerat quam et leo molestie mattis. Mauris et tincidunt dolor. Nam sit amet sollicitudin diam. Maecenas eleifend non sapien id venenatis. Sed ligula purus, lobortis et tellus ac, lacinia blandit diam. Nullam ac efficitur nulla. Quisque nec porttitor orci. Sed arcu lacus, vulputate vel porttitor sit amet, dictum at sapien. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;</p>',1, '2021-01-03', NULL),
 ('NoSQL-with-DynamoDB', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec varius ipsum quam, vitae fermentum dui ultrices sed. Aenean vulputate eleifend blandit. Proin viverra imperdiet risus molestie accumsan. Donec dapibus est varius tortor convallis, eu ornare tellus malesuada. Curabitur sed orci orci. Sed condimentum ex at turpis tincidunt auctor. Curabitur tristique mi turpis, ut tempus mi vulputate quis. Nulla semper erat quis fermentum semper. Proin lacinia dolor pharetra velit posuere, ut accumsan tellus fringilla. Mauris nec lacus arcu. Aliquam ut interdum sem. Phasellus rutrum pellentesque est, non tincidunt nisl posuere vel. Sed aliquam feugiat viverra. Praesent nulla leo, semper sit amet vestibulum vel, scelerisque id nunc.</p><p>Nullam placerat quam et leo molestie mattis. Mauris et tincidunt dolor. Nam sit amet sollicitudin diam. Maecenas eleifend non sapien id venenatis. Sed ligula purus, lobortis et tellus ac, lacinia blandit diam. Nullam ac efficitur nulla. Quisque nec porttitor orci. Sed arcu lacus, vulputate vel porttitor sit amet, dictum at sapien. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;</p>',1, '2021-01-04', NULL),
 ('C++', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec varius ipsum quam, vitae fermentum dui ultrices sed. Aenean vulputate eleifend blandit. Proin viverra imperdiet risus molestie accumsan. Donec dapibus est varius tortor convallis, eu ornare tellus malesuada. Curabitur sed orci orci. Sed condimentum ex at turpis tincidunt auctor. Curabitur tristique mi turpis, ut tempus mi vulputate quis. Nulla semper erat quis fermentum semper. Proin lacinia dolor pharetra velit posuere, ut accumsan tellus fringilla. Mauris nec lacus arcu. Aliquam ut interdum sem. Phasellus rutrum pellentesque est, non tincidunt nisl posuere vel. Sed aliquam feugiat viverra. Praesent nulla leo, semper sit amet vestibulum vel, scelerisque id nunc.</p><p>Nullam placerat quam et leo molestie mattis. Mauris et tincidunt dolor. Nam sit amet sollicitudin diam. Maecenas eleifend non sapien id venenatis. Sed ligula purus, lobortis et tellus ac, lacinia blandit diam. Nullam ac efficitur nulla. Quisque nec porttitor orci. Sed arcu lacus, vulputate vel porttitor sit amet, dictum at sapien. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;</p>',1, '2021-01-05', NULL);


-- Table: UsersCourses
-- TeacherA teaches Java
-- TeacherB teaches Assembly, AdvancedSQL
-- TeacherC teaches NoSQL, C++
INSERT INTO `UsersCourses` (`userFk`, `courseFk`) VALUES
(3, 1),
(4, 2),
(4, 3),
(4, 4),
(5, 5);

-- Table: LanguagesCourses
-- TO-DO: need to match up langauge to course
-- INSERT INTO `LanguagesCourses` (`languageFk`, `courseFk`) VALUES ();
