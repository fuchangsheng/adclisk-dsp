/*
Navicat MySQL Data Transfer

Source Server         : dsp-adclick
Source Server Version : 50173
Source Host           : 180.76.153.68:3306
Source Database       : dsp_adx

Target Server Type    : MYSQL
Target Server Version : 50173
File Encoding         : 65001

Date: 2017-02-28 15:15:28
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for adx_configs
-- ----------------------------
DROP TABLE IF EXISTS `adx_configs`;
CREATE TABLE `adx_configs` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT '' COMMENT 'ADX鍚�',
  `config` text NOT NULL COMMENT 'JSON瀛樺偍鐨刟dx閰嶇疆',
  `status` int(11) NOT NULL COMMENT 'ADX鐘舵��',
  `create_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT '1980-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
