/*
Navicat MySQL Data Transfer

Source Server         : dsp-adclick
Source Server Version : 50173
Source Host           : 180.76.153.68:3306
Source Database       : dsp_dashboard

Target Server Type    : MYSQL
Target Server Version : 50173
File Encoding         : 65001

Date: 2017-02-28 15:12:54
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for adideas
-- ----------------------------
DROP TABLE IF EXISTS `adideas`;
CREATE TABLE `adideas` (
  `date` datetime NOT NULL COMMENT '时间',
  `id` bigint(20) NOT NULL COMMENT '广告主id',
  `idea_id` bigint(20) NOT NULL COMMENT '创意id',
  `request` bigint(20) NOT NULL,
  `bid` bigint(20) NOT NULL,
  `imp` bigint(20) NOT NULL,
  `click` bigint(20) NOT NULL,
  `cost` bigint(20) NOT NULL,
  `download` bigint(20) NOT NULL DEFAULT '0' COMMENT '下载',
  `revenue` bigint(20) NOT NULL DEFAULT '0' COMMENT '收入',
  `unit` int(11) NOT NULL DEFAULT '3' COMMENT '时间粒度, 默认小时',
  PRIMARY KEY (`date`,`idea_id`,`unit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for adplans
-- ----------------------------
DROP TABLE IF EXISTS `adplans`;
CREATE TABLE `adplans` (
  `date` datetime NOT NULL COMMENT '时间',
  `id` bigint(20) NOT NULL COMMENT '广告主id',
  `plan_id` bigint(20) NOT NULL COMMENT '创意id',
  `request` bigint(20) NOT NULL,
  `bid` bigint(20) NOT NULL,
  `imp` bigint(20) NOT NULL,
  `click` bigint(20) NOT NULL,
  `cost` bigint(20) NOT NULL,
  `download` bigint(20) NOT NULL DEFAULT '0' COMMENT '下载',
  `revenue` bigint(20) NOT NULL DEFAULT '0' COMMENT '收入',
  `unit` int(11) NOT NULL DEFAULT '3' COMMENT '时间粒度, 默认小时',
  PRIMARY KEY (`date`,`plan_id`,`unit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for adunits
-- ----------------------------
DROP TABLE IF EXISTS `adunits`;
CREATE TABLE `adunits` (
  `date` datetime NOT NULL COMMENT '时间',
  `id` bigint(20) NOT NULL COMMENT '广告主id',
  `unit_id` bigint(20) NOT NULL COMMENT '创意id',
  `request` bigint(20) NOT NULL,
  `bid` bigint(20) NOT NULL,
  `imp` bigint(20) NOT NULL,
  `click` bigint(20) NOT NULL,
  `cost` bigint(20) NOT NULL,
  `download` bigint(20) NOT NULL DEFAULT '0' COMMENT '下载',
  `revenue` bigint(20) NOT NULL DEFAULT '0' COMMENT '收入',
  `unit` int(11) NOT NULL DEFAULT '3' COMMENT '时间粒度, 默认小时',
  PRIMARY KEY (`date`,`unit_id`,`unit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for advertisers
-- ----------------------------
DROP TABLE IF EXISTS `advertisers`;
CREATE TABLE `advertisers` (
  `date` datetime NOT NULL COMMENT '时间',
  `id` bigint(20) NOT NULL COMMENT '广告主id',
  `request` bigint(20) NOT NULL,
  `bid` bigint(20) NOT NULL,
  `imp` bigint(20) NOT NULL,
  `click` bigint(20) NOT NULL,
  `cost` bigint(20) NOT NULL,
  `download` bigint(20) NOT NULL DEFAULT '0' COMMENT '下载',
  `revenue` bigint(20) NOT NULL DEFAULT '0' COMMENT '收入',
  `unit` int(11) NOT NULL DEFAULT '3' COMMENT '时间粒度, 默认小时',
  PRIMARY KEY (`date`,`id`,`unit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for adviews
-- ----------------------------
DROP TABLE IF EXISTS `adviews`;
CREATE TABLE `adviews` (
  `date` datetime NOT NULL COMMENT '时间',
  `adview` int(11) NOT NULL COMMENT '流量类型',
  `request` bigint(20) NOT NULL,
  `bid` bigint(20) NOT NULL,
  `imp` bigint(20) NOT NULL,
  `click` bigint(20) NOT NULL,
  `cost` bigint(20) NOT NULL,
  `download` bigint(20) NOT NULL DEFAULT '0' COMMENT '下载',
  `revenue` bigint(20) NOT NULL DEFAULT '0' COMMENT '收入',
  PRIMARY KEY (`date`,`adview`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for adxs
-- ----------------------------
DROP TABLE IF EXISTS `adxs`;
CREATE TABLE `adxs` (
  `date` datetime NOT NULL COMMENT '日期',
  `adx` int(11) NOT NULL COMMENT 'ADX ID',
  `request` bigint(20) NOT NULL,
  `bid` bigint(20) NOT NULL,
  `imp` bigint(20) NOT NULL,
  `click` bigint(20) NOT NULL,
  `cost` bigint(20) NOT NULL,
  `download` bigint(20) NOT NULL DEFAULT '0' COMMENT '下载',
  `revenue` bigint(20) NOT NULL DEFAULT '0' COMMENT '收入',
  PRIMARY KEY (`date`,`adx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for creative_types
-- ----------------------------
DROP TABLE IF EXISTS `creative_types`;
CREATE TABLE `creative_types` (
  `date` datetime NOT NULL COMMENT '时间',
  `creative_type` int(11) NOT NULL COMMENT '创意类型',
  `request` bigint(20) NOT NULL,
  `bid` bigint(20) NOT NULL,
  `imp` bigint(20) NOT NULL,
  `click` bigint(20) NOT NULL,
  `cost` bigint(20) NOT NULL,
  `download` bigint(20) NOT NULL DEFAULT '0' COMMENT '下载',
  `revenue` bigint(20) NOT NULL DEFAULT '0' COMMENT '收入',
  PRIMARY KEY (`date`,`creative_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for exps
-- ----------------------------
DROP TABLE IF EXISTS `exps`;
CREATE TABLE `exps` (
  `date` datetime NOT NULL COMMENT '日期',
  `exp_id` int(20) NOT NULL COMMENT '实验ID',
  `request` bigint(20) NOT NULL,
  `bid` bigint(20) NOT NULL,
  `imp` bigint(20) NOT NULL,
  `click` bigint(20) NOT NULL,
  `cost` bigint(20) NOT NULL,
  `download` bigint(20) NOT NULL DEFAULT '0' COMMENT '下载',
  `revenue` bigint(20) NOT NULL DEFAULT '0' COMMENT '收入',
  PRIMARY KEY (`date`,`exp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for overview
-- ----------------------------
DROP TABLE IF EXISTS `overview`;
CREATE TABLE `overview` (
  `date` datetime NOT NULL COMMENT '时间',
  `request` bigint(20) NOT NULL,
  `bid` bigint(20) NOT NULL,
  `imp` bigint(20) NOT NULL,
  `click` bigint(20) NOT NULL,
  `cost` bigint(20) NOT NULL,
  `download` bigint(20) NOT NULL DEFAULT '0' COMMENT '下载',
  `revenue` bigint(20) NOT NULL DEFAULT '0' COMMENT '收入',
  PRIMARY KEY (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for regions
-- ----------------------------
DROP TABLE IF EXISTS `regions`;
CREATE TABLE `regions` (
  `date` datetime NOT NULL COMMENT '时间',
  `prov` varchar(255) NOT NULL COMMENT '省份',
  `city` varchar(255) NOT NULL COMMENT '城市',
  `request` bigint(20) NOT NULL,
  `bid` bigint(20) NOT NULL,
  `imp` bigint(20) NOT NULL,
  `click` bigint(20) NOT NULL,
  `cost` bigint(20) NOT NULL,
  `download` bigint(20) NOT NULL DEFAULT '0' COMMENT '下载',
  `revenue` bigint(20) NOT NULL DEFAULT '0' COMMENT '收入',
  PRIMARY KEY (`date`,`prov`,`city`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for sites
-- ----------------------------
DROP TABLE IF EXISTS `sites`;
CREATE TABLE `sites` (
  `date` datetime NOT NULL COMMENT '日期',
  `site` varchar(128) NOT NULL DEFAULT '' COMMENT '站点',
  `request` bigint(20) NOT NULL,
  `bid` bigint(20) NOT NULL,
  `imp` bigint(20) NOT NULL,
  `click` bigint(20) NOT NULL,
  `cost` bigint(20) NOT NULL,
  `download` bigint(20) NOT NULL DEFAULT '0' COMMENT '下载',
  `revenue` bigint(20) NOT NULL DEFAULT '0' COMMENT '收入',
  PRIMARY KEY (`date`,`site`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
