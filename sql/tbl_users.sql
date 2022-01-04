CREATE TABLE `tbl_users` (
  `user_id` INT UNIQUE AUTO_INCREMENT PRIMARY KEY, 
  `firstname` VARCHAR(255) NOT NULL, 
  `lastname` VARCHAR(255) NOT NULL, 
  `email` VARCHAR(255) NOT NULL UNIQUE, 
  `password` VARCHAR(255) NOT NULL, 
  `date_in` TIMESTAMP NOT NULL,
  `role_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  `active` TINYINT(1) NOT NULL DEFAULT 0,
  `blocked` TINYINT(1) NOT NULL DEFAULT 0,
  `attempts` INT NOT NULL DEFAULT 0, 
  `wait_until` BIGINT UNSIGNED,
  `last_login` TIMESTAMP DEFAULT NULL,
  `last_pass_changed` TIMESTAMP DEFAULT NULL,
  `last_remember` TIMESTAMP DEFAULT NULL
) ENGINE=InnoDB CHARSET=utf8;