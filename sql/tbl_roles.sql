CREATE TABLE `tbl_roles` (
  `role_id` INT UNIQUE NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `desc` VARCHAR(255)
) ENGINE=InnoDB CHARSET=utf8;