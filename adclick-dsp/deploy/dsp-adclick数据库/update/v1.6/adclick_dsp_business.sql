SET FOREIGN_KEY_CHECKS=0;

ALTER TABLE `tb_audit_log`
MODIFY COLUMN `content`  longtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '操作内容' AFTER `type`;

ALTER TABLE `tb_messages`
MODIFY COLUMN `content`  longtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '消息内容' AFTER `title`;

ALTER TABLE `tb_dsp_aduser`
ADD COLUMN `license_number`  varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '营业执照编号' AFTER `company_license`,
ADD COLUMN `license_valid_date_begin`  datetime NULL DEFAULT NULL COMMENT '营业执照有效期' AFTER `company_license`,
ADD COLUMN `license_valid_date_end`  datetime NULL DEFAULT NULL COMMENT '营业执照有效期' AFTER `license_valid_date_begin`;