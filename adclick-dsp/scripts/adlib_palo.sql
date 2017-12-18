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
Source Database       : dsp_palo

 Target Server Version : 50621
 File Encoding         : utf-8

 Date: 06/05/2016 21:00:06 PM
*/
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';
SET FOREIGN_KEY_CHECKS=0;

DROP database `dsp_palo`;
CREATE SCHEMA IF NOT EXISTS `dsp_palo` DEFAULT CHARACTER SET utf8 ;
SHOW WARNINGS;
USE `dsp_palo` 

DROP TABLE IF EXISTS `dsp_daily_info`;
CREATE TABLE `dsp_daily_info` (
  `date` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
  `user_id` bigint(64)  NOT NULL  COMMENT '广告主ID',
  `plan_id` bigint(64)  NOT NULL  COMMENT '广告主ID',
  `unit_id` bigint(64)  NOT NULL  COMMENT '广告主ID',
  `idea_id` bigint(64)  NOT NULL  COMMENT '广告主ID',
  `ad_bid_type` int(11) DEFAULT 0 COMMENT '广告主行业分类',
  `adx` int(11) DEFAULT 0 COMMENT '广告主行业分类',
  `creative_type` int(11) DEFAULT 0 COMMENT '广告主行业分类',
  `adview_type` int(11) DEFAULT 0 COMMENT '广告主行业分类',
  `prov` VARCHAR(32) DEFAULT NULL COMMENT '广告主名',
  `city` VARCHAR(32) DEFAULT NULL COMMENT '广告主公司名',
  `site` VARCHAR(128) DEFAULT NULL COMMENT '公司执照',
  `request` bigint(64) DEFAULT 0 COMMENT '广告主行业分类',
  `bid` bigint(64) DEFAULT 0 COMMENT '广告主行业分类',
  `imp` bigint(64) DEFAULT 0 COMMENT '广告主行业分类',
  `click` bigint(64) DEFAULT 0 COMMENT '广告主行业分类',
  `download` bigint(64) DEFAULT 0 COMMENT '广告主行业分类',
  `cost` bigint(64) DEFAULT 0 COMMENT '广告主行业分类',
  `revenue` bigint(64) DEFAULT 0 COMMENT '广告主行业分类',
  PRIMARY KEY (`date`, `user_id`, `plan_id`, `unit_id`, `idea_id`, `ad_bid_type`, `adx`, `creative_type`,`adview_type`,`prov`,`city`,`site`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='广告主信息表';

GRANT ALL privileges ON adclickdsp.* TO dmtec@180.76.153.68 IDENTIFIED BY 'adclickZaq!2wsx';
SHOW WARNINGS;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;