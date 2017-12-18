/*
Navicat MySQL Data Transfer

Source Server         : dsp-adclick
Source Server Version : 50173
Source Host           : 180.76.153.68:3306
Source Database       : adx_dashboard

Target Server Type    : MYSQL
Target Server Version : 50173
File Encoding         : 65001

Date: 2017-02-28 15:38:12
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for dsps
-- ----------------------------
DROP TABLE IF EXISTS `dsps`;
CREATE TABLE `dsps` (
  `date` datetime NOT NULL,
  `dspId` bigint(20) NOT NULL DEFAULT '0',
  `request` bigint(20) DEFAULT '0',
  `bid` bigint(20) DEFAULT '0',
  `win` bigint(20) DEFAULT '0',
  `imp` bigint(20) DEFAULT '0',
  `click` bigint(20) DEFAULT '0',
  `cost` bigint(20) DEFAULT '0',
  PRIMARY KEY (`date`,`dspId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for exps
-- ----------------------------
DROP TABLE IF EXISTS `exps`;
CREATE TABLE `exps` (
  `date` datetime NOT NULL COMMENT 'æ—¥æœŸ',
  `exp_id` int(20) NOT NULL COMMENT 'å®žéªŒID',
  `request` bigint(20) NOT NULL,
  `fill` bigint(20) NOT NULL,
  `imp` bigint(20) NOT NULL,
  `click` bigint(20) NOT NULL,
  `cost` bigint(20) NOT NULL,
  PRIMARY KEY (`date`,`exp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for overview
-- ----------------------------
DROP TABLE IF EXISTS `overview`;
CREATE TABLE `overview` (
  `date` datetime NOT NULL,
  `request` bigint(20) DEFAULT '0',
  `fill` bigint(20) DEFAULT '0',
  `imp` bigint(20) DEFAULT '0',
  `click` bigint(20) DEFAULT '0',
  `cost` bigint(20) DEFAULT '0',
  PRIMARY KEY (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for ssps
-- ----------------------------
DROP TABLE IF EXISTS `ssps`;
CREATE TABLE `ssps` (
  `date` datetime NOT NULL,
  `sspId` bigint(20) NOT NULL DEFAULT '0',
  `request` bigint(20) DEFAULT '0',
  `fill` bigint(20) DEFAULT '0',
  `imp` bigint(20) DEFAULT '0',
  `click` bigint(20) DEFAULT '0',
  `cost` bigint(20) DEFAULT '0',
  PRIMARY KEY (`date`,`sspId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
