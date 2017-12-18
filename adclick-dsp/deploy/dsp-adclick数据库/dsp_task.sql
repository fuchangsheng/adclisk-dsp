/*
Navicat MySQL Data Transfer

Source Server         : dsp-adclick
Source Server Version : 50173
Source Host           : 180.76.153.68:3306
Source Database       : dsp_task

Target Server Type    : MYSQL
Target Server Version : 50173
File Encoding         : 65001

Date: 2017-02-28 15:17:50
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for task
-- ----------------------------
DROP TABLE IF EXISTS `task`;
CREATE TABLE `task` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT,
  `task_type` varchar(255) NOT NULL COMMENT '任务类型',
  `process_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '处理该时间段的日志',
  `status` enum('SUCCESS','RUNNING','FAILED') NOT NULL COMMENT '任务状态',
  `job_id` varchar(255) NOT NULL DEFAULT '' COMMENT 'BRM任务ID',
  `retry_times` int(11) NOT NULL DEFAULT '0' COMMENT '重试次数',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18199 DEFAULT CHARSET=utf8;
