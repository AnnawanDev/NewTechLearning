-- MariaDB dump 10.18  Distrib 10.5.8-MariaDB, for osx10.15 (x86_64)
--
-- Host: localhost    Database: Jan20DB
-- ------------------------------------------------------
-- Server version	10.5.8-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Courses`
--

DROP TABLE IF EXISTS `Courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Courses` (
  `courseId` int(11) NOT NULL AUTO_INCREMENT,
  `courseName` varchar(255) NOT NULL,
  `courseDescription` mediumtext DEFAULT NULL,
  PRIMARY KEY (`courseId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Courses`
--

LOCK TABLES `Courses` WRITE;
/*!40000 ALTER TABLE `Courses` DISABLE KEYS */;
INSERT INTO `Courses` VALUES (1,'Java',NULL),(2,'Assembly-Language',NULL),(3,'Advanced-SQL',NULL),(4,'NoSQL-with-DynamoDB',NULL),(5,'C++',NULL);
/*!40000 ALTER TABLE `Courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `userType` enum('STUDENT','INSTRUCTOR','ADMIN') NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `userName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `passwordToken` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `userName` (`userName`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'ADMIN','Ed','Wied','wiede','wiede@oregonstate.edu','wiede',NULL),(2,'INSTRUCTOR','Teacher','A','teacherA','teacherA@somedomain.com','teacherA',NULL),(3,'INSTRUCTOR','Teacher','B','teacherB','teacherB@somedomain.com','teacherB',NULL),(4,'INSTRUCTOR','Teacher','C','teacherC','teacherC@somedomain.com','teacherC',NULL),(5,'STUDENT','Student','1','student1','student1@somedomain.com','student1',NULL),(6,'STUDENT','Student','2','student2','student1@somedomain.com','student2',NULL),(7,'STUDENT','Student','3','student3','student2@somedomain.com','student3',NULL),(8,'STUDENT','Student','4','student4','student3@somedomain.com','student4',NULL),(9,'STUDENT','Student','5','student5','student4@somedomain.com','student5',NULL),(10,'STUDENT','Student','6','student6','student5@somedomain.com','student6',NULL),(11,'STUDENT','Student','7','student7','student6@somedomain.com','student7',NULL);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UsersCourses`
--

DROP TABLE IF EXISTS `UsersCourses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UsersCourses` (
  `userCourseId` int(11) NOT NULL AUTO_INCREMENT,
  `userFk` int(11) NOT NULL,
  `courseFk` int(11) NOT NULL,
  PRIMARY KEY (`userCourseId`),
  KEY `userFk` (`userFk`),
  KEY `courseFk` (`courseFk`),
  CONSTRAINT `userscourses_ibfk_1` FOREIGN KEY (`userFk`) REFERENCES `Users` (`userId`),
  CONSTRAINT `userscourses_ibfk_2` FOREIGN KEY (`courseFk`) REFERENCES `Courses` (`courseId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UsersCourses`
--

LOCK TABLES `UsersCourses` WRITE;
/*!40000 ALTER TABLE `UsersCourses` DISABLE KEYS */;
INSERT INTO `UsersCourses` VALUES (1,2,1),(2,3,2),(3,3,3),(4,4,4),(5,4,5);
/*!40000 ALTER TABLE `UsersCourses` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-01-21  7:47:53
