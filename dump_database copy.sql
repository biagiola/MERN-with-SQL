-- MySQL dump 10.13  Distrib 8.0.25, for Linux (x86_64)
--
-- Host: localhost    Database: prueba
-- ------------------------------------------------------
-- Server version	8.0.25

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tbl_circuits`
--

DROP TABLE IF EXISTS `tbl_circuits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_circuits` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_provider` int unsigned NOT NULL COMMENT '//ID Proveedor',
  `name` varchar(50) NOT NULL,
  `identifier` varchar(150) DEFAULT NULL COMMENT '//Número de Circuito',
  `host` varchar(50) DEFAULT NULL COMMENT '//IP-Dominio de Trunks asociados',
  `port` varchar(50) DEFAULT NULL COMMENT '//SIP puerto asociado',
  `date_in` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '//Fecha Alta',
  `date_out` datetime DEFAULT NULL COMMENT '//Fecha Baja',
  `description` text COMMENT '//Descripcion',
  `active` tinyint unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_circuits`
--

LOCK TABLES `tbl_circuits` WRITE;
/*!40000 ALTER TABLE `tbl_circuits` DISABLE KEYS */;
INSERT INTO `tbl_circuits` VALUES (4,4,'option1','123456','127.0.0.1','8080','2021-06-22 02:00:50',NULL,'this is circuit description 2 blah',1),(21,21,'option1','123456','127.0.0.1','9000','2021-06-24 12:21:18',NULL,'this is circuit description 2 blah',1),(22,22,'option1','123456','192.0.0.1','8081','2021-06-24 12:21:47',NULL,'this is circuit description 2 blah',1),(23,23,'option1','123456','192.0.0.3','8081','2021-06-24 12:22:08',NULL,'this is circuit description 2 blah',1),(24,24,'option1','857649','172.0.0.0','8081','2021-06-24 12:22:37',NULL,'this is circuit description 2 blah',1),(25,25,'option1','947685','172.0.0.0','8081','2021-06-24 12:22:54',NULL,'this is circuit description 2 blah',1);
/*!40000 ALTER TABLE `tbl_circuits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_ddis`
--

DROP TABLE IF EXISTS `tbl_ddis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_ddis` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_provider` int unsigned NOT NULL COMMENT '//id proveedor tblproviders',
  `id_circuit` varchar(50) NOT NULL COMMENT '//Circuito en el que se provisiona',
  `ddis` varchar(50) NOT NULL COMMENT '//Numeración',
  `ddis_associated` varchar(50) DEFAULT NULL COMMENT '//Número asociado',
  `date_in` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '//Fecha de alta de la numeración',
  `date_out` datetime DEFAULT NULL COMMENT '//Fecha de baja de la numeración',
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `id_provider` (`id_provider`),
  CONSTRAINT `tbl_ddis_ibfk_1` FOREIGN KEY (`id_provider`) REFERENCES `tbl_providers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_ddis`
--

