/*
 * copyright@dmtec.cn reserved, 2017
 * history:
 * 2017.05.29, created by zhouyaowei
 *  
 */
/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50621
Source Host           : localhost:3306
Source Database       : adlib_tags

 Target Server Version : 50621
 File Encoding         : utf-8

 Date: 29/05/2017 21:00:06 PM
*/
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';
SET FOREIGN_KEY_CHECKS=0;

DROP database `adlib_tags`;
CREATE SCHEMA IF NOT EXISTS `adlib_tags` DEFAULT CHARACTER SET utf8 ;
SHOW WARNINGS;
USE `adlib_tags`;

-- Create syntax for TABLE 'assets'
CREATE TABLE IF NOT EXISTS `ad_tags` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'tag id',
  `categories` varchar(32) NOT NULL COMMENT '一级分类',
  `sub_categories` varchar(32) NOT NULL COMMENT '二级分类',
  `code` int(11) NOT NULL COMMENT '一级代码',
  `sub_code` int(11) NOT NULL COMMENT '二级代码',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `status` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


GRANT ALL privileges ON adlib_tags.* TO dmtec@180.76.153.68 IDENTIFIED BY 'adclickZaq!2wsx';
SHOW WARNINGS;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

