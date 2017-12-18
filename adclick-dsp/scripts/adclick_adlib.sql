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
Source Database       : adclickdsp

 Target Server Version : 50621
 File Encoding         : utf-8

 Date: 06/05/2016 21:00:06 PM
*/
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';
SET FOREIGN_KEY_CHECKS=0;

DROP database `dsp_adlib`;
CREATE SCHEMA IF NOT EXISTS `dsp_adlib` DEFAULT CHARACTER SET utf8 ;
SHOW WARNINGS;
USE `dsp_adlib`;

-- Create syntax for TABLE 'assets'
CREATE TABLE IF NOT EXISTS `assets` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create syntax for TABLE 'ideas'
CREATE TABLE IF NOT EXISTS `ideas` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create syntax for TABLE 'idea_conversion'
CREATE TABLE IF NOT EXISTS `idea_conversion` (
  `idea_id` bigint(20) NOT NULL COMMENT '创意ID',
  `unit_id` bigint(20) NOT NULL COMMENT '单元ID',
  `plan_id` bigint(20) NOT NULL COMMENT '计划ID',
  `user_id` bigint(20) NOT NULL COMMENT '账户ID',
  `date` DATE NOT NULL COMMENT '转化日期',
  `conversion` int(11)  NOT NULL DEFAULT 0 COMMENT '转化数量',
  PRIMARY KEY (`idea_id`, `date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create syntax for TABLE 'idea_conversion'
CREATE TABLE IF NOT EXISTS `idea_conversion2` (
  `idea_id` bigint(20) NOT NULL COMMENT '创意ID',
  `unit_id` bigint(20) NOT NULL COMMENT '单元ID',
  `plan_id` bigint(20) NOT NULL COMMENT '计划ID',
  `user_id` bigint(20) NOT NULL COMMENT '账户ID',
  `date` DATE NOT NULL COMMENT '转化日期',
  `date_hour` DATETIME NOT NULL COMMENT '转化时间',
  `conversion` int(11)  NOT NULL DEFAULT 0 COMMENT '转化数量',
  `price` int(11)  NOT NULL DEFAULT 0 COMMENT 'cpa单价',
  PRIMARY KEY (`idea_id`, `date_hour`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create syntax for TABLE 'idea_price'
CREATE TABLE IF NOT EXISTS `idea_price` (
  `idea_id` bigint(20) NOT NULL COMMENT '创意ID',
  `type` int(11) NOT NULL COMMENT '价格类型',
  `price` int(11) NOT NULL COMMENT '账户ID',
  PRIMARY KEY (`idea_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create syntax for TABLE 'plans'
CREATE TABLE IF NOT EXISTS `plans` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create syntax for TABLE 'unit_targeting'
CREATE TABLE IF NOT EXISTS `unit_targeting` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Table structure for navtive_templates
CREATE TABLE IF NOT EXISTS `navtive_templates` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `template_id` bigint(20) NOT NULL COMMENT '模板ID',
  `space_name` varchar(255) NOT NULL COMMENT '广告位名称，信息',
  `denid_categorys` varchar(255) DEFAULT '' COMMENT '禁止投放行业',
  `detail` varchar(255) DEFAULT '' COMMENT '广告投放需要注意的事项，素材尺寸要求等',
  `example_img` varchar(255) NOT NULL COMMENT '广告位资源示意图url',
  `template_content` varchar(255) NOT NULL COMMENT '广告位模板需要的内容',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Table structure for targeting_templates
CREATE TABLE IF NOT EXISTS `targeting_templates` (
  `template_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '模板ID',
  `template_name` varchar(255) NOT NULL COMMENT '模板名',
  `user_id` bigint(20) NOT NULL COMMENT '账户ID',
  `tag` varchar(255) DEFAULT '' COMMENT '模板标签',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`template_id`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Table structure for targeting_template_contents
CREATE TABLE IF NOT EXISTS `targeting_template_contents` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `template_id` bigint(20) NOT NULL COMMENT '模板ID',
  `user_id` bigint(20) NOT NULL,
  `type` int(11) NOT NULL COMMENT '定向类型（详见广告库文档）',
  `content` longtext NOT NULL COMMENT '定向内容（详见广告库文档）',
  `status` int(11) NOT NULL COMMENT '定向状态（0为启用）',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create syntax for TABLE 'units'
CREATE TABLE IF NOT EXISTS `units` (
  `unit_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '单元ID',
  `plan_id` bigint(20) NOT NULL COMMENT '计划ID',
  `user_id` bigint(20) NOT NULL COMMENT '账户ID',
  `unit_name` varchar(255) NOT NULL DEFAULT '' COMMENT '单元名',
  `bid` int(11) NOT NULL COMMENT '出价',
  `adview_type` int(11) NOT NULL COMMENT '流量类型',
  `bid_type` int(11) NOT NULL COMMENT '计费方式，CPC、CPM',
  `unit_status` int(11) NOT NULL COMMENT '单元状态',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`unit_id`),
  KEY `plan_id` (`plan_id`),
  KEY `user_id` (`user_id`),
  KEY `update_time` (`update_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create syntax for TABLE 'users'
CREATE TABLE IF NOT EXISTS `users` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create syntax for TABLE 'keywords'
CREATE TABLE IF NOT EXISTS `keywords` (
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

CREATE TABLE IF NOT EXISTS `mgtv_channel_index`(
  `index_number` INT PRIMARY KEY, 
  `keyword` CHAR(100), 
  `enable` BOOL default TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `mgtv_category_index`(
  `index_number` INT PRIMARY KEY, 
  `keyword` CHAR(100), 
  `enable` BOOL default TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

GRANT ALL privileges ON adclickdsp.* TO dmtec@180.76.153.68 IDENTIFIED BY 'adclickZaq!2wsx';
SHOW WARNINGS;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

