## 数据库：adclick_dsp_business
---
### **表名**:　tb_account_recharge_log
### **说明**:　账户充值记录
### **字段说明**
字段名|数据类型|非空|备注
:---: | :---:  |:---:|:--
id|varchar|Y|primary key
user_id|bigint|Y|广告主id
oper_id|varchar|Y|操作员id
account_type|int|N|0-实际账户，1-虚拟账户
amount|bigint|Y|本次充值金额
ticket_no|varchar|Y|充值流水号
charge_type|int|N|0-网银 ，1-支付宝，2-微信
charge_status|int|N|0-充值完成，1-充值中，2-充值失败
create_time|datetime|Y|创建时间
update_time|datetime|Y|更新时间
---
　

### **表名**:　tb_aduser_invoice_account
### **说明**:　广告主发票信息表
### **字段说明**
字段名|数据类型|非空|备注
:---: | :---:  |:---:|:--
id|varchar|Y|发票信息id,　primary key
user_id|bigint|Y|广告主id
title|varchar|Y|发票抬头
type|int|Y|发票类型：1-增值税普票 2-增值税专票
tax_no|varchar|N|税号
address|varchar|N|地址
phone|varchar|N|公司电话
bank|varchar|N|开户行
bank_account_no|varchar|N|开户行银行账号
receiver_name|varchar|N|收件人姓名
receiver_address|varchar|N|收件人地址
receiver_email|varchar|N|收件人邮箱
receiver_mobile|varchar|N|收件人电话
qualification|varchar|N|资质文件
audit_status|int|N|审核状态 0-通过 1-正在提交 2-审核中 3-审核失败
audit_message|varchar|N|审核失败的原因
status|int|N|记录状态 0-有效 其它-无效
create_time|datetime|Y|创建时间
update_time|datetime|Y|更新时间
---
　

### **表名**:　tb_aduser_operators
### **说明**:　广告主协作人员表
### **字段说明**
字段名|数据类型|非空|备注
:---: | :---:  |:---:|:--
oper_id|varchar|Y|操作员id,　primary key
user_id|bigint|Y|广告主id
email|varchar|Y|协作员邮箱
mobile|varchar|Y|协作员电话
password|varchar|N|协作者密码
portrait|varchar|N|用户头像
name|varchar|N|用户名
role|int|N|角色 0-创建者，1-管理员，2-操作员，3-观察员，4-财务人员
audit_status|int|N|审核状态 0-通过 1-正在提交 2-审核中 3-审核失败
audit_message|varchar|N|审核失败的原因
status|int|N|记录状态 0-有效 其它-无效
create_time|datetime|Y|创建时间
update_time|datetime|Y|更新时间
---
　

### **表名**:　tb_audit_log
### **说明**:　数据变动记录表
### **字段说明**
字段名|数据类型|非空|备注
:---: | :---:  |:---:|:--
id|varchar|Y|primary key
oper_id|varchar|Y|操作员id
user_id|bigint|Y|广告主id
level|int|Y|纪录级别
type|int|Y|日志类型 见***AdConstants.AUDITTYPE***
content|varchar|N|记录内容
create_time|datetime|Y|创建时间
origin|varchar|Y|发起人
---
　

### **表名**:　tb_dsp_aduser
### **说明**:　广告主信息表
### **字段说明**
字段名|数据类型|非空|备注
:---: | :---:  |:---:|:--
user_id|varchar|Y|广告主id,primary key
user_name|varchar|Y|用户名
company_name|varchar|N|广告主公司名
company_license|varchar|N|广告主公司营业执照
license_number|varchar|N|营业执照编号
license_valid_date_begin|datetime|N|营业执照有效期开始
license_valid_date_end|datetime|N|营业执照有效期结束
address|varchar|N|公司地址
telephone|varchar|N|公司联系电话
contacts_name|varchar|N|联系人姓名
contacts_mobile|varchar|N|联系人电话
contacts_email|varchar|N|联系人邮箱
rbalance|bigint|N|实际账户
vbalance|bigint|N|虚拟账户
user_audit_status|int|N|广告主审核状态 0-通过，1-未审核，2审核中，3-审核失败
user_audit_message|varchar|N|审核失败原因
categories|int|N|广告主行业分类
subcategories|int|N|广告主行业子分类
categories_audit_status|int|N|行业审核状态
categories_audit_message|varchar|N|行业审核失败的消息
qualification|varchar|N|广告主行业资质url
qualification_number|varchar|N|资质编号
qulification_type|int|N|资质类型
valid_date_begin|datetime|N|资质有效期
valid_date_end|datetime|N|资质有效期
invoiced_amount|bigint|N|已开票总额
uninvoice_amount|bigint|N|未开票总额
balance|bigint|N|账户余额
qualification_name|varchar|N|行业资质名称
site_name|varchar|N|网站名称
site_url|varchar|N|网页地址
user_type|tinyint|N|用户类型，0-普通，1-可以跑cpd
create_time|datetime|Y|创建时间
update_time|datetime|Y|更新时间
---
　

