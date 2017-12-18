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
Source Database       : wirecheck

 Target Server Version : 50621
 File Encoding         : utf-8

 Date: 06/05/2016 21:00:06 PM
*/
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';
SET FOREIGN_KEY_CHECKS=0;

DROP database `adclickmgr`;
CREATE SCHEMA IF NOT EXISTS `adclickmgr` DEFAULT CHARACTER SET utf8 ;
SHOW WARNINGS;
USE `adclickmgr` ;

-- ------------------------------
-- Table structure for tb_administrator
-- ------------------------------
DROP TABLE IF EXISTS `tb_administrator`;
CREATE TABLE `tb_administrator` (
  `id` int(11)  NOT NULL COMMENT '管理员ID',
  `name` VARCHAR(64)  NOT NULL UNIQUE COMMENT '管理员名',
  `password` VARCHAR(64) NOT NULL COMMENT '密码',
  `phone` VARCHAR(64) NOT NULL COMMENT '联系电话',
  `email` VARCHAR(64) NOT NULL COMMENT '邮箱',
  `role` int(11) NOT NULL COMMENT '权限，0-操作员，1-管理员',
  `status` int(11) DEFAULT 1 COMMENT '记录状态，0-有效，其它无效',
  `create_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
  `update_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT 'update日期', 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='管理员信息表';

/*
alter table tb_administrator change  column user_name name VARCHAR(64);
*/

-- ------------------------------
-- Table structure for tb_slot_price
-- ------------------------------
DROP TABLE IF EXISTS `tb_slot_price`;
CREATE TABLE `tb_slot_price` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `user_id` bigint(20) NOT NULL COMMENT '账户ID',
  `adx_id` bigint(20) NOT NULL COMMENT 'ADX ID',
  `slot_id` bigint(20) NOT NULL COMMENT '广告位 ID',
  `bottom_price` bigint(64) DEFAULT 0 COMMENT '广告位底价',
  `status` int(11) NOT NULL COMMENT '状态',
  `create_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
  `update_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT 'update日期', 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='广告主广告位底价表';

-- ------------------------------
-- Table structure for idea audits
-- ------------------------------
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
  #UNIQUE KEY `idea_id_adx_id` (`idea_id`,`adx_id`),
  KEY `idea_id` (`idea_id`),
  KEY `unit_id` (`unit_id`),
  KEY `plan_id` (`plan_id`),
  KEY `user_id` (`user_id`),
  KEY `mgr_id` (`mgr_id`),
  KEY `update_time` (`update_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='管理系统创意审计表';

-- ------------------------------
-- Table structure for tb_sms_log
-- ------------------------------
DROP TABLE IF EXISTS `tb_sms_log`;
CREATE TABLE `tb_sms_log` (
  `mobile` VARCHAR(16) DEFAULT NULL COMMENT '手机号',
  `smscode` VARCHAR(8) DEFAULT NULL COMMENT '短信验证码',
  `status` int(11) NOT NULL DEFAULT 0 COMMENT '0-验证通过，1-已发送未验证，2-验证失败',
  `create_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
  `update_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT 'update日期', 
  PRIMARY KEY (`mobile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='短信验证码表';

-- ------------------------------
-- Table structure for tb_verify_code_log
-- ------------------------------
DROP TABLE IF EXISTS `tb_verify_code_log`;
CREATE TABLE `tb_verify_code_log` (
  `code_name` VARCHAR(64) DEFAULT NULL COMMENT '验证码名',
  `code_value` VARCHAR(64) DEFAULT NULL COMMENT '验证码值',
  `status` int(11) DEFAULT 1 COMMENT '0-验证通过，1-创建，2-已发送，3-验证失败',
  `create_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
  PRIMARY KEY (`code_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='验证码记录表';

-- Table structure for tb_notify_receivers
-- ------------------------------
DROP TABLE IF EXISTS `tb_notify_receivers`;
CREATE TABLE `tb_notify_receivers` (
  `id` VARCHAR(64)  NOT NULL COMMENT '记录id',
  `type` int(11) NOT NULL DEFAULT 0 COMMENT '0-email,1-sms',
  `receiver` VARCHAR(64) DEFAULT NULL COMMENT 'email or mobile value', 
  `audit_status` int(11) NOT NULL DEFAULT 1 COMMENT ' 0-success, 1-verifying,2-failed',
  `create_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
  `update_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT 'update日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='消息接受人员表';


-- Table structure for tb_messages
-- ------------------------------
DROP TABLE IF EXISTS `tb_messages`;
CREATE TABLE `tb_messages` (
  `msg_id` VARCHAR(64)  NOT NULL COMMENT '记录id',
  `categories` int(11) NOT NULL DEFAULT 0 COMMENT '0-系统消息，1-审核消息，2-账户消息，3-财务消息',
  `subcategories` int(11) NOT NULL DEFAULT 0 COMMENT '消息子类型',
  `title` VARCHAR(64) DEFAULT NULL COMMENT '消息头',
  `content` VARCHAR(64) DEFAULT NULL COMMENT '消息内容',
  `create_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
  PRIMARY KEY (`msg_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='消息信息表';

-- ------------------------------
-- Table structure for tb_notify_log
-- ------------------------------
DROP TABLE IF EXISTS `tb_notify_log`;
CREATE TABLE `tb_notify_log` (
  `id` VARCHAR(64)  NOT NULL COMMENT '记录id',
  `msg_id` VARCHAR(64)  NOT NULL COMMENT '消息id',
  `receiver` VARCHAR(64) DEFAULT NULL COMMENT 'email, mobile,',
  `type` int(11) NOT NULL DEFAULT 0 COMMENT '0-站内信,1-sms,2-email',
  `notify_status` int(11) NOT NULL DEFAULT 1 COMMENT '0-已读，其他未读，对于email和sms0-成功，',
  `create_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
  `update_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT 'update日期', 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='消息通知记录表';

-- ------------------------------
-- Table structure for tb_audit_log
-- ------------------------------
DROP TABLE IF EXISTS `tb_audit_log`;
CREATE TABLE `tb_audit_log` (
  `id` VARCHAR(64)  NOT NULL COMMENT '记录id',
  `mgr_id` VARCHAR(64)  NOT NULL COMMENT '操作人员id',
  `level` int(11) NOT NULL DEFAULT 0 COMMENT '等级',
  `type` int(11) NOT NULL DEFAULT 0 COMMENT '类型',
  `content` VARCHAR(200) DEFAULT NULL COMMENT '操作内容',
  `create_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='审计记录表';
CREATE INDEX audit_log_mgr_id ON tb_audit_log (mgr_id);

-- ------------------------------
-- Table structure for tb_email_verify_log
-- ------------------------------
DROP TABLE IF EXISTS `tb_email_verify_log`;
CREATE TABLE `tb_email_verify_log` (
  `id` VARCHAR(64)  NOT NULL COMMENT '记录id',
  `email` VARCHAR(64) DEFAULT NULL COMMENT 'email',
  `token` VARCHAR(128) DEFAULT NULL COMMENT '验证码值',
  `type` int(11) DEFAULT 1 COMMENT '业务类型，1-邮件消息接收人',
  `status` int(11) DEFAULT 1 COMMENT '0-验证通过，1-创建，2-已发送，3-验证失败',
  `create_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
  `update_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT 'update日期', 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='验证码记录表';

-- ----------------------------
-- View structure for v_msg_query
-- ----------------------------
DROP VIEW IF EXISTS `v_msg_query`;
CREATE ALGORITHM = UNDEFINED DEFINER = `root`@`localhost` SQL SECURITY DEFINER VIEW `v_msg_query` AS SELECT
  `m`.`msg_id` AS `msg_id`,
  `m`.`categories` AS `categories`,
  `m`.`subcategories` AS `subcategories`,
  `m`.`title` AS `title`,
  `m`.`content` AS `content`,
  `n`.`receiver` AS `receiver`,
  `n`.`notify_status` AS `notify_status`,
  `m`.`create_time` AS `create_time`
FROM
  (
    `tb_messages` `m`
    JOIN `tb_notify_log` `n` ON (
      (`m`.`msg_id` = `n`.`msg_id`)
    )
  )
WHERE
  (`n`.`type` = 0);



GRANT ALL privileges ON adclickmgr.* TO dmtec@180.76.153.68 IDENTIFIED BY 'adclickZaq!2wsx';
SHOW WARNINGS;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;