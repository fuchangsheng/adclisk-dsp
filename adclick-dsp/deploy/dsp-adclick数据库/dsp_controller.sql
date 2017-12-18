/*
Navicat MySQL Data Transfer

Source Server         : dsp-adclick
Source Server Version : 50173
Source Host           : 180.76.153.68:3306
Source Database       : dsp_controller

Target Server Type    : MYSQL
Target Server Version : 50173
File Encoding         : 65001

Date: 2017-02-28 15:41:21
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for bidder_config
-- ----------------------------
DROP TABLE IF EXISTS `bidder_config`;
CREATE TABLE `bidder_config` (
  `id` int(11) unsigned NOT NULL,
  `config` text NOT NULL COMMENT 'JSON存储的设置项',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for bidders
-- ----------------------------
DROP TABLE IF EXISTS `bidders`;
CREATE TABLE `bidders` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `host` varchar(255) NOT NULL DEFAULT '' COMMENT '主机地址',
  `port` int(11) NOT NULL COMMENT '部署端口',
  `user` varchar(255) NOT NULL DEFAULT '' COMMENT '部署账户',
  `passwd` varchar(255) NOT NULL DEFAULT '' COMMENT '部署密码',
  `work_dir` varchar(255) NOT NULL DEFAULT '' COMMENT '部署目录',
  `failure_message` varchar(1024) NOT NULL DEFAULT '' COMMENT '错误信息',
  `bidder_status` int(11) NOT NULL COMMENT '服务状态',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for operation_history
-- ----------------------------
DROP TABLE IF EXISTS `operation_history`;
CREATE TABLE `operation_history` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `operation` varchar(256) NOT NULL DEFAULT '' COMMENT '操作',
  `target` varchar(1024) NOT NULL DEFAULT '' COMMENT '操作对象',
  `status` int(11) NOT NULL COMMENT '操作状态',
  `failure_message` varchar(1024) NOT NULL DEFAULT '' COMMENT '错误信息',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8;
