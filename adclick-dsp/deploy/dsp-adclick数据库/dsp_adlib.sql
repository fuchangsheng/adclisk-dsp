/*
Navicat MySQL Data Transfer

Source Server         : dsp-adclick
Source Server Version : 50173
Source Host           : 180.76.153.68:3306
Source Database       : dsp_adlib

Target Server Type    : MYSQL
Target Server Version : 50173
File Encoding         : 65001

Date: 2017-02-28 15:15:14
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for assets
-- ----------------------------
DROP TABLE IF EXISTS `assets`;
CREATE TABLE `assets` (
  `asset_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '素材ID',
  `user_id` bigint(20) NOT NULL COMMENT '账户ID',
  `asset_name` varchar(64) NOT NULL DEFAULT '' COMMENT '素材名',
  `url` varchar(128) NOT NULL DEFAULT '' COMMENT '素材',
  `thumbnail` varchar(128) DEFAULT '' COMMENT '缩略图',
  `width` int(11) unsigned NOT NULL COMMENT '宽度',
  `height` int(11) unsigned NOT NULL COMMENT '高度',
  `duration` int(11) unsigned DEFAULT NULL COMMENT '素材时长',
  `ratio` varchar(64) DEFAULT NULL COMMENT '素材长宽比',
  `asset_type` int(11) unsigned NOT NULL COMMENT '素材类型',
  `asset_tag` varchar(64) NOT NULL DEFAULT '' COMMENT '素材标签',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`asset_id`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for ideas
-- ----------------------------
DROP TABLE IF EXISTS `ideas`;
CREATE TABLE `ideas` (
  `idea_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '创意ID',
  `unit_id` bigint(20) NOT NULL COMMENT '单元ID',
  `plan_id` bigint(20) NOT NULL COMMENT '计划ID',
  `user_id` bigint(20) NOT NULL COMMENT '账户ID',
  `idea_name` varchar(255) NOT NULL DEFAULT '' COMMENT '创意名',
  `idea_slots` varchar(255) NOT NULL DEFAULT '' COMMENT '创意可投放的广告位类型',
  `idea_type` int(11) NOT NULL COMMENT '创意类型',
  `landing_page` varchar(1024) NOT NULL DEFAULT '' COMMENT '跳转地址',
  `assets` text NOT NULL COMMENT '物料',
  `adview_type` int(11) NOT NULL COMMENT '渠道类型',
  `idea_trade` varchar(255) NOT NULL COMMENT '创意行业',
  `idea_status` int(11) NOT NULL COMMENT '创意状态',
  `imp_monitor_urls` text NOT NULL COMMENT '展现监控地址，空格分隔，可多个',
  `click_monitor_urls` text NOT NULL COMMENT '点击监控地址，空格分隔，可多个',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idea_id`),
  KEY `unit_id` (`unit_id`),
  KEY `plan_id` (`plan_id`),
  KEY `user_id` (`user_id`),
  KEY `update_time` (`update_time`)
) ENGINE=InnoDB AUTO_INCREMENT=340 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for keywords
-- ----------------------------
DROP TABLE IF EXISTS `keywords`;
CREATE TABLE `keywords` (
  `keyword_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '关键词ID',
  `unit_id` bigint(20) NOT NULL COMMENT '单元ID',
  `plan_id` bigint(20) NOT NULL COMMENT '计划ID',
  `user_id` bigint(20) NOT NULL COMMENT '账户ID',
  `keyword` varchar(255) NOT NULL DEFAULT '' COMMENT '关键词',
  `match_type` int(11) NOT NULL COMMENT '匹配类型',
  `bid` int(11) NOT NULL COMMENT '出价',
  `landing_page` varchar(1024) NOT NULL DEFAULT '' COMMENT '跳转地址',
  `status` int(11) NOT NULL COMMENT '关键词状态',
  `imp_monitor_urls` text NOT NULL COMMENT '展现监控地址，空格分隔，可多个',
  `click_monitor_urls` text NOT NULL COMMENT '点击监控地址，空格分隔，可多个',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`keyword_id`),
  KEY `unit_id` (`unit_id`),
  KEY `plan_id` (`plan_id`),
  KEY `user_id` (`user_id`),
  KEY `update_time` (`update_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for plans
-- ----------------------------
DROP TABLE IF EXISTS `plans`;
CREATE TABLE `plans` (
  `plan_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '计划ID',
  `user_id` bigint(20) NOT NULL COMMENT '账户ID',
  `plan_name` varchar(255) NOT NULL DEFAULT '' COMMENT '计划名',
  `start_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '起始时间',
  `end_time` timestamp NOT NULL DEFAULT '2037-01-01 00:00:00' COMMENT '结束时间',
  `budget` int(11) NOT NULL DEFAULT '0' COMMENT '预算',
  `plan_cycle` varchar(128) NOT NULL DEFAULT '' COMMENT '推广时段',
  `plan_status` int(11) NOT NULL COMMENT '计划状态',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`plan_id`),
  KEY `user_id` (`user_id`),
  KEY `update_time` (`update_time`)
) ENGINE=InnoDB AUTO_INCREMENT=1000710 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for targeting_template_contents
-- ----------------------------
DROP TABLE IF EXISTS `targeting_template_contents`;
CREATE TABLE `targeting_template_contents` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `template_id` bigint(20) NOT NULL COMMENT '模板ID',
  `user_id` bigint(20) NOT NULL,
  `type` int(11) NOT NULL COMMENT '定向类型（详见广告库文档）',
  `content` longtext NOT NULL COMMENT '定向内容（详见广告库文档）',
  `status` int(11) NOT NULL COMMENT '定向状态（0为启用）',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=175 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for targeting_templates
-- ----------------------------
DROP TABLE IF EXISTS `targeting_templates`;
CREATE TABLE `targeting_templates` (
  `template_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '模板ID',
  `template_name` varchar(255) NOT NULL COMMENT '模板名',
  `user_id` bigint(20) NOT NULL COMMENT '账户ID',
  `tag` varchar(255) DEFAULT '' COMMENT '模板标签',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`template_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for unit_targeting
-- ----------------------------
DROP TABLE IF EXISTS `unit_targeting`;
CREATE TABLE `unit_targeting` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `unit_id` bigint(20) NOT NULL COMMENT '单元ID',
  `plan_id` bigint(20) NOT NULL COMMENT '计划ID',
  `user_id` bigint(20) NOT NULL COMMENT '账户ID',
  `type` int(11) NOT NULL COMMENT '定向类型（详见广告库文档）',
  `content` longtext NOT NULL COMMENT '定向内容（详见广告库文档）',
  `status` int(11) NOT NULL COMMENT '定向状态（0为启用）',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unit_id_type` (`unit_id`,`type`),
  KEY `update_time` (`update_time`)
) ENGINE=InnoDB AUTO_INCREMENT=99501608 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for units
-- ----------------------------
DROP TABLE IF EXISTS `units`;
CREATE TABLE `units` (
  `unit_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '单元ID',
  `plan_id` bigint(20) NOT NULL COMMENT '计划ID',
  `user_id` bigint(20) NOT NULL COMMENT '账户ID',
  `unit_name` varchar(255) NOT NULL DEFAULT '' COMMENT '单元名',
  `bid` int(11) NOT NULL COMMENT '出价',
  `bid_type` int(11) NOT NULL COMMENT '计费方式，CPC、CPM',
  `unit_status` int(11) NOT NULL COMMENT '单元状态',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`unit_id`),
  KEY `plan_id` (`plan_id`),
  KEY `user_id` (`user_id`),
  KEY `update_time` (`update_time`)
) ENGINE=InnoDB AUTO_INCREMENT=100512 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '账户ID',
  `user_name` varchar(255) NOT NULL DEFAULT '' COMMENT '账户名',
  `balance` bigint(20) NOT NULL DEFAULT '0' COMMENT '账户余额',
  `qualification_name` varchar(255) NOT NULL DEFAULT '' COMMENT '账户资质',
  `site_name` varchar(255) NOT NULL DEFAULT '' COMMENT '主站名',
  `site_url` varchar(1024) NOT NULL DEFAULT '' COMMENT '主站地址',
  `user_status` int(11) NOT NULL COMMENT '状态',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  KEY `update_time` (`update_time`)
) ENGINE=InnoDB AUTO_INCREMENT=98657142 DEFAULT CHARSET=utf8;
