/*
Navicat MySQL Data Transfer

Source Server         : adclick68
Source Server Version : 50173
Source Host           : 180.76.153.68:3306
Source Database       : adclick_dsp_dashboard

Target Server Type    : MYSQL
Target Server Version : 50173
File Encoding         : 65001

Date: 2017-02-16 14:29:27
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for adclick_dsp_realtime
-- ----------------------------
DROP TABLE IF EXISTS `adclick_dsp_realtime`;
CREATE TABLE `adclick_dsp_realtime` (
  `date` datetime NOT NULL DEFAULT '1980-01-01 00:00:00' COMMENT '创建日期',
  `user_id` varchar(64) NOT NULL COMMENT '广告主ID',
  `plan_id` varchar(64) NOT NULL COMMENT '广告主ID',
  `unit_id` varchar(64) NOT NULL COMMENT '广告主ID',
  `idea_id` varchar(64) NOT NULL COMMENT '广告主ID',
  `ad_bid_type` varchar(11) NOT NULL DEFAULT '' COMMENT '广告主行业分类',
  `adx` varchar(11) NOT NULL DEFAULT '' COMMENT '广告主行业分类',
  `creative_type` varchar(11) NOT NULL DEFAULT '' COMMENT '广告主行业分类',
  `adview_type` varchar(11) NOT NULL DEFAULT '' COMMENT '广告主行业分类',
  `prov` varchar(32) NOT NULL DEFAULT '' COMMENT '广告主名',
  `city` varchar(32) NOT NULL DEFAULT '' COMMENT '广告主公司名',
  `site` varchar(128) NOT NULL DEFAULT '' COMMENT '公司执照',
  `request` bigint(64) DEFAULT 0 COMMENT '广告主行业分类',
  `bid` bigint(64) DEFAULT 0 COMMENT '广告主行业分类',
  `imp` bigint(64) DEFAULT 0 COMMENT '广告主行业分类',
  `click` bigint(64) DEFAULT 0 COMMENT '广告主行业分类',
  `download` bigint(64) DEFAULT 0 COMMENT '广告主行业分类',
  `cost` bigint(64) DEFAULT 0 COMMENT '广告主行业分类',
  `revenue` bigint(64) DEFAULT 0 COMMENT '广告主行业分类',
  PRIMARY KEY (`date`,`user_id`,`plan_id`,`unit_id`,`idea_id`,`ad_bid_type`,`adx`,`creative_type`,`adview_type`,`prov`,`city`,`site`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='广告主信息表';

-- ----------------------------
-- Table structure for realtime_action
-- ----------------------------
DROP TABLE IF EXISTS `realtime_action`;
CREATE TABLE `realtime_action` (
  `sid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '标识一次检索的唯一id 用于join',
  `adx` varchar(128) DEFAULT NULL COMMENT 'adx id',
  `user` varchar(128) DEFAULT NULL COMMENT '广告主id',
  `plan` varchar(128) DEFAULT NULL COMMENT '广告计划id',
  `unit` varchar(128) DEFAULT NULL COMMENT '广告单元id',
  `idea` varchar(128) NOT NULL COMMENT '广告创意id',
  `rank` varchar(128) DEFAULT NULL COMMENT '该广告对应检索请求中的第几个广告位',
  `ad_bid_type` varchar(128) DEFAULT NULL COMMENT '广告主出价类型',
  `ad_bid` varchar(128) DEFAULT NULL COMMENT '广告主原始出价 单位：分',
  `ad_gsp_bid` varchar(128) DEFAULT NULL COMMENT 'GSP二价 单位：分',
  `dsp_bid_type` varchar(128) DEFAULT NULL COMMENT 'dsp向adx的出价类型',
  `dsp_bid` varchar(128) DEFAULT NULL COMMENT 'dsp向adx的出价 单位：分',
  `adx_price` varchar(128) DEFAULT NULL COMMENT 'adx向收取的实际费用 只有当DSP以CPD出价时 该值不为0',
  `action` varchar(128) DEFAULT NULL COMMENT '用户行为0-app下载 1-app安装 2-video观看完成 3-video跳出 4-app激活 5-app下载开始 6-video播放开始',
  `instime` datetime NOT NULL,
  PRIMARY KEY (`sid`,`idea`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for realtime_bidding
-- ----------------------------
DROP TABLE IF EXISTS `realtime_bidding`;
CREATE TABLE `realtime_bidding` (
  `sid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '标识一次检索的唯一ID',
  `adx` varchar(128) DEFAULT NULL COMMENT '标识不同的adx',
  `hr` varchar(128) DEFAULT NULL COMMENT '当前小时 取值范围[0-23]',
  `wd` varchar(128) DEFAULT NULL COMMENT 'week day 取值范围[0-6]',
  `adx_user` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'adx域下的用户cookie-id',
  `dsp_user` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'dsp域下的用户cookie-id',
  `imei` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '设备imei号',
  `imeisha1` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'imei sha1哈希值',
  `imeimd5` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'imei md5哈希值',
  `androidid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'android id',
  `androididsha1` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'android id sha1哈希值',
  `androididmd5` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'android id md5哈希值',
  `idfa` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '苹果设备 idfa',
  `idfasha1` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '苹果设备idfa sha1哈希值',
  `idfamd5` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '苹果设备 idfa md5哈希值',
  `mac` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '设备mac地址',
  `macsha1` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'mac sha1哈希值',
  `macmd5` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'mac md5哈希值',
  `ua` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '浏览器UserAgent',
  `ip` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '设备ipv4',
  `prov` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '省',
  `city` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '市',
  `device` varchar(128) DEFAULT NULL COMMENT '设备类型0-PC 1-Phone 2-Tablet',
  `os` varchar(128) DEFAULT NULL COMMENT '操作系统0-Windows 1-MacOS 2-Linux 3-IOS 4-Android',
  `carrier` varchar(128) DEFAULT NULL COMMENT '运营商0-中国电信 1-中国移动 2-中国联通 3-中国网通',
  `conntype` varchar(128) DEFAULT NULL COMMENT '网络类型0-wifi 1-移动网络(2G) 2-移动网络(3G) 3-移动网络(4G) 4-有线网络(earthnet)',
  `adview_type` varchar(128) DEFAULT NULL COMMENT '流量类型0-WEB 1-WAP 2-APP',
  `is_site` varchar(128) DEFAULT NULL COMMENT 'site or app 0-app 1-site',
  `url` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'site url/app package name',
  `site` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'url中的站点部分',
  `domain` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'url中的主域部分',
  `sq` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '站点质量 site quality',
  `pq` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '页面质量 page quality',
  `pt` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '页面类型',
  `query` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `sc` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '站点行业site category 逗号分隔',
  `pc` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '页面行业page category 逗号分隔',
  `interest` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '用户兴趣点 逗号分隔',
  `pk` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '页面关键词 逗号分隔',
  `nimp` varchar(128) DEFAULT NULL COMMENT '本次竞价请求个广告位个数',
  `impid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告位id列表 逗号分隔',
  `bidtype` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '允许的竞价类型0-CPM 1-CPC 2-CPD 3-CPT 多个广告位之间以逗号分隔，若一个广告位允许多种竞价类型以&分隔',
  `bidfloor` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '底价 多个广告位之间以逗号分隔 若一个广告位允许多种竞价类型以&分隔',
  `slot` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告位类型 逗号分隔1-横幅(固定类横幅) 2-开屏 3-插屏 4-视频流 5-原生(信息流) 6-横幅(悬浮类横幅)',
  `w` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告位宽 逗号分隔',
  `h` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告位高 逗号分隔',
  `expid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '命中的实验id 多个实验以逗号分隔',
  `nad` varchar(128) DEFAULT NULL COMMENT '返回的广告数量',
  `user` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告主id 逗号分隔',
  `plan` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告计划id 逗号分隔',
  `unit` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告单元id 逗号分隔',
  `idea` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '广告创意id 逗号分隔',
  `ad_bid_type` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告主出价类型 逗号分隔',
  `ad_bid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告主原始出价 单位：分 逗号分隔',
  `ad_gsp_bid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'GPS二价 单位：分 逗号分隔',
  `dsp_bid_type` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'dsp向adx的出价类型 逗号分隔',
  `dsp_bid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'dsp向adx出价 单位：分 逗号分隔',
  `ct` varchar(255) DEFAULT NULL COMMENT '创意类型 creative type 逗号分隔 1-图片 2-flash 3-视频 4-Native 5-文字 6-图文',
  `ctr` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'ctr预估值 原始值*255000 逗号分隔',
  `rank` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '该广告是填充的第几个广告位 逗号分隔',
  `instime` datetime NOT NULL COMMENT 'insert time',
  PRIMARY KEY (`sid`,`idea`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- ----------------------------
-- Table structure for realtime_bidding_single
-- ----------------------------
DROP TABLE IF EXISTS `realtime_bidding_single`;
CREATE TABLE `realtime_bidding_single` (
  `sid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '标识一次检索的唯一ID',
  `adx` varchar(128) DEFAULT NULL COMMENT '标识不同的adx',
  `hr` varchar(128) DEFAULT NULL COMMENT '当前小时 取值范围[0-23]',
  `wd` varchar(128) DEFAULT NULL COMMENT 'week day 取值范围[0-6]',
  `adx_user` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'adx域下的用户cookie-id',
  `dsp_user` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'dsp域下的用户cookie-id',
  `imei` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '设备imei号',
  `imeisha1` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'imei sha1哈希值',
  `imeimd5` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'imei md5哈希值',
  `androidid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'android id',
  `androididsha1` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'android id sha1哈希值',
  `androididmd5` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'android id md5哈希值',
  `idfa` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '苹果设备 idfa',
  `idfasha1` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '苹果设备idfa sha1哈希值',
  `idfamd5` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '苹果设备 idfa md5哈希值',
  `mac` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '设备mac地址',
  `macsha1` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'mac sha1哈希值',
  `macmd5` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'mac md5哈希值',
  `ua` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '浏览器UserAgent',
  `ip` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '设备ipv4',
  `prov` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '省',
  `city` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '市',
  `device` varchar(128) DEFAULT NULL COMMENT '设备类型0-PC 1-Phone 2-Tablet',
  `os` varchar(128) DEFAULT NULL COMMENT '操作系统0-Windows 1-MacOS 2-Linux 3-IOS 4-Android',
  `carrier` varchar(128) DEFAULT NULL COMMENT '运营商0-中国电信 1-中国移动 2-中国联通 3-中国网通',
  `conntype` varchar(128) DEFAULT NULL COMMENT '网络类型0-wifi 1-移动网络(2G) 2-移动网络(3G) 3-移动网络(4G) 4-有线网络(earthnet)',
  `adview_type` varchar(128) DEFAULT NULL COMMENT '流量类型0-WEB 1-WAP 2-APP',
  `is_site` varchar(128) DEFAULT NULL COMMENT 'site or app 0-app 1-site',
  `url` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'site url/app package name',
  `site` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'url中的站点部分',
  `domain` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'url中的主域部分',
  `sq` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '站点质量 site quality',
  `pq` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '页面质量 page quality',
  `pt` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '页面类型',
  `query` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `sc` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '站点行业site category 逗号分隔',
  `pc` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '页面行业page category 逗号分隔',
  `interest` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '用户兴趣点 逗号分隔',
  `pk` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '页面关键词 逗号分隔',
  `nimp` varchar(128) DEFAULT NULL COMMENT '本次竞价请求个广告位个数',
  `impid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告位id列表 逗号分隔',
  `bidtype` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '允许的竞价类型0-CPM 1-CPC 2-CPD 3-CPT 多个广告位之间以逗号分隔，若一个广告位允许多种竞价类型以&分隔',
  `bidfloor` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '底价 多个广告位之间以逗号分隔 若一个广告位允许多种竞价类型以&分隔',
  `slot` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告位类型 逗号分隔1-横幅(固定类横幅) 2-开屏 3-插屏 4-视频流 5-原生(信息流) 6-横幅(悬浮类横幅)',
  `w` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告位宽 逗号分隔',
  `h` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告位高 逗号分隔',
  `expid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '命中的实验id 多个实验以逗号分隔',
  `nad` varchar(128) NOT NULL DEFAULT '' COMMENT '返回的广告数量',
  `user` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告主id 逗号分隔',
  `plan` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告计划id 逗号分隔',
  `unit` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告单元id 逗号分隔',
  `idea` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告创意id 逗号分隔',
  `ad_bid_type` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告主出价类型 逗号分隔',
  `ad_bid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告主原始出价 单位：分 逗号分隔',
  `ad_gsp_bid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'GPS二价 单位：分 逗号分隔',
  `dsp_bid_type` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'dsp向adx的出价类型 逗号分隔',
  `dsp_bid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'dsp向adx出价 单位：分 逗号分隔',
  `ct` varchar(255) DEFAULT NULL COMMENT '创意类型 creative type 逗号分隔 1-图片 2-flash 3-视频 4-Native 5-文字 6-图文',
  `ctr` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'ctr预估值 原始值*255000 逗号分隔',
  `rank` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '该广告是填充的第几个广告位 逗号分隔',
  `instime` datetime NOT NULL COMMENT 'insert time',
  PRIMARY KEY (`sid`,`nad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for realtime_click
-- ----------------------------
DROP TABLE IF EXISTS `realtime_click`;
CREATE TABLE `realtime_click` (
  `sid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '标识一次检索的唯一id，用于join',
  `adx` varchar(255) DEFAULT NULL COMMENT 'adx id',
  `user` varchar(255) DEFAULT NULL COMMENT '广告主id',
  `plan` varchar(255) DEFAULT NULL COMMENT '广告计划id',
  `unit` varchar(255) DEFAULT NULL COMMENT '广告单元id',
  `idea` varchar(255) NOT NULL COMMENT '广告创意id',
  `rank` varchar(255) DEFAULT NULL COMMENT '该广告对应检索请求中第几个广告位',
  `ad_bid_type` varchar(255) DEFAULT NULL COMMENT '广告主出价类型',
  `ad_bid` varchar(255) DEFAULT NULL COMMENT '广告主原始出价 单位：分',
  `ad_gsp_bid` varchar(255) DEFAULT NULL COMMENT 'GSP二价 单位：分',
  `dsp_bid_type` varchar(255) DEFAULT NULL COMMENT 'dsp向adx的出价类型',
  `dsp_bid` varchar(255) DEFAULT NULL COMMENT 'dsp向adx的出价 单位：分',
  `adx_price` varchar(255) DEFAULT NULL COMMENT 'adx向dsp收取的实际费用 只有当DSP以CPC出价时 该值不为0',
  `lp` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告主landing page',
  `instime` datetime NOT NULL,
  PRIMARY KEY (`sid`,`idea`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for realtime_imp
-- ----------------------------
DROP TABLE IF EXISTS `realtime_imp`;
CREATE TABLE `realtime_imp` (
  `sid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '标识一次检索的唯一id，用于join',
  `adx` varchar(255) DEFAULT NULL COMMENT 'adx id',
  `user` varchar(255) DEFAULT NULL COMMENT '广告主id',
  `plan` varchar(255) DEFAULT NULL COMMENT '广告计划id',
  `unit` varchar(255) DEFAULT NULL COMMENT '广告单元id',
  `idea` varchar(255) NOT NULL COMMENT '广告创意id',
  `rank` varchar(255) DEFAULT NULL COMMENT '该广告对应检索请求中的第几个广告位',
  `ad_bid_type` varchar(255) DEFAULT NULL COMMENT '广告主出价类型',
  `ad_bid` varchar(255) DEFAULT NULL COMMENT '广告主原始出价 单位：分',
  `ad_gsp_bid` varchar(255) DEFAULT NULL COMMENT 'GSP二价 单位：分',
  `dsp_bid_type` varchar(255) DEFAULT NULL COMMENT 'dsp向adx的出价类型',
  `dsp_bid` varchar(255) DEFAULT NULL COMMENT 'dsp向adx的出价 单位：分',
  `adx_price` varchar(255) DEFAULT NULL COMMENT 'adx向dsp收取的实际费用 只有当DSP以CPM出价时 该值不为0',
  `instime` datetime DEFAULT NULL,
  PRIMARY KEY (`sid`,`idea`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Procedure structure for realtime_action
-- ----------------------------
DROP PROCEDURE IF EXISTS `realtime_action`;
DELIMITER ;;
CREATE DEFINER=`dmtec`@`%` PROCEDURE `realtime_action`(IN `table_create_date` VARCHAR(20) CHARSET utf8)
    DETERMINISTIC
    COMMENT '创建分钟统计表'
BEGIN
	DECLARE table_name VARCHAR(20);
	set @table_name = CONCAT('realtime_action_',table_create_date);
	set @createsql = CONCAT("create table ",@table_name,"(`sid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '标识一次检索的唯一id 用于join',
  `adx` varchar(128) DEFAULT NULL COMMENT 'adx id',
  `user` varchar(128) DEFAULT NULL COMMENT '广告主id',
  `plan` varchar(128) DEFAULT NULL COMMENT '广告计划id',
  `unit` varchar(128) DEFAULT NULL COMMENT '广告单元id',
  `idea` varchar(128) NOT NULL COMMENT '广告创意id',
  `rank` varchar(128) DEFAULT NULL COMMENT '该广告对应检索请求中的第几个广告位',
  `ad_bid_type` varchar(128) DEFAULT NULL COMMENT '广告主出价类型',
  `ad_bid` varchar(128) DEFAULT NULL COMMENT '广告主原始出价 单位：分',
  `ad_gsp_bid` varchar(128) DEFAULT NULL COMMENT 'GSP二价 单位：分',
  `dsp_bid_type` varchar(128) DEFAULT NULL COMMENT 'dsp向adx的出价类型',
  `dsp_bid` varchar(128) DEFAULT NULL COMMENT 'dsp向adx的出价 单位：分',
  `adx_price` varchar(128) DEFAULT NULL COMMENT 'adx向收取的实际费用 只有当DSP以CPD出价时 该值不为0',
  `action` varchar(128) DEFAULT NULL COMMENT '用户行为0-app下载 1-app安装 2-video观看完成 3-video跳出 4-app激活 5-app下载开始 6-video播放开始',
  `instime` datetime NOT NULL,
  PRIMARY KEY (`sid`,`idea`)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8;");
	PREPARE create_stmt from @createsql;
	EXECUTE create_stmt;
END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for realtime_bidding
-- ----------------------------
DROP PROCEDURE IF EXISTS `realtime_bidding`;
DELIMITER ;;
CREATE DEFINER=`dmtec`@`%` PROCEDURE `realtime_bidding`(IN `table_create_date` VARCHAR(20) CHARSET utf8)
    DETERMINISTIC
    COMMENT '创建分钟统计表'
BEGIN
	DECLARE table_name VARCHAR(20);
	set @table_name = CONCAT('realtime_bidding_',table_create_date);
	set @createsql = CONCAT("create table ",@table_name,"(
  `sid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '标识一次检索的唯一ID',
  `adx` varchar(128) DEFAULT NULL COMMENT '标识不同的adx',
  `hr` varchar(128) DEFAULT NULL COMMENT '当前小时 取值范围[0-23]',
  `wd` varchar(128) DEFAULT NULL COMMENT 'week day 取值范围[0-6]',
  `adx_user` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'adx域下的用户cookie-id',
  `dsp_user` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'dsp域下的用户cookie-id',
  `imei` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '设备imei号',
  `imeisha1` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'imei sha1哈希值',
  `imeimd5` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'imei md5哈希值',
  `androidid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'android id',
  `androididsha1` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'android id sha1哈希值',
  `androididmd5` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'android id md5哈希值',
  `idfa` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '苹果设备 idfa',
  `idfasha1` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '苹果设备idfa sha1哈希值',
  `idfamd5` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '苹果设备 idfa md5哈希值',
  `mac` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '设备mac地址',
  `macsha1` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'mac sha1哈希值',
  `macmd5` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'mac md5哈希值',
  `ua` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '浏览器UserAgent',
  `ip` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '设备ipv4',
  `prov` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '省',
  `city` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '市',
  `device` varchar(128) DEFAULT NULL COMMENT '设备类型0-PC 1-Phone 2-Tablet',
  `os` varchar(128) DEFAULT NULL COMMENT '操作系统0-Windows 1-MacOS 2-Linux 3-IOS 4-Android',
  `carrier` varchar(128) DEFAULT NULL COMMENT '运营商0-中国电信 1-中国移动 2-中国联通 3-中国网通',
  `conntype` varchar(128) DEFAULT NULL COMMENT '网络类型0-wifi 1-移动网络(2G) 2-移动网络(3G) 3-移动网络(4G) 4-有线网络(earthnet)',
  `adview_type` varchar(128) DEFAULT NULL COMMENT '流量类型0-WEB 1-WAP 2-APP',
  `is_site` varchar(128) DEFAULT NULL COMMENT 'site or app 0-app 1-site',
  `url` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'site url/app package name',
  `site` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'url中的站点部分',
  `domain` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'url中的主域部分',
  `sq` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '站点质量 site quality',
  `pq` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '页面质量 page quality',
  `pt` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '页面类型',
  `query` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `sc` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '站点行业site category 逗号分隔',
  `pc` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '页面行业page category 逗号分隔',
  `interest` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '用户兴趣点 逗号分隔',
  `pk` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '页面关键词 逗号分隔',
  `nimp` varchar(128) DEFAULT NULL COMMENT '本次竞价请求个广告位个数',
  `impid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告位id列表 逗号分隔',
  `bidtype` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '允许的竞价类型0-CPM 1-CPC 2-CPD 3-CPT 多个广告位之间以逗号分隔，若一个广告位允许多种竞价类型以&分隔',
  `bidfloor` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '底价 多个广告位之间以逗号分隔 若一个广告位允许多种竞价类型以&分隔',
  `slot` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告位类型 逗号分隔1-横幅(固定类横幅) 2-开屏 3-插屏 4-视频流 5-原生(信息流) 6-横幅(悬浮类横幅)',
  `w` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告位宽 逗号分隔',
  `h` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告位高 逗号分隔',
  `expid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '命中的实验id 多个实验以逗号分隔',
  `nad` varchar(128) DEFAULT NULL COMMENT '返回的广告数量',
  `user` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告主id 逗号分隔',
  `plan` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告计划id 逗号分隔',
  `unit` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告单元id 逗号分隔',
  `idea` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '广告创意id 逗号分隔',
  `ad_bid_type` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告主出价类型 逗号分隔',
  `ad_bid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告主原始出价 单位：分 逗号分隔',
  `ad_gsp_bid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'GPS二价 单位：分 逗号分隔',
  `dsp_bid_type` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'dsp向adx的出价类型 逗号分隔',
  `dsp_bid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'dsp向adx出价 单位：分 逗号分隔',
  `ct` varchar(255) DEFAULT NULL COMMENT '创意类型 creative type 逗号分隔 1-图片 2-flash 3-视频 4-Native 5-文字 6-图文',
  `ctr` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'ctr预估值 原始值*255000 逗号分隔',
  `rank` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '该广告是填充的第几个广告位 逗号分隔',
  `instime` datetime NOT NULL COMMENT 'insert time',
  PRIMARY KEY (`sid`,`idea`)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8;");
	PREPARE create_stmt from @createsql;
	EXECUTE create_stmt;
END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for realtime_bidding_single
-- ----------------------------
DROP PROCEDURE IF EXISTS `realtime_bidding_single`;
DELIMITER ;;
CREATE DEFINER=`dmtec`@`%` PROCEDURE `realtime_bidding_single`(IN `table_create_date` VARCHAR(20) CHARSET utf8)
    DETERMINISTIC
    COMMENT '创建分钟统计表'
BEGIN
	DECLARE table_name VARCHAR(20);
	set @table_name = CONCAT('realtime_bidding_single_',table_create_date);
	set @createsql = CONCAT("create table ",@table_name,"(
  `sid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '标识一次检索的唯一ID',
  `adx` varchar(128) DEFAULT NULL COMMENT '标识不同的adx',
  `hr` varchar(128) DEFAULT NULL COMMENT '当前小时 取值范围[0-23]',
  `wd` varchar(128) DEFAULT NULL COMMENT 'week day 取值范围[0-6]',
  `adx_user` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'adx域下的用户cookie-id',
  `dsp_user` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'dsp域下的用户cookie-id',
  `imei` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '设备imei号',
  `imeisha1` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'imei sha1哈希值',
  `imeimd5` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'imei md5哈希值',
  `androidid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'android id',
  `androididsha1` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'android id sha1哈希值',
  `androididmd5` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'android id md5哈希值',
  `idfa` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '苹果设备 idfa',
  `idfasha1` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '苹果设备idfa sha1哈希值',
  `idfamd5` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '苹果设备 idfa md5哈希值',
  `mac` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '设备mac地址',
  `macsha1` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'mac sha1哈希值',
  `macmd5` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'mac md5哈希值',
  `ua` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '浏览器UserAgent',
  `ip` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '设备ipv4',
  `prov` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '省',
  `city` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '市',
  `device` varchar(128) DEFAULT NULL COMMENT '设备类型0-PC 1-Phone 2-Tablet',
  `os` varchar(128) DEFAULT NULL COMMENT '操作系统0-Windows 1-MacOS 2-Linux 3-IOS 4-Android',
  `carrier` varchar(128) DEFAULT NULL COMMENT '运营商0-中国电信 1-中国移动 2-中国联通 3-中国网通',
  `conntype` varchar(128) DEFAULT NULL COMMENT '网络类型0-wifi 1-移动网络(2G) 2-移动网络(3G) 3-移动网络(4G) 4-有线网络(earthnet)',
  `adview_type` varchar(128) DEFAULT NULL COMMENT '流量类型0-WEB 1-WAP 2-APP',
  `is_site` varchar(128) DEFAULT NULL COMMENT 'site or app 0-app 1-site',
  `url` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'site url/app package name',
  `site` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'url中的站点部分',
  `domain` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'url中的主域部分',
  `sq` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '站点质量 site quality',
  `pq` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '页面质量 page quality',
  `pt` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '页面类型',
  `query` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `sc` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '站点行业site category 逗号分隔',
  `pc` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '页面行业page category 逗号分隔',
  `interest` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '用户兴趣点 逗号分隔',
  `pk` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '页面关键词 逗号分隔',
  `nimp` varchar(128) DEFAULT NULL COMMENT '本次竞价请求个广告位个数',
  `impid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告位id列表 逗号分隔',
  `bidtype` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '允许的竞价类型0-CPM 1-CPC 2-CPD 3-CPT 多个广告位之间以逗号分隔，若一个广告位允许多种竞价类型以&分隔',
  `bidfloor` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '底价 多个广告位之间以逗号分隔 若一个广告位允许多种竞价类型以&分隔',
  `slot` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告位类型 逗号分隔1-横幅(固定类横幅) 2-开屏 3-插屏 4-视频流 5-原生(信息流) 6-横幅(悬浮类横幅)',
  `w` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告位宽 逗号分隔',
  `h` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告位高 逗号分隔',
  `expid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '命中的实验id 多个实验以逗号分隔',
  `nad` varchar(128) NOT NULL DEFAULT '' COMMENT '返回的广告数量',
  `user` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告主id 逗号分隔',
  `plan` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告计划id 逗号分隔',
  `unit` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告单元id 逗号分隔',
  `idea` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告创意id 逗号分隔',
  `ad_bid_type` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告主出价类型 逗号分隔',
  `ad_bid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告主原始出价 单位：分 逗号分隔',
  `ad_gsp_bid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'GPS二价 单位：分 逗号分隔',
  `dsp_bid_type` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'dsp向adx的出价类型 逗号分隔',
  `dsp_bid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'dsp向adx出价 单位：分 逗号分隔',
  `ct` varchar(255) DEFAULT NULL COMMENT '创意类型 creative type 逗号分隔 1-图片 2-flash 3-视频 4-Native 5-文字 6-图文',
  `ctr` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'ctr预估值 原始值*255000 逗号分隔',
  `rank` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '该广告是填充的第几个广告位 逗号分隔',
  `instime` datetime NOT NULL COMMENT 'insert time',
  PRIMARY KEY (`sid`,`nad`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;");
	PREPARE create_stmt from @createsql;
	EXECUTE create_stmt;
END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for realtime_click
-- ----------------------------
DROP PROCEDURE IF EXISTS `realtime_click`;
DELIMITER ;;
CREATE DEFINER=`dmtec`@`%` PROCEDURE `realtime_click`(IN `table_create_date` VARCHAR(20) CHARSET utf8)
    DETERMINISTIC
    COMMENT '创建分钟统计表'
BEGIN
	DECLARE table_name VARCHAR(20);
	set @table_name = CONCAT('realtime_click_',table_create_date);
	set @createsql = CONCAT("create table ",@table_name,"(
  `sid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '标识一次检索的唯一id，用于join',
  `adx` varchar(255) DEFAULT NULL COMMENT 'adx id',
  `user` varchar(255) DEFAULT NULL COMMENT '广告主id',
  `plan` varchar(255) DEFAULT NULL COMMENT '广告计划id',
  `unit` varchar(255) DEFAULT NULL COMMENT '广告单元id',
  `idea` varchar(255) NOT NULL COMMENT '广告创意id',
  `rank` varchar(255) DEFAULT NULL COMMENT '该广告对应检索请求中第几个广告位',
  `ad_bid_type` varchar(255) DEFAULT NULL COMMENT '广告主出价类型',
  `ad_bid` varchar(255) DEFAULT NULL COMMENT '广告主原始出价 单位：分',
  `ad_gsp_bid` varchar(255) DEFAULT NULL COMMENT 'GSP二价 单位：分',
  `dsp_bid_type` varchar(255) DEFAULT NULL COMMENT 'dsp向adx的出价类型',
  `dsp_bid` varchar(255) DEFAULT NULL COMMENT 'dsp向adx的出价 单位：分',
  `adx_price` varchar(255) DEFAULT NULL COMMENT 'adx向dsp收取的实际费用 只有当DSP以CPC出价时 该值不为0',
  `lp` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '广告主landing page',
  `instime` datetime NOT NULL,
  PRIMARY KEY (`sid`,`idea`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;");
	PREPARE create_stmt from @createsql;
	EXECUTE create_stmt;
END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for realtime_imp
-- ----------------------------
DROP PROCEDURE IF EXISTS `realtime_imp`;
DELIMITER ;;
CREATE DEFINER=`dmtec`@`%` PROCEDURE `realtime_imp`(IN `table_create_date` VARCHAR(20) CHARSET utf8)
    DETERMINISTIC
    COMMENT '创建分钟统计表'
BEGIN
	DECLARE table_name VARCHAR(20);
	set @table_name = CONCAT('realtime_imp_',table_create_date);
	set @createsql = CONCAT("create table ",@table_name,"(
  `sid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '标识一次检索的唯一id，用于join',
  `adx` varchar(255) DEFAULT NULL COMMENT 'adx id',
  `user` varchar(255) DEFAULT NULL COMMENT '广告主id',
  `plan` varchar(255) DEFAULT NULL COMMENT '广告计划id',
  `unit` varchar(255) DEFAULT NULL COMMENT '广告单元id',
  `idea` varchar(255) NOT NULL COMMENT '广告创意id',
  `rank` varchar(255) DEFAULT NULL COMMENT '该广告对应检索请求中的第几个广告位',
  `ad_bid_type` varchar(255) DEFAULT NULL COMMENT '广告主出价类型',
  `ad_bid` varchar(255) DEFAULT NULL COMMENT '广告主原始出价 单位：分',
  `ad_gsp_bid` varchar(255) DEFAULT NULL COMMENT 'GSP二价 单位：分',
  `dsp_bid_type` varchar(255) DEFAULT NULL COMMENT 'dsp向adx的出价类型',
  `dsp_bid` varchar(255) DEFAULT NULL COMMENT 'dsp向adx的出价 单位：分',
  `adx_price` varchar(255) DEFAULT NULL COMMENT 'adx向dsp收取的实际费用 只有当DSP以CPM出价时 该值不为0',
  `instime` datetime DEFAULT NULL,
  PRIMARY KEY (`sid`,`idea`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;");
	PREPARE create_stmt from @createsql;
	EXECUTE create_stmt;
END
;;
DELIMITER ;

-- ----------------------------
-- Event structure for realtime_action
-- ----------------------------
DROP EVENT IF EXISTS `realtime_action`;
DELIMITER ;;
CREATE EVENT `realtime_action` ON SCHEDULE EVERY 1 DAY STARTS '2017-01-04 23:00:00' ON COMPLETION PRESERVE ENABLE DO call realtime_action(DATE_FORMAT(DATE_SUB(CURRENT_TIMESTAMP,INTERVAL -1 DAY),'%Y%m%d'))
;;
DELIMITER ;

-- ----------------------------
-- Event structure for realtime_bidding
-- ----------------------------
DROP EVENT IF EXISTS `realtime_bidding`;
DELIMITER ;;
CREATE EVENT `realtime_bidding` ON SCHEDULE EVERY 1 DAY STARTS '2017-01-04 23:00:00' ON COMPLETION PRESERVE ENABLE DO call realtime_bidding(DATE_FORMAT(DATE_SUB(CURRENT_TIMESTAMP,INTERVAL -1 DAY),'%Y%m%d'))
;;
DELIMITER ;

-- ----------------------------
-- Event structure for realtime_bidding_single
-- ----------------------------
DROP EVENT IF EXISTS `realtime_bidding_single`;
DELIMITER ;;
CREATE EVENT `realtime_bidding_single` ON SCHEDULE EVERY 1 DAY STARTS '2017-01-04 23:00:00' ON COMPLETION PRESERVE ENABLE DO call realtime_bidding_single(DATE_FORMAT(DATE_SUB(CURRENT_TIMESTAMP,INTERVAL -1 DAY),'%Y%m%d'))
;;
DELIMITER ;

-- ----------------------------
-- Event structure for realtime_click
-- ----------------------------
DROP EVENT IF EXISTS `realtime_click`;
DELIMITER ;;
CREATE EVENT `realtime_click` ON SCHEDULE EVERY 1 DAY STARTS '2017-01-04 23:00:00' ON COMPLETION PRESERVE ENABLE DO call realtime_click(DATE_FORMAT(DATE_SUB(CURRENT_TIMESTAMP,INTERVAL -1 DAY),'%Y%m%d'))
;;
DELIMITER ;

-- ----------------------------
-- Event structure for realtime_imp
-- ----------------------------
DROP EVENT IF EXISTS `realtime_imp`;
DELIMITER ;;
CREATE EVENT `realtime_imp` ON SCHEDULE EVERY 1 DAY STARTS '2017-01-04 23:00:00' ON COMPLETION PRESERVE ENABLE DO call realtime_imp(DATE_FORMAT(DATE_SUB(CURRENT_TIMESTAMP,INTERVAL -1 DAY),'%Y%m%d'))
;;
DELIMITER ;

-- ----------------------------
-- SET EVENT ON
-- ----------------------------
SET GLOBAL event_scheduler = ON;
