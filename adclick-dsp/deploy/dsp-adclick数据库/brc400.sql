/*
Navicat MySQL Data Transfer

Source Server         : dsp-adclick
Source Server Version : 50173
Source Host           : 180.76.153.68:3306
Source Database       : brc400

Target Server Type    : MYSQL
Target Server Version : 50173
File Encoding         : 65001

Date: 2017-02-28 15:39:18
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for call_ticket
-- ----------------------------
DROP TABLE IF EXISTS `call_ticket`;
CREATE TABLE `call_ticket` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `calling_num` varchar(100) CHARACTER SET utf8 DEFAULT NULL COMMENT '主叫号码',
  `called_num` varchar(100) CHARACTER SET utf8 DEFAULT NULL COMMENT '被叫号码',
  `dst_num` varchar(100) CHARACTER SET utf8 DEFAULT NULL COMMENT '目的号码',
  `start_time` datetime DEFAULT NULL COMMENT '通话开始时间',
  `dst_num_loc` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '目的地号码归属地',
  `start_num_loc` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '发话地区',
  `call_loc` varchar(100) CHARACTER SET utf8 DEFAULT NULL COMMENT '通话性质(本地或者长途)',
  `call_time` varchar(100) CHARACTER SET utf8 DEFAULT NULL COMMENT '通话时长',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=420 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for channel_400
-- ----------------------------
DROP TABLE IF EXISTS `channel_400`;
CREATE TABLE `channel_400` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `channel_id` int(100) NOT NULL COMMENT '渠道ID',
  `channel_400` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '渠道400电话号码',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for houses
-- ----------------------------
DROP TABLE IF EXISTS `houses`;
CREATE TABLE `houses` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `house_no` varchar(100) CHARACTER SET utf8 DEFAULT NULL COMMENT '楼盘编号',
  `house_name` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '楼盘名称',
  `house_loc` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '楼盘地址',
  `house_sale_phone` varchar(100) CHARACTER SET utf8 DEFAULT NULL COMMENT '楼盘销售中心电话',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for houses_channel
-- ----------------------------
DROP TABLE IF EXISTS `houses_channel`;
CREATE TABLE `houses_channel` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `house_no` varchar(100) CHARACTER SET utf8 DEFAULT NULL COMMENT '楼盘编号',
  `channel_no` varchar(100) CHARACTER SET utf8 DEFAULT NULL COMMENT '渠道编号',
  `channel_name` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '渠道名称',
  `channel_loc` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '渠道地址',
  `channel_400` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '渠道对应400电话列表',
  `channel_contact_name` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '渠道联系人姓名',
  `channel_contact_phone` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '渠道联系人电话',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(40) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` int(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
