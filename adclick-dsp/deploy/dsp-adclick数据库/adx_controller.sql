/*
Navicat MySQL Data Transfer

Source Server         : dsp-adclick
Source Server Version : 50173
Source Host           : 180.76.153.68:3306
Source Database       : adx_controller

Target Server Type    : MYSQL
Target Server Version : 50173
File Encoding         : 65001

Date: 2017-02-28 15:37:55
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for exchanger_config
-- ----------------------------
DROP TABLE IF EXISTS `exchanger_config`;
CREATE TABLE `exchanger_config` (
  `id` int(11) unsigned NOT NULL,
  `config` text NOT NULL COMMENT 'JSONå­˜å‚¨çš„è®¾ç½®é¡¹',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for exchangers
-- ----------------------------
DROP TABLE IF EXISTS `exchangers`;
CREATE TABLE `exchangers` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'è‡ªå¢žID',
  `host` varchar(255) NOT NULL DEFAULT '' COMMENT 'ä¸»æœºåœ°å€',
  `port` int(11) NOT NULL COMMENT 'éƒ¨ç½²ç«¯å£',
  `user` varchar(255) NOT NULL DEFAULT '' COMMENT 'éƒ¨ç½²è´¦æˆ·',
  `passwd` varchar(255) NOT NULL DEFAULT '' COMMENT 'éƒ¨ç½²å¯†ç ',
  `work_dir` varchar(255) NOT NULL DEFAULT '' COMMENT 'éƒ¨ç½²ç›®å½•',
  `failure_message` varchar(1024) NOT NULL DEFAULT '' COMMENT 'é”™è¯¯ä¿¡æ¯',
  `bidder_status` int(11) NOT NULL COMMENT 'æœåŠ¡çŠ¶æ€',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for operation_history
-- ----------------------------
DROP TABLE IF EXISTS `operation_history`;
CREATE TABLE `operation_history` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'è‡ªå¢žID',
  `operation` varchar(256) NOT NULL DEFAULT '' COMMENT 'æ“ä½œ',
  `target` varchar(1024) NOT NULL DEFAULT '' COMMENT 'æ“ä½œå¯¹è±¡',
  `status` int(11) NOT NULL COMMENT 'æ“ä½œçŠ¶æ€',
  `failure_message` varchar(1024) NOT NULL DEFAULT '' COMMENT 'é”™è¯¯ä¿¡æ¯',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
