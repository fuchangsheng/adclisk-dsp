/*
Navicat MySQL Data Transfer

Source Server         : dsp-adclick
Source Server Version : 50173
Source Host           : 180.76.153.68:3306
Source Database       : adclick_dsp_mgr

Target Server Type    : MYSQL
Target Server Version : 50173
File Encoding         : 65001

Date: 2017-02-28 15:11:30
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for sessions
-- ----------------------------
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `session_id` varchar(128) NOT NULL,
  `expires` int(11) NOT NULL,
  `data` text,
  PRIMARY KEY (`session_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for tb_administrator
-- ----------------------------
DROP TABLE IF EXISTS `tb_administrator`;
CREATE TABLE `tb_administrator` (
  `id` int(11) NOT NULL COMMENT '管理员ID',
  `name` varchar(64) NOT NULL COMMENT '管理员名',
  `password` varchar(64) NOT NULL COMMENT '密码',
  `phone` varchar(64) NOT NULL COMMENT '联系电话',
  `email` varchar(64) NOT NULL COMMENT '邮箱',
  `role` int(11) NOT NULL COMMENT '权限，0-操作员，1-管理员',
  `status` int(11) DEFAULT '1' COMMENT '记录状态，0-有效，其它无效',
  `create_time` datetime NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
  `update_time` datetime NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT 'update日期',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='管理员信息表';

-- ----------------------------
-- Table structure for tb_audit_ideas
-- ----------------------------
DROP TABLE IF EXISTS `tb_audit_ideas`;
CREATE TABLE `tb_audit_ideas` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `idea_id` bigint(20) NOT NULL COMMENT '创意ID',
  `unit_id` bigint(20) NOT NULL COMMENT '单元ID',
  `plan_id` bigint(20) NOT NULL COMMENT '计划ID',
  `user_id` bigint(20) NOT NULL COMMENT '账户ID',
  `mgr_id` bigint(20) NOT NULL COMMENT 'mgr ID',
  `signature` char(32) NOT NULL DEFAULT '' COMMENT '当前创意签名',
  `audit_status` int(11) NOT NULL COMMENT '审核状态',
  `failure_message` varchar(1024) NOT NULL DEFAULT '' COMMENT 'audit返回的错误信息',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idea_id` (`idea_id`),
  KEY `unit_id` (`unit_id`),
  KEY `plan_id` (`plan_id`),
  KEY `user_id` (`user_id`),
  KEY `mgr_id` (`mgr_id`),
  KEY `update_time` (`update_time`)
) ENGINE=InnoDB AUTO_INCREMENT=338 DEFAULT CHARSET=utf8 COMMENT='管理系统创意审计表';

-- ----------------------------
-- Table structure for tb_audit_log
-- ----------------------------
DROP TABLE IF EXISTS `tb_audit_log`;
CREATE TABLE `tb_audit_log` (
  `id` varchar(64) NOT NULL COMMENT '记录id',
  `mgr_id` varchar(64) NOT NULL COMMENT '操作人员id',
  `level` int(11) NOT NULL DEFAULT '0' COMMENT '等级',
  `type` int(11) NOT NULL DEFAULT '0' COMMENT '类型',
  `content` longtext COMMENT '操作内容',
  `create_time` datetime NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
  PRIMARY KEY (`id`),
  KEY `audit_log_mgr_id` (`mgr_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='审计记录表';

-- ----------------------------
-- Table structure for tb_email_verify_log
-- ----------------------------
DROP TABLE IF EXISTS `tb_email_verify_log`;
CREATE TABLE `tb_email_verify_log` (
  `id` varchar(64) NOT NULL COMMENT '记录id',
  `email` varchar(64) DEFAULT NULL COMMENT 'email',
  `token` varchar(128) DEFAULT NULL COMMENT '验证码值',
  `type` int(11) DEFAULT '1' COMMENT '业务类型，1-邮件消息接收人',
  `status` int(11) DEFAULT '1' COMMENT '0-验证通过，1-创建，2-已发送，3-验证失败',
  `create_time` datetime NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
  `update_time` datetime NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT 'update日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='验证码记录表';

-- ----------------------------
-- Table structure for tb_messages
-- ----------------------------
DROP TABLE IF EXISTS `tb_messages`;
CREATE TABLE `tb_messages` (
  `msg_id` varchar(64) NOT NULL COMMENT '记录id',
  `categories` int(11) NOT NULL DEFAULT '0' COMMENT '0-系统消息，1-审核消息，2-账户消息，3-财务消息',
  `subcategories` int(11) NOT NULL DEFAULT '0' COMMENT '消息子类型',
  `title` varchar(64) DEFAULT NULL COMMENT '消息头',
  `content` longtext COMMENT '消息内容',
  `create_time` datetime NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
  PRIMARY KEY (`msg_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='消息信息表';

-- ----------------------------
-- Table structure for tb_notify_log
-- ----------------------------
DROP TABLE IF EXISTS `tb_notify_log`;
CREATE TABLE `tb_notify_log` (
  `id` varchar(64) NOT NULL COMMENT '记录id',
  `msg_id` varchar(64) NOT NULL COMMENT '消息id',
  `receiver` varchar(64) DEFAULT NULL COMMENT 'email, mobile,',
  `type` int(11) NOT NULL DEFAULT '0' COMMENT '0-站内信,1-sms,2-email',
  `notify_status` int(11) NOT NULL DEFAULT '1' COMMENT '0-已读，其他未读，对于email和sms0-成功，',
  `create_time` datetime NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
  `update_time` datetime NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT 'update日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='消息通知记录表';

-- ----------------------------
-- Table structure for tb_notify_receivers
-- ----------------------------
DROP TABLE IF EXISTS `tb_notify_receivers`;
CREATE TABLE `tb_notify_receivers` (
  `id` varchar(64) NOT NULL COMMENT '记录id',
  `type` int(11) NOT NULL DEFAULT '0' COMMENT '0-email,1-sms',
  `receiver` varchar(64) DEFAULT NULL COMMENT 'email or mobile value',
  `audit_status` int(11) NOT NULL DEFAULT '1' COMMENT ' 0-success, 1-verifying,2-failed',
  `create_time` datetime NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
  `update_time` datetime NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT 'update日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='消息接受人员表';

-- ----------------------------
-- Table structure for tb_sms_log
-- ----------------------------
DROP TABLE IF EXISTS `tb_sms_log`;
CREATE TABLE `tb_sms_log` (
  `mobile` varchar(16) NOT NULL DEFAULT '' COMMENT '手机号',
  `smscode` varchar(8) DEFAULT NULL COMMENT '短信验证码',
  `status` int(11) NOT NULL DEFAULT '0' COMMENT '0-验证通过，1-已发送未验证，2-验证失败',
  `create_time` datetime NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
  `update_time` datetime NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT 'update日期',
  PRIMARY KEY (`mobile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='短信验证码表';

-- ----------------------------
-- Table structure for tb_verify_code_log
-- ----------------------------
DROP TABLE IF EXISTS `tb_verify_code_log`;
CREATE TABLE `tb_verify_code_log` (
  `code_name` varchar(64) NOT NULL DEFAULT '' COMMENT '验证码名',
  `code_value` varchar(64) DEFAULT NULL COMMENT '验证码值',
  `status` int(11) DEFAULT '1' COMMENT '0-验证通过，1-创建，2-已发送，3-验证失败',
  `create_time` datetime NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
  PRIMARY KEY (`code_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='验证码记录表';

-- ----------------------------
-- View structure for v_msg_query
-- ----------------------------
DROP VIEW IF EXISTS `v_msg_query`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_msg_query` AS select `m`.`msg_id` AS `msg_id`,`m`.`categories` AS `categories`,`m`.`subcategories` AS `subcategories`,`m`.`title` AS `title`,`m`.`content` AS `content`,`n`.`receiver` AS `receiver`,`n`.`notify_status` AS `notify_status`,`m`.`create_time` AS `create_time` from (`tb_messages` `m` join `tb_notify_log` `n` on((`m`.`msg_id` = `n`.`msg_id`))) where (`n`.`type` = 0) ;
