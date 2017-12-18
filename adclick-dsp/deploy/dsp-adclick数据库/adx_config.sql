/*
Navicat MySQL Data Transfer

Source Server         : dsp-adclick
Source Server Version : 50173
Source Host           : 180.76.153.68:3306
Source Database       : adx_config

Target Server Type    : MYSQL
Target Server Version : 50173
File Encoding         : 65001

Date: 2017-02-28 15:13:52
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for adx_dsp_configs
-- ----------------------------
DROP TABLE IF EXISTS `adx_dsp_configs`;
CREATE TABLE `adx_dsp_configs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '' COMMENT 'DSPå',
  `status` int(11) NOT NULL COMMENT 'DSPçŠ¶æ€',
  `type` int(11) DEFAULT NULL COMMENT 'ä¹°æ–¹ç±»åž‹',
  `balance` int(11) DEFAULT NULL COMMENT 'è´¦æˆ·ä½™é¢',
  `qps` int(11) DEFAULT NULL COMMENT 'qps',
  `company` varchar(255) NOT NULL DEFAULT '' COMMENT 'å…¬å¸',
  `contact` varchar(255) NOT NULL DEFAULT '' COMMENT 'è”ç³»äºº',
  `phone` varchar(255) NOT NULL DEFAULT '' COMMENT 'ç”µè¯',
  `encryption_key` varchar(255) NOT NULL DEFAULT '' COMMENT 'å¯†é’¥',
  `integrity_key` varchar(255) NOT NULL DEFAULT '' COMMENT 'å¯†é’¥',
  `bidding_url` varchar(255) NOT NULL DEFAULT '' COMMENT 'ç«žä»·Url',
  `cookie_mapping_url` varchar(255) NOT NULL DEFAULT '' COMMENT 'Cookie Mapping Url',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for adx_dsp_pretargeting_groups
-- ----------------------------
DROP TABLE IF EXISTS `adx_dsp_pretargeting_groups`;
CREATE TABLE `adx_dsp_pretargeting_groups` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `group_name` varchar(255) DEFAULT NULL COMMENT 'ç»„å',
  `dsp_id` bigint(20) DEFAULT NULL COMMENT 'DSP ID',
  `status` int(11) DEFAULT NULL COMMENT 'Pretargetingç»„çŠ¶æ€',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for adx_dsp_pretargetings
-- ----------------------------
DROP TABLE IF EXISTS `adx_dsp_pretargetings`;
CREATE TABLE `adx_dsp_pretargetings` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `group_id` bigint(20) DEFAULT NULL COMMENT 'ç»„ID',
  `dsp_id` bigint(20) DEFAULT NULL COMMENT 'DSP ID',
  `status` int(11) DEFAULT NULL COMMENT 'PretargetingçŠ¶æ€',
  `type` int(11) DEFAULT NULL COMMENT 'å®šå‘ç±»åž‹',
  `content` longtext COMMENT 'å®šå‘å†…å®¹',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for adx_ssp_configs
-- ----------------------------
DROP TABLE IF EXISTS `adx_ssp_configs`;
CREATE TABLE `adx_ssp_configs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '' COMMENT 'SSPå',
  `status` int(11) NOT NULL COMMENT 'SSPçŠ¶æ€',
  `type` int(11) DEFAULT NULL COMMENT 'å–æ–¹ç±»åž‹',
  `company` varchar(255) NOT NULL DEFAULT '' COMMENT 'å…¬å¸',
  `contact` varchar(255) NOT NULL DEFAULT '' COMMENT 'è”ç³»äºº',
  `phone` varchar(255) NOT NULL DEFAULT '' COMMENT 'ç”µè¯',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for adx_ssp_prioritys
-- ----------------------------
DROP TABLE IF EXISTS `adx_ssp_prioritys`;
CREATE TABLE `adx_ssp_prioritys` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ssp_id` bigint(20) DEFAULT NULL COMMENT 'SSP ID',
  `dsp_id` bigint(20) DEFAULT NULL COMMENT 'DSP ID',
  `app_id` varchar(255) DEFAULT NULL COMMENT 'App ID',
  `slot_id` varchar(255) DEFAULT NULL COMMENT 'Slot ID',
  `priority` int(11) DEFAULT NULL COMMENT 'ä¼˜å…ˆçº§',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