### **表名**:　tb_email_verify_log
### **说明**:　邮箱链接验证记录表
### **字段说明**
字段名|数据类型|非空|备注
:---: | :---:  |:---:|:--
id|varchar|Y|记录id
email|varchar|N|接受验证邮箱的邮箱
token|varchar|N|链接后缀
user_id|varchar|N|广告主id
type|int|N|业务类型 1-邮件消息接收人
status|int|N|0-验证通过，1-创建，2-已发送， 3-验证失败
create_time|datetime|Y|创建时间
update_time|datetime|Y|更新时间
---
　


### **表名**:tb_ads_records
### **说明**:　广告活动记录录表
### **字段说明**
字段名|数据类型|非空|备注
:---: | :---:  |:---:|:--
id|varchar|Y|记录id
user_id|bigint|Y|广告主id
oper_id|varchar|Y|操作员id
plan_id|bigint|Y|计划id
unit_id|bigint|Y|单元id
idea_id|bigint|Y|创意id
action|varchar|N|操作
result|varchar|N|操作详情
obj|varchar|N|活动对象
origin|varchar|发起人
create_time|datetime|Y|创建时间
---
　

### **表名**:　tb_invoice_op_log
### **说明**:　发票操作记录表
### **字段说明**
字段名|数据类型|非空|备注
:---: | :---:  |:---:|:--
id|varchar|Y|记录id
user_id|varchar|Y|广告主id
title|varchar|Y|发票抬头
invoice_id|varchar|Y|纳税人识别号
oper_id|varchar|Y|操作员id
type|int|Y|发票类型 1-增值税普票 2-增值税专票
item_name|varchar|Y|开票项目
amount|int|Y|开票金额，单位分
tax_info_ticket|varchar|Y|发票信息id
invoice_status|int|Y|0-完成 1-提交中 2-处理中
post_name|varchar|Y|快递公司
post_id|varchar|Y|快递号
message|varchar|N|拒绝理由
create_time|datetime|Y|创建时间
update_time|datetime|Y|更新时间
---
　

### **表名**:　tb_messages
### **说明**:　消息表
### **字段说明**
字段名|数据类型|非空|备注
:---: | :---:  |:---:|:--
msg_id|varchar|Y|消息id
user_id|varchar|Y|广告主id
title|varchar|N|消息标题
conten|varchar|N|消息内容
categories|int|Y|消息类型，0-系统消息，1-审核消息，2-账户消息，3-财务消息
subcategories|int|Y|子消息类型
create_time|datetime|Y|创建时间
---
　

### **表名**:　tb_message_notify_set
### **说明**:　消息设置表
### **字段说明**
字段名|数据类型|非空|备注
:---: | :---:  |:---:|:--
id|varchar|Y|设置id
user_id|varchar|Y|广告主id
categories|int|Y|消息类型，0-系统消息，1-审核消息，2-账户消息，3-财务消息
subcategories|int|Y|子消息类型
channel|int|Y|0b001-站内信，0b010邮箱，0b100手机短信
create_time|datetime|Y|创建时间
---
　

### **表名**:　tb_message_notify_status
### **说明**:　消息发送状态表
### **字段说明**
字段名|数据类型|非空|备注
:---: | :---:  |:---:|:--
user_id|varchar|Y|广告主id
categories|int|Y|消息类型，0-系统消息，1-审核消息，2-账户消息，3-财务消息
subcategories|int|Y|子消息类型
status|int|Y|发送状态 0-已发送 1-未发送
create_time|datetime|Y|创建时间
update_time|datetime|Y|更新时间
---
　

### **表名**:　tb_notify_log
### **说明**:　消息通知记录
### **字段说明**
字段名|数据类型|非空|备注
:---: | :---:  |:---:|:--
id|varchar|Y|记录id
msg_id|varchar|Y|消息id
receiver|varchar|Y|接受者 mobile，email，null
type|int|Y|通知类型，0-站内信，1-短信，2-邮件
user_id|varchar|Y|广告主id
notify_status|int|Y|对于站内信：0-已读，其它-未读，对于其它0-发送成功
create_time|datetime|Y|创建时间
update_time|datetime|Y|更新时间
---
　

### **表名**:　tb_notify_receivers
### **说明**:　消息接收人表
### **字段说明**
字段名|数据类型|非空|备注
:---: | :---:  |:---:|:--
id|varchar|Y|记录id
user_id|varchar|Y|广告主id
receiver|varchar|Y|接受者 mobile\email
type|int|Y|通知类型　1-短信　0-邮件
audit_status|int|Y|0-通过，1-审核中，2-审核失败
create_time|datetime|Y|创建时间
update_time|datetime|Y|更新时间
---
　

### **表名**:　tb_sms_log
### **说明**:　短信发送记录表
### **字段说明**
字段名|数据类型|非空|备注
:---: | :---:  |:---:|:--
mobile|varchar|Y|primary　key　手机号
smscode|varchar|Y|验证码
status|int|Y|0-验证通过，1-已发送未验证，2-验证失败
create_time|datetime|Y|创建时间
update_time|datetime|Y|更新时间
---
　

### **表名**:　tb_verify_code_log
### **说明**:　图片验证码表
### **字段说明**
字段名|数据类型|非空|备注
:---: | :---:  |:---:|:--
code_name|varchar|Y|PRIMARY　验证码id
code_value|varchar|Y|验证码值
status|int|N|0-验证通过，1-创建，2-已发送，3-验证失败
create_time|datetime|Y|创建时间
---
　
---