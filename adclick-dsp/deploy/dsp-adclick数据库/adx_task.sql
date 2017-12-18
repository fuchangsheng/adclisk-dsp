/*
Navicat MySQL Data Transfer

Source Server         : dsp-adclick
Source Server Version : 50173
Source Host           : 180.76.153.68:3306
Source Database       : adx_task

Target Server Type    : MYSQL
Target Server Version : 50173
File Encoding         : 65001

Date: 2017-02-28 15:39:06
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for task
-- ----------------------------
DROP TABLE IF EXISTS `task`;
CREATE TABLE `task` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT,
  `task_type` varchar(255) NOT NULL COMMENT 'ä»»åŠ¡ç±»åž‹',
  `process_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT 'å¤„ç†è¯¥æ—¶é—´æ®µçš„æ—¥å¿—',
  `status` enum('SUCCESS','RUNNING','FAILED') NOT NULL COMMENT 'ä»»åŠ¡çŠ¶æ€',
  `job_id` varchar(255) NOT NULL DEFAULT '' COMMENT 'BRMä»»åŠ¡ID',
  `retry_times` int(11) NOT NULL DEFAULT '0' COMMENT 'é‡è¯•æ¬¡æ•°',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8;
