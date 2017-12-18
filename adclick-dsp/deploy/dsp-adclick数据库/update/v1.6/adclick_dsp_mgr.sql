SET FOREIGN_KEY_CHECKS=0;

ALTER TABLE `tb_audit_log`
MODIFY COLUMN `content`  longtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '操作内容' AFTER `type`;

ALTER TABLE `tb_messages`
MODIFY COLUMN `content`  longtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '消息内容' AFTER `title`;