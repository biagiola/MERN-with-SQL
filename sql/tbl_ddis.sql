CREATE TABLE `tbl_ddis` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `id_provider` int(10) unsigned NOT NULL COMMENT '//id proveedor tbl_providers',
  `id_circuit` varchar(50) NOT NULL COMMENT '//Circuito en el que se provisiona',
  `ddis` varchar(50) NOT NULL COMMENT '//Numeración',
  `ddis_associated` varchar(50) DEFAULT NULL COMMENT '//Número asociado',
  `date_in` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '//Fecha de alta de la numeración',
  `date_out` datetime DEFAULT NULL COMMENT '//Fecha de baja de la numeración',
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_provider`) REFERENCES tbl_providers(`id`)
) ENGINE=InnoDB CHARSET=utf8;