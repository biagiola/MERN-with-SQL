CREATE TABLE `tbl_circuits` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_provider` int(10) unsigned NOT NULL COMMENT '//ID Proveedor',
  `name` varchar(50) NOT NULL,
  `identifier` varchar(150) DEFAULT NULL COMMENT '//Número de Circuito',
  `host` varchar(50) DEFAULT NULL COMMENT '//IP-Dominio de Trunks asociados',
  `port` varchar(50) DEFAULT NULL COMMENT '//SIP puerto asociado',
  `date_in` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '//Fecha Alta',
  `date_out` datetime DEFAULT NULL COMMENT '//Fecha Baja',
  `description` text COMMENT '//Descripcion',
  `active` tinyint(3) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB CHARSET=utf8;
