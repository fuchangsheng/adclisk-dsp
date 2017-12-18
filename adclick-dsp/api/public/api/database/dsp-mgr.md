## adclick_dsp_mgr
---
　
　
　

### **表名**:　tb_audit_ideas
### **说明**:　广告创意审核表
### **字段说明**
字段名|数据类型|非空|备注
:---: | :---:  |:---:|:--
id|bigint|Y|Primary
idea_id|bigint|Y|创意id
unit_id|bigint|Y|单元id
plan_id|bigint|Y|计划id
user_id|bigint|Y|广告主id
mgr_id|bigint|Y|管理员id
signature|chat|Y|签名
audit_status|int|Y|审核状态，0-审核通过，1-审核中，2-审核失败
failure_message|varchar|Y|审核失败的消息
create_time|datetime|Y|创建时间
update_time|datetime|Y|更新时间
---
　
　
　

### **表名**:　tb_audit_ideas
### **说明**:　广告创意审核表
### **字段说明**
字段名|数据类型|非空|备注
:---: | :---:  |:---:|:--
id|bigint|Y|Primary
idea_id|bigint|Y|创意id
unit_id|bigint|Y|单元id
plan_id|bigint|Y|计划id
user_id|bigint|Y|广告主id
mgr_id|bigint|Y|管理员id
signature|chat|Y|签名
audit_status|int|Y|审核状态，0-审核通过，1-审核中，2-审核失败
failure_message|varchar|Y|审核失败的消息
create_time|datetime|Y|创建时间
update_time|datetime|Y|更新时间