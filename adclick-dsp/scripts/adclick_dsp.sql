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

DROP database `adclickdsp`;
CREATE SCHEMA IF NOT EXISTS `adclickdsp` DEFAULT CHARACTER SET utf8 ;
SHOW WARNINGS;
USE `adclickdsp` ;

-- ----------------------------
-- Table structure for tb_dsp_aduser
-- ----------------------------
DROP TABLE IF EXISTS `tb_dsp_aduser`;
CREATE TABLE `tb_dsp_aduser` (
  `user_id` bigint(64) NOT NULL COMMENT '广告主ID',
  `user_name` varchar(64) NOT NULL COMMENT '广告主名',
  `company_name` varchar(200) DEFAULT NULL COMMENT '广告主公司名',
  `company_license` varchar(200) DEFAULT NULL COMMENT '公司执照',
  `license_number` varchar(100) DEFAULT NULL COMMENT '营业执照编号',
  `license_valid_date_begin` datetime DEFAULT NULL COMMENT '营业执照有效期',
  `license_valid_date_end` datetime DEFAULT NULL COMMENT '营业执照有效期',
  `address` varchar(200) DEFAULT NULL COMMENT '公司地址',
  `telephone` varchar(16) DEFAULT NULL COMMENT '公司电话',
  `contacts_name` varchar(200) DEFAULT NULL COMMENT '联系人名',
  `contacts_mobile` varchar(200) DEFAULT NULL COMMENT '联系人手机',
  `contacts_email` varchar(200) DEFAULT NULL COMMENT '联系人邮件',
  `rbalance` bigint(64) DEFAULT '0' COMMENT '实际账户余额',
  `vbalance` bigint(64) DEFAULT '0' COMMENT '虚拟账户余额',
  `user_audit_status` int(11) DEFAULT '1' COMMENT '广告主审核状态',
  `user_audit_message` varchar(1024) DEFAULT NULL COMMENT '广告主审核失败原因',
  `categories` int(11) DEFAULT '0' COMMENT '广告主行业分类',
  `subcategories` int(11) DEFAULT '0' COMMENT '广告主子行业分类',
  `categories_audit_status` int(11) DEFAULT '0' COMMENT '广告主行业审核',
  `categories_audit_message` varchar(1024) DEFAULT NULL COMMENT '广告主行业审核失败原因',
  `qualification` varchar(200) DEFAULT NULL COMMENT '广告主行业资质url',
  `qualification_number` varchar(100) DEFAULT NULL COMMENT '资质编号',
  `qualification_type` int(11) DEFAULT '0' COMMENT '资质类型',
  `valid_date_begin` datetime DEFAULT NULL COMMENT '资质有效期',
  `valid_date_end` datetime DEFAULT NULL COMMENT '资质有效期',
  `invoiced_amount` bigint(64) DEFAULT '0' COMMENT '已开票金额',
  `uninvoice_amount` bigint(64) DEFAULT '0' COMMENT '未开票金额',
  `balance` bigint(64) DEFAULT '0' COMMENT '账户余额',
  `qualification_name` varchar(200) DEFAULT NULL COMMENT '广告主行业资质',
  `site_name` varchar(200) DEFAULT NULL COMMENT '广告主行业资质',
  `site_url` varchar(200) DEFAULT NULL COMMENT '广告主行业资质',
  `create_time` datetime NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
  `update_time` datetime NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT 'update日期',
  `user_type` tinyint(4) DEFAULT '0' COMMENT '用户类型',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='广告主信息表';


-- ------------------------------
-- Table structure for tb_aduser_invoice_account
-- ------------------------------
DROP TABLE IF EXISTS `tb_aduser_invoice_account`;
CREATE TABLE `tb_aduser_invoice_account` (
  `id` VARCHAR(64)  NOT NULL COMMENT '发票信息ID',
  `user_id` bigint(64)  NOT NULL COMMENT '广告主ID',
  `title` VARCHAR(64) NOT NULL COMMENT '发票抬头',
  `type` int(11) NOT NULL DEFAULT 0 COMMENT '发票类型，1-增值税普票，2-增值税专票',
  `tax_no` VARCHAR(64) DEFAULT NULL COMMENT '税号',
  `address` VARCHAR(200) DEFAULT NULL COMMENT '公司地址',
  `phone` VARCHAR(16) DEFAULT NULL COMMENT '公司电话',
  `bank` VARCHAR(200) DEFAULT NULL COMMENT '开户行',
  `bank_account_no` VARCHAR(200) DEFAULT NULL COMMENT '开户银行卡号',
  `receiver_name` VARCHAR(200) DEFAULT NULL COMMENT '收件人名',
  `receiver_address` VARCHAR(200) DEFAULT NULL COMMENT '收件人地址',
  `receiver_email` VARCHAR(200) DEFAULT NULL COMMENT '联系人邮件',
  `receiver_mobile` VARCHAR(32) DEFAULT NULL COMMENT '收件手机',
  `qualification` VARCHAR(128) DEFAULT NULL COMMENT '资质文件',
  `audit_status` int(11) DEFAULT 0 COMMENT '审查状态，0-通过，1-提交中，2-审查中，3-审查失败',
  `audit_message` VARCHAR(1024) DEFAULT NULL COMMENT '审核失败原因',
  `status` int(11) DEFAULT 1 COMMENT '记录状态，0-有效，其它无效',
  `create_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
  `update_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT 'update日期', 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='公司发票信息表';

CREATE INDEX invoice_user_id ON tb_aduser_invoice_account (user_id);

-- ------------------------------
-- Table structure for tb_aduser_operators
-- ------------------------------
DROP TABLE IF EXISTS `tb_aduser_operators`;
CREATE TABLE `tb_aduser_operators` (
  `oper_id` VARCHAR(64)  NOT NULL COMMENT '协作人员id',
  `user_id` bigint(64)  NOT NULL COMMENT '广告主ID',
  `email` VARCHAR(64)  NOT NULL COMMENT '用户email',
  `mobile` VARCHAR(16) NOT NULL COMMENT '用户手机号',
  `password` VARCHAR(64) DEFAULT NULL COMMENT '用户密码',
  `portrait` VARCHAR(64) DEFAULT NULL COMMENT '用户头像',
  `name` VARCHAR(64) DEFAULT NULL COMMENT '用户名称',
  `role` int(11) DEFAULT NULL COMMENT '角色，0-创建者，1-管理员，2-操作员，3-观察员，4-财务人员',
  `audit_status` int(11) DEFAULT 1 COMMENT '审核状态，0-审核通过，1-未审核，2-审核中，3-审核未通过',
  `audit_message` VARCHAR(1024) DEFAULT NULL COMMENT '审核失败原因',
  `status` int(11) DEFAULT 1 COMMENT '记录状态，0-有效，其它无效',
  `create_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
  `update_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT 'update日期', 
  PRIMARY KEY (`oper_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='广告主协作人员信息表';

CREATE INDEX oper_user_id ON tb_aduser_operators (user_id);

-- ------------------------------
-- Table structure for tb_account_recharge_log
-- ------------------------------
DROP TABLE IF EXISTS `tb_account_recharge_log`;
CREATE TABLE `tb_account_recharge_log` (
  `id` VARCHAR(64)  NOT NULL COMMENT '记录id',
  `user_id` bigint(64)  NOT NULL COMMENT '广告主ID',
  `account_type` int(11) DEFAULT NULL COMMENT '0-实际账户，1-虚拟账户',
  `oper_id` VARCHAR(64)  NOT NULL COMMENT '操作人员id',
  `amount` bigint(64)  NOT NULL COMMENT '充值金额',
  `ticket_no` VARCHAR(64) NOT NULL COMMENT '充值流水号',
  `charge_type` int(11) DEFAULT NULL COMMENT '0-网银，1-支付宝，2-微信',
  `charge_status` int(11) DEFAULT NULL COMMENT '0-充值完成，1-充值中，2-充值失败',
  `create_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
  `update_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT 'update日期', 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='账号充值记录表';

CREATE INDEX account_recharge_user_id ON tb_account_recharge_log (user_id);

-- ------------------------------
-- Table structure for tb_invoice_op_log
-- ------------------------------
DROP TABLE IF EXISTS `tb_invoice_op_log`;
CREATE TABLE `tb_invoice_op_log` (
  `id` VARCHAR(64)  NOT NULL COMMENT '记录id',
  `user_id` bigint(64)  NOT NULL COMMENT '广告主ID',
  
  `title` VARCHAR(128) NOT NULL COMMENT '发票title',
  `invoice_id` VARCHAR(64) NOT NULL COMMENT '发票id',
  `oper_id` VARCHAR(64)  NOT NULL COMMENT '操作人员id',
  `type` int(11) NOT NULL DEFAULT 0 COMMENT '发票类型，1-增值税普票，2-增值税专票',
  `item_name` VARCHAR(64) NOT NULL COMMENT '开票项目',
  `amount` int(11)  NOT NULL COMMENT '开票金额,单位分',
  `tax_info_ticket` VARCHAR(64) NOT NULL COMMENT '发票信息id',
  `invoice_status` int(11) NOT NULL DEFAULT 1 COMMENT '0-完成，1-提交中，2-处理中，',
  `post_name` VARCHAR(64) NOT NULL COMMENT '快递公司',
  `post_id` VARCHAR(64) NOT NULL COMMENT '快递号id',
  `message` VARCHAR(1024) NOT NULL COMMENT '拒绝理由',
  `create_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
  `update_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT 'update日期', 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='账号充值记录表';

CREATE INDEX invoice_op_user_id ON tb_invoice_op_log (user_id);

-- ------------------------------
-- Table structure for tb_message_notify_set
-- ------------------------------
DROP TABLE IF EXISTS `tb_message_notify_set`;
CREATE TABLE `tb_message_notify_set` (
  `id` VARCHAR(64)  NOT NULL COMMENT '记录id',
  `user_id` bigint(64)  NOT NULL COMMENT '广告主ID',
  `categories` int(11) NOT NULL DEFAULT 0 COMMENT '0-系统消息，1-审核消息，2-账户消息，3-财务消息',
  `subcategories` int(11) NOT NULL DEFAULT 0 COMMENT '消息子类型',
  `channel` int(11) NOT NULL DEFAULT 1 COMMENT '0b001-站内信，0b010邮箱，0b100手机短信',
  `create_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
   
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='消息设置表';

CREATE INDEX notify_set_user_id ON tb_message_notify_set (user_id);

-- ----------------------------
-- Table structure for tb_message_notify_status
-- ----------------------------
DROP TABLE IF EXISTS `tb_message_notify_status`;
CREATE TABLE `tb_message_notify_status` (
  `user_id` bigint(64) NOT NULL COMMENT '广告主ID',
  `categories` int(11) NOT NULL DEFAULT '0' COMMENT '0-系统消息，1-审核消息，2-账户消息，3-财务消息',
  `subcategories` int(11) NOT NULL DEFAULT '0' COMMENT '消息子类型',
  `status` int(11) NOT NULL DEFAULT '1' COMMENT '状态',
  `create_time` datetime NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
  `update_time` datetime NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '更新时间',
  PRIMARY KEY (`user_id`,`categories`,`subcategories`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='消息通知状态表';

-- Table structure for tb_notify_receivers
-- ------------------------------
DROP TABLE IF EXISTS `tb_notify_receivers`;
CREATE TABLE `tb_notify_receivers` (
  `id` VARCHAR(64)  NOT NULL COMMENT '记录id',
  `user_id` bigint(64)  NOT NULL COMMENT '广告主ID',
  `type` int(11) NOT NULL DEFAULT 0 COMMENT '0-email,1-sms',
  `receiver` VARCHAR(64) DEFAULT NULL COMMENT 'email or mobile value', 
  `audit_status` int(11) NOT NULL DEFAULT 1 COMMENT ' 0-success, 1-verifying,2-failed',
  `create_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
  `update_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT 'update日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='消息接受人员表';

CREATE INDEX receiver_user_id ON tb_notify_receivers (user_id);

-- Table structure for tb_messages
-- ------------------------------
DROP TABLE IF EXISTS `tb_messages`;
CREATE TABLE `tb_messages` (
  `msg_id` VARCHAR(64)  NOT NULL COMMENT '记录id',
  `user_id` bigint(64)  NOT NULL COMMENT '广告主ID',
  `categories` int(11) NOT NULL DEFAULT 0 COMMENT '0-系统消息，1-审核消息，2-账户消息，3-财务消息',
  `subcategories` int(11) NOT NULL DEFAULT 0 COMMENT '消息子类型',
  `title` VARCHAR(64) DEFAULT NULL COMMENT '消息头',
  `content` VARCHAR(64) DEFAULT NULL COMMENT '消息内容',
  `create_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
  PRIMARY KEY (`msg_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='消息信息表';

CREATE INDEX message_user_id ON tb_messages (user_id);

-- ------------------------------
-- Table structure for tb_notify_log
-- ------------------------------
DROP TABLE IF EXISTS `tb_notify_log`;
CREATE TABLE `tb_notify_log` (
  `id` VARCHAR(64)  NOT NULL COMMENT '记录id',
  `user_id` bigint(64)  NOT NULL COMMENT '广告主ID',
  `msg_id` VARCHAR(64)  NOT NULL COMMENT '消息id',
  `receiver` VARCHAR(64) DEFAULT NULL COMMENT 'email, mobile,',
  `type` int(11) NOT NULL DEFAULT 0 COMMENT '0-站内信,1-sms,2-email',
  `notify_status` int(11) NOT NULL DEFAULT 1 COMMENT '0-已读，其他未读，对于email和sms0-成功，',
  `create_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
  `update_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT 'update日期', 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='消息通知记录表';

CREATE INDEX notify_log_user_id ON tb_notify_log (user_id);

DROP VIEW IF EXISTS `v_msg_query`;
create view v_msg_query as select m.msg_id, m.user_id, m.categories, m.subcategories, m.title, m.content,n.receiver, n.notify_status,m.create_time from tb_messages m inner join tb_notify_log n on m.msg_id = n.msg_id where n.type=0;

-- ------------------------------
-- Table structure for tb_unit_target_template
-- ------------------------------
DROP TABLE IF EXISTS `tb_unit_target_template`;
CREATE TABLE `tb_unit_target_template` (
  `id` VARCHAR(64)  NOT NULL COMMENT '记录id',
  `user_id` bigint(64)  NOT NULL COMMENT '广告主ID',
  `template_id` VARCHAR(64)  NOT NULL COMMENT '模板id',
  `target_type` int(11) NOT NULL DEFAULT 0 COMMENT '定向类型',
  `target_content` VARCHAR(256) DEFAULT NULL COMMENT '定向内容',
  `create_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='定向模板表';

CREATE INDEX target_template_user_id ON tb_unit_target_template (user_id);

-- ------------------------------
-- Table structure for tb_audit_log
-- ------------------------------
DROP TABLE IF EXISTS `tb_audit_log`;
CREATE TABLE `tb_audit_log` (
  `id` VARCHAR(64)  NOT NULL COMMENT '记录id',
  `user_id` bigint(64)  NOT NULL COMMENT '广告主ID',
  `oper_id` VARCHAR(64)  NOT NULL COMMENT '操作人员id',
  `level` int(11) NOT NULL DEFAULT 0 COMMENT '等级',
  `type` int(11) NOT NULL DEFAULT 0 COMMENT '类型',
  `content` VARCHAR(200) DEFAULT NULL COMMENT '操作内容',
  `create_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='审计记录表';
CREATE INDEX audit_log_user_id ON tb_audit_log (user_id);

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


-- ------------------------------
-- Table structure for tb_email_verify_log
-- ------------------------------
DROP TABLE IF EXISTS `tb_email_verify_log`;
CREATE TABLE `tb_email_verify_log` (
  `id` VARCHAR(64)  NOT NULL COMMENT '记录id',
  `email` VARCHAR(64) DEFAULT NULL COMMENT 'email',
  `token` VARCHAR(128) DEFAULT NULL COMMENT '验证码值',
  `user_id` bigint(64) DEFAULT 0 COMMENT '所属广告主',
  `type` int(11) DEFAULT 1 COMMENT '业务类型，1-邮件消息接收人',
  `status` int(11) DEFAULT 1 COMMENT '0-验证通过，1-创建，2-已发送，3-验证失败',
  `create_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
  `update_time` DATETIME NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT 'update日期', 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='验证码记录表';



SHOW WARNINGS;

CREATE USER 'dmtec'@'180.76.179.44' IDENTIFIED BY 'adclickZaq!2wsx';

GRANT ALL privileges ON adclickdsp.* TO dmtec@180.76.153.68 IDENTIFIED BY 'adclickZaq!2wsx';
SHOW WARNINGS;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;