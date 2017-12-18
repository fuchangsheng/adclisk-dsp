## dsp_tags
---
　
　
　

### **表名**:audit_ideas
### **说明**:　ADX创意审核表
### **字段说明**
字段名|数据类型|非空|备注
:---: | :---:  |:---:|:--
id|bigint|Y|Primary
idea_id|bigint|Y|创意id
unit_id|bigint|Y|单元id
plan_id|bigint|Y|计划id
user_id|bigint|Y|广告主id
adx_id|bigint|Y|adx_id
adx_idea_id|bigint|N|创意提交到adx后返回的id
signature|char|N|签名
audit_status|int|Y|adx审核状态
failure_message|varchar|N|审核失败消息
create_time|datetime|Y|创建时间
update_time|datetime|Y|更新时间
---
　
　
　

### **表名**:audit_users
### **说明**:　ADX创意审核表
### **字段说明**
字段名|数据类型|非空|备注
:---: | :---:  |:---:|:--
id|bigint|Y|Primary
user_id|bigint|Y|广告主id
adx_id|bigint|Y|adx_id
adx_qual_id|bigint|N|adx使用的资质id
adx_user_id|bigint|Y|广告主在别的adx上的id
signature|char|N|签名
audit_status|int|Y|审核状态
failure_message|varchar|N|审核失败消息
create_time|datetime|Y|创建时间
update_time|datetime|Y|更新时间