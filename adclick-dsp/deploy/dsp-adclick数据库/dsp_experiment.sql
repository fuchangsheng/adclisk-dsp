/*
Navicat MySQL Data Transfer

Source Server         : dsp-adclick
Source Server Version : 50173
Source Host           : 180.76.153.68:3306
Source Database       : dsp_experiment

Target Server Type    : MYSQL
Target Server Version : 50173
File Encoding         : 65001

Date: 2017-02-28 15:41:57
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for exps
-- ----------------------------
DROP TABLE IF EXISTS `exps`;
CREATE TABLE `exps` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT,
  `layer_id` int(20) NOT NULL COMMENT '所属实验层ID',
  `percent` decimal(6,4) NOT NULL COMMENT '流量比例',
  `flags` text NOT NULL COMMENT '参数值',
  `status` int(11) NOT NULL COMMENT '实验状态',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for layers
-- ----------------------------
DROP TABLE IF EXISTS `layers`;
CREATE TABLE `layers` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL DEFAULT '' COMMENT '实验层名称',
  `type` varchar(256) NOT NULL DEFAULT '' COMMENT '实验流量类型',
  `status` int(11) NOT NULL COMMENT '实验层状态',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `name` (`name`(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
