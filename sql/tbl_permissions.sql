CREATE TABLE `tbl_permissions` (
  `permissions_id` INT UNIQUE NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255),
  `desc` VARCHAR(255)
) ENGINE=InnoDB CHARSET=utf8;