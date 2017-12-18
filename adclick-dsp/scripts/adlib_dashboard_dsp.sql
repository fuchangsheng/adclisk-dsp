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
Source Database       : dsp_dashboard

 Target Server Version : 50621
 File Encoding         : utf-8

 Date: 06/05/2016 21:00:06 PM
*/
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';
SET FOREIGN_KEY_CHECKS=0;
# USE dsp_dashboard;
DROP database `dsp_dashboard`;
CREATE SCHEMA IF NOT EXISTS `dsp_dashboard` DEFAULT CHARACTER SET utf8 ;
SHOW WARNINGS;
USE `dsp_dashboard` ;

-- Create syntax for TABLE 'advertisers'
CREATE TABLE IF NOT EXISTS `advertisers` (
  `date` datetime NOT NULL COMMENT '时间',
  `id` bigint(20) NOT NULL COMMENT '广告主id',
  `request` bigint(20) NOT NULL,
  `bid` bigint(20) NOT NULL,
  `imp` bigint(20) NOT NULL,
  `click` bigint(20) NOT NULL,
  `cost` bigint(20) NOT NULL,
  `download` bigint(20) NOT NULL default 0 COMMENT '下载',
  `revenue` bigint(20) NOT NULL default 0 COMMENT '收入',
  `unit` int(11) NOT NULL default 3 COMMENT '时间粒度, 默认小时',
  PRIMARY KEY (`date`,`id`,`unit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `adplans`;
-- Create syntax for TABLE 'adplans'
CREATE TABLE IF NOT EXISTS `adplans` (
  `date` datetime NOT NULL COMMENT '时间',
  `id` bigint(20) NOT NULL COMMENT '广告主id',
  `plan_id` bigint(20) NOT NULL COMMENT '创意id',
  `request` bigint(20) NOT NULL,
  `bid` bigint(20) NOT NULL,
  `imp` bigint(20) NOT NULL,
  `click` bigint(20) NOT NULL,
  `cost` bigint(20) NOT NULL,
  `download` bigint(20) NOT NULL default 0 COMMENT '下载',
  `revenue` bigint(20) NOT NULL default 0 COMMENT '收入',
  `unit` int(11) NOT NULL default 3 COMMENT '时间粒度, 默认小时',
  PRIMARY KEY (`date`,`plan_id`,`unit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `adunits`;
-- Create syntax for TABLE 'adunits'
CREATE TABLE IF NOT EXISTS `adunits` (
  `date` datetime NOT NULL COMMENT '时间',
  `id` bigint(20) NOT NULL COMMENT '广告主id',
  `unit_id` bigint(20) NOT NULL COMMENT '创意id',
  `request` bigint(20) NOT NULL,
  `bid` bigint(20) NOT NULL,
  `imp` bigint(20) NOT NULL,
  `click` bigint(20) NOT NULL,
  `cost` bigint(20) NOT NULL,
  `download` bigint(20) NOT NULL default 0 COMMENT '下载',
  `revenue` bigint(20) NOT NULL default 0 COMMENT '收入',
  `unit` int(11) NOT NULL default 3 COMMENT '时间粒度, 默认小时',
  PRIMARY KEY (`date`,`unit_id`,`unit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `adideas`;
-- Create syntax for TABLE 'adideas'
CREATE TABLE IF NOT EXISTS `adideas` (
  `date` datetime NOT NULL COMMENT '时间',
  `id` bigint(20) NOT NULL COMMENT '广告主id',
  `idea_id` bigint(20) NOT NULL COMMENT '创意id',
  `request` bigint(20) NOT NULL,
  `bid` bigint(20) NOT NULL,
  `imp` bigint(20) NOT NULL,
  `click` bigint(20) NOT NULL,
  `cost` bigint(20) NOT NULL,
  `download` bigint(20) NOT NULL default 0 COMMENT '下载',
  `revenue` bigint(20) NOT NULL default 0 COMMENT '收入',
  `unit` int(11) NOT NULL default 3 COMMENT '时间粒度, 默认小时',
  PRIMARY KEY (`date`,`idea_id`,`unit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

GRANT ALL privileges ON adclickdsp.* TO dmtec@180.76.153.68 IDENTIFIED BY 'adclickZaq!2wsx';
SHOW WARNINGS;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
