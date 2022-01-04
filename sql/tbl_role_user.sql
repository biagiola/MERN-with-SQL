CREATE TABLE `tbl_role_user` (
  `role_id` INT NOT NULL, 
  `user_id` INT UNIQUE NOT NULL, 
  FOREIGN KEY (user_id) REFERENCES `tbl_users` (user_id)
) ENGINE=InnoDB CHARSET=utf8;