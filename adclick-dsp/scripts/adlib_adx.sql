/*
 * copyright@dmtec.cn reserved, 2016
 * history:
 * 2016.10.30, created by zhouyaowei
 *  
 */
/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50621
Source Host           : localhost:3306
Source Database       : dsp_adx

 Target Server Version : 50621
 File Encoding         : utf-8

 Date: 06/05/2016 21:00:06 PM
*/
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';
SET FOREIGN_KEY_CHECKS=0;

DROP database `dsp_adx`;
CREATE SCHEMA IF NOT EXISTS `dsp_adx` DEFAULT CHARACTER SET utf8 ;
SHOW WARNINGS;
USE `dsp_adx` ;

# USE dsp_adx;

-- Create syntax for TABLE 'adx_configs'
CREATE TABLE IF NOT EXISTS `adx_configs` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT '' COMMENT 'ADX鍚�',
  `config` text NOT NULL COMMENT 'JSON瀛樺偍鐨刟dx閰嶇疆',
  `status` int(11) NOT NULL COMMENT 'ADX鐘舵��',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

GRANT ALL privileges ON adclickdsp.* TO dmtec@180.76.153.68 IDENTIFIED BY 'adclickZaq!2wsx';
SHOW WARNINGS;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;