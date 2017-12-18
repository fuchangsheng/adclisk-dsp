/*
Navicat MySQL Data Transfer

Source Server         : dsp-adclick
Source Server Version : 50173
Source Host           : 180.76.153.68:3306
Source Database       : adclick_dsp_business

Target Server Type    : MYSQL
Target Server Version : 50173
File Encoding         : 65001

Date: 2017-03-15 20:06:52
*/

SET FOREIGN_KEY_CHECKS=0;

ALTER TABLE `tb_dsp_aduser`
ADD COLUMN `qualification_number`  varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '资质编号' AFTER `qualification`,
ADD COLUMN `qualification_type`  int(11) NULL DEFAULT 0 COMMENT '资质类型' AFTER `qualification_number`,
ADD COLUMN `valid_date_begin`  datetime NULL DEFAULT NULL COMMENT '资质有效期' AFTER `qualification_type`,
ADD COLUMN `valid_date_end`  datetime NULL DEFAULT NULL COMMENT '资质有效期' AFTER `valid_date_begin`,

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