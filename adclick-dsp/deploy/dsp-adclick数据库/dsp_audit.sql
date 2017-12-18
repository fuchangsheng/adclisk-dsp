/*
Navicat MySQL Data Transfer

Source Server         : dsp-adclick
Source Server Version : 50173
Source Host           : 180.76.153.68:3306
Source Database       : dsp_audit

Target Server Type    : MYSQL
Target Server Version : 50173
File Encoding         : 65001

Date: 2017-02-28 15:40:39
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for audit_ideas
-- ----------------------------
DROP TABLE IF EXISTS `audit_ideas`;
CREATE TABLE `audit_ideas` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `idea_id` bigint(20) NOT NULL COMMENT '创意ID',
  `unit_id` bigint(20) NOT NULL COMMENT '单元ID',
  `plan_id` bigint(20) NOT NULL COMMENT '计划ID',
  `user_id` bigint(20) NOT NULL COMMENT '账户ID',
  `adx_id` bigint(20) NOT NULL COMMENT 'ADX ID',
  `adx_idea_id` varchar(1024) NOT NULL DEFAULT '' COMMENT 'ADX使用的创意ID',
  `signature` char(32) NOT NULL DEFAULT '' COMMENT '当前创意签名',
  `audit_status` int(11) NOT NULL COMMENT '审核状态',
  `failure_message` varchar(1024) NOT NULL DEFAULT '' COMMENT 'ADX返回的错误信息',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idea_id_adx_id` (`idea_id`,`adx_id`),
  KEY `idea_id` (`idea_id`),
  KEY `unit_id` (`unit_id`),
  KEY `plan_id` (`plan_id`),
  KEY `user_id` (`user_id`),
  KEY `adx_id` (`adx_id`),
  KEY `update_time` (`update_time`)
) ENGINE=InnoDB AUTO_INCREMENT=914 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for audit_users
-- ----------------------------
DROP TABLE IF EXISTS `audit_users`;
CREATE TABLE `audit_users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `user_id` bigint(20) NOT NULL COMMENT '账户ID',
  `adx_id` bigint(20) NOT NULL COMMENT 'ADX ID',
  `signature` char(32) NOT NULL DEFAULT '' COMMENT '当前用户信息签名',
  `audit_status` int(11) NOT NULL COMMENT '审核状态',
  `failure_message` varchar(1024) NOT NULL DEFAULT '' COMMENT 'ADX返回的错误信息',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id_adx_id` (`user_id`,`adx_id`),
  KEY `user_id` (`user_id`),
  KEY `adx_id` (`adx_id`),
  KEY `update_time` (`update_time`)
) ENGINE=InnoDB AUTO_INCREMENT=1083 DEFAULT CHARSET=utf8;