LOCK TABLES `tbl_ddis` WRITE;
/*!40000 ALTER TABLE `tbl_ddis` DISABLE KEYS */;
INSERT INTO `tbl_ddis` VALUES (4,4,'4','123456','1234567','2021-06-22 02:00:50',NULL,1),(21,21,'21','123456','1234567','2021-06-24 12:21:18',NULL,1),(22,22,'22','654321','654321','2021-06-24 12:21:47',NULL,1),(23,23,'23','524163','635241','2021-06-24 12:22:08',NULL,1),(24,24,'24','436152','4351524','2021-06-24 12:22:37',NULL,1),(25,25,'25','634141','3215142','2021-06-24 12:22:54',NULL,1);
/*!40000 ALTER TABLE `tbl_ddis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_permission_role`
--

DROP TABLE IF EXISTS `tbl_permission_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_permission_role` (
  `permission_id` int NOT NULL,
  `role_id` int NOT NULL,
  UNIQUE KEY `permission_id` (`permission_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `tbl_permission_role_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `tbl_roles` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_permission_role`
--

LOCK TABLES `tbl_permission_role` WRITE;
/*!40000 ALTER TABLE `tbl_permission_role` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_permission_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_permissions`
--

DROP TABLE IF EXISTS `tbl_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_permissions` (
  `permissions_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `desc` varchar(255) DEFAULT NULL,
  UNIQUE KEY `permissions_id` (`permissions_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_permissions`
--

LOCK TABLES `tbl_permissions` WRITE;
/*!40000 ALTER TABLE `tbl_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_providers`
--

DROP TABLE IF EXISTS `tbl_providers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_providers` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `active` tinyint unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_providers`
--

LOCK TABLES `tbl_providers` WRITE;
/*!40000 ALTER TABLE `tbl_providers` DISABLE KEYS */;
INSERT INTO `tbl_providers` VALUES (4,'option1',1),(21,'option1',1),(22,'option2',1),(23,'option2',1),(24,'option2',1),(25,'option2',1);
/*!40000 ALTER TABLE `tbl_providers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_role_user`
--

DROP TABLE IF EXISTS `tbl_role_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_role_user` (
  `role_id` int NOT NULL,
  `user_id` int NOT NULL,
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `tbl_role_user_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_role_user`
--

LOCK TABLES `tbl_role_user` WRITE;
/*!40000 ALTER TABLE `tbl_role_user` DISABLE KEYS */;
INSERT INTO `tbl_role_user` VALUES (0,39),(0,55),(0,56),(1,57),(1,58),(0,59),(1,61),(0,64),(0,78),(0,79),(0,84),(0,85),(0,86),(0,90),(0,91),(0,102),(0,103),(1,104),(1,105),(0,132),(0,133);
/*!40000 ALTER TABLE `tbl_role_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_roles`
--

DROP TABLE IF EXISTS `tbl_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_roles` (
  `role_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `desc` varchar(255) DEFAULT NULL,
  UNIQUE KEY `role_id` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_roles`
--

LOCK TABLES `tbl_roles` WRITE;
/*!40000 ALTER TABLE `tbl_roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_users`
--

DROP TABLE IF EXISTS `tbl_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `date_in` timestamp NOT NULL,
  `role_id` int NOT NULL,
  `permission_id` int NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '0',
  `blocked` tinyint(1) NOT NULL DEFAULT '0',
  `attempts` int NOT NULL DEFAULT '0',
  `wait_until` bigint unsigned DEFAULT NULL,
  `last_login` timestamp NULL DEFAULT NULL,
  `last_pass_changed` timestamp NULL DEFAULT NULL,
  `last_remember` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=134 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_users`
--

LOCK TABLES `tbl_users` WRITE;
/*!40000 ALTER TABLE `tbl_users` DISABLE KEYS */;
INSERT INTO `tbl_users` VALUES (39,'Cesar','Gonzalez','pedro1@gmail.com','$2a$10$wC8.gJpMF4EnCxzEFiWDl.jgNC.zCfffVRQHxtmfnAUAFweBSdnfC','2021-06-08 07:22:02',0,0,0,0,0,NULL,'2021-06-15 04:37:05',NULL,NULL),(55,'Carlos','Garcia','carlos5@gmail.com','$2a$10$/RsbJC82cwnsi4kMcqCCc.MQvfGb..WnkXlhP.Owaa5H8PLyq7JxG','2021-06-09 08:01:30',0,0,0,0,0,NULL,'2021-06-24 16:23:07',NULL,NULL),(56,'Andrea','Pereira','Andrea1995@gmail.com','$2a$10$2pX4JgHmfc22WIOLGkdf4OyaMAiT/K.ge.Nbu.BGhs9pPSKPn29ZG','2021-06-10 04:35:45',0,0,0,0,0,NULL,NULL,NULL,NULL),(57,'Joaquin*','Bernal','joaco1@gmail.com','$2a$10$f8xZ56t3QVt0SVFemEZWpucQoMPI2YyNxt2mPNYZpJGSFqkGyTwam','2021-06-10 04:43:03',1,0,0,0,0,NULL,'2021-06-17 17:51:12',NULL,NULL),(58,'Jorge','Fernandez','jorgefernandez1@gmail.com','$2a$10$1Jzi8p1bC19UisM7VQnGHOBlXtU9BY5SE51hjO6WjFwoJNjt6yQBG','2021-06-15 05:02:01',1,0,0,0,0,NULL,'2021-06-15 22:45:15',NULL,NULL),(59,'Carlos','García','carlos7@gmail.com','$2a$10$W3oKeND8vS/gx2NXmiwWJ.NYrX8nvZr0BUH3dqpE4WwnCpwtXea6W','2021-06-15 05:39:00',0,0,0,0,0,NULL,NULL,NULL,NULL),(61,'Sebastian','Melgarejo','sebastianmelga1@gmail.com','$2a$10$wEWg6qX5Q7zXv6gI.ONJEupEUxr.gdkvdkJ.9eTfHdH6y9gyJSL9C','2021-06-17 05:09:39',1,0,0,0,0,NULL,NULL,NULL,NULL),(64,'Patricia*','Verdun','patriciaverdun1@hotmail.com','$2a$10$DvNC0ibXtHmLYI9j7vLWv.k.YAxpizoJ2ZMraCQiU9yKzWUGWsHva','2021-06-17 05:19:37',0,0,0,0,0,NULL,NULL,NULL,NULL),(78,'Sergio*','Perez','sergiomarquez1@gmail.com','$2a$10$jEDDs5lkfzyX1Rtc5eoMqe8y6lszhnouQqRvRhnB/97EP..028Woe','2021-06-17 06:14:56',0,0,0,0,0,NULL,NULL,NULL,NULL),(79,'Oscar ','Ayala','oscarayala1@outlook.es','$2a$10$eMsHWzj3QXrH/Rqa00nsLuqzm3/IVpBvQx/lvPqqoQodaWBuyizMO','2021-06-17 06:15:10',0,0,0,0,0,NULL,NULL,NULL,NULL),(84,'Delsy','Gimenez','delsygimenez@gmail.com','$2a$10$ljGyj4a75Niwog6pzAE6A.ff95l4rhrLMEcy/PJ2PXR02X5lzFnkq','2021-06-17 06:29:53',0,0,0,0,0,NULL,'2021-06-17 17:50:39',NULL,NULL),(85,'Evelyn','Estigarribia','evelynestigab@gmail.com','$2a$10$fxf5H9EZIX3BDHzjtPCnd.yZY9ZaO848jj3yflWp.Tdms7/xGMSjC','2021-06-17 06:35:08',0,0,0,0,0,NULL,NULL,NULL,NULL),(86,'Guillermo','Sosa','guillersosa@gmail.com','$2a$10$SflG6t7CTMbuDwL5xvIqTeeQGEU8Pyn2zink5z8K7VnTBKexVDXaa','2021-06-17 06:36:24',0,0,0,0,0,NULL,NULL,NULL,NULL),(90,'juan','carlos ','juacarlos234@gmail.com','$2a$10$bDzvQlIxQCPbIrpyCE7lTOTR6klxQ2DRmFJPcx9T7ob51k64uLNqW','2021-06-17 17:08:11',0,0,0,0,0,NULL,NULL,NULL,NULL),(91,'Ricardo','Ferrer','ricardoferrer@gmail.com','$2a$10$a3KxgNf7aSw4L0XbI2U3zOuVabCBp9cyR0Ucf5ryJdUhua/cqNZEG','2021-06-17 17:15:24',0,0,0,0,0,NULL,NULL,NULL,NULL),(102,'pedro','pedro','pedro2@gmail.com','$2a$10$vrZDzTB.tpKo2StIof3ab.mLqKC/EU2kaBKFKM7p5myH5MOAnpWO2','2021-06-17 19:03:31',0,0,0,0,0,NULL,NULL,NULL,NULL),(103,'Pedro','pedro','pedro3@gmail.com','$2a$10$2WBuxmFXP6Q/XAH/y0YeLuA6mBKCjO1e1prgMCHb3UTJOHfDtQmVe','2021-06-17 19:03:43',0,0,0,0,0,NULL,NULL,NULL,NULL),(104,'pedro','pedro','pedro4@gmail.com','$2a$10$/g6P9oG9rN9vVwZSfQM0Z.kedVqID/F.rj3YnBoeRvqGXyZGnpTrG','2021-06-17 19:04:00',1,0,0,0,0,NULL,NULL,NULL,NULL),(105,'pedro','pedro','pedro5@gmail.com','$2a$10$cM0gLSjn4MOfQucSzC0WQekR65AtqDPoqbOr8sIbArwfbwdY5MMrG','2021-06-17 19:04:20',1,0,0,0,0,NULL,NULL,NULL,NULL),(132,'pedro','pedro','pedro7@gmail.com','$2a$10$gogFLBEBxeuJcznCn0/YqusIiWB3Qh3g7KF8ot2KkjCrz464KXtUm','2021-06-21 18:47:00',0,0,0,0,0,NULL,NULL,NULL,NULL),(133,'pedro','pedro','pedro8@gmail.com','$2a$10$Y1uK/76Q4SPqndriwFyzf.kPYiN5.KBYDtUA046HW4mKK5DG0FrAO','2021-06-21 18:51:35',0,0,0,0,0,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `tbl_users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-06-24  8:32:48