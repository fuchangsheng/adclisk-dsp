## 数据库：dsp_adlib
---
　
　
　

### **表名**:　assets
### **说明**:　素材表
### **字段说明**
字段名|数据类型|非空|备注
:---: | :---:  |:---:|:--
asset_id|bigint|Y|primary key
user_id|bigint|Y|广告主id
asset_name|varchar|Y|素材名称
url|varchar|Y|素材地址
thumbnail|varchar|N|缩略图
width|int|Y|宽
height|int|Y|高
duration|int|N|视频素材时长
ratio|varchar|Y|素材的长宽比
asset_type|int|Y|1-图片，2-flash，3-视频
asset_tag|varchar|Y|素材标签
create_time|datetime|Y|创建时间
update_time|datetime|Y|更新时间
---
　
　
　

### **表名**:　idea_conversion2
### **说明**:　小时转化表表
### **字段说明**
字段名|数据类型|非空|备注
:---: | :---:  |:---:|:--
user_id|bigint|Y|广告主id
plan_id|bigint|Y|计划id
unit_id|bigint|Y|单元id
idea_id|bigint|Y|创意id
date|date|Y|统计日期
date_hour|date_time|Y|统计时间
conversion|int|Y|转化量
price|int|Y|转化单价，单位分
---
　
　
　

### **表名**:ideas
### **说明**:　创意表
### **字段说明**
字段名|数据类型|非空|备注
:---: | :---:  |:---:|:--
idea_id|bigint|Y|创意id
user_id|bigint|Y|广告主id
plan_id|bigint|Y|计划id
unit_id|bigint|Y|单元id
idea_name|varchar|Y|创意名称
idea_slots|varchar|Y|创意可投放的广告位类型
idea_type|int|Y|创意类型，见**AdConstants.IDEATYPE**
landing_page|varchar|Y|落地页
assets|text|Y|物料信息
asset_id|int|Y|素材id
adview_type|int|Y|渠道类型0-web，1-wap，2-app
idea_trade|varchar|Y|创意行业
idea_status|int|Y|创意状态，0-启动，1-未启动，2-暂停
imp_monitor_urls|varchar|Y|展现监控地址，空格分隔
click_monitor_urls|varchar|Y|点击监控地址，空格分隔
signature|vachar|Y|签名
audit_status|int|Y|审核状态，0-审核通过，1-审核中，2-审核失败
failure_message|varchar|Y|审核失败的消息
create_time|datetime|Y|创建时间
update_time|datetime|Y|更新时间
---
　
　
　

### **表名**:　plans
### **说明**:　广告计划表
### **字段说明**
字段名|数据类型|非空|备注
:---: | :---:  |:---:|:--
user_id|bigint|Y|广告主id
plan_id|bigint|Y|计划id
plan_name|varchar|Y|计划名称
start_time|timestamp|Y|开始时间
end_time|timestamp|Y|结束时间
budget|int|Y|预算
plan_circle|varchar|Y|投放周期，42位16进制数
plan_status|int|Y|0-启动，1-未启动，2-暂停
delivery_type|int|Y|0-匀速 1-加速
create_time|datetime|Y|创建时间
update_time|datetime|Y|更新时间
---
　
　
　

### **表名**:　units
### **说明**:　广告单元表
### **字段说明**
字段名|数据类型|非空|备注
:---: | :---:  |:---:|:--
unit_id|bigint|Y|单元id
user_id|bigint|Y|广告主id
plan_id|bigint|Y|计划id
unit_name|varchar|Y|单元名称
bid|int|Y|出价
bid_type|int|Y|出价方式0-CPM,1-CPC,2-CPD,3-CPT
adview_type|int|Y|渠道类型0-web，1-wap，2-app
unit_status|int|Y|0-启动，1-未启动，2-暂停
create_time|datetime|Y|创建时间
update_time|datetime|Y|更新时间
---
　
　
　

### **表名**:　unit_targeting
### **说明**:　广告单元定向表
### **字段说明**
字段名|数据类型|非空|备注
:---: | :---:  |:---:|:--
id|bigint|Y|Primary
unit_id|bigint|Y|单元id
user_id|bigint|Y|广告主id
plan_id|bigint|Y|计划id
type|int|Y|定向类型**AdConstants.ADTARGETTYPE**
content|longtext|Y|定向内容
status|int|Y|定向状态0-启用
create_time|datetime|Y|创建时间
update_time|datetime|Y|更新时间
---
　
　
　

### **表名**:　tartgeting_templates
### **说明**:　定向模板表
### **字段说明**
字段名|数据类型|非空|备注
:---: | :---:  |:---:|:--
template_id|bigint|Y|Primary,模板id
template_name|varchar|Y|模板名称
user_id|bigint|Y|广告主id
tag|varchar|Y|模板标签
create_time|datetime|Y|创建时间
update_time|datetime|Y|更新时间
---
　
　
　

### **表名**:　targeting_template_contents
### **说明**:　定向模板内容表
### **字段说明**
字段名|数据类型|非空|备注
:---: | :---:  |:---:|:--
id|bigint|Y|Primary
template_id|bigint|Y|模板id
user_id|bigint|Y|广告主id
type|int|Y|定向类型**AdConstants.ADTARGETTYPE**
content|longtext|Y|定向内容
status|int|Y|定向状态0-启用
create_time|datetime|Y|创建时间
update_time|datetime|Y|更新时间
　
　

---