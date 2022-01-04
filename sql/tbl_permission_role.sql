CREATE TABLE `tbl_permission_role` (
  `permission_id` INT UNIQUE NOT NULL,
  `role_id` INT NOT NULL,
  FOREIGN KEY (role_id) REFERENCES `tbl_roles` (role_id)
) ENGINE=InnoDB CHARSET=utf8;