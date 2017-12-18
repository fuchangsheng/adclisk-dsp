## dsp_palo
---
　
　
　

### **表名**:dsp_charge
### **说明**:实时表（15分钟）
### **字段说明**
字段名|数据类型|非空|备注
:---: | :---:  |:---:|:--
date|datetime|Y|统计时间
adx|int|Y|adx
user_id|bigint|Y|广告主id
idea_id|bigint|Y|创意id
unit_id|bigint|Y|单元id
plan_id|bigint|Y|计划id
ad_bid_type|int|Y|广告主结算方式
dsp_bid_type|int|Y|dsp结算方式
imp|int|Y|展现数量
click|int|Y|点击量
action|int|Y|指定动作触发数
cost|int|Y|广告主花费
dsp_cost|int|Y|dsp花费
---
　
　
　

### **表名**:　dsp_daily_info
### **说明**:　每日统计表
### **字段说明**
字段名|数据类型|非空|备注
:---: | :---:  |:---:|:--
date|datetime|Y|统计时间
user_id|bigint|Y|广告主id
idea_id|bigint|Y|创意id
unit_id|bigint|Y|单元id
plan_id|bigint|Y|计划id
adx|int|Y|adx
ad_bid_type|int|Y|广告主结算方式
creative_type|int|Y|创意类型
prov|varchar|Y|省份
city|varchar|Y|城市
adview_type|int|Y|流量类型
site|varchar|Y|站点
part|datetime|Y|-
os|int|N|操作系统
carrier|int|N|运营商
device|int|N|设备
request|int|Y|请求数
bid|int|Y|竞价数
imp|int|Y|展现数
click|int|Y|点击数
download|int|Y|下载数
cost|int|Y|广告主花费
revenue|int|Y|利润
---

