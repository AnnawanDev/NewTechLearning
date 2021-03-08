-- 4 Querries to move to stored procedure:
-- let result = await editCourse(courseId, courseName, courseDescription, isLive, category);
-- let updateInstructorResult = await updateInstructorForCourse(courseId, oldInstructor, newInstructor);
-- let deleteLanguageResult = await deleteAllLanguagesForCourse(courseId);
-- let insertNewLanguageResult = await addLanguagesToCourse(newLanguageIds, courseId);

DELIMITER //
CREATE PROCEDURE
  UpdateCourse
  (parameter_courseName VARCHAR(256),
  parameter_courseDescription VARCHAR(256),
  parameter_isLive TINYINT(1),
  parameter_dateWentLive DATE,
  parameter_categoryFk INT,
  parameter_courseId INT,
  parameter_oldInstructorId INT,
  parameter_newInstructorId INT
)
  MODIFIES SQL DATA
  BEGIN
    UPDATE Courses
      SET courseName = parameter_courseName, courseDescription = parameter_courseDescription,
        isLive = parameter_isLive, dateWentLive = parameter_dateWentLive, categoryFk = parameter_categoryFk
      WHERE courseId = parameter_courseId;
    UPDATE UsersCourses
      SET userFk = parameter_newInstructorId, courseFk = parameter_courseId
      WHERE userFk=parameter_oldInstructorId AND courseFk=parameter_courseId;
  END;
  //
DELIMITER ;



-- list procedures command:
-- SHOW PROCEDURE STATUS;

-- delete procedure command:
-- DROP PROCEDURE {some name}
