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
Source Database       : dsp_audit

 Target Server Version : 50621
 File Encoding         : utf-8

 Date: 06/05/2016 21:00:06 PM
*/
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';
SET FOREIGN_KEY_CHECKS=0;

DROP database `dsp_audit`;
CREATE SCHEMA IF NOT EXISTS `dsp_audit` DEFAULT CHARACTER SET utf8 ;
SHOW WARNINGS;
USE `dsp_audit` ;

-- Create syntax for TABLE 'audit_ideas'
CREATE TABLE IF NOT EXISTS `audit_ideas` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create syntax for TABLE 'audit_users'
CREATE TABLE IF NOT EXISTS `audit_users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `user_id` bigint(20) NOT NULL COMMENT '账户ID',
  `adx_id` bigint(20) NOT NULL COMMENT 'ADX ID',
  `adx_user_id` bigint(20) NOT NULL DEFAULT 0 COMMENT 'ADX使用的用户ID',
  `adx_qual_id` bigint(20) NOT NULL DEFAULT 0 COMMENT 'ADX使用的资质ID',
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

GRANT ALL privileges ON adclickdsp.* TO dmtec@180.76.153.68 IDENTIFIED BY 'adclickZaq!2wsx';
SHOW WARNINGS;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;